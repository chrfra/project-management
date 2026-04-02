import { useEffect, useMemo, useState, type ElementType } from "react";
import { ChevronDown, Info } from "lucide-react";

import { ThemeProvider } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CyberCard } from "@/components/cyber/CyberCard";
import { cn } from "@/lib/utils";

type Lane = "all" | "v1" | "ia" | "future";
type DiffMode = "hidden" | "markers" | "side-by-side";
type VersionId = "v1" | "v2";
type VersionHistory<T> = readonly { version: VersionId; value: T }[];

type VersionMeta = {
  id: VersionId;
  label: string;
  timestamp: string;
  summary: string;
};

type VersionedItem = {
  id: string;
  label: VersionHistory<string>;
};

type HeroFact = {
  id: string;
  kicker: VersionHistory<string>;
  title: VersionHistory<string>;
  summary: VersionHistory<string>;
};

type TimelineItem = {
  id: string;
  step: string;
  lane: Lane;
  kicker: VersionHistory<string>;
  title: VersionHistory<string>;
  summary: VersionHistory<string>;
  chips: VersionedItem[];
  bullets: VersionedItem[];
};

type SurfaceItem = {
  id: string;
  kicker: VersionHistory<string>;
  title: VersionHistory<string>;
  summary: VersionHistory<string>;
  questions: VersionedItem[];
  pill: VersionHistory<string>;
};

type SourceItem = {
  id: string;
  badge: VersionHistory<string>;
  title: VersionHistory<string>;
  description: VersionHistory<string>;
  path: VersionHistory<string>;
};

type DeliveryCard = {
  id: string;
  title: VersionHistory<string>;
  points: VersionedItem[];
  ordered?: boolean;
};

const whiteCardClass =
  "rounded-sm border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-200 dark:bg-white dark:text-slate-900";
const mutedTextClass = "text-slate-600 dark:text-slate-600";
const sectionMutedTextClass = "text-muted-foreground";
const cardLabelTextClass = "font-display text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500";
const sectionLabelTextClass = "font-display text-xs uppercase tracking-[0.18em] text-muted-foreground";
const nestedCardClass =
  "rounded-sm border border-border/60 bg-secondary/20 p-3 text-foreground dark:border-border/60 dark:bg-secondary/20 dark:text-foreground";
const updateTintClass = "border-amber-300/90 bg-amber-50/80";

const dashboardVersions: readonly VersionMeta[] = [
  {
    id: "v1",
    label: "v1",
    timestamp: "2026-04-01 18:10 CEST",
    summary: "Initial monitoring enhancements dashboard for the first Figma pass.",
  },
  {
    id: "v2",
    label: "v2",
    timestamp: "2026-04-02 11:30 CEST",
    summary: "Added dashboard version handling, timestamped history, granular update markers, and range diff views.",
  },
] as const;

const versionIndexMap = new Map(dashboardVersions.map((version, index) => [version.id, index]));
const latestVersionId = dashboardVersions[dashboardVersions.length - 1]?.id ?? "v2";

const v1 = <T,>(value: T): VersionHistory<T> => [{ version: "v1", value }];
const revisedInV2 = <T,>(before: T, after: T): VersionHistory<T> => [
  { version: "v1", value: before },
  { version: "v2", value: after },
];
const addedInV2 = <T,>(value: T): VersionHistory<T> => [{ version: "v2", value }];

const heroTitle = v1("Make automations visible, inspectable, and actionable");
const heroSummary = revisedInV2(
  "This site turns the `260302` package into a visual drill-down. It starts with the immediate feature slice, shows the IA implications, and keeps a bridge to the larger Automations 2.0 concept.",
  "This site now tracks timestamped plan and dashboard versions. It still starts with the immediate feature slice, but now every future content update can be reviewed as a granular change set or a side-by-side diff against earlier dashboard versions.",
);
const nextStepBody = revisedInV2(
  "Build four low-fi Figma frames first:\nOverview -> Detail -> Run Inspector -> Failure Handling",
  "Build four low-fi Figma frames first, and treat every future plan/dashboard content update as a new timestamped release:\nOverview -> Detail -> Run Inspector -> Failure Handling",
);

const heroFacts: readonly HeroFact[] = [
  {
    id: "blocker",
    kicker: v1("Primary blocker"),
    title: v1("Monitoring visibility"),
    summary: v1("VBG, HIMA, Flamingo all need execution visibility."),
  },
  {
    id: "ux-move",
    kicker: v1("Core UX move"),
    title: v1("Automation-first model"),
    summary: v1("Package becomes metadata, not the monitoring path."),
  },
  {
    id: "outcome",
    kicker: v1("Outcome"),
    title: v1("Detect -> Inspect -> Act"),
    summary: v1("Supports debugging, replication, auditability, and migration."),
  },
] as const;

const focusCards = [
  {
    id: "v1-scope",
    badge: v1("V1 feature"),
    title: v1("What should be designed for handoff now"),
    points: [
      { id: "v1-1", label: v1("All-access automations overview") },
      { id: "v1-2", label: v1("Automation health and recent runs") },
      { id: "v1-3", label: v1("Run inspector with payload and response") },
      { id: "v1-4", label: v1("Failure handling with “Run component on failure”") },
    ],
  },
  {
    id: "ia-scope",
    badge: v1("IA upgrade"),
    title: v1("What this feature should quietly establish"),
    points: [
      { id: "ia-1", label: v1("Monitoring starts from automations, not packages") },
      { id: "ia-2", label: v1("Run evidence and configuration stay separate") },
      { id: "ia-3", label: v1("Operational setup becomes easier to discover") },
    ],
  },
  {
    id: "future-scope",
    badge: v1("Future concept"),
    title: v1("What should stay visible but not block V1"),
    points: [
      { id: "future-1", label: v1("Jump from failed run back into editing or testing") },
      { id: "future-2", label: v1("Broader Automations 2.0 navigation model") },
      { id: "future-3", label: v1("Richer telemetry and advanced operations") },
    ],
  },
] as const;

