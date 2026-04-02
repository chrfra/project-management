# Monitoring Enhancements User Flows

## Primary End-to-End Flow

This is the anchor flow for the first design pass and for stakeholder review:

1. User opens `Automations Overview`.
2. User sees that one automation has a recent failure indicator.
3. User opens the automation.
4. User reviews recent runs and opens the latest failed run.
5. User inspects payload sent to the target system.
6. User inspects response returned by the target system.
7. User reads failure details and confirms likely root cause.
8. User navigates to `Failure Handling`.
9. User enables failure handling and configures `Run component on failure`.
10. User saves and sees a clear confirmation of what will happen on the next failure.

## Figma Task Flow To Design First

Design these frames first, in sequence:

### Frame 1

`Automations Overview - failing state`

The user must be able to answer:

- what failed?
- is it mine?
- where do I click next?

### Frame 2

`Automation Detail - failed summary`

The user must be able to answer:

- is this automation currently healthy?
- what has happened recently?
- is failure handling configured?

### Frame 3

`Run Inspector - failed run`

The user must be able to answer:

- what exactly was sent?
- what exactly came back?
- where did it fail?

### Frame 4

`Failure Handling - configured state`

The user must be able to answer:

- what will happen next time this fails?
- how do I change it?

## Secondary Flows

### Flow A: Daily Monitoring

1. User opens overview as part of daily checks.
2. User filters to failing automations.
3. User opens the affected automation.
4. User inspects the most relevant failed run.
5. User closes the issue or escalates it.

### Flow B: Support Escalation

1. Support receives report that automation output was wrong.
2. Support finds the automation from overview search.
3. Support opens the relevant run.
4. Support copies payload and response evidence.
5. Support escalates with run ID and evidence attached.

### Flow C: Hardening After Incident

1. User investigates a failure.
2. User realizes there is no failure action configured.
3. User opens failure handling.
4. User sets `Run component on failure`.
5. User confirms future incidents will trigger a predictable action.

## Empty and Edge Flows

### Empty state: no accessible automations

The screen should explain:

- there are no automations visible to this user
- why that might be true
- what to do next

### Empty state: no recent runs

The screen should explain:

- the automation exists
- there is no recent execution history
- failure handling can still be configured

### Partial-evidence state

The run inspector should handle:

- payload available but no response
- response available but payload truncated
- data intentionally redacted

### Permissions state

If a user can see the automation but not sensitive run content, the UI must:

- state that some content is hidden
- preserve useful metadata
- avoid showing a blank panel with no explanation

## Design Checks For Review Sessions

When reviewing the low-fi flow with stakeholders, ask:

1. Can a user monitor automations without knowing the package first?
2. Is the next action obvious from the overview?
3. Does the run inspector provide enough evidence for support and debugging?
4. Does failure handling feel like a normal part of owning an automation?
5. Are we drifting into a dashboard project instead of solving monitoring tasks?

## Follow-on Concept Flow

After the V1 flow is stable, create one additional concept flow only:

1. user inspects a failed run
2. user jumps back into an authoring or testing context with that run as reference data

This is important to the broader Automations 2.0 direction, but it should stay clearly marked as future-facing.
