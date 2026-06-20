export const PRD_TEMPLATE = `# Product Requirement Document

## Executive Summary
## Problem Statement
## Goals
## Non-Goals
## User Personas
## Functional Requirements
## Non-Functional Requirements
## Success Metrics
## Risks
## Open Questions`;

export const ROADMAP_TEMPLATE = `# Quarterly Roadmap

| Quarter | Initiative | Milestone | KPI |
|---------|-----------|-----------|-----|
`;

export const USER_STORY_TEMPLATE = `As a [user]
I want [goal]
So that [benefit]

Acceptance Criteria:
- Given [context], when [action], then [outcome]`;

export const STRATEGY_TEMPLATE = `# Product Strategy

## Vision
## Market
## Positioning
## Growth Plan`;

export const TEMPLATES = {
  prd: PRD_TEMPLATE,
  roadmap: ROADMAP_TEMPLATE,
  'user-story': USER_STORY_TEMPLATE,
  strategy: STRATEGY_TEMPLATE
} as const;

export type TemplateName = keyof typeof TEMPLATES;
