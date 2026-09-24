export type ServiceStatus = 'ok' | 'degraded';

export type HealthResponse = {
  service: 'careerpilot-api';
  status: ServiceStatus;
  version: string;
  environment: string;
  timestamp: string;
};

export type ReadinessResponse = {
  service: 'careerpilot-api';
  status: 'ready' | 'not_ready';
  version: string;
  environment: string;
  checks: {
    configuration: 'ok' | 'error';
    external_dependencies: 'not_required' | 'ok' | 'error';
  };
  timestamp: string;
};

export type ConfigurationResponse = {
  service: 'careerpilot-api';
  status: 'ok' | 'invalid';
  version: string;
  environment: string;
  phase: '31.1';
  web_origins: number;
  supabase: 'not_configured' | 'configured' | 'incomplete';
  ai_gateway: 'not_configured' | 'configured';
  timestamp: string;
};

export type PhaseStatus = 'active' | 'locked' | 'planned';

export type RoadmapPhase = {
  id: string;
  name: string;
  status: PhaseStatus;
  summary: string;
};
