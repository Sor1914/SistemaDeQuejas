import { useEffect, useState } from 'react';

type Toast = { id: number; message: string; kind?: 'success' | 'info' | 'error' };

export default function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { message: string; kind?: Toast['kind'] };
      setToasts((list) => [...list, { id: Date.now(), message: detail.message, kind: detail.kind }]);
    };
    window.addEventListener('app:toast', handler as EventListener);
    return () => window.removeEventListener('app:toast', handler as EventListener);
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const timer = setTimeout(() => setToasts((list) => list.slice(1)), 2600);
    return () => clearTimeout(timer);
  }, [toasts]);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className="rounded-xl px-4 py-3 shadow border"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--ink)',
          }}
        >
          <span className={
            t.kind === 'success' ? 'font-medium'
            : t.kind === 'error' ? 'font-medium'
            : ''
          }>
            {t.message}
          </span>
        </div>
      ))}
    </div>
  );
}
