import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createApi, type Athlete, type Coach, type Member } from '@ams/api-client';

const api = createApi(() => sessionStorage.getItem('ams.token'));
const weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
export function MobileAccountsPanel({ academyId, athletes, coaches }: { academyId: string; athletes: Athlete[]; coaches: Coach[] }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [rules, setRules] = useState<Awaited<ReturnType<typeof api.staffWorkdays>>>([]);
  const [kind, setKind] = useState<'ATHLETE' | 'COACH' | 'STAFF'>('ATHLETE');
  const [error, setError] = useState(''); const [created, setCreated] = useState('');
  const [busy, setBusy] = useState(false);
  const [activeForm, setActiveForm] = useState('');
  const pending = useRef(false);
  const load = async () => { const [people, workdays] = await Promise.all([api.members(academyId), api.staffWorkdays(academyId)]); setMembers(people); setRules(workdays); };
  useEffect(() => { void load().catch(value => setError(value instanceof Error ? value.message : 'Could not load accounts.')); }, [academyId]);
  async function provision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending.current) return; pending.current = true; setActiveForm('account'); setBusy(true); setError(''); setCreated('');
    const form = event.currentTarget; const data = new FormData(form);
    try {
      await api.provisionMobileAccount(academyId, { personType: kind, personId: kind === 'STAFF' ? null : String(data.get('personId')),
        username: String(data.get('username')), temporaryPassword: String(data.get('temporaryPassword')),
        name: String(data.get('name')), email: String(data.get('email')) });
      setCreated(`Account created for ${data.get('username')}. Share the temporary password privately; a new password is required at first sign-in.`);
      form.reset(); await load();
    } catch (value) { setError(value instanceof Error ? value.message : 'Could not create account.'); }
    finally { pending.current = false; setBusy(false); }
  }
  async function saveWorkdays(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending.current) return; pending.current = true; setActiveForm('workdays'); setBusy(true); setError('');
    const data = new FormData(event.currentTarget);
    try { await api.saveStaffWorkdays(academyId, { membershipId: String(data.get('membershipId')), weekdays: data.getAll('weekday').map(Number) }); await load(); setCreated('Workdays saved from today.'); }
    catch (value) { setError(value instanceof Error ? value.message : 'Could not save workdays.'); }
    finally { pending.current = false; setBusy(false); }
  }
  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending.current) return; pending.current = true; setActiveForm('password'); setBusy(true); setError(''); setCreated('');
    const form = event.currentTarget; const data = new FormData(form);
    try { await api.resetMobilePassword(academyId, { membershipId: String(data.get('membershipId')), temporaryPassword: String(data.get('temporaryPassword')) }); setCreated('Password reset. Existing device sessions were revoked. Share the new temporary password privately.'); form.reset(); }
    catch (value) { setError(value instanceof Error ? value.message : 'Could not reset password.'); }
    finally { pending.current = false; setBusy(false); }
  }
  return <section className="content-card"><div className="section-heading"><h2>Create mobile account</h2><p>Give athletes and staff their own RallyOne sign-in.</p></div>
    <form className="dialog-form" onSubmit={provision}><div className="form-grid">
      <label>Account type<select value={kind} onChange={event => setKind(event.target.value as typeof kind)}><option value="ATHLETE">Athlete</option><option value="COACH">Coach</option><option value="STAFF">Other staff</option></select></label>
      {kind !== 'STAFF' && <label>{kind === 'ATHLETE' ? 'Athlete' : 'Coach'}<select name="personId" required><option value="">Choose a record</option>{(kind === 'ATHLETE' ? athletes : coaches).filter(person => person.active && !person.membershipId).map(person => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>}
      <label>Name<input name="name" minLength={2} required /></label><label>Email<input name="email" type="email" required /></label>
      <label>Username<input name="username" minLength={3} pattern="[A-Za-z0-9._-]+" required /></label>
      <label>Temporary password<input name="temporaryPassword" type="password" minLength={12} required /></label>
    </div>{error && activeForm === 'account' && <p className="form-error" role="alert">{error}</p>}<button className="primary" disabled={busy}>{busy && activeForm === 'account' ? 'Creating...' : 'Create mobile account'}</button></form>
    <div className="section-heading" style={{ marginTop: 32 }}><h2>Staff workdays</h2><p>Changes take effect today. Days without a schedule do not count toward the attendance rate.</p></div>
    <form className="dialog-form" onSubmit={saveWorkdays}><label>Staff member<select name="membershipId" required><option value="">Choose staff</option>{members.filter(member => member.active && !member.roles.includes('ATHLETE')).map(member => <option key={member.id} value={member.id}>{member.name}{rules.find(rule => rule.membershipId === member.id) ? ' · configured' : ''}</option>)}</select></label><fieldset><legend>Expected days</legend><div className="check-grid">{weekdays.map((day, index) => <label className="check-label" key={day}><input type="checkbox" name="weekday" value={index} />{day}</label>)}</div></fieldset>{error && activeForm === 'workdays' && <p className="form-error" role="alert">{error}</p>}<button className="primary" disabled={busy}>{busy && activeForm === 'workdays' ? 'Saving...' : 'Save workdays'}</button></form>
    <div className="section-heading" style={{ marginTop: 32 }}><h2>Reset a mobile password</h2><p>This signs the account out on every device.</p></div>
    <form className="dialog-form" onSubmit={resetPassword}><div className="form-grid"><label>Account<select name="membershipId" required><option value="">Choose an account</option>{members.filter(member => member.active && member.roles.some(role => ['ATHLETE','COACH','SCORER'].includes(role))).map(member => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label><label>New temporary password<input name="temporaryPassword" type="password" minLength={12} required /></label></div>{error && activeForm === 'password' && <p className="form-error" role="alert">{error}</p>}<button className="secondary" disabled={busy}>{busy && activeForm === 'password' ? 'Resetting...' : 'Reset password'}</button></form>
    {created && <p className="success-note" role="status">{created}</p>}{error && !activeForm && <p className="form-error" role="alert">{error}</p>}
  </section>;
}