const timelineItems: readonly TimelineItem[] = [
  {
    id: "frame-project",
    step: "01",
    lane: "v1",
    kicker: v1("Start here"),
    title: v1("Lock the problem and decision"),
    summary: v1(
      "Frame the feature as an automation-first monitoring slice, not as a generic dashboard. The question is how to make automations visible and debuggable without package-hunting.",
    ),
    chips: [
      { id: "chip-1", label: v1("V1") },
      { id: "chip-2", label: v1("Problem framing") },
      { id: "chip-3", label: v1("Customer blocker") },
    ],
    bullets: [
      {
        id: "frame-project-1",
        label: v1("Use one clear product decision: make automations visible, inspectable, and operationally manageable."),
      },
      {
        id: "frame-project-2",
        label: v1("Anchor it in the migration pain: payload visibility, response visibility, and failure handling are not optional."),
      },
      {
        id: "frame-project-3",
        label: v1("Keep telemetry, queueing, and full authoring redesign out of the first handoff."),
      },
    ],
  },
  {
    id: "frame-ia",
    step: "02",
    lane: "ia",
    kicker: v1("Structure"),
    title: v1("Shift from package-first to automation-first IA"),
    summary: v1(
      "Monitoring should flow through Automations Overview, Automation Detail, Run Inspector, and Failure Handling. Package remains metadata throughout.",
    ),
    chips: [
      { id: "chip-4", label: v1("IA") },
      { id: "chip-5", label: v1("Navigation") },
      { id: "chip-6", label: v1("Object model") },
    ],
    bullets: [
      { id: "frame-ia-1", label: v1("Separate Automation, Run, Failure Action, and Package in the UI model.") },
      { id: "frame-ia-2", label: v1("Do not make users browse package structure to find operational evidence.") },
      { id: "frame-ia-3", label: v1("Keep run evidence and settings on separate surfaces so the workflow stays clear.") },
    ],
  },
  {
    id: "frame-overview",
    step: "03",
    lane: "v1",
    kicker: v1("Frame 1"),
    title: v1("Design the Automations Overview"),
    summary: v1(
      "Give users one list of all automations they can access, with health signals, package metadata, and a direct inspect action.",
    ),
    chips: [
      { id: "chip-7", label: v1("V1") },
      { id: "chip-8", label: v1("Overview") },
      { id: "chip-9", label: v1("Discovery") },
    ],
    bullets: [
      { id: "frame-overview-1", label: v1("Show automation name, status, package, trigger type, last run, and recent failure signal.") },
      { id: "frame-overview-2", label: v1("Answer: what failed, is it mine, and where do I click next?") },
      { id: "frame-overview-3", label: v1("Prefer a scan-friendly list or table over an analytics-heavy dashboard.") },
    ],
  },
  {
    id: "frame-inspector",
    step: "04",
    lane: "v1",
    kicker: v1("Frames 2 and 3"),
    title: v1("Design detail and run inspection together"),
    summary: v1(
      "The detail screen points users to the right run. The run inspector is where evidence lives: payload out, response in, timestamps, and failure context.",
    ),
    chips: [
      { id: "chip-10", label: v1("V1") },
      { id: "chip-11", label: v1("Debugging") },
      { id: "chip-12", label: v1("Auditability") },
    ],
    bullets: [
      { id: "frame-inspector-1", label: v1("Use Automation Detail for health summary, recent runs, and failure-handling summary.") },
      { id: "frame-inspector-2", label: v1("Use Run Inspector for exact payload, exact response, failure details, trigger context, and run metadata.") },
      { id: "frame-inspector-3", label: v1("The inspector must be strong enough for debugging and support escalation without engineering help.") },
    ],
  },
  {
    id: "frame-failure",
    step: "05",
    lane: "v1",
    kicker: v1("Frame 4"),
    title: v1("Make failure handling operational, not hidden"),
    summary: v1(
      "Treat failure handling as normal ownership behavior. The first-class action is 'Run component on failure,' with a clear explanation of cause and effect.",
    ),
    chips: [
      { id: "chip-13", label: v1("V1") },
      { id: "chip-14", label: v1("Failure handling") },
      { id: "chip-15", label: v1("Operational setup") },
    ],
    bullets: [
      { id: "frame-failure-1", label: v1("Show configured versus not-configured states clearly.") },
      { id: "frame-failure-2", label: v1("Frame it as: when this automation fails, this component runs.") },
      { id: "frame-failure-3", label: v1("Avoid presenting it as abstract exception plumbing or buried advanced settings.") },
    ],
  },
  {
    id: "frame-validation",
    step: "06",
    lane: "future",
    kicker: v1("Validate and package"),
    title: v1("Test the flow and prepare a scoped handoff"),
    summary: v1(
      "Run quick usability checks with internal builders, then hand off only the V1 slice and move the rest into roadmap follow-up.",
    ),
    chips: [
      { id: "chip-16", label: v1("Validation") },
      { id: "chip-17", label: v1("Handoff") },
      { id: "chip-18", label: v1("Future bridge") },
    ],
    bullets: [
      { id: "frame-validation-1", label: v1("Test find, inspect, understand, and configure tasks in that order.") },
      { id: "frame-validation-2", label: v1("Hand off Overview, Detail, Run Inspector, and Failure Handling as the immediate slice.") },
      { id: "frame-validation-3", label: v1("Keep the monitoring-to-authoring loop and larger Automations 2.0 model visible as future concept work.") },
    ],
  },
] as const;

