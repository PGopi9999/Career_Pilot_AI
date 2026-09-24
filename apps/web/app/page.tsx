'use client';

import { useState } from 'react';
import type { HealthResponse, RoadmapPhase } from '@careerpilot/shared-types';
import { StatusPill } from '@careerpilot/ui';

const phases: RoadmapPhase[] = [
  { id: '31.1', name: 'Foundation', status: 'active', summary: 'Repository, UI shell, API, tests and CI' },
  { id: '31.2', name: 'Secure accounts', status: 'locked', summary: 'Auth, MFA, sessions and account controls' },
  { id: '31.3', name: 'Career profile', status: 'planned', summary: 'Profile data, privacy and version history' },
  { id: '31.4', name: 'Resume intelligence', status: 'planned', summary: 'Private uploads and grounded analysis' },
  { id: '31.5', name: 'Job intelligence', status: 'planned', summary: 'Fresh, explainable job discovery' },
  { id: '31.6', name: 'AI matching', status: 'planned', summary: 'Transparent fit signals and feedback' },
];

export default function Home() {
  const [apiState, setApiState] = useState<'idle' | 'checking' | 'online' | 'offline'>('idle');
  const [apiDetails, setApiDetails] = useState<HealthResponse | null>(null);

  async function checkApi() {
    setApiState('checking');
    try {
      const response = await fetch('/api/backend/health', { cache: 'no-store' });
      if (!response.ok) throw new Error('API health check failed');
      const details = (await response.json()) as HealthResponse;
      setApiDetails(details);
      setApiState('online');
    } catch {
      setApiDetails(null);
      setApiState('offline');
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="CareerPilot home">
          <span className="brand-mark">✦</span>
          <span>CareerPilot <em>AI</em></span>
        </a>
        <div className="topbar-actions">
          <span className="build-label">Phase 31.1 foundation</span>
          <button className="icon-button" aria-label="Open help" title="Help is coming in a later phase">?</button>
        </div>
      </header>

      <section className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse-dot" /> Private career operating system</div>
          <h1>Build a career you can <span>navigate with confidence.</span></h1>
          <p className="hero-lede">CareerPilot will bring your profile, resumes, jobs, applications and learning plan into one calm workspace — with AI that explains itself and keeps you in control.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={checkApi} disabled={apiState === 'checking'}>
              {apiState === 'checking' ? 'Checking live API…' : 'Check live connection'}
              <span aria-hidden="true">→</span>
            </button>
            <a className="button button-secondary" href="#roadmap">View the build roadmap</a>
          </div>
          <div className="trust-row" aria-label="Product principles">
            <span>Human-reviewed AI</span><span>Private by design</span><span>India + global ready</span>
          </div>
        </div>

        <div className="hero-card" aria-label="Foundation health card">
          <div className="card-topline"><span>Foundation health</span><StatusPill tone={apiState === 'online' ? 'positive' : 'info'}>{apiState === 'online' ? 'API online' : 'Local preview'}</StatusPill></div>
          <div className="health-score"><strong>{apiState === 'online' ? 'Live' : '31.1'}</strong><span>{apiState === 'online' ? 'FastAPI is responding' : 'Foundation in progress'}</span></div>
          <div className="signal-list">
            <div><span className="signal-icon signal-good">✓</span><span>Web shell</span><b>Ready</b></div>
            <div><span className="signal-icon signal-good">✓</span><span>API contract</span><b>{apiState === 'online' ? 'Online' : 'Ready'}</b></div>
            <div><span className="signal-icon signal-blue">◌</span><span>Secure account layer</span><b>Next</b></div>
            <div><span className="signal-icon signal-muted">○</span><span>AI Gateway</span><b>Later</b></div>
          </div>
          {apiState === 'offline' && <p className="inline-alert">The API is not running. Start FastAPI on port 8000, then try again.</p>}
          {apiDetails && <p className="inline-success">{apiDetails.service} • {apiDetails.environment} • checked {new Date(apiDetails.timestamp).toLocaleTimeString()}</p>}
        </div>
      </section>

      <section className="metric-strip" aria-label="Build metrics">
        <div><span className="metric-value">21</span><span className="metric-label">locked phases</span></div>
        <div><span className="metric-value">5</span><span className="metric-label">test gates per phase</span></div>
        <div><span className="metric-value">2</span><span className="metric-label">markets from day one</span></div>
        <div><span className="metric-value">0</span><span className="metric-label">production secrets here</span></div>
      </section>

      <section className="workspace-grid">
        <div className="section-heading">
          <div><span className="eyebrow">A calm starting point</span><h2>Everything you need, one next step at a time.</h2></div>
          <span className="section-note">No unfinished feature is pretending to be live.</span>
        </div>
        <div className="feature-grid">
          <article className="feature-card feature-card-lavender"><div className="feature-icon">◎</div><h3>Know your starting point</h3><p>Profile and resume intelligence will turn scattered career data into a clear, editable foundation.</p><span className="feature-link">Planned for 31.3–31.4 <span>→</span></span></article>
          <article className="feature-card feature-card-mint"><div className="feature-icon">↗</div><h3>Make better moves</h3><p>Transparent job matching will show the reasons behind a recommendation — not just a mysterious score.</p><span className="feature-link">Planned for 31.5–31.6 <span>→</span></span></article>
          <article className="feature-card feature-card-peach"><div className="feature-icon">✦</div><h3>Keep the human in charge</h3><p>AI can draft, coach and explain. You review before anything is sent, saved or shared outside CareerPilot.</p><span className="feature-link">Locked product rule <span>→</span></span></article>
        </div>
      </section>

      <section className="roadmap-section" id="roadmap">
        <div className="section-heading"><div><span className="eyebrow">Build roadmap</span><h2>What is happening now</h2></div><span className="roadmap-legend"><i className="legend-dot legend-active" /> Active <i className="legend-dot legend-locked" /> Locked <i className="legend-dot legend-planned" /> Planned</span></div>
        <div className="roadmap-list">
          {phases.map((phase) => <div className={`roadmap-row roadmap-${phase.status}`} key={phase.id}><div className="phase-number">{phase.id}</div><div className="phase-name"><strong>{phase.name}</strong><span>{phase.summary}</span></div><span className="phase-status"><i />{phase.status}</span></div>)}
        </div>
      </section>

      <footer className="footer"><span>CareerPilot AI · Foundation build</span><span>Designed for domestic India and global services</span></footer>
    </main>
  );
}
