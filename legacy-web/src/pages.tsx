import { useEffect, useState, type DependencyList } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { Activity, ArrowRight, ArrowUpRight, Building2, Check, CheckCircle2, ClipboardList, Clock3, Flag, MapPin, MoreHorizontal, Plus, ShieldCheck, Table2, Trophy, Users, Wallet } from 'lucide-react';
import type { Academy, Audit, Branch, Dashboard, Invitation, Me, Member, Role, Workspace } from '@ams/api-client';
import { api } from './App';
import { AsyncForm, Empty, ErrorMessage, Field, Initials, InvitationLink, Loading, Modal, PageHeading, Pill, dateTime, formValue, roleName } from './ui';

function useData<T>(load: () => Promise<T>, deps: DependencyList) {
  const [value, setValue] = useState<T>();
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let current = true;
    setError('');
    void load().then(data => { if (current) setValue(data); }).catch(e => { if (current) setError(e instanceof Error ? e.message : 'Could not load your records.'); });
    return () => { current = false; };
  }, [...deps, retry]);
  return { value, error, reload: () => setRetry(v => v + 1) };
}
function LoadError({ message, retry }: { message: string; retry: () => void }) { return <div className="stack"><ErrorMessage message={message} /><button className="button secondary" onClick={retry}>Try again</button></div>; }

