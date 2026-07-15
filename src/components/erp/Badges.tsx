import type { ProjectStatus, Priority, TaskStatus, ProjectHealth, ProjectStage } from "@/lib/erp-types";

const projectStatusClass: Record<ProjectStatus, string> = {
  Planning: "erp-badge erp-badge-info",
  Running: "erp-badge erp-badge-primary",
  Review: "erp-badge erp-badge-warning",
  Completed: "erp-badge erp-badge-success",
  Delayed: "erp-badge erp-badge-danger",
};
const taskStatusClass: Record<TaskStatus, string> = {
  "To Do": "erp-badge erp-badge-muted",
  Assigned: "erp-badge erp-badge-info",
  "In Progress": "erp-badge erp-badge-primary",
  "Waiting Review": "erp-badge erp-badge-warning",
  Completed: "erp-badge erp-badge-success",
};
const priorityClass: Record<Priority, string> = {
  Low: "erp-badge erp-badge-muted",
  Medium: "erp-badge erp-badge-info",
  High: "erp-badge erp-badge-warning",
  Critical: "erp-badge erp-badge-danger",
};
const healthClass: Record<ProjectHealth, string> = {
  Healthy: "erp-badge erp-badge-success",
  Attention: "erp-badge erp-badge-warning",
  Delayed: "erp-badge erp-badge-danger",
  Blocked: "erp-badge erp-badge-danger",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={projectStatusClass[status]}>{status}</span>;
}
export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <span className={taskStatusClass[status]}>{status}</span>;
}
export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={priorityClass[priority]}>{priority}</span>;
}
export function HealthBadge({ health }: { health: ProjectHealth }) {
  return <span className={healthClass[health]}>{health}</span>;
}
export function StageBadge({ stage }: { stage: ProjectStage }) {
  return <span className="erp-badge erp-badge-info">{stage}</span>;
}
export function TeamBadge({ team }: { team: string }) {
  const cls =
    team === "Instrumentation" ? "erp-badge erp-badge-primary" :
    team === "Numerical" ? "erp-badge erp-badge-info" :
    team === "Management" ? "erp-badge erp-badge-warning" :
    "erp-badge erp-badge-muted";
  return <span className={cls}>{team}</span>;
}

export function ProgressBar({ value, tone = "primary" }: { value: number; tone?: "primary" | "success" | "warning" | "danger" }) {
  return (
    <div className="erp-progress">
      <div className={`erp-progress-bar tone-${tone}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
