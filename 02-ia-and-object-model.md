# Monitoring Enhancements IA and Object Model

## IA Goal

Create one monitoring flow that lets users move from awareness to evidence to action without switching mental models.

## Recommended Navigation Model

Use an automation-first monitoring hierarchy:

1. `Automations Overview`
2. `Automation Detail`
3. `Run Inspector`
4. `Failure Handling`

Package remains supporting metadata throughout the flow. It should never be the primary route for monitoring work.

## Core Objects

### Automation

The monitored object the user owns or has access to.

Must expose:

- name
- status
- trigger type
- package
- last run
- failure count or recent-failure signal
- shortcut to inspect

### Run

A single execution of an automation.

Must expose:

- run status
- timestamps
- trigger context
- payload sent
- response returned
- error or failure detail
- run ID

### Failure Action

What the system should do when a run fails.

V1 must support:

- enabled or disabled state
- one or more configured actions
- `Run component on failure` as a first-class action

### Package

The implementation container.

Package should appear as metadata for orientation, filtering, and permissions, but not define the monitoring journey.

## Route Structure

Recommended route model for the UX:

- `Automations`
- `Automations / [Automation name]`
- `Automations / [Automation name] / Runs / [Run ID]`
- `Automations / [Automation name] / Failure handling`

If route names differ in product, preserve this structural model in the prototype even if final labels change.

## Screen Inventory

### 1. Automations Overview

Purpose:

- answer what exists
- answer what needs attention
- answer where to inspect next

Must include:

- list or table of accessible automations
- search
- filters
- visible package metadata
- health indicator
- last run
- recent failure signal
- primary action to inspect

### 2. Automation Detail

Purpose:

- answer whether the automation is healthy
- summarize recent activity
- show whether failure handling is configured

Must include:

- health summary
- recent runs
- shortcut to latest failed run
- failure handling summary
- metadata section

### 3. Run Inspector

Purpose:

- show what happened in a specific execution
- provide debugging evidence

Must include:

- run header with status and timestamps
- payload tab or panel
- response tab or panel
- failure detail area
- metadata panel

### 4. Failure Handling

Purpose:

- let the user understand and configure what should happen on failure

Must include:

- current failure handling summary
- enable or disable state
- action type selection
- `Run component on failure`
- success state after save

## IA Rules

1. Do not bury monitoring entry points under package editing or package administration.
2. Do not mix run evidence with configuration fields on the same surface.
3. Do not present package as the top-level object in the overview.
4. Do not treat failure handling as hidden advanced settings.
5. Do not let the first version turn into a telemetry dashboard project.

## Filtering Model For Overview

Use these filters first:

- package
- status
- trigger type
- environment if applicable
- recent failures
- ownership or access scope if needed

## State Model

Design explicit states for:

- no automations visible
- healthy automation set
- failing automations present
- no recent runs
- run data unavailable
- payload or response redacted
- failure handling not configured
- failure handling configured

## IA Risks

### Risk 1

The overview becomes a package list with automation rows nested inside it.

Why this is bad:

- it recreates the current "hidden inside packages" problem

### Risk 2

The run inspector is too shallow.

Why this is bad:

- users still need engineering help to understand failures

### Risk 3

Failure handling is framed as abstract exception plumbing.

Why this is bad:

- users will not trust or adopt it

### Risk 4

The detail page becomes a settings page with a monitoring section tacked on.

Why this is bad:

- it weakens the core detect-inspect-act journey