const surfaceItems: readonly SurfaceItem[] = [
  {
    id: "overview",
    kicker: v1("Frame 1"),
    title: v1("Automations Overview"),
    summary: v1(
      "This is the new monitoring entry point. It should answer what automations exist for me, which ones need attention, and where to inspect next.",
    ),
    questions: [
      { id: "overview-q1", label: v1("What failed?") },
      { id: "overview-q2", label: v1("Is it mine?") },
      { id: "overview-q3", label: v1("Where do I click next?") },
    ],
    pill: v1("Failing automation visible"),
  },
  {
    id: "detail",
    kicker: v1("Frame 2"),
    title: v1("Automation Detail"),
    summary: v1(
      "A focused operational summary, not a package-heavy settings page. It shows health, recent runs, and whether failure handling is configured.",
    ),
    questions: [
      { id: "detail-q1", label: v1("Is this automation healthy?") },
      { id: "detail-q2", label: v1("What happened recently?") },
      { id: "detail-q3", label: v1("Is failure handling configured?") },
    ],
    pill: v1("Health summary"),
  },
  {
    id: "inspector",
    kicker: v1("Frame 3"),
    title: v1("Run Inspector"),
    summary: v1(
      "This is the evidence surface. It must show what was sent, what came back, where it failed, and enough metadata for support and auditability.",
    ),
    questions: [
      { id: "inspector-q1", label: v1("What exactly was sent?") },
      { id: "inspector-q2", label: v1("What exactly came back?") },
      { id: "inspector-q3", label: v1("Where did it fail?") },
    ],
    pill: v1("Payload + response"),
  },
  {
    id: "failure",
    kicker: v1("Frame 4"),
    title: v1("Failure Handling"),
    summary: v1(
      "Failure behavior belongs to the automation lifecycle. V1 needs an understandable path to 'Run component on failure' and a strong configured state.",
    ),
    questions: [
      { id: "failure-q1", label: v1("What happens next time this fails?") },
      { id: "failure-q2", label: v1("How do I change it?") },
      { id: "failure-q3", label: v1("Is it currently configured?") },
    ],
    pill: v1("Run component on failure"),
  },
] as const;

const sourceItems: readonly SourceItem[] = [
  {
    id: "source-requirements",
    badge: v1("Requirements"),
    title: v1("FLINT parity and monitoring requirements"),
    description: v1("Payload inspection, response visibility, diagnostics, historical overview, and failure notification."),
    path: v1("Automations/automations actions/resources/resources/FLINT_and_Flow_Connect_Automations_Requirements_2026.md"),
  },
  {
    id: "source-gap-analysis",
    badge: v1("Customer blockers"),
    title: v1("Gap analysis summary"),
    description: v1("VBG is blocked on monitoring and error notification. HIMA and Flamingo still need monitoring visibility."),
    path: v1("Automations/Automations claude/PM/gap-analysis-summary.md"),
  },
  {
    id: "source-concept",
    badge: v1("Concept seed"),
    title: v1("Monitoring concept direction"),
    description: v1("The core journey is overview -> detect issue -> inspect run -> configure future failure behavior."),
    path: v1("Automations/og/PM/monitoring-enhancements-concept-direction.md"),
  },
  {
    id: "source-process",
    badge: v1("UX process"),
    title: v1("Readable process guidance"),
    description: v1("Use co-creation, early demos, targeted testing, and a scoped handoff rather than a giant spec dump."),
    path: v1("UX process documents/UX/03. Onboarding/Sample design Process.docx"),
  },
  {
    id: "source-visual",
    badge: v1("Visual system"),
    title: v1("Neon Nexus styling reference"),
    description: v1("This page uses copied UI primitives from the repo: Button, Card, Badge, Tabs, CyberCard, and the exact theme hook pattern."),
    path: v1("/tmp/neon-nexus/src/features/system-config/views/AboutInfolinkView.tsx"),
  },
] as const;

const deliveryCards: readonly DeliveryCard[] = [
  {
    id: "review-order",
    title: revisedInV2("Stakeholder review order", "Stakeholder review and release order"),
    ordered: true,
    points: [
      { id: "review-1", label: v1("Co-create low-fi with your cocreation partner.") },
      { id: "review-2", label: v1("Review with PO/PM and key stakeholders early.") },
      {
        id: "review-3",
        label: v1("Check feasibility of payload, response, and failure-action behavior with engineering."),
      },
      { id: "review-4", label: v1("Test the monitoring flow with internal builders.") },
      {
        id: "review-5",
        label: revisedInV2(
          "Prepare a tightly scoped V1 handoff plus roadmap follow-up.",
          "Prepare a tightly scoped V1 handoff plus roadmap follow-up, and publish a new timestamped dashboard version whenever the plan content changes.",
        ),
      },
    ],
  },
  {
    id: "usability",
    title: v1("Usability tasks"),
    points: [
      { id: "task-1", label: v1("Find the automation that failed this morning.") },
      { id: "task-2", label: v1("Open the most relevant failed run.") },
      { id: "task-3", label: v1("Show what payload was sent and what response came back.") },
      { id: "task-4", label: v1("Explain the likely root cause.") },
      { id: "task-5", label: v1("Configure a component to run on the next failure.") },
    ],
  },
  {
    id: "out-of-scope",
    title: v1("Out of scope for the first handoff"),
    points: [
      { id: "scope-1", label: v1("Full telemetry dashboard") },
      { id: "scope-2", label: v1("Queue-management UX") },
      { id: "scope-3", label: v1("Kill or terminate running processes") },
      { id: "scope-4", label: v1("Full authoring redesign") },
      { id: "scope-5", label: v1("Complete Automations 2.0 restructuring") },
    ],
  },
  {
    id: "versioning-rule",
    title: addedInV2("Versioning rule for plan and dashboard updates"),
    points: [
      { id: "versioning-1", label: addedInV2("Every content update creates a new dashboard version with a timestamp.") },
      { id: "versioning-2", label: addedInV2("The dashboard defaults to the latest version, while the dropdown can reopen earlier snapshots.") },
      { id: "versioning-3", label: addedInV2("Updated content is marked at the paragraph, bullet, and card level instead of circling whole sections.") },
      { id: "versioning-4", label: addedInV2("Users can hide markers, view markers inline, or compare updated content side by side against the previous version range.") },
    ],
  },
] as const;

