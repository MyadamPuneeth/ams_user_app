export interface paths {
    "/api/auth/config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Auth Config */
        get: operations["auth_config_api_auth_config_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/demo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Demo */
        post: operations["demo_api_auth_demo_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Me */
        get: operations["me_api_me_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/invitations/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Accept */
        post: operations["accept_api_invitations_accept_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/platform/academies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Academies */
        get: operations["academies_api_platform_academies_get"];
        put?: never;
        /** Create Academy */
        post: operations["create_academy_api_platform_academies_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/platform/academies/{academy_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Set Active */
        patch: operations["set_active_api_platform_academies__academy_id__patch"];
        trace?: never;
    };
    "/api/academies/{academy_id}/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Dashboard */
        get: operations["dashboard_api_academies__academy_id__dashboard_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/academies/{academy_id}/branches": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Branches */
        get: operations["branches_api_academies__academy_id__branches_get"];
        put?: never;
        /** Create Branch */
        post: operations["create_branch_api_academies__academy_id__branches_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/academies/{academy_id}/branches/{branch_id}/tables": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create Table */
        post: operations["create_table_api_academies__academy_id__branches__branch_id__tables_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/academies/{academy_id}/members": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Members */
        get: operations["members_api_academies__academy_id__members_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/academies/{academy_id}/members/{member_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update Member */
        patch: operations["update_member_api_academies__academy_id__members__member_id__patch"];
        trace?: never;
    };
    "/api/academies/{academy_id}/invitations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Invitations */
        get: operations["invitations_api_academies__academy_id__invitations_get"];
        put?: never;
        /** Invite */
        post: operations["invite_api_academies__academy_id__invitations_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/academies/{academy_id}/invitations/{invitation_id}/revoke": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Revoke */
        post: operations["revoke_api_academies__academy_id__invitations__invitation_id__revoke_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/academies/{academy_id}/activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Activity */
        get: operations["activity_api_academies__academy_id__activity_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health */
        get: operations["health_api_health_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** AcademyCreatedDto */
        AcademyCreatedDto: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Invitationurl */
            invitationUrl: string;
            academy: components["schemas"]["AcademyDto"];
        };
        /** AcademyDto */
        AcademyDto: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /** Slug */
            slug: string;
            /** Active */
            active: boolean;
            /** Timezone */
            timezone: string;
            /**
             * Createdat
             * Format: date-time
             */
            createdAt: string;
        };
        /** AcademyInput */
        AcademyInput: {
            /** Name */
            name: string;
            /** Slug */
            slug: string;
            /** Adminemail */
            adminEmail: string;
        };
        /** AcceptDto */
        AcceptDto: {
            /**
             * Academyid
             * Format: uuid
             */
            academyId: string;
        };
        /** AcceptInput */
        AcceptInput: {
            /** Token */
            token: string;
        };
        /** ActiveInput */
        ActiveInput: {
            /** Active */
            active: boolean;
        };
        /** AuditDto */
        AuditDto: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Action */
            action: string;
            /** Detail */
            detail: string;
            /**
             * Createdat
             * Format: date-time
             */
            createdAt: string;
        };
        /** AuthConfigDto */
        AuthConfigDto: {
            /** Demo */
            demo: boolean;
            /** Profiles */
            profiles: components["schemas"]["DemoProfileDto"][];
        };
        /** BranchDto */
        BranchDto: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /** City */
            city: string;
            /** Address */
            address: string;
            /** Tables */
            tables: components["schemas"]["TableDto"][];
        };
        /** BranchInput */
        BranchInput: {
            /** Name */
            name: string;
            /** City */
            city: string;
            /** Address */
            address: string;
        };
        /** DashboardDto */
        DashboardDto: {
            /** Branches */
            branches: number;
            /** Tables */
            tables: number;
            /** Members */
            members: number | null;
            /** Invitations */
            invitations: number | null;
        };
        /** DemoInput */
        DemoInput: {
            /**
             * Userid
             * Format: uuid
             */
            userId: string;
        };
        /** DemoProfileDto */
        DemoProfileDto: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /** Email */
            email: string;
            /** Label */
            label: string;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** InvitationCreatedDto */
        InvitationCreatedDto: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Invitationurl */
            invitationUrl: string;
        };
        /** InvitationDto */
        InvitationDto: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Email */
            email: string;
            /** Roles */
            roles: components["schemas"]["Role"][];
            /** Allbranches */
            allBranches: boolean;
            /** Branchids */
            branchIds: string[];
            /**
             * Expiresat
             * Format: date-time
             */
            expiresAt: string;
            /** Acceptedat */
            acceptedAt: string | null;
            /**
             * Createdat
             * Format: date-time
             */
            createdAt: string;
        };
        /** InvitationInput */
        InvitationInput: {
            /** Roles */
            roles: components["schemas"]["Role"][];
            /** Allbranches */
            allBranches: boolean;
            /** Branchids */
            branchIds: string[];
            /** Email */
            email: string;
        };
        /** MeDto */
        MeDto: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Email */
            email: string;
            /** Name */
            name: string;
            /** Platformowner */
            platformOwner: boolean;
            /** Workspaces */
            workspaces: components["schemas"]["WorkspaceDto"][];
        };
        /** MemberDto */
        MemberDto: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Userid
             * Format: uuid
             */
            userId: string;
            /** Name */
            name: string;
            /** Email */
            email: string;
            /** Roles */
            roles: components["schemas"]["Role"][];
            /** Allbranches */
            allBranches: boolean;
            /** Active */
            active: boolean;
            /** Branchids */
            branchIds: string[];
        };
        /** MemberInput */
        MemberInput: {
            /** Roles */
            roles: components["schemas"]["Role"][];
            /** Allbranches */
            allBranches: boolean;
            /** Branchids */
            branchIds: string[];
            /** Active */
            active: boolean;
        };
        /**
         * Role
         * @enum {string}
         */
        Role: "ADMIN" | "COACH" | "FINANCE" | "SCORER" | "ATHLETE" | "GUARDIAN";
        /** TableDto */
        TableDto: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
        };
        /** TableInput */
        TableInput: {
            /** Name */
            name: string;
        };
        /** TokenDto */
        TokenDto: {
            /** Accesstoken */
            accessToken: string;
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
        /** WorkspaceDto */
        WorkspaceDto: {
            academy: components["schemas"]["AcademyDto"];
            membership: components["schemas"]["MemberDto"];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    auth_config_api_auth_config_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthConfigDto"];
                };
            };
        };
    };
    demo_api_auth_demo_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DemoInput"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenDto"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    me_api_me_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MeDto"];
                };
            };
        };
    };
    accept_api_invitations_accept_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AcceptInput"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AcceptDto"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    academies_api_platform_academies_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AcademyDto"][];
                };
            };
        };
    };
    create_academy_api_platform_academies_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AcademyInput"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AcademyCreatedDto"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    set_active_api_platform_academies__academy_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academy_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ActiveInput"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AcademyDto"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    dashboard_api_academies__academy_id__dashboard_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academy_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DashboardDto"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    branches_api_academies__academy_id__branches_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academy_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BranchDto"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_branch_api_academies__academy_id__branches_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academy_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BranchInput"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BranchDto"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_table_api_academies__academy_id__branches__branch_id__tables_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academy_id: string;
                branch_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TableInput"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TableDto"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    members_api_academies__academy_id__members_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academy_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemberDto"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_member_api_academies__academy_id__members__member_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academy_id: string;
                member_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MemberInput"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemberDto"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    invitations_api_academies__academy_id__invitations_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academy_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvitationDto"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    invite_api_academies__academy_id__invitations_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academy_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InvitationInput"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvitationCreatedDto"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    revoke_api_academies__academy_id__invitations__invitation_id__revoke_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academy_id: string;
                invitation_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    activity_api_academies__academy_id__activity_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academy_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuditDto"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    health_api_health_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
}
