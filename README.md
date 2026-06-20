# PM-Copilot MCP

An AI-powered Product Management Operating System exposed as a [Model Context Protocol](https://modelcontextprotocol.io)
server. It gives Product Managers, founders, and product leaders a set of tools, prompts, and
reference resources for the workflows they do every day — PRDs, user stories, prioritization,
competitor analysis, roadmaps, KPIs, meeting notes, and product strategy — directly from Claude
Desktop, Claude Code, Cursor, Windsurf, or any other MCP-compatible client.

## How generation works

PM-Copilot does not call out to an LLM API itself. Tools that produce narrative documents (PRDs,
user stories, competitor analysis, roadmaps, KPIs, meeting summaries, strategy docs) use the MCP
**sampling** capability to ask the connected client's own model to do the writing, using a
PM-best-practices system prompt and a structured request. `prioritize_features` is fully
deterministic: it computes RICE and ICE scores and MoSCoW buckets in code.

## Tools

| Tool | Purpose |
|------|---------|
| `generate_prd` | Enterprise-grade Product Requirement Document |
| `generate_user_stories` | INVEST-compliant user stories with acceptance criteria and edge cases |
| `prioritize_features` | RICE / ICE / MoSCoW scoring and final prioritization |
| `competitor_analysis` | Feature comparison matrix, SWOT, and strategic recommendations |
| `generate_roadmap` | Quarterly roadmap with milestones, dependencies, risks |
| `generate_kpis` | North Star metric with leading/lagging indicators |
| `analyze_meeting_notes` | Summary, decisions, risks, action items, follow-ups |
| `generate_strategy` | Vision, mission, goals, market analysis, positioning, growth plan |

## Resources

- `pm-copilot://templates/{prd,roadmap,user-story,strategy}` — reusable document templates
- `pm-copilot://frameworks` — reference definitions for RICE, ICE, MoSCoW, Kano, JTBD,
  Opportunity Solution Tree, SWOT, Porter's Five Forces, and PESTLE

## Prompts

`create_prd`, `generate_user_stories_prompt`, `analyze_competitor`, `build_product_strategy`,
`create_quarterly_roadmap` — each wraps the corresponding tool with the right arguments.

## Project structure

```
src/
  tools/       one module per MCP tool
  resources/   templates + framework library, registered as MCP resources
  prompts/     guided prompt wrappers around the tools
  schemas/     Zod input schemas and shared validation helpers
  utils/       structured logger and the sampling helper
  server.ts    builds and wires the McpServer
  cli.ts       stdio entrypoint (`pm-copilot-mcp` binary)
tests/         Jest unit tests
```

## Development

```bash
npm install
npm run build   # compile TypeScript to dist/
npm test        # run the Jest test suite
npm run start   # run the compiled server over stdio
```

## Docker

```bash
docker build -t pm-copilot-mcp .
docker run -i pm-copilot-mcp
```

The server communicates over stdio (the standard MCP transport for desktop clients), so run the
container interactively (`-i`) rather than publishing a port.

## Claude Desktop configuration

```json
{
  "mcpServers": {
    "pm-copilot": {
      "command": "node",
      "args": ["/path/to/pm-copilot-mcp/dist/cli.js"]
    }
  }
}
```

## Quality

- All tool inputs are validated with Zod; invalid input raises a descriptive error before any
  generation happens.
- Structured JSON logs are written to stderr so they never collide with MCP JSON-RPC traffic on
  stdout.
- Tool results return both human-readable text and `structuredContent` for programmatic clients.

## Roadmap

Planned premium features include PM intelligence (usage/retention analytics), Jira/Notion/Linear
integrations, and an AI product coach for interview and case-study practice — see the original
product brief for the full commercialization plan.
