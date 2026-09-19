import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createApi, type AuthConfig, type Me } from '@ams/api-client';
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Building2, ChevronDown, LayoutDashboard, LogOut, Menu, ShieldCheck, Table2, Users, X } from 'lucide-react';
import { AsyncForm, ErrorMessage, Field, Initials, Loading, formValue } from './ui';
import { AcademyPages, PlatformPage } from './pages';

let supabase: SupabaseClient | undefined;
if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
const getToken = () => sessionStorage.getItem('ams.token');
export const api = createApi(getToken);

export function App() {
  const [config, setConfig] = useState<AuthConfig>();
  const [me, setMe] = useState<Me>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(sessionStorage.getItem('ams.workspace') || '');
  const [menu, setMenu] = useState(false);
  const [recovery, setRecovery] = useState(window.location.hash.includes('type=recovery'));
  const location = useLocation();
  const navigate = useNavigate();
  const generation = useRef(0);

  const refresh = useCallback(async () => {
    const version = ++generation.current;
    if (!getToken()) { setMe(undefined); setLoading(false); return; }
    try { const user = await api.me(); if (version === generation.current) { setMe(user); setError(''); } }
    catch (e) { if (version === generation.current) { sessionStorage.removeItem('ams.token'); setMe(undefined); setError(e instanceof Error ? e.message : 'Please sign in again.'); } }
    finally { if (version === generation.current) setLoading(false); }
  }, []);
  useEffect(() => {
    void api.config().then(setConfig).catch(() => { setError('The API is unavailable. Start the development server and retry.'); setLoading(false); });
    void refresh();
    const listener = supabase?.auth.onAuthStateChange((_event, session) => {
      if (_event === 'PASSWORD_RECOVERY') setRecovery(true);
      if (session?.access_token) sessionStorage.setItem('ams.token', session.access_token);
      else sessionStorage.removeItem('ams.token');
      void refresh();
    });
    return () => listener?.data.subscription.unsubscribe();
  }, [refresh]);
  useEffect(() => { setMenu(false); }, [location.pathname]);

  async function signOut() { generation.current++; sessionStorage.removeItem('ams.token'); setMe(undefined); await supabase?.auth.signOut(); if (location.pathname !== '/accept-invitation') navigate('/'); }
  const workspace = me?.workspaces.find(w => w.academy.id === selected) || me?.workspaces[0];
  if (loading) return <Loading />;
  if (!config) return <div className="login-page"><ErrorMessage message={error || 'Connecting…'} /><button className="button primary" onClick={() => window.location.reload()}>Retry connection</button></div>;
  if (!me || recovery) return <Login config={config} error={error} ready={refresh} recovery={recovery} recovered={() => setRecovery(false)} />;
  if (location.pathname === '/accept-invitation') return <AcceptInvitation refresh={refresh} signOut={signOut} email={me.email} select={id => { setSelected(id); sessionStorage.setItem('ams.workspace', id); }} />;
  const admin = workspace?.membership.roles.includes('ADMIN');
  return <div className="app-shell">
    {menu && <button className="mobile-overlay" aria-label="Close navigation" onClick={() => setMenu(false)} />}
    <aside className={`sidebar ${menu ? 'open' : ''}`}>
      <Link to="/" className="brand"><span className="brand-symbol"><Table2 size={25} /></span><span>ams<span className="brand-dot">.</span><small>ACADEMY MANAGEMENT</small></span></Link>
      <p className="nav-label">WORKSPACE</p>
      <nav>
        {workspace && <><NavLink to="/" end><LayoutDashboard size={18} />Overview</NavLink><NavLink to="/branches"><Building2 size={18} />Branches & tables</NavLink>{admin && <><NavLink to="/team"><Users size={18} />Team & access</NavLink><NavLink to="/activity"><Activity size={18} />Activity log</NavLink></>}</>}
        {me.platformOwner && <><p className="nav-label">PLATFORM</p><NavLink to="/platform"><ShieldCheck size={18} />Academies</NavLink></>}
      </nav>
      <div className="sidebar-note"><span className="status-dot" /> A strong start.<p>Your academy, connected.<br />Built for the next generation.</p><div className="mini-court"><i /><b /></div></div>
      <div className="sidebar-footer"><Initials name={me.name} small /><div><strong>{me.name}</strong><small>{me.platformOwner ? 'Platform owner' : admin ? 'Academy administrator' : workspace?.membership.roles.join(' · ') || 'Invited member'}</small></div><button className="icon-button" aria-label="Sign out" onClick={() => void signOut()}><LogOut size={17} /></button></div>
    </aside>
    <div className="main-shell"><header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMenu(true)}><Menu size={22} /></button><span className="sport-mark">TT</span><div className="workspace-control"><label htmlFor="workspace">YOUR ACADEMY</label><select id="workspace" value={workspace?.academy.id || ''} onChange={e => { setSelected(e.target.value); sessionStorage.setItem('ams.workspace', e.target.value); navigate('/'); }}>{me.workspaces.length ? me.workspaces.map(w => <option key={w.academy.id} value={w.academy.id}>{w.academy.name}</option>) : <option value="">Platform workspace</option>}</select></div></div><div className="topbar-right"><span className="sport-pill">Table tennis</span><span className="topbar-divider" /><Initials name={me.name} small /></div></header>
      {config.demo && <div className="preview-bar"><span className="status-dot" />Local preview · Sample academies and accounts · Changes are saved on this device’s database</div>}
      <main key={workspace?.academy.id || 'platform'}>
        <Routes>
          <Route path="/platform" element={me.platformOwner ? <PlatformPage /> : <Navigate to="/" replace />} />
          <Route path="/*" element={workspace ? <AcademyPages workspace={workspace} me={me} refreshMe={refresh} /> : me.platformOwner ? <Navigate to="/platform" replace /> : <div className="no-workspace"><ShieldCheck size={38} /><h1>Your workspace is waiting</h1><p>Open your academy invitation link to join. You’re signed in as {me.email}.</p><button className="button secondary" onClick={() => void refresh()}>Check for access</button></div>} />
        </Routes>
      </main><footer className="app-footer"><span>AMS / Made for the game.</span><span>India · IST</span></footer>
    </div>
  </div>;
}