export function AcademyPages({ workspace, me, refreshMe }: { workspace: Workspace; me: Me; refreshMe: () => Promise<void> }) {
  const admin = workspace.membership.roles.includes('ADMIN');
  return <Routes>
    <Route index element={<Overview workspace={workspace} me={me} />} />
    <Route path="branches" element={<Branches academyId={workspace.academy.id} admin={admin} />} />
    <Route path="team" element={admin ? <Team academyId={workspace.academy.id} refreshMe={refreshMe} /> : <Navigate to="/" replace />} />
    <Route path="activity" element={admin ? <ActivityPage academyId={workspace.academy.id} /> : <Navigate to="/" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

function Overview({ workspace, me }: { workspace: Workspace; me: Me }) {
  const admin = workspace.membership.roles.includes('ADMIN');
  const data = useData(async () => ({ dashboard: await api.dashboard(workspace.academy.id), branches: await api.branches(workspace.academy.id), activity: admin ? await api.activity(workspace.academy.id) : [] }), [workspace.academy.id, admin]);
  const today = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' }).format(new Date());
  return <>
    <PageHeading eyebrow="YOUR ACADEMY AT A GLANCE" title={`Hello, ${me.name.split(' ')[0]}.`} subtitle="A little organisation. A lot more time for the game." action={<span className="date-label"><Clock3 size={15} />{today}</span>} />
    <section className="hero"><div className="hero-content"><span className="hero-kicker"><span className="status-dot" /> YOUR NEXT CHAPTER STARTS HERE</span><h2>Build the home<br />for your next champion.</h2><p>Bring your spaces and your people together.<br />Your academy’s foundation is ready to grow.</p><Link className="button lime" to={admin ? '/team' : '/branches'}>{admin ? 'Bring your team on board' : 'Explore your branches'}<ArrowUpRight size={18} /></Link></div><div className="hero-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="court"><div className="court-middle" /><div className="net" /><span className="court-ball" /></div><div className="paddle"><div /></div><span className="art-label">EVERY GREAT GAME<br />STARTS WITH A STRONG FOUNDATION.</span><span className="hero-number">01 / THE FOUNDATION</span></div></section>
    {data.error ? <LoadError message={data.error} retry={data.reload} /> : !data.value ? <Loading /> : <>
      <div className="stats-grid">{[
        { icon: Building2, label: 'Active branches', value: data.value.dashboard.branches, note: 'Spaces to make progress', color: 'mint' },
        { icon: Table2, label: 'Training tables', value: data.value.dashboard.tables, note: 'Across your accessible branches', color: 'peach' },
        { icon: Users, label: 'Academy members', value: data.value.dashboard.members, note: admin ? 'People behind the progress' : 'Managed by your administrator', color: 'lavender' },
        { icon: ShieldCheck, label: 'Open invitations', value: data.value.dashboard.invitations, note: admin ? 'Waiting to join your academy' : 'Managed by your administrator', color: 'yellow' },
      ].map(stat => <div className="stat-card" key={stat.label}><div className="stat-top"><span>{stat.label}</span><div className={`stat-icon ${stat.color}`}><stat.icon size={19} /></div></div><strong>{stat.value ?? '—'}</strong><p>{stat.note}</p></div>)}</div>
      <div className="overview-grid"><section className="panel"><div className="section-heading"><div><h2>Your spaces</h2><p>Where the everyday work becomes progress.</p></div><Link to="/branches" className="text-link">View all <ArrowUpRight size={16} /></Link></div>{data.value.branches.length ? data.value.branches.slice(0, 3).map((branch, i) => <Link to="/branches" className="space-row" key={branch.id}><span className={`space-icon ${i % 2 ? 'peach' : 'mint'}`}><Building2 size={23} /></span><div><h3>{branch.name}</h3><p><MapPin size={12} />{branch.city} <span>·</span> {branch.tables.length} tables</p></div><ArrowUpRight size={18} /></Link>) : <Empty title="A place to begin">Add your first branch and its training tables.</Empty>}</section>
        <section className="panel setup-panel"><div className="section-heading"><div><h2>A strong foundation</h2><p>Small steps. A connected academy.</p></div><Flag size={21} /></div>{[
          { label: 'Your academy workspace', done: true, path: '/' },
          { label: 'Add your training spaces', done: data.value.dashboard.branches > 0, path: '/branches' },
          { label: 'Register your tables', done: data.value.dashboard.tables > 0, path: '/branches' },
          { label: 'Bring your team together', done: (data.value.dashboard.members || 0) > 1, path: admin ? '/team' : '/branches' },
        ].map((step, i) => <Link to={step.path} className="setup-row" key={step.label}><span className={step.done ? 'step done' : 'step'}>{step.done ? <Check size={13} /> : i + 1}</span><span>{step.label}</span><ArrowRight size={15} /></Link>)}</section></div>
      <section className="next-section"><div className="section-heading"><div><p className="eyebrow">BUILT TO GROW WITH YOU</p><h2>The bigger picture</h2></div><span className="subtle small">Coming in the next milestones</span></div><div className="roadmap-grid">{[{ icon: Users, title: 'Athletes & coaching', text: 'From the first trial to their next personal best.', tag: 'Milestone 02' }, { icon: Wallet, title: 'Fees & operations', text: 'Keep your academy’s business in good shape.', tag: 'Milestone 03' }, { icon: Trophy, title: 'Competitions & scoring', text: 'Every draw, every match, every point.', tag: 'Milestone 04' }].map(card => <article className="roadmap-card" key={card.title}><div><card.icon size={21} /><span>{card.tag}</span></div><h3>{card.title}</h3><p>{card.text}</p></article>)}</div></section>
      {admin && <section className="panel activity-preview"><div className="section-heading"><h2>Latest activity</h2><Link className="text-link" to="/activity">View log <ArrowUpRight size={16} /></Link></div>{data.value.activity.slice(0, 3).map(item => <div className="activity-row" key={item.id}><span className="activity-icon"><Activity size={16} /></span><div><strong>{item.detail}</strong><small>{item.action.replaceAll('.', ' / ')}</small></div><time>{dateTime(item.createdAt)}</time></div>)}</section>}
    </>}
  </>;
}

function Branches({ academyId, admin }: { academyId: string; admin: boolean }) {
  const data = useData(() => api.branches(academyId), [academyId]);
  const [modal, setModal] = useState<'branch' | Branch>();
  const [search, setSearch] = useState('');
  return <><PageHeading eyebrow="THE PLACES YOU PLAY" title="Branches & tables" subtitle="Give every training space a place in your academy." action={admin && <button className="button primary" onClick={() => setModal('branch')}><Plus size={18} />Add branch</button>} />
    <div className="toolbar"><input aria-label="Search branches" placeholder="Find a branch or city…" value={search} onChange={e => setSearch(e.target.value)} /><span className="subtle small">{data.value?.length ?? '—'} accessible branches</span></div>
    {data.error ? <LoadError message={data.error} retry={data.reload} /> : !data.value ? <Loading /> : <div className="branch-grid">{data.value.filter(branch => `${branch.name} ${branch.city}`.toLowerCase().includes(search.toLowerCase())).map((branch, i) => <article className="branch-card panel" key={branch.id}><div className={`branch-art ${i % 2 ? 'branch-art-peach' : ''}`}><div className="mini-table"><i /><b /></div><Pill>Active branch</Pill></div><div className="branch-content"><div className="section-heading"><h2>{branch.name}</h2><Building2 size={21} /></div><p className="location"><MapPin size={15} />{branch.city}</p><p className="address">{branch.address}</p><div className="table-list">{branch.tables.map(table => <span key={table.id}><Table2 size={13} />{table.name}</span>)}{!branch.tables.length && <span className="subtle">No tables registered yet.</span>}</div><div className="branch-bottom"><span>{branch.tables.length} training tables</span>{admin && <button className="text-link" onClick={() => setModal(branch)}><Plus size={15} />Add table</button>}</div></div></article>)}{!data.value.filter(b => `${b.name} ${b.city}`.toLowerCase().includes(search.toLowerCase())).length && <Empty title={search ? 'No matching branches' : 'Your first space starts here'}>{search ? 'Try another branch name or city.' : 'Add a branch to organise your training tables.'}</Empty>}</div>}
    {modal && <Modal title={modal === 'branch' ? 'Add a branch' : `Add a table · ${modal.name}`} close={() => setModal(undefined)}><AsyncForm button={modal === 'branch' ? 'Create branch' : 'Add table'} submit={async form => { if (modal === 'branch') await api.createBranch(academyId, { name: formValue(form, 'name'), city: formValue(form, 'city'), address: formValue(form, 'address') }); else await api.createTable(academyId, modal.id, formValue(form, 'name')); }} onSuccess={() => { setModal(undefined); data.reload(); }}><Field label={modal === 'branch' ? 'Branch name' : 'Table name'}><input required autoFocus name="name" minLength={modal === 'branch' ? 2 : 1} maxLength={modal === 'branch' ? 100 : 60} placeholder={modal === 'branch' ? 'e.g. Koramangala' : 'e.g. Table 4'} /></Field>{modal === 'branch' && <><Field label="City"><input required name="city" minLength={2} maxLength={100} /></Field><Field label="Address"><textarea required name="address" minLength={3} maxLength={300} rows={3} /></Field></>}</AsyncForm></Modal>}
  </>;
}

function AccessFields({ branches, member }: { branches: Branch[]; member?: Member }) {
  const [role, setRole] = useState<Role>(member?.roles[0] || 'COACH');
  const [all, setAll] = useState(member?.allBranches ?? true);
  return <><Field label="Roles"><select name="roles" multiple defaultValue={member?.roles || ['COACH']} onChange={e => { const selected = Array.from(e.target.selectedOptions).map(o => o.value); if (selected.includes('ADMIN')) { setRole('ADMIN'); setAll(true); } else setRole((selected[0] as Role) || 'COACH'); }} required size={6}>{(['ADMIN', 'COACH', 'FINANCE', 'SCORER', 'ATHLETE', 'GUARDIAN'] as Role[]).map(r => <option key={r} value={r}>{roleName(r)}</option>)}</select></Field><p className="small subtle">Select one or more roles. Hold Ctrl (Windows) or Command (Mac) to select multiple.</p><Field label="Branch access"><select name="scope" value={all ? 'all' : 'selected'} onChange={e => setAll(e.target.value === 'all')}><option value="all">All branches</option>{role !== 'ADMIN' && <option value="selected">Specific branches</option>}</select></Field>{!all && <fieldset className="branch-choices"><legend>Allowed branches</legend>{branches.map(branch => <label key={branch.id}><input type="checkbox" name="branchIds" value={branch.id} defaultChecked={member?.branchIds.includes(branch.id)} />{branch.name}</label>)}</fieldset>}</>;
}
function accessValues(data: FormData) { return { roles: data.getAll('roles').map(String) as Role[], allBranches: formValue(data, 'scope') === 'all', branchIds: formValue(data, 'scope') === 'all' ? [] : data.getAll('branchIds').map(String) }; }

function Team({ academyId, refreshMe }: { academyId: string; refreshMe: () => Promise<void> }) {
  const data = useData(async () => ({ members: await api.members(academyId), invitations: await api.invitations(academyId), branches: await api.branches(academyId) }), [academyId]);
  const [modal, setModal] = useState<'invite' | Member>();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  async function revoke(id: string) { setBusy(id); setError(''); try { await api.revokeInvite(academyId, id); data.reload(); } catch (e) { setError(e instanceof Error ? e.message : 'Could not revoke invitation.'); } finally { setBusy(''); } }
  return <><PageHeading eyebrow="THE PEOPLE BEHIND THE PROGRESS" title="Team & access" subtitle="Bring your people together, with the right access for each person." action={<button className="button primary" onClick={() => { setUrl(''); setModal('invite'); }}><Plus size={18} />Invite a member</button>} />{error && <ErrorMessage message={error} />}
    {data.error ? <LoadError message={data.error} retry={data.reload} /> : !data.value ? <Loading /> : <><section className="panel"><div className="section-heading"><h2>Academy members <span className="count">{data.value.members.length}</span></h2><Pill>Private to your academy</Pill></div><div className="table-scroll"><table><thead><tr><th>Person</th><th>Role</th><th>Branch access</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{data.value.members.map(member => <tr key={member.id}><td><div className="person"><Initials name={member.name} /><div><strong>{member.name}</strong><small>{member.email}</small></div></div></td><td>{member.roles.map(roleName).join(', ')}</td><td>{member.allBranches ? 'All branches' : member.branchIds.map(id => data.value!.branches.find(b => b.id === id)?.name || 'Assigned branch').join(', ')}</td><td><Pill tone={member.active ? '' : 'muted'}>{member.active ? 'Active' : 'Revoked'}</Pill></td><td><button className="text-link" onClick={() => { setUrl(''); setModal(member); }}>Manage<span className="sr-only"> {member.name}</span></button></td></tr>)}</tbody></table></div></section>
      <section className="panel section-gap"><div className="section-heading"><div><h2>Invitations</h2><p>A seat at the table, ready when they are.</p></div><span className="small subtle">Links expire after 7 days</span></div>{!data.value.invitations.length ? <Empty title="Make room for your team">Invite coaches, finance staff, scorers, athletes or guardians.</Empty> : <div className="table-scroll"><table><thead><tr><th>Email</th><th>Role</th><th>Expires</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{data.value.invitations.map(invite => { const pending = !invite.acceptedAt && new Date(invite.expiresAt) > new Date(); return <tr key={invite.id}><td>{invite.email}</td><td>{invite.roles.map(roleName).join(', ')}</td><td>{dateTime(invite.expiresAt)}</td><td><Pill tone={pending ? 'amber' : 'muted'}>{invite.acceptedAt ? 'Accepted' : pending ? 'Pending' : 'Expired / revoked'}</Pill></td><td>{pending && <button disabled={busy === invite.id} className="text-button danger" onClick={() => void revoke(invite.id)}>Revoke</button>}</td></tr>; })}</tbody></table></div>}</section>
    </>}
    {modal && data.value && <Modal title={url ? 'Invitation created' : modal === 'invite' ? 'Invite a member' : `Manage ${modal.name}`} close={() => { setModal(undefined); setUrl(''); }}>{url ? <InvitationLink url={url} /> : <AsyncForm button={modal === 'invite' ? 'Create invitation' : 'Update access'} submit={async form => { const access = accessValues(form); if (modal === 'invite') { const result = await api.invite(academyId, { email: formValue(form, 'email'), ...access }); setUrl(result.invitationUrl); data.reload(); } else { await api.updateMember(academyId, modal.id, { ...access, active: form.get('active') === 'on' }); setModal(undefined); data.reload(); await refreshMe(); } }}>{modal === 'invite' ? <Field label="Email address"><input type="email" name="email" required maxLength={254} placeholder="coach@youracademy.com" /></Field> : <label className="check-label"><input type="checkbox" name="active" defaultChecked={modal.active} />Active membership</label>}<AccessFields branches={data.value.branches} member={modal === 'invite' ? undefined : modal} /></AsyncForm>}</Modal>}
  </>;
}

function ActivityPage({ academyId }: { academyId: string }) {
  const data = useData(() => api.activity(academyId), [academyId]);
  return <><PageHeading eyebrow="A CLEAR RECORD" title="Activity log" subtitle="The latest 50 changes to your academy’s foundation." />{data.error ? <LoadError message={data.error} retry={data.reload} /> : !data.value ? <Loading /> : <section className="panel">{data.value.length ? data.value.map(item => <div className="activity-row" key={item.id}><span className="activity-icon"><Activity size={17} /></span><div><strong>{item.detail}</strong><small>{item.action.replaceAll('.', ' / ')}</small></div><time>{dateTime(item.createdAt)}</time></div>) : <Empty title="A fresh beginning">Academy changes will appear here as your team gets started.</Empty>}</section>}</>;
}

export function PlatformPage() {
  const data = useData(() => api.academies(), []);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  async function toggle(academy: Academy) {
    if (!window.confirm(`${academy.active ? 'Suspend' : 'Activate'} ${academy.name}? ${academy.active ? 'Members will lose workspace access until it is reactivated.' : 'Members will regain their existing access.'}`)) return;
    setBusy(academy.id); setError('');
    try { await api.setAcademyActive(academy.id, !academy.active); data.reload(); } catch (e) { setError(e instanceof Error ? e.message : 'Could not update academy.'); } finally { setBusy(''); }
  }
  return <><PageHeading eyebrow="PLATFORM ADMINISTRATION" title="A home for every academy." subtitle="Onboard academy owners and manage workspace availability." action={<button className="button primary" onClick={() => { setUrl(''); setOpen(true); }}><Plus size={18} />Onboard academy</button>} /><div className="platform-note"><ShieldCheck size={22} /><p>Academy records stay private. Platform access covers onboarding and workspace status.</p></div>{error && <ErrorMessage message={error} />}{data.error ? <LoadError message={data.error} retry={data.reload} /> : !data.value ? <Loading /> : <section className="panel"><div className="table-scroll"><table><thead><tr><th>Academy</th><th>Workspace</th><th>Status</th><th>Created</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{data.value.map(academy => <tr key={academy.id}><td><div className="person"><Initials name={academy.name} /><strong>{academy.name}</strong></div></td><td>{academy.slug}</td><td><Pill tone={academy.active ? '' : 'muted'}>{academy.active ? 'Active' : 'Suspended'}</Pill></td><td>{dateTime(academy.createdAt)}</td><td><button className="text-button" disabled={busy === academy.id} onClick={() => void toggle(academy)}>{academy.active ? 'Suspend' : 'Activate'}</button></td></tr>)}</tbody></table></div></section>}{open && <Modal title={url ? 'Welcome your academy administrator' : 'Onboard an academy'} close={() => setOpen(false)}>{url ? <InvitationLink url={url} /> : <AsyncForm button="Create academy & invitation" submit={async form => { const result = await api.createAcademy({ name: formValue(form, 'name'), slug: formValue(form, 'slug'), adminEmail: formValue(form, 'email') }); setUrl(result.invitationUrl); data.reload(); }}><Field label="Academy name"><input required name="name" minLength={2} maxLength={100} /></Field><Field label="Workspace slug"><input required name="slug" minLength={3} maxLength={50} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="e.g. champions-table-tennis" /></Field><Field label="Administrator email"><input required name="email" type="email" maxLength={254} /></Field><p className="small subtle">The recipient gets administrator access after accepting the invitation with their verified account.</p></AsyncForm>}</Modal>}</>;
}
