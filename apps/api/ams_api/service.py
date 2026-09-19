from datetime import datetime, timedelta, timezone
import hashlib
import os
from secrets import token_hex
from uuid import UUID
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import Identity
from .database import Database
from .errors import ApiError
from .schemas import AcademyInput, BranchInput, InvitationInput, MemberInput, Role

def row(result):
    value = result.mappings().first()
    return dict(value) if value else None

def rows(result): return [dict(value) for value in result.mappings().all()]

class AcademyService:
    def __init__(self, db: Database) -> None: self.db = db

    async def owner(self, session: AsyncSession) -> None:
        if not (await session.scalar(text("SELECT app_private.is_platform_owner()"))):
            raise ApiError(403, "Platform owner access is required.")

    async def member(self, session: AsyncSession, actor: Identity, academy_id: UUID, admin=False):
        membership = row(await session.execute(text('SELECT id, "academyId", "userId", email, name, roles, "allBranches", active, "createdAt" FROM "Membership" WHERE "academyId"=:academy AND "userId"=:actor AND active'), {"academy": academy_id, "actor": actor.id}))
        academy = row(await session.execute(text('SELECT id FROM "Academy" WHERE id=:academy AND active'), {"academy": academy_id}))
        if not membership or not academy or (admin and "ADMIN" not in membership["roles"]):
            raise ApiError(403, "You do not have access to this workspace action.")
        return membership

    async def audit(self, session: AsyncSession, actor: Identity, academy_id: UUID, action: str, detail: str) -> None:
        await session.execute(text('INSERT INTO "Audit" (id, "academyId", "actorId", action, detail) VALUES (gen_random_uuid(), :academy, :actor, :action, :detail)'), {"academy": academy_id, "actor": actor.id, "action": action, "detail": detail})

    async def scope(self, session: AsyncSession, academy_id: UUID, input: InvitationInput | MemberInput) -> None:
        if Role.ADMIN in input.roles and not input.allBranches: raise ApiError(400, "Administrators require access to all branches.")
        if input.allBranches and input.branchIds: raise ApiError(400, "Choose all branches or specific branches, not both.")
        if not input.allBranches and not input.branchIds: raise ApiError(400, "Select at least one branch.")
        count = await session.scalar(text('SELECT count(*) FROM "Branch" WHERE "academyId"=:academy AND id = ANY(CAST(:branches AS uuid[]))'), {"academy": academy_id, "branches": [str(value) for value in input.branchIds]})
        if count != len(input.branchIds): raise ApiError(400, "One or more branches are unavailable.")

    async def lock(self, session: AsyncSession, academy_id: UUID) -> None:
        # Serialize invitation and membership administration for one academy.
        await session.execute(text('SELECT id FROM "Academy" WHERE id=:academy FOR UPDATE'), {"academy": academy_id})

    async def invite(self, session: AsyncSession, actor: Identity, academy_id: UUID, input: InvitationInput):
        email = input.email.lower()
        existing = await session.scalar(text('SELECT 1 FROM "Membership" WHERE "academyId"=:academy AND email=:email AND active'), {"academy": academy_id, "email": email})
        if existing: raise ApiError(409, "This person already belongs to the academy.")
        # A new invite supersedes any earlier pending invite for this academy and email.
        await session.execute(text('UPDATE "Invitation" SET "expiresAt"=now() WHERE "academyId"=:academy AND email=:email AND "acceptedAt" IS NULL'), {"academy": academy_id, "email": email})
        token = token_hex(32)
        # Store only a hash. The raw capability goes in a URL fragment, which browsers do not
        # send to the server or include in Referer headers.
        invitation_id = await session.scalar(text('INSERT INTO "Invitation" (id, "academyId", email, roles, "allBranches", "branchIds", "tokenHash", "expiresAt") VALUES (gen_random_uuid(), :academy, :email, CAST(:roles AS "Role"[]), :all_branches, CAST(:branches AS uuid[]), :token_hash, :expires) RETURNING id'), {"academy": academy_id, "email": email, "roles": [role.value for role in input.roles], "all_branches": input.allBranches, "branches": [str(value) for value in input.branchIds], "token_hash": hashlib.sha256(token.encode()).hexdigest(), "expires": datetime.now(timezone.utc) + timedelta(days=7)})
        await self.audit(session, actor, academy_id, "invitation.created", f"Invited {email} as {', '.join(role.value for role in input.roles)}")
        return {"id": invitation_id, "invitationUrl": f"{os.getenv('WEB_ORIGIN', 'http://localhost:5173')}/accept-invitation#{token}"}

    async def me(self, actor: Identity):
        async with self.db.as_actor(actor) as session:
            platform_owner = bool(await session.scalar(text("SELECT app_private.is_platform_owner()")))
            memberships = rows(await session.execute(text('SELECT m.id AS "membershipId", m."userId", m.email, m.name AS "memberName", m.roles, m."allBranches", m.active, a.id, a.name, a.slug, a.active, a.timezone, a."createdAt" FROM "Membership" m JOIN "Academy" a ON a.id=m."academyId" WHERE m."userId"=:actor AND m.active AND a.active ORDER BY m."createdAt"'), {"actor": actor.id}))
            workspaces = []
            for item in memberships:
                branch_ids = [value for value in await session.scalars(text('SELECT "branchId" FROM "MemberBranch" WHERE "membershipId"=:membership'), {"membership": item["membershipId"]})]
                workspaces.append({"academy": {key: item[key] for key in ("id", "name", "slug", "active", "timezone", "createdAt")}, "membership": {"id": item["membershipId"], "userId": item["userId"], "name": item["memberName"], "email": item["email"], "roles": item["roles"], "allBranches": item["allBranches"], "active": item["active"], "branchIds": branch_ids}})
            return {"id": actor.id, "email": actor.email, "name": actor.name, "platformOwner": platform_owner, "workspaces": workspaces}

    async def academies(self, actor: Identity):
        async with self.db.as_actor(actor) as session:
            await self.owner(session)
            return rows(await session.execute(text('SELECT id, name, slug, active, timezone, "createdAt" FROM "Academy" ORDER BY "createdAt" DESC')))

    async def create_academy(self, actor: Identity, input: AcademyInput):
        async with self.db.as_actor(actor) as session:
            await self.owner(session)
            academy = row(await session.execute(text('INSERT INTO "Academy" (id, name, slug) VALUES (gen_random_uuid(), :name, :slug) RETURNING id, name, slug, active, timezone, "createdAt"'), {"name": input.name, "slug": input.slug}))
            # Switch from platform scope so audit and first-admin invitation pass tenant RLS.
            await session.execute(text("SELECT set_config('app.academy', :academy, true)"), {"academy": str(academy["id"])})
            await self.audit(session, actor, academy["id"], "academy.created", f"Created {academy['name']}")
            invitation = await self.invite(session, actor, academy["id"], InvitationInput(email=input.adminEmail, roles=[Role.ADMIN], allBranches=True, branchIds=[]))
            return {"academy": academy, **invitation}

    async def set_active(self, actor: Identity, academy_id: UUID, active: bool):
        async with self.db.as_actor(actor, academy_id) as session:
            await self.owner(session)
            academy = row(await session.execute(text('UPDATE "Academy" SET active=:active WHERE id=:academy RETURNING id, name, slug, active, timezone, "createdAt"'), {"academy": academy_id, "active": active}))
            if not academy: raise ApiError(404, "The record is unavailable.")
            await self.audit(session, actor, academy_id, "academy.activated" if active else "academy.suspended", academy["name"])
            return academy

    async def branches(self, actor: Identity, academy_id: UUID):
        async with self.db.as_actor(actor, academy_id) as session:
            await self.member(session, actor, academy_id)
            result = []
            for branch in rows(await session.execute(text('SELECT id, name, city, address FROM "Branch" WHERE "academyId"=:academy ORDER BY "createdAt"'), {"academy": academy_id})):
                branch["tables"] = rows(await session.execute(text('SELECT id, name FROM "TableResource" WHERE "academyId"=:academy AND "branchId"=:branch ORDER BY name'), {"academy": academy_id, "branch": branch["id"]}))
                result.append(branch)
            return result

    async def create_branch(self, actor: Identity, academy_id: UUID, input: BranchInput):
        async with self.db.as_actor(actor, academy_id) as session:
            await self.member(session, actor, academy_id, True)
            branch = row(await session.execute(text('INSERT INTO "Branch" (id, "academyId", name, city, address) VALUES (gen_random_uuid(), :academy, :name, :city, :address) RETURNING id, name, city, address'), {"academy": academy_id, "name": input.name, "city": input.city, "address": input.address}))
            await self.audit(session, actor, academy_id, "branch.created", f"Added {branch['name']}")
            return {**branch, "tables": []}

    async def create_table(self, actor: Identity, academy_id: UUID, branch_id: UUID, name: str):
        async with self.db.as_actor(actor, academy_id) as session:
            await self.member(session, actor, academy_id, True)
            if not await session.scalar(text('SELECT 1 FROM "Branch" WHERE id=:branch AND "academyId"=:academy'), {"branch": branch_id, "academy": academy_id}): raise ApiError(404, "Branch not found.")
            table = row(await session.execute(text('INSERT INTO "TableResource" (id, "academyId", "branchId", name) VALUES (gen_random_uuid(), :academy, :branch, :name) RETURNING id, name'), {"academy": academy_id, "branch": branch_id, "name": name}))
            await self.audit(session, actor, academy_id, "table.created", f"Added {table['name']}")
            return table

    async def members(self, actor: Identity, academy_id: UUID):
        async with self.db.as_actor(actor, academy_id) as session:
            await self.member(session, actor, academy_id, True)
            result = []
            for member in rows(await session.execute(text('SELECT id, "userId", name, email, roles, "allBranches", active FROM "Membership" WHERE "academyId"=:academy ORDER BY "createdAt"'), {"academy": academy_id})):
                member["branchIds"] = [value for value in await session.scalars(text('SELECT "branchId" FROM "MemberBranch" WHERE "membershipId"=:member'), {"member": member["id"]})]
                result.append(member)
            return result

    async def update_member(self, actor: Identity, academy_id: UUID, member_id: UUID, input: MemberInput):
        async with self.db.as_actor(actor, academy_id) as session:
            await self.lock(session, academy_id); await self.member(session, actor, academy_id, True); await self.scope(session, academy_id, input)
            existing = row(await session.execute(text('SELECT id, email, roles, active FROM "Membership" WHERE id=:member AND "academyId"=:academy'), {"member": member_id, "academy": academy_id}))
            if not existing: raise ApiError(404, "The record is unavailable.")
            if existing["active"] and "ADMIN" in existing["roles"] and (not input.active or Role.ADMIN not in input.roles):
                count = await session.scalar(text('SELECT count(*) FROM "Membership" WHERE "academyId"=:academy AND active AND \'ADMIN\'=ANY(roles)'), {"academy": academy_id})
                if count <= 1: raise ApiError(409, "Keep at least one active academy administrator.")
            # Replace branch assignments atomically with the role change.
            await session.execute(text('DELETE FROM "MemberBranch" WHERE "academyId"=:academy AND "membershipId"=:member'), {"academy": academy_id, "member": member_id})
            for branch_id in input.branchIds:
                await session.execute(text('INSERT INTO "MemberBranch" ("academyId", "membershipId", "branchId") VALUES (:academy, :member, :branch)'), {"academy": academy_id, "member": member_id, "branch": branch_id})
            updated = row(await session.execute(text('UPDATE "Membership" SET roles=CAST(:roles AS "Role"[]), "allBranches"=:all_branches, active=:active WHERE id=:member RETURNING id, "userId", name, email, roles, "allBranches", active'), {"member": member_id, "roles": [role.value for role in input.roles], "all_branches": input.allBranches, "active": input.active}))
            updated["branchIds"] = list(input.branchIds)
            await self.audit(session, actor, academy_id, "membership.updated", f"Updated access for {existing['email']}")
            return updated

    async def invitations(self, actor: Identity, academy_id: UUID):
        async with self.db.as_actor(actor, academy_id) as session:
            await self.member(session, actor, academy_id, True)
            return rows(await session.execute(text('SELECT id, email, roles, "allBranches", "branchIds", "expiresAt", "acceptedAt", "createdAt" FROM "Invitation" WHERE "academyId"=:academy ORDER BY "createdAt" DESC'), {"academy": academy_id}))

    async def create_invitation(self, actor: Identity, academy_id: UUID, input: InvitationInput):
        async with self.db.as_actor(actor, academy_id) as session:
            await self.lock(session, academy_id); await self.member(session, actor, academy_id, True); await self.scope(session, academy_id, input)
            return await self.invite(session, actor, academy_id, input)

    async def revoke(self, actor: Identity, academy_id: UUID, invitation_id: UUID):
        async with self.db.as_actor(actor, academy_id) as session:
            await self.member(session, actor, academy_id, True)
            invite = row(await session.execute(text('SELECT id, email FROM "Invitation" WHERE id=:id AND "academyId"=:academy AND "acceptedAt" IS NULL'), {"id": invitation_id, "academy": academy_id}))
            if not invite: raise ApiError(404, "The record is unavailable.")
            await session.execute(text('UPDATE "Invitation" SET "expiresAt"=now() WHERE id=:id'), {"id": invitation_id})
            await self.audit(session, actor, academy_id, "invitation.revoked", f"Revoked invitation for {invite['email']}")

    async def accept(self, actor: Identity, token: str):
        async with self.db.as_actor(actor) as session:
            # The SECURITY DEFINER function locks the invite and consumes it exactly once.
            academy_id = await session.scalar(text('SELECT app_private.accept_invitation(:hash, :name)'), {"hash": hashlib.sha256(token.encode()).hexdigest(), "name": actor.name})
            if not academy_id: raise ApiError(400, "Invitation unavailable.")
            return {"academyId": academy_id}

    async def dashboard(self, actor: Identity, academy_id: UUID):
        async with self.db.as_actor(actor, academy_id) as session:
            member = await self.member(session, actor, academy_id)
            admin = "ADMIN" in member["roles"]
            return {"branches": await session.scalar(text('SELECT count(*) FROM "Branch" WHERE "academyId"=:academy'), {"academy": academy_id}), "tables": await session.scalar(text('SELECT count(*) FROM "TableResource" WHERE "academyId"=:academy'), {"academy": academy_id}), "members": await session.scalar(text('SELECT count(*) FROM "Membership" WHERE "academyId"=:academy AND active'), {"academy": academy_id}) if admin else None, "invitations": await session.scalar(text('SELECT count(*) FROM "Invitation" WHERE "academyId"=:academy AND "acceptedAt" IS NULL AND "expiresAt">now()'), {"academy": academy_id}) if admin else None}

    async def activity(self, actor: Identity, academy_id: UUID):
        async with self.db.as_actor(actor, academy_id) as session:
            await self.member(session, actor, academy_id, True)
            return rows(await session.execute(text('SELECT id, action, detail, "createdAt" FROM "Audit" WHERE "academyId"=:academy ORDER BY "createdAt" DESC LIMIT 50'), {"academy": academy_id}))
