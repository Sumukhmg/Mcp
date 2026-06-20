export interface PmCopilotConfig {
  serverName: string;
  serverVersion: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  freeTierMonthlyRequestLimit: number;
}

function readLogLevel(): PmCopilotConfig['logLevel'] {
  const value = (process.env.PM_COPILOT_LOG_LEVEL ?? 'info').toLowerCase();
  return value === 'debug' || value === 'warn' || value === 'error' ? value : 'info';
}

export const config: PmCopilotConfig = {
  serverName: process.env.PM_COPILOT_SERVER_NAME ?? 'pm-copilot-mcp',
  serverVersion: process.env.PM_COPILOT_SERVER_VERSION ?? '0.1.0',
  logLevel: readLogLevel(),
  freeTierMonthlyRequestLimit: Number(process.env.PM_COPILOT_FREE_TIER_LIMIT ?? 50)
};