const sectionNavItems = [
  { id: "hero", label: "• Overview" },
  { id: "timeline", label: "• Design Timeline" },
  { id: "surfaces", label: "• Screen Sequence" },
  { id: "delivery", label: "• Delivery Workflow" },
  { id: "sources", label: "• Source Map" },
] as const;

function getVersionIndex(versionId: VersionId): number {
  return versionIndexMap.get(versionId) ?? 0;
}

function getEffectiveValue<T>(history: VersionHistory<T>, versionId: VersionId): T | undefined {
  const targetIndex = getVersionIndex(versionId);
  const matchingEntries = history.filter((entry) => getVersionIndex(entry.version) <= targetIndex);
  return matchingEntries[matchingEntries.length - 1]?.value;
}

function getPreviousVersionId(versionId: VersionId): VersionId | null {
  const versionIndex = getVersionIndex(versionId);
  if (versionIndex <= 0) {
    return null;
  }

  return dashboardVersions[versionIndex - 1]?.id ?? null;
}

function getComparableStartVersions(viewVersion: VersionId): VersionId[] {
  const endIndex = getVersionIndex(viewVersion);
  if (endIndex === 0) {
    return ["v1"];
  }

  return dashboardVersions.slice(1, endIndex + 1).map((version) => version.id);
}

function getChangedVersionsInRange<T>(history: VersionHistory<T>, rangeStart: VersionId, rangeEnd: VersionId): VersionId[] {
  const baselineVersionId = getPreviousVersionId(rangeStart);
  if (!baselineVersionId) {
    return [];
  }

  const startIndex = getVersionIndex(rangeStart);
  const endIndex = getVersionIndex(rangeEnd);

  return history
    .map((entry) => entry.version)
    .filter((version) => {
      const versionIndex = getVersionIndex(version);
      return versionIndex >= startIndex && versionIndex <= endIndex;
    });
}

function getRangeChange<T>(history: VersionHistory<T>, rangeStart: VersionId, rangeEnd: VersionId) {
  const baselineVersionId = getPreviousVersionId(rangeStart);
  const current = getEffectiveValue(history, rangeEnd);
  const previous = baselineVersionId ? getEffectiveValue(history, baselineVersionId) : undefined;
  const changedVersions = getChangedVersionsInRange(history, rangeStart, rangeEnd);
  const changed = changedVersions.length > 0 && JSON.stringify(current) !== JSON.stringify(previous);

  return { changed, changedVersions, previous, current };
}

function getVersionLabel(versionId: VersionId): string {
  return dashboardVersions.find((version) => version.id === versionId)?.label ?? versionId;
}

function getChangeLabel(changedVersions: VersionId[]): string {
  if (changedVersions.length === 1) {
    return `Updated in ${getVersionLabel(changedVersions[0])}`;
  }

  return `Updates in ${getVersionLabel(changedVersions[0])}-${getVersionLabel(changedVersions[changedVersions.length - 1])}`;
}

function VersionPill({ changedVersions }: { changedVersions: VersionId[] }) {
  if (changedVersions.length === 0) {
    return null;
  }

  return (
    <span className="inline-flex w-fit items-center rounded-full border border-amber-300 bg-amber-100/90 px-2 py-0.5 font-display text-[11px] uppercase tracking-[0.16em] text-amber-900">
      {getChangeLabel(changedVersions)}
    </span>
  );
}

function summarizeMarkerText(value: string | undefined): string {
  if (!value) {
    return "Added in this version range.";
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= 140) {
    return normalized;
  }

  return `${normalized.slice(0, 137)}...`;
}

function UpdateMarker({
  changedVersions,
  previous,
  current,
}: {
  changedVersions: VersionId[];
  previous?: string;
  current: string;
}) {
  return (
    <span className="group relative inline-flex shrink-0 items-start">
      <span
        tabIndex={0}
        className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-amber-300 bg-amber-100 text-amber-900 outline-none ring-0 transition-colors group-hover:bg-amber-200 group-focus-within:bg-amber-200"
      >
        <Info className="h-3 w-3" />
      </span>
      <span className="pointer-events-none absolute right-0 top-full z-20 mt-2 hidden w-72 rounded-sm border border-amber-300 bg-amber-50 p-3 text-left text-xs leading-5 text-amber-950 shadow-lg group-hover:block group-focus-within:block">
        <span className={cardLabelTextClass}>{getChangeLabel(changedVersions)}</span>
        {previous ? (
          <>
            <span className="mt-2 block font-display text-[11px] uppercase tracking-[0.14em] text-amber-900/80">Previous</span>
            <span className="mt-1 block">{summarizeMarkerText(previous)}</span>
          </>
        ) : (
          <span className="mt-2 block">{summarizeMarkerText(previous)}</span>
        )}
        <span className="mt-2 block font-display text-[11px] uppercase tracking-[0.14em] text-amber-900/80">Current</span>
        <span className="mt-1 block">{summarizeMarkerText(current)}</span>
      </span>
    </span>
  );
}

