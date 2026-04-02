# Monitoring Enhancements UX Package

This folder is the working package for the next automation feature:

- unified overview of all automations a user can access
- failure notification and failure-action setup
- payload visibility
- response visibility
- monitoring UX that supports debugging, replication, and auditability

It is based on the project material in `Automations/*` and the Novacura UX process material in `UX process documents/UX`.

## Next Step

Start in Figma with four low-fidelity frames in this exact order:

1. `Automations Overview`
2. `Automation Detail`
3. `Run Inspector`
4. `Failure Handling`

Use the primary scenario from [03-user-flows.md](./03-user-flows.md):

- an automation fails
- the user notices it from the overview
- the user opens the failed run
- the user inspects payload and response
- the user configures future failure behavior

Do not start with visual polish. First prove the navigation model and the debugging flow.

## Working Order

1. Read [01-project-framing.md](./01-project-framing.md) to align on scope and success criteria.
2. Use [02-ia-and-object-model.md](./02-ia-and-object-model.md) to define the structure and routes.
3. Use [03-user-flows.md](./03-user-flows.md) to design the core task flow and edge cases.
4. Use [04-screen-spec.md](./04-screen-spec.md) to build the low/mid-fi screens.
5. Use [05-validation-and-handoff.md](./05-validation-and-handoff.md) to review, test, and package the work for engineering.

## Scope Split

This package treats the work as three connected layers:

- `V1 feature`: monitoring overview, run inspection, failure handling
- `IA upgrade`: automation-first monitoring model instead of package-hunting
- `Future concept`: bridge toward a broader Automations 2.0 experience

The design work should cover all three, but only the `V1 feature` should be prepared as the immediate handoff slice.

## Source Highlights

- Requirements and parity goals: `Automations/automations actions/resources/resources/FLINT_and_Flow_Connect_Automations_Requirements_2026.md`
- Customer blockers and priorities: `Automations/Automations claude/PM/gap-analysis-summary.md`
- Monitoring concept seed: `Automations/og/PM/monitoring-enhancements-concept-direction.md`
- Generated strategy and presentation material: `Automations/Automations octopus/*` and `Automations/automations actions/*`
- UX process guidance: `UX process documents/UX/03. Onboarding/Sample design Process.docx`
- UX planning guidance: `UX process documents/UX/03. Onboarding/How-tos/How to plan UX work.docx`
- Research-to-action process: `UX process documents/UX/02. User Research/02. Quick Start/Research to Action Process.docx`

## Output Expectation

By the time this package is complete, you should have:

- one low-fi and one mid-fi flow for the monitoring journey
- a tested run inspector concept
- a clear failure-handling model
- a scoped engineering handoff for the near-term feature
- roadmap notes for the larger IA and Automations 2.0 follow-up

## Visual Site

An interactive visual version of this package is available at:

- `Automations/260302/site/index.html`

The site now supports both:

- dark mode
- day mode

using the same theme-token split and local storage key style as the source `neon-nexus` repo.

The reusable UI primitives in the site are now copied from the source repo instead of being hand-rolled:

- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/cyber/CyberCard.tsx`
- `src/hooks/use-theme.tsx`
- `src/lib/utils.ts`
- `src/index.css` theme and utility foundation

The site is now a small Vite/React app under `Automations/260302/site`.

If you want to serve it locally instead of opening the file directly:

```bash
cd /Users/christianfransson/workspace/work/Automations/260302/site
npm install
npm run dev
```
