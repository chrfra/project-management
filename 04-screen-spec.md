# Monitoring Enhancements Screen Specification

## Screen 1: Automations Overview

### Goal

Give users one place to see all automations they can access, regardless of package.

### Recommended Layout

- page title and summary
- search and filter row
- main list or table of automations
- optional right-side detail preview only if it does not slow scanning

### Required Columns or Fields

- automation name
- status
- package
- trigger type
- last run time
- recent failure indicator
- primary action such as `Inspect`

### Required States

- healthy set
- one or more failures
- no results after filtering
- no automations visible

### Key Interaction

Clicking the main row action opens `Automation Detail`, not package settings.

## Screen 2: Automation Detail

### Goal

Summarize whether the automation is healthy and point the user to the most relevant recent runs and failure configuration.

### Recommended Sections

- health summary
- recent runs
- failure handling summary
- metadata

### Required Content

- automation name
- package metadata
- current status
- latest run
- recent failure count or signal
- shortcut to latest failed run
- whether failure handling is configured

### Required States

- healthy example
- failing example
- no recent runs
- failure handling not configured

## Screen 3: Run Inspector

### Goal

Provide enough evidence for debugging, escalation, and auditability.

### Recommended Layout

- run summary header
- payload and response content area
- failure detail section
- metadata side panel or secondary region

### Required Header Fields

- run ID
- status
- started time
- completed or failed time
- automation name

### Required Evidence Areas

- payload sent to integration or automation
- response returned by target system
- error or failure detail

### Required Supporting Metadata

- trigger
- package
- environment if applicable
- retention or redaction explanation if relevant

### Required States

- success run
- failed run
- payload only
- response only
- redacted data
- unavailable history

### Design Guidance

- Prioritize evidence readability over dense settings chrome.
- Use tabs only if they help scanning; avoid hiding critical failure detail too deeply.
- Support copy and export patterns in the concept if those matter for support workflows.

## Screen 4: Failure Handling

### Goal

Make future failure behavior easy to understand and configure.

### Recommended Structure

- explanation of what happens when a run fails
- current configuration summary
- configuration form
- save confirmation

### Required Controls

- enable failure handling
- choose action type
- `Run component on failure`
- select component
- saved summary of configured behavior

### Required States

- not configured
- configured
- validation or missing-field issue
- confirmation after save

### Design Guidance

- Explain cause and effect directly: "When this automation fails, this component runs."
- Avoid language that sounds like hidden system plumbing.

## Cross-Screen Design Requirements

### Terminology

Use the same labels across all screens for:

- automation
- run
- failure handling
- payload
- response

### Copy Style

Apply the repo’s UX writing guidance:

- direct and simple
- action-oriented
- specific
- friendly without being casual to the point of vagueness
- US English

### Visual Direction

Use the existing product shell and design system patterns.

Do not introduce a new visual language for this feature. The UX move here is structural and operational, not stylistic.

## Suggested Figma Pages

1. `00 Problem framing`
2. `01 Overview`
3. `02 Automation detail`
4. `03 Run inspector`
5. `04 Failure handling`
6. `05 End-to-end flow`
7. `06 Future concept`
8. `✅ Handoff`
