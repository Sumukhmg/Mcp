import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { config } from './config.js';
import { registerGeneratePrdTool } from './tools/generate-prd.js';
import { registerGenerateUserStoriesTool } from './tools/generate-user-stories.js';
import { registerPrioritizeFeaturesTool } from './tools/prioritize-features.js';
import { registerCompetitorAnalysisTool } from './tools/competitor-analysis.js';
import { registerGenerateRoadmapTool } from './tools/generate-roadmap.js';
import { registerGenerateKpisTool } from './tools/generate-kpis.js';
import { registerAnalyzeMeetingNotesTool } from './tools/analyze-meeting-notes.js';
import { registerGenerateStrategyTool } from './tools/generate-strategy.js';
import { registerResources } from './resources/register.js';
import { registerPrdPrompt } from './prompts/prd.prompt.js';
import { registerRoadmapPrompt } from './prompts/roadmap.prompt.js';
import { registerStrategyPrompt } from './prompts/strategy.prompt.js';
import { registerCompetitorPrompt } from './prompts/competitor.prompt.js';
import { registerUserStoriesPrompt } from './prompts/user-stories.prompt.js';

export function createServer(): McpServer {
  const mcpServer = new McpServer({
    name: config.serverName,
    version: config.serverVersion
  });

  registerGeneratePrdTool(mcpServer);
  registerGenerateUserStoriesTool(mcpServer);
  registerPrioritizeFeaturesTool(mcpServer);
  registerCompetitorAnalysisTool(mcpServer);
  registerGenerateRoadmapTool(mcpServer);
  registerGenerateKpisTool(mcpServer);
  registerAnalyzeMeetingNotesTool(mcpServer);
  registerGenerateStrategyTool(mcpServer);

  registerResources(mcpServer);

  registerPrdPrompt(mcpServer);
  registerRoadmapPrompt(mcpServer);
  registerStrategyPrompt(mcpServer);
  registerCompetitorPrompt(mcpServer);
  registerUserStoriesPrompt(mcpServer);

  return mcpServer;
}