function Login({ config, error, ready, recovery, recovered }: { config: AuthConfig; error: string; ready: () => Promise<void>; recovery: boolean; recovered: () => void }) {
  const [reset, setReset] = useState(false);
  const [notice, setNotice] = useState('');
  return <div className="login-page"><section className="login-story"><div className="brand"><span className="brand-symbol"><Table2 /></span><span>ams.</span></div><div><p className="eyebrow">MORE TIME FOR THE GAME</p><h1>Great athletes.<br />Stronger academies.</h1><p>The workspace for everything behind your next great player.</p><div className="login-court"><div className="court-net" /><div className="court-line" /><span /></div></div><small>TABLE TENNIS ACADEMY MANAGEMENT</small></section><section className="login-form"><span className="eyebrow">WELCOME TO YOUR WORKSPACE</span><h1>{config.demo ? 'Take your place.' : recovery ? 'Set your new password' : reset ? 'Reset your password' : 'Welcome back.'}</h1><p className="subtle">{config.demo ? 'Choose a sample account to explore the foundation.' : 'Sign in with the email your academy invited.'}</p>{error && <ErrorMessage message={error} />}{notice && <p role="status" className="notice">{notice}</p>}
      <AsyncForm button={config.demo ? 'Open workspace' : recovery ? 'Update password' : reset ? 'Send reset email' : 'Sign in'} submit={async data => {
        if (config.demo) { const result = await api.demo(formValue(data, 'profile')); sessionStorage.setItem('ams.token', result.accessToken); await ready(); }
        else {
          if (!supabase) throw new Error('Supabase settings are missing. Configure the web application environment.');
          if (recovery) { const result = await supabase.auth.updateUser({ password: String(data.get('password') || '') }); if (result.error) throw result.error; recovered(); window.history.replaceState(null, '', window.location.pathname); await ready(); }
          else if (reset) { const result = await supabase.auth.resetPasswordForEmail(formValue(data, 'email'), { redirectTo: window.location.origin }); if (result.error) throw result.error; setNotice('If an account exists, a reset link will be sent to its email.'); }
          else { const result = await supabase.auth.signInWithPassword({ email: formValue(data, 'email'), password: String(data.get('password') || '') }); if (result.error) throw result.error; sessionStorage.setItem('ams.token', result.data.session.access_token); await ready(); }
        }
      }}>
        {config.demo ? <Field label="Preview account"><select name="profile">{config.profiles.map(p => <option key={p.id} value={p.id}>{p.name} — {p.label}</option>)}</select></Field> : <>{!recovery && <Field label="Email address"><input required type="email" name="email" autoComplete="email" /></Field>}{(!reset || recovery) && <Field label="Password"><input required type="password" name="password" minLength={8} autoComplete={recovery ? 'new-password' : 'current-password'} /></Field>}</>}
      </AsyncForm>{!config.demo && <button className="text-button" onClick={() => setReset(!reset)}>{reset ? 'Back to sign in' : 'Forgot password?'}</button>}
      <div className="login-footnote"><ShieldCheck size={18} /><p>{config.demo ? 'Development preview only. No live athlete or payment data.' : 'Invite-only access. Contact your academy administrator to join.'}</p></div></section></div>;
}

function AcceptInvitation({ refresh, signOut, email, select }: { refresh: () => Promise<void>; signOut: () => Promise<void>; email: string; select: (id: string) => void }) {
  const navigate = useNavigate();
  const token = window.location.hash.slice(1);
  return <div className="accept-page"><section className="panel"><ShieldCheck size={36} /><p className="eyebrow">YOU’RE INVITED</p><h1>Join your academy</h1><p>You’re signed in as <strong>{email}</strong>. This must match the invitation’s email address.</p><AsyncForm button="Accept invitation" submit={async () => { if (!/^[a-f0-9]{64}$/.test(token)) throw new Error('This invitation link is incomplete. Ask your administrator for a new link.'); const result = await api.accept(token); select(result.academyId); await refresh(); navigate('/', { replace: true }); }}><p className="subtle">Your academy administrator controls your role and branch access.</p></AsyncForm><button className="text-button" onClick={() => void signOut()}>Use a different account</button></section></div>;
}
