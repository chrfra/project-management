# Monitoring Enhancements Project Framing

## Problem

Automations are currently hidden inside application packages. Users cannot monitor automations as first-class operational objects, which makes it hard to:

- discover what automations they have access to
- detect failures quickly
- inspect the payload sent to a target system
- inspect the response returned by the target system
- configure what should happen when an automation fails

This creates debugging friction, slows issue replication, weakens auditability, and blocks migration from FLINT for customers who depend on monitoring and failure visibility.

## Why This Matters

The source material is consistent:

- FLINT parity requires execution history, payload visibility, diagnostics, and failure notifications.
- VBG is blocked on monitoring and error notification.
- HIMA needs payload visibility and process monitoring.
- Flamingo checks the monitoring portal daily and needs automation visibility.
- The broader automation UX problem is fragmentation across too many contexts.

## Product Decision

The feature should answer this decision:

> How do we make automations visible, inspectable, and operationally manageable without requiring users to hunt through package structure?

## Core UX Move

Shift monitoring from a package-first model to an automation-first model.

The user journey should be:

`Overview -> Detect issue -> Inspect run -> Configure future failure behavior`

## Job To Be Done

When an automation fails or behaves unexpectedly, I want to find it quickly, inspect exactly what was sent and what came back, and configure how future failures should be handled, so I can debug, recover, and support the process with confidence.

## Primary Users

- internal automation builders
- support and operations users
- technical product stakeholders validating migration readiness

## Primary Scenario

Use this scenario across the design work:

- receive XML or JSON from an external source
- run an automation that sends data to a target system
- automation fails
- user opens the failed run
- user inspects payload and response
- user identifies the issue
- user configures a failure action so the next failure is visible and actionable

## In Scope For Immediate Design

- all-access automations overview
- automation health and recent-run visibility
- run inspector with payload and response visibility
- failure handling configuration
- the ability to run a component on failure

## Out of Scope For Immediate Handoff

- full telemetry dashboard
- queue-management UX
- kill/terminate-running-process UX
- full authoring redesign
- complete Automations 2.0 restructuring

These can be referenced as follow-on work, but should not block the first handoff slice.

## Success Criteria

The design is successful when a user can:

1. find any automation they can access without needing to know the package first
2. identify which automation needs attention
3. open a specific run and see what happened
4. inspect the sent payload
5. inspect the returned response
6. understand failure context well enough to debug or escalate
7. configure a future failure action without needing engineering support

## Design Principles

1. Monitoring starts from the automation, not from package structure.
2. Runs and settings must stay conceptually separate.
3. Payload and response must be shown as evidence, not hidden metadata.
4. Failure handling should feel like normal operational setup, not expert-only plumbing.
5. The first version should solve concrete monitoring tasks, not become a generic analytics dashboard.

## Versioning Strategy

### V1 handoff

- automations overview
- automation detail
- run inspector
- failure handling

### V1.5 roadmap follow-up

- tighter link from monitoring back into authoring/testing
- stronger filtering and saved views
- richer failure states and recoverability support

### V2 concept bridge

- broader automation-first navigation model
- stronger create-test-debug loop
- clearer convergence between monitoring, testing, and operational setup

## Open Questions To Resolve During Review

- Is the automations overview a top-level destination or embedded under an existing automation area?
- Is failure handling configured per automation only, or can it be inherited from reusable templates later?
- Are there retention, compliance, or redaction rules that affect payload/response visibility?
- Is "run component on failure" the default first-class failure action, or should notification templates appear at the same level in V1?
