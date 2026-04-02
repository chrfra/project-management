# Monitoring Enhancements Project Context

## Project

This folder contains the UX working package for the next Flow Connect Automations feature:

- unified overview of all automations a user can access
- failure notification and failure-action setup
- payload visibility
- response visibility
- monitoring UX that supports debugging, replication, auditability, and migration from FLINT

## Core Product Direction

The feature should be designed as one connected operational journey:

`Overview -> Detect issue -> Inspect run -> Configure future failure behavior`

The central UX move is to shift monitoring from a package-first model to an automation-first model.

## Current Deliverables In This Folder

- `README.md` — working package overview and next action
- `01-project-framing.md` — scope, decision, JTBD, success criteria
- `02-ia-and-object-model.md` — navigation and object model
- `03-user-flows.md` — primary and secondary flows
- `04-screen-spec.md` — first screen set and required states
- `05-validation-and-handoff.md` — review, testing, and handoff plan
- `site/` — interactive visual project site
- `99-worklog.md` — running change log

## Visual Site

The interactive project site lives in:

- `Automations/260302/site`

It is now a small Vite/React app that uses copied UI primitives from the source repo rather than hand-rolled versions.

Copied source-based primitives in use:

- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/cyber/CyberCard.tsx`
- `src/hooks/use-theme.tsx`
- `src/lib/utils.ts`
- `src/index.css` theme and utility foundation

## Source Material This Project Is Based On

- `Automations/automations actions/resources/resources/FLINT_and_Flow_Connect_Automations_Requirements_2026.md`
- `Automations/Automations claude/PM/gap-analysis-summary.md`
- `Automations/og/PM/monitoring-enhancements-concept-direction.md`
- `Automations/Automations octopus/*`
- `Automations/automations actions/*`
- `UX process documents/UX/03. Onboarding/Sample design Process.docx`
- `UX process documents/UX/03. Onboarding/How-tos/How to plan UX work.docx`
- `UX process documents/UX/02. User Research/02. Quick Start/Research to Action Process.docx`

## Decisions Locked So Far

- Monitoring is a migration blocker, not a nice-to-have.
- The first handoff slice is:
  - Automations Overview
  - Automation Detail
  - Run Inspector
  - Failure Handling
- Package is supporting metadata in monitoring UX, not the primary navigation path.
- `Run component on failure` is a first-class failure action in the concept.
- The visual site should follow the `neon-nexus` visual system and copied component code.

## Working Memory

### User preference

- Do not ask the user to deploy.
- When a change requires deployment and the deployment path is known and available in the project, perform the deployment directly instead of asking the user to do it.
- When asked to update the content of the plan or dashboard, always create a new timestamped dashboard version instead of overwriting the existing version.
- The dashboard should default to the latest version, while allowing the user to switch back to earlier timestamped versions.
- Every updated version should mark the exact changed content granularly, support hide/show markers, and support a side-by-side diff view against the previous content for a selected version range.
- When this project site is updated and a local URL is needed, start the local preview server directly instead of only providing the URL.

### Current practical note

- For this folder, local build and browser verification are available and have been used.
- No production deployment target is currently documented inside this project package.
- Until a concrete deployment target exists in the repo or project instructions, treat local build verification as the default completion step.

## Verification State

- The site has been built successfully with `npm run build` in `Automations/260302/site`.
- The built app has been verified in-browser.
- Latest visual verification artifact:
  - `output/playwright/monitoring-site-react.png`

## Immediate Next Action

Use the package and the site to create the first low-fi Figma pass for:

1. `Automations Overview`
2. `Automation Detail`
3. `Run Inspector`
4. `Failure Handling`
