import type { ReactNode } from 'react';

export function StatusPill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'positive' | 'info' }) {
  return <span className={`status-pill status-pill-${tone}`}>{children}</span>;
}