function VersionedText({
  as,
  className,
  history,
  diffMode,
  rangeStart,
  rangeEnd,
  viewVersion,
}: {
  as?: ElementType;
  className?: string;
  history: VersionHistory<string>;
  diffMode: DiffMode;
  rangeStart: VersionId;
  rangeEnd: VersionId;
  viewVersion: VersionId;
}) {
  const component = as ?? "p";
  const currentValue = getEffectiveValue(history, viewVersion);

  if (!currentValue) {
    return null;
  }

  const { changed, changedVersions, previous } = getRangeChange(history, rangeStart, rangeEnd);

  if (diffMode === "side-by-side" && changed) {
    const PreviousComponent = component;
    const CurrentComponent = component;

    return (
      <div className={cn("rounded-sm border p-3", updateTintClass)}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <VersionPill changedVersions={changedVersions} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-sm border border-slate-200 bg-white/70 p-3">
            <div className={cardLabelTextClass}>Previous</div>
            {previous ? (
              <PreviousComponent className={className}>{previous}</PreviousComponent>
            ) : (
              <p className={cn("text-sm italic", mutedTextClass)}>Not present before this update range.</p>
            )}
          </div>
          <div className="rounded-sm border border-amber-200 bg-white p-3">
            <div className={cardLabelTextClass}>Current</div>
            <CurrentComponent className={className}>{currentValue}</CurrentComponent>
          </div>
        </div>
      </div>
    );
  }

  const Component = component;

  if (changed && diffMode === "markers") {
    return (
      <Component className={className}>
        <span className="inline-flex max-w-full items-start gap-2 align-top">
          <span className="min-w-0">{currentValue}</span>
          <UpdateMarker changedVersions={changedVersions} previous={previous} current={currentValue} />
        </span>
      </Component>
    );
  }

  return (
    <Component className={className}>{currentValue}</Component>
  );
}

function VersionedBadge({
  history,
  diffMode,
  rangeStart,
  rangeEnd,
  viewVersion,
  variant = "secondary",
}: {
  history: VersionHistory<string>;
  diffMode: DiffMode;
  rangeStart: VersionId;
  rangeEnd: VersionId;
  viewVersion: VersionId;
  variant?: "default" | "secondary" | "outline";
}) {
  const label = getEffectiveValue(history, viewVersion);
  if (!label) {
    return null;
  }

  const { changed, changedVersions, previous } = getRangeChange(history, rangeStart, rangeEnd);

  return (
    <span className="inline-flex items-center gap-2">
      <Badge className="w-fit rounded-sm" variant={variant}>
        {label}
      </Badge>
      {changed && diffMode === "markers" ? (
        <UpdateMarker changedVersions={changedVersions} previous={previous} current={label} />
      ) : null}
    </span>
  );
}

function VersionSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly VersionMeta[];
  value: VersionId;
  onChange: (value: VersionId) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className={cardLabelTextClass}>{label}</span>
      <select
        className="rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition-colors focus:border-cyan-500"
        value={value}
        onChange={(event) => onChange(event.target.value as VersionId)}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label} - {option.timestamp}
          </option>
        ))}
      </select>
    </label>
  );
}

