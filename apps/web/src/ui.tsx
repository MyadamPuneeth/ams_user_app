import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { AlertCircle, ArrowUpRight, Check, Copy, LoaderCircle, X } from 'lucide-react';

export function Loading() { return <div className="loading" role="status"><LoaderCircle className="spin" size={22} /> Loading your workspace…</div>; }
export function ErrorMessage({ message }: { message: string }) { return <div className="error" role="alert"><AlertCircle size={18} /><span>{message}</span></div>; }
export function Empty({ title, children }: { title: string; children: ReactNode }) { return <div className="empty"><div className="empty-mark">↗</div><h3>{title}</h3><p>{children}</p></div>; }
export function Pill({ children, tone = '' }: { children: ReactNode; tone?: string }) { return <span className={`pill ${tone}`}>{children}</span>; }
export function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: ReactNode }) { return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="subtle">{subtitle}</p></div>{action}</div>; }
export function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="field"><span>{label}</span>{children}</label>; }
export function Modal({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => { ref.current?.showModal(); const previous = document.activeElement as HTMLElement; return () => { ref.current?.close(); previous?.focus(); }; }, []);
  return <dialog ref={ref} aria-labelledby={id} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === ref.current) close(); }}><div className="modal-head"><h2 id={id}>{title}</h2><button type="button" className="icon-button" aria-label="Close dialog" onClick={close}><X size={20} /></button></div>{children}</dialog>;
}
export function AsyncForm({ children, submit, button = 'Save changes', onSuccess }: { children: ReactNode; submit: (data: FormData) => Promise<void>; button?: string; onSuccess?: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function handle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try { await submit(new FormData(event.currentTarget)); onSuccess?.(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to save. Please try again.'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={e => void handle(e)} className="stack">{children}{error && <ErrorMessage message={error} />}<button className="button primary" disabled={busy}>{busy ? <LoaderCircle size={17} className="spin" /> : null}{busy ? 'Saving…' : button}</button></form>;
}
export function InvitationLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return <div className="invite-result"><Check size={24} /><h3>Your invitation is ready</h3><p>Share this single-use link with the invited person. It expires in 7 days. They must sign in with the invited email.</p><input readOnly aria-label="Invitation link" value={url} onFocus={e => e.target.select()} /><button className="button primary" onClick={() => void navigator.clipboard.writeText(url).then(() => setCopied(true)).catch(() => setCopied(false))}><Copy size={16} />{copied ? 'Copied' : 'Copy invitation link'}</button><p className="small subtle">Email delivery isn’t connected yet. Copy and share the link directly.</p></div>;
}
export function Initials({ name, small = false }: { name: string; small?: boolean }) { return <span className={`avatar ${small ? 'small-avatar' : ''}`}>{name.split(' ').slice(0, 2).map(s => s[0]).join('')}</span>; }
export const formValue = (data: FormData, key: string) => String(data.get(key) || '').trim();
export const roleName = (role: string) => ({ ADMIN: 'Administrator', COACH: 'Coach', FINANCE: 'Finance', SCORER: 'Scorer', ATHLETE: 'Athlete', GUARDIAN: 'Guardian' }[role] || role);
export const dateTime = (value: string) => new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
