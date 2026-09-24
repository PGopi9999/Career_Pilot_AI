'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="error-shell">
      <span className="eyebrow">Something needs attention</span>
      <h1>CareerPilot could not load this view.</h1>
      <p>Try again. No account or personal data is connected in Phase 31.1.</p>
      <button className="button button-primary" onClick={() => reset()}>Try again</button>
    </main>
  );
}