function SectionIndex({ activeSection }: { activeSection: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeItem = sectionNavItems.find((item) => item.id === activeSection) ?? sectionNavItems[0];

  return (
    <div className="pointer-events-none fixed right-4 top-6 z-40 hidden xl:block md:right-6">
      <div
        className="pointer-events-auto"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocusCapture={() => setIsOpen(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsOpen(false);
          }
        }}
      >
        <div className="w-[260px] rounded-2xl border border-white/18 bg-background/35 shadow-[0_14px_48px_hsl(var(--background)/0.12)] backdrop-blur-2xl">
          <button
            type="button"
            aria-expanded={isOpen}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="min-w-0 flex-1 truncate font-display text-xs font-bold tracking-[0.02em] text-foreground/92">
              {activeItem.label.replace(/^•\s*/, "")}
            </span>
            <ChevronDown
              className={cn("h-3.5 w-3.5 text-muted-foreground/75 transition-transform", isOpen && "rotate-180")}
            />
          </button>

          {isOpen ? (
            <div className="border-t border-white/10 px-2 py-2">
              <div className="space-y-1">
                {sectionNavItems.map((item) => {
                  const isActive = item.id === activeSection;

                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors",
                        isActive
                          ? "border-primary/20 bg-primary/12 text-foreground hover:border-white/12 hover:bg-white/10"
                          : "border-transparent text-muted-foreground hover:border-white/12 hover:bg-white/10 hover:text-foreground",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-primary" : "bg-muted-foreground/30")} />
                      <span className="min-w-0 truncate font-display text-xs font-bold tracking-[0.02em]">{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MonitoringEnhancementsPage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedTimelineId, setSelectedTimelineId] = useState<string>(timelineItems[0].id);
  const [selectedLane, setSelectedLane] = useState<Lane>("all");
  const [viewVersion, setViewVersion] = useState<VersionId>(latestVersionId);
  const [diffMode, setDiffMode] = useState<DiffMode>("hidden");
  const [rangeStart, setRangeStart] = useState<VersionId>(latestVersionId);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const sections = [...document.querySelectorAll("section[id]")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0.15, 0.5, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const comparableStartVersions = useMemo(() => {
    const versionIds = getComparableStartVersions(viewVersion);
    return dashboardVersions.filter((version) => versionIds.includes(version.id));
  }, [viewVersion]);

  useEffect(() => {
    const allowedRangeStarts = getComparableStartVersions(viewVersion);
    if (!allowedRangeStarts.includes(rangeStart)) {
      setRangeStart(allowedRangeStarts[allowedRangeStarts.length - 1] ?? viewVersion);
    }
  }, [rangeStart, viewVersion]);

  const selectedTimelineItem = timelineItems.find((item) => item.id === selectedTimelineId) ?? timelineItems[0];
  const currentVersionMeta = dashboardVersions.find((version) => version.id === viewVersion) ?? dashboardVersions[0];
  const changedVersionLabels = getChangedVersionsInRange(heroSummary, rangeStart, viewVersion).map((versionId) => getVersionLabel(versionId));

  return (
    <div className="relative min-h-screen bg-mesh">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid-fade" />
      <SectionIndex activeSection={activeSection} />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-4 md:px-6 md:py-6">
        <main className="space-y-5">
          <section id="hero" className="space-y-6 overflow-hidden py-2">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)] xl:items-start">
              <div className="min-w-0">
                <div className="relative mb-6 flex flex-wrap items-center gap-3">
                  <p className={sectionLabelTextClass}>Monitoring Enhancements</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-sm border border-slate-300 bg-slate-100 px-4 py-2 font-display text-xs uppercase tracking-[0.14em] text-slate-700 shadow-sm transition-colors hover:bg-slate-200"
                    aria-expanded={isHistoryOpen}
                    onClick={() => setIsHistoryOpen((open) => !open)}
                  >
                    <span>Version history</span>
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isHistoryOpen && "rotate-180")} />
                  </button>
                  {isHistoryOpen ? (
                    <Card className={cn(whiteCardClass, "absolute left-0 top-full z-20 mt-3 w-full max-w-[520px] overflow-hidden")}>
                      <CardContent className="grid gap-4 p-4">
                        <VersionSelect label="Viewing version" options={dashboardVersions} value={viewVersion} onChange={setViewVersion} />
                        <VersionSelect label="Show updates introduced in" options={comparableStartVersions} value={rangeStart} onChange={setRangeStart} />
                        <div>
                          <div className={cardLabelTextClass}>Marker mode</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant={diffMode === "hidden" ? "default" : "outline"}
                              className="rounded-sm"
                              onClick={() => setDiffMode("hidden")}
                            >
                              Hide markers
                            </Button>
                            <Button
                              type="button"
                              variant={diffMode === "markers" ? "default" : "outline"}
                              className="rounded-sm"
                              onClick={() => setDiffMode("markers")}
                            >
                              Show markers
                            </Button>
                            <Button
                              type="button"
                              variant={diffMode === "side-by-side" ? "default" : "outline"}
                              className="rounded-sm"
                              onClick={() => setDiffMode("side-by-side")}
                            >
                              Side-by-side diff
                            </Button>
                          </div>
                        </div>
                        <div className={nestedCardClass}>
                          <div className={cardLabelTextClass}>Current release</div>
                          <div className="mt-2 break-words text-xl font-semibold text-foreground">
                            {currentVersionMeta.label} - {currentVersionMeta.timestamp}
                          </div>
                          <p className={cn("mt-2 text-base leading-7", sectionMutedTextClass)}>{currentVersionMeta.summary}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge className="rounded-sm" variant="secondary">
                              Default view: {currentVersionMeta.label}
                            </Badge>
                            <Badge className="rounded-sm" variant="outline">
                              Update range: {getVersionLabel(rangeStart)}-{getVersionLabel(viewVersion)}
                            </Badge>
                            <Badge className="rounded-sm" variant="outline">
                              Mode: {diffMode === "side-by-side" ? "Side-by-side" : diffMode === "markers" ? "Markers" : "Hidden"}
                            </Badge>
                          </div>
                          <p className={cn("mt-4 text-sm leading-6", sectionMutedTextClass)}>
                            {changedVersionLabels.length > 0
                              ? `This view can show updates introduced in ${changedVersionLabels.join(", ")} without losing the older snapshots.`
                              : "Initial version selected. Update markers stay quiet because there is no earlier baseline to compare against."}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : null}
                </div>
                <VersionedText
                  as="h1"
                  className="max-w-3xl break-words font-display text-3xl leading-tight text-foreground md:text-4xl"
                  history={heroTitle}
                  diffMode={diffMode}
                  rangeStart={rangeStart}
                  rangeEnd={viewVersion}
                  viewVersion={viewVersion}
                />
                <VersionedText
                  as="p"
                  className={cn("mt-4 max-w-3xl text-base leading-7", sectionMutedTextClass)}
                  history={heroSummary}
                  diffMode={diffMode}
                  rangeStart={rangeStart}
                  rangeEnd={viewVersion}
                  viewVersion={viewVersion}
                />
              </div>
              <Card className={cn(whiteCardClass, "h-fit w-full")}>
                <CardHeader className="pb-3">
                  <CardDescription className={cardLabelTextClass}>Next step</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <VersionedText
                    as="p"
                    className="whitespace-pre-line text-base text-slate-700"
                    history={nextStepBody}
                    diffMode={diffMode}
                    rangeStart={rangeStart}
                    rangeEnd={viewVersion}
                    viewVersion={viewVersion}
                  />
                  <Button asChild className="rounded-sm">
                    <a href="#surfaces">Go to screen sequence</a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {heroFacts
                .filter((item) => getEffectiveValue(item.title, viewVersion))
                .map((item) => (
                  <CyberCard key={item.id} className="rounded-sm border-border/80 bg-card/84 p-5 text-foreground shadow-sm dark:bg-card/92">
                    <VersionedText
                      as="div"
                      className={sectionLabelTextClass}
                      history={item.kicker}
                      diffMode={diffMode}
                      rangeStart={rangeStart}
                      rangeEnd={viewVersion}
                      viewVersion={viewVersion}
                    />
                    <VersionedText
                      as="div"
                      className="mt-2 break-words text-2xl font-semibold text-foreground"
                      history={item.title}
                      diffMode={diffMode}
                      rangeStart={rangeStart}
                      rangeEnd={viewVersion}
                      viewVersion={viewVersion}
                    />
                    <VersionedText
                      as="div"
                      className={cn("mt-2 text-base leading-6", sectionMutedTextClass)}
                      history={item.summary}
                      diffMode={diffMode}
                      rangeStart={rangeStart}
                      rangeEnd={viewVersion}
                      viewVersion={viewVersion}
                    />
                  </CyberCard>
                ))}
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-3">
              {focusCards.map((card) => (
                <Card key={card.id} className={whiteCardClass}>
                  <CardHeader>
                    <VersionedBadge history={card.badge} diffMode={diffMode} rangeStart={rangeStart} rangeEnd={viewVersion} viewVersion={viewVersion} variant="outline" />
                    <VersionedText
                      as={CardTitle}
                      className="break-words text-2xl"
                      history={card.title}
                      diffMode={diffMode}
                      rangeStart={rangeStart}
                      rangeEnd={viewVersion}
                      viewVersion={viewVersion}
                    />
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
                      {card.points.map((point) => (
                        <VersionedText
                          key={point.id}
                          as="li"
                          history={point.label}
                          className="break-words"
                          diffMode={diffMode}
                          rangeStart={rangeStart}
                          rangeEnd={viewVersion}
                          viewVersion={viewVersion}
                        />
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="timeline" className="space-y-5 pt-2">
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className={sectionLabelTextClass}>Step by step</p>
                <h2 className="break-words text-3xl font-semibold text-foreground">Design sequence and drill-down timeline</h2>
              </div>
              <Tabs value={selectedLane} onValueChange={(value) => setSelectedLane(value as Lane)}>
                <TabsList className="rounded-md border border-border/60 bg-secondary/80 text-muted-foreground backdrop-blur-sm">
                  <TabsTrigger className="rounded-sm" value="all">
                    All
                  </TabsTrigger>
                  <TabsTrigger className="rounded-sm" value="v1">
                    V1
                  </TabsTrigger>
                  <TabsTrigger className="rounded-sm" value="ia">
                    IA
                  </TabsTrigger>
                  <TabsTrigger className="rounded-sm" value="future">
                    Future bridge
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
              <div className="grid gap-3">
                {timelineItems.map((item) => {
                  const laneMatches = selectedLane === "all" || item.lane === selectedLane;

                  return (
                    <Card
                      key={item.id}
                      className={cn(
                        whiteCardClass,
                        "cursor-pointer transition-all",
                        selectedTimelineId === item.id && "border-primary/40 bg-slate-50",
                        laneMatches ? "opacity-100" : "opacity-45",
                        selectedTimelineId !== item.id && laneMatches && "hover:bg-slate-50",
                      )}
                      onClick={() => setSelectedTimelineId(item.id)}
                    >
                      <CardContent className="flex gap-4 p-5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-slate-200 bg-slate-100 font-display text-xs text-slate-900">
                          {item.step}
                        </div>
                        <div className="min-w-0">
                          <VersionedText
                            as="div"
                            className={cardLabelTextClass}
                            history={item.kicker}
                            diffMode={diffMode}
                            rangeStart={rangeStart}
                            rangeEnd={viewVersion}
                            viewVersion={viewVersion}
                          />
                          <VersionedText
                            as="h3"
                            className="mt-1 break-words text-2xl font-semibold leading-tight text-slate-900"
                            history={item.title}
                            diffMode={diffMode}
                            rangeStart={rangeStart}
                            rangeEnd={viewVersion}
                            viewVersion={viewVersion}
                          />
                          <VersionedText
                            as="p"
                            className={cn("mt-2 break-words text-base leading-7", mutedTextClass)}
                            history={item.summary}
                            diffMode={diffMode}
                            rangeStart={rangeStart}
                            rangeEnd={viewVersion}
                            viewVersion={viewVersion}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className={cn(whiteCardClass, "h-fit")}>
                <CardHeader>
                  <VersionedText
                    as={CardDescription}
                    className={cardLabelTextClass}
                    history={selectedTimelineItem.kicker}
                    diffMode={diffMode}
                    rangeStart={rangeStart}
                    rangeEnd={viewVersion}
                    viewVersion={viewVersion}
                  />
                  <VersionedText
                    as={CardTitle}
                    className="break-words text-2xl"
                    history={selectedTimelineItem.title}
                    diffMode={diffMode}
                    rangeStart={rangeStart}
                    rangeEnd={viewVersion}
                    viewVersion={viewVersion}
                  />
                  <VersionedText
                    as={CardDescription}
                    className="break-words text-base leading-7 text-slate-600"
                    history={selectedTimelineItem.summary}
                    diffMode={diffMode}
                    rangeStart={rangeStart}
                    rangeEnd={viewVersion}
                    viewVersion={viewVersion}
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedTimelineItem.chips
                      .filter((chip) => getEffectiveValue(chip.label, viewVersion))
                      .map((chip) => (
                        <VersionedBadge
                          key={chip.id}
                          history={chip.label}
                          diffMode={diffMode}
                          rangeStart={rangeStart}
                          rangeEnd={viewVersion}
                          viewVersion={viewVersion}
                        />
                      ))}
                  </div>
                  <ul className="list-disc space-y-3 pl-5 text-base leading-7 text-slate-700">
                    {selectedTimelineItem.bullets.map((bullet) => (
                      <VersionedText
                        key={bullet.id}
                        as="li"
                        history={bullet.label}
                        className="break-words"
                        diffMode={diffMode}
                        rangeStart={rangeStart}
                        rangeEnd={viewVersion}
                        viewVersion={viewVersion}
                      />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="surfaces" className="space-y-5 pt-2">
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className={sectionLabelTextClass}>Screen order</p>
                <h2 className="break-words text-3xl font-semibold text-foreground">The four frames to design first</h2>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.hash = "#hero";
                }}
                className="rounded-sm border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                Back to overview
              </Button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {surfaceItems.map((item) => (
                <Card key={item.id} className={whiteCardClass}>
                  <CardHeader className="gap-4">
                    <div className={nestedCardClass}>
                      <div className="h-3 w-1/2 rounded-sm bg-cyan-200" />
                      <Badge className="mt-3 w-fit rounded-sm bg-cyan-100 text-slate-900 hover:bg-cyan-100">
                        {getEffectiveValue(item.pill, viewVersion)}
                      </Badge>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="h-14 rounded-sm border border-border/60 bg-background/50" />
                        <div className="h-14 rounded-sm border border-border/60 bg-background/50" />
                      </div>
                      <div className="mt-3 h-2.5 rounded-sm bg-border/80" />
                      <div className="mt-2 h-2.5 w-3/5 rounded-sm bg-border/80" />
                    </div>
                    <VersionedText
                      as="div"
                      className={cardLabelTextClass}
                      history={item.kicker}
                      diffMode={diffMode}
                      rangeStart={rangeStart}
                      rangeEnd={viewVersion}
                      viewVersion={viewVersion}
                    />
                    <VersionedText
                      as={CardTitle}
                      className="break-words text-2xl"
                      history={item.title}
                      diffMode={diffMode}
                      rangeStart={rangeStart}
                      rangeEnd={viewVersion}
                      viewVersion={viewVersion}
                    />
                    <VersionedText
                      as={CardDescription}
                      className="break-words text-base leading-7 text-slate-600"
                      history={item.summary}
                      diffMode={diffMode}
                      rangeStart={rangeStart}
                      rangeEnd={viewVersion}
                      viewVersion={viewVersion}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className={nestedCardClass}>
                      <div className={cardLabelTextClass}>Must answer</div>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
                        {item.questions.map((question) => (
                          <VersionedText
                            key={question.id}
                            as="li"
                            history={question.label}
                            className="break-words"
                            diffMode={diffMode}
                            rangeStart={rangeStart}
                            rangeEnd={viewVersion}
                            viewVersion={viewVersion}
                          />
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="delivery" className="space-y-5 pt-2">
            <div>
              <p className={sectionLabelTextClass}>Validation and handoff</p>
              <h2 className="break-words text-3xl font-semibold text-foreground">How to move this from concept to delivery</h2>
            </div>
            <div className="grid gap-4 xl:grid-cols-4">
              {deliveryCards
                .filter((card) => getEffectiveValue(card.title, viewVersion))
                .map((card) => (
                  <Card key={card.id} className={whiteCardClass}>
                    <CardHeader>
                      <VersionedText
                        as={CardTitle}
                        className="break-words text-2xl"
                        history={card.title}
                        diffMode={diffMode}
                        rangeStart={rangeStart}
                        rangeEnd={viewVersion}
                        viewVersion={viewVersion}
                      />
                    </CardHeader>
                    <CardContent>
                      {card.ordered ? (
                        <ol className="list-decimal space-y-2 pl-5 text-base leading-7 text-slate-700">
                          {card.points.map((point) => (
                            <VersionedText
                              key={point.id}
                              as="li"
                              history={point.label}
                              className="break-words"
                              diffMode={diffMode}
                              rangeStart={rangeStart}
                              rangeEnd={viewVersion}
                              viewVersion={viewVersion}
                            />
                          ))}
                        </ol>
                      ) : (
                        <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
                          {card.points.map((point) => (
                            <VersionedText
                              key={point.id}
                              as="li"
                              history={point.label}
                              className="break-words"
                              diffMode={diffMode}
                              rangeStart={rangeStart}
                              rangeEnd={viewVersion}
                              viewVersion={viewVersion}
                            />
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>

          <section id="sources" className="space-y-5 pt-2">
            <div>
              <p className={sectionLabelTextClass}>Source map</p>
              <h2 className="break-words text-3xl font-semibold text-foreground">What this site is based on</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {sourceItems.map((item) => (
                <Card key={item.id} className={whiteCardClass}>
                  <CardHeader>
                    <VersionedBadge history={item.badge} diffMode={diffMode} rangeStart={rangeStart} rangeEnd={viewVersion} viewVersion={viewVersion} />
                    <VersionedText
                      as={CardTitle}
                      className="break-words text-2xl"
                      history={item.title}
                      diffMode={diffMode}
                      rangeStart={rangeStart}
                      rangeEnd={viewVersion}
                      viewVersion={viewVersion}
                    />
                    <VersionedText
                      as={CardDescription}
                      className="break-words text-base leading-7 text-slate-600"
                      history={item.description}
                      diffMode={diffMode}
                      rangeStart={rangeStart}
                      rangeEnd={viewVersion}
                      viewVersion={viewVersion}
                    />
                  </CardHeader>
                  <CardContent>
                    <VersionedText
                      as="code"
                      className="block w-full overflow-hidden whitespace-pre-wrap break-all rounded-sm border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-700"
                      history={item.path}
                      diffMode={diffMode}
                      rangeStart={rangeStart}
                      rangeEnd={viewVersion}
                      viewVersion={viewVersion}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MonitoringEnhancementsPage />
    </ThemeProvider>
  );
}
