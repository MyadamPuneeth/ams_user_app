import { StrictMode, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApiError, createApi, type Me, type Workspace } from '@ams/api-client';
import { AcademyWorkspace } from './operations';
import './style.css';
import './operations.css';

const api = createApi(() => sessionStorage.getItem('ams.token'));

function Brand({ light = false }: { light?: boolean }) {
  return <div className={`brand ${light ? 'light' : ''}`}><span className="brand-mark" aria-hidden="true"><i /><i /></span><span><strong>Rally<span>One</span></strong><small>Academy management</small></span></div>;
}

function PasswordField({ name, label, autoComplete, autoFocus }: { name: string; label: string; autoComplete: string; autoFocus?: boolean }) {
  const [visible, setVisible] = useState(false);
  return <div className="password-control"><label htmlFor={name}>{label}</label><span className="password-field"><input id={name} name={name} type={visible ? 'text' : 'password'} autoComplete={autoComplete} minLength={12} maxLength={128} required autoFocus={autoFocus} /><button type="button" onClick={() => setVisible(value => !value)} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}>{visible ? 'Hide' : 'Show'}</button></span></div>;
}

function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="auth-page"><section className="auth-visual" aria-label="RallyOne academy management"><Brand light /><div className="auth-message"><span className="eyebrow">Made for growing academies</span><h1>Everything your academy needs, in one place.</h1><p>Manage athletes, coaches, batches, attendance and finance without losing sight of the game.</p></div><div className="court-art" aria-hidden="true"><span className="court-line" /><span className="court-net" /><span className="ball" /></div><p className="auth-quote">Less admin. More time coaching.</p></section><section className="auth-panel">{children}</section></main>;
}

function SignIn({ demo, onSuccess }: { demo: boolean; onSuccess: () => Promise<void> }) {
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (pending.current) return; pending.current = true; setBusy(true); setError(''); const data = new FormData(event.currentTarget); try { await api.passwordSignIn({ username: String(data.get('username')), password: String(data.get('password')) }); await onSuccess(); } catch (value) { setError(value instanceof Error ? value.message : 'Could not sign in.'); } finally { pending.current = false; setBusy(false); } };
  const preview = async () => { setBusy(true); setError(''); try { const result = await api.demo('11111111-1111-4111-8111-111111111111'); sessionStorage.setItem('ams.token', result.accessToken); await onSuccess(); } catch (value) { setError(value instanceof Error ? value.message : 'Could not open the preview.'); } finally { setBusy(false); } };
  return <AuthLayout><form className="auth-form" onSubmit={submit}><div className="mobile-brand"><Brand /></div><div><span className="eyebrow green">Welcome back</span><h2>Sign in to your academy</h2><p>Enter the credentials shared by your platform administrator.</p></div><label>Username<input name="username" autoComplete="username" minLength={3} maxLength={50} pattern="[A-Za-z0-9._-]+" placeholder="e.g. coach.arun" required autoFocus /></label><PasswordField name="password" label="Password" autoComplete="current-password" />{error && <p className="form-error" role="alert">{error}</p>}<button className="primary full" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>{demo && <><div className="divider"><span>or</span></div><button className="secondary full" type="button" disabled={busy} onClick={() => void preview()}>Open development preview</button></>}<p className="form-footnote">Need access? Contact your academy administrator.</p></form></AuthLayout>;
}

function ChangePassword({ me, onSuccess, onSignOut }: { me: Me; onSuccess: () => Promise<void>; onSignOut: () => Promise<void> }) {
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (pending.current) return; pending.current = true; setBusy(true); setError(''); const data = new FormData(event.currentTarget); const password = String(data.get('password')); try { if (password !== String(data.get('confirmation'))) throw new Error('The passwords do not match.'); await api.changeRequiredPassword(password); await onSuccess(); } catch (value) { setError(value instanceof Error ? value.message : 'Could not change the password.'); } finally { pending.current = false; setBusy(false); } };
  return <AuthLayout><form className="auth-form" onSubmit={submit}><div className="mobile-brand"><Brand /></div><div><span className="eyebrow green">Secure your account</span><h2>Create a new password</h2><p>Hi {me.name}. Replace your temporary password before entering the workspace.</p></div><PasswordField name="password" label="New password" autoComplete="new-password" autoFocus /><PasswordField name="confirmation" label="Confirm new password" autoComplete="new-password" />{error && <p className="form-error" role="alert">{error}</p>}<button className="primary full" disabled={busy}>{busy ? 'Saving...' : 'Save password and continue'}</button><button className="text-button" type="button" onClick={() => void onSignOut()}>Sign out instead</button></form></AuthLayout>;
}

function App() {
  const [me, setMe] = useState<Me>(); const [workspace, setWorkspace] = useState<Workspace>(); const [demo, setDemo] = useState(false); const [checking, setChecking] = useState(true); const [error, setError] = useState('');
  const load = async () => { try { const value = await api.me(); setMe(value); setWorkspace(value.workspaces[0]); setError(''); } catch (value) { setMe(undefined); setWorkspace(undefined); if (!(value instanceof ApiError && value.status === 401)) setError(value instanceof Error ? value.message : 'Could not load your workspace.'); } finally { setChecking(false); } };
  const signOut = async () => { try { await api.passwordSignOut(); } catch { /* demo sessions use only the bearer token */ } sessionStorage.removeItem('ams.token'); setMe(undefined); setWorkspace(undefined); };
  useEffect(() => { void Promise.all([api.config().then(value => setDemo(value.demo)), load()]); }, []);
  if (checking) return <main className="loading"><Brand /><span>Preparing your workspace...</span></main>;
  if (!me) return <><SignIn demo={demo} onSuccess={load} />{error && <p className="toast" role="alert">{error}</p>}</>;
  if (me.passwordChangeRequired) return <ChangePassword me={me} onSuccess={load} onSignOut={signOut} />;
  return <AcademyWorkspace me={me} workspace={workspace} onSignOut={signOut} />;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
