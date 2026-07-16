import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutGrid, List as ListIcon, AlertTriangle } from "lucide-react";
import { ErpShell } from "@/components/erp/Shell";
import { PriorityBadge, TaskStatusBadge, ProgressBar, TeamBadge } from "@/components/erp/Badges";
import { tasks, getEmployee, getProject, projects, employees, TODAY_ISO } from "@/data/mock";
import type { TaskStage, Team, Priority } from "@/lib/erp-types";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Tasks — KDM SHM ERP" }] }),
  component: TasksPage,
});

const columns: TaskStage[] = [
  "Site Visit",
  "Methodology",
  "Sensor Installation",
  "Load Testing",
  "Data Extraction",
  "Numerical Analysis",
  "Report Preparation",
  "Completed",
];

function TasksPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [projectId, setProjectId] = useState<string>("All");
  const [team, setTeam] = useState<Team | "All">("All");
  const [engineerId, setEngineerId] = useState<string>("All");
  const [priority, setPriority] = useState<Priority | "All">("All");
  const [quick, setQuick] = useState<"All" | "DueToday" | "Delayed">("All");

  const engineerOptions = useMemo(
    () => employees.filter((e) => e.role === "Instrumentation Engineer" || e.role === "Numerical Engineer"),
    []
  );

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (projectId !== "All" && t.projectId !== projectId) return false;
      if (team !== "All" && t.team !== team) return false;
      if (engineerId !== "All" && t.assigneeId !== engineerId) return false;
      if (priority !== "All" && t.priority !== priority) return false;
      if (quick === "DueToday" && t.dueDate !== TODAY_ISO) return false;
      if (quick === "Delayed" && !(t.stage !== "Completed" && t.dueDate < TODAY_ISO)) return false;
      return true;
    });
  }, [projectId, team, engineerId, priority, quick]);

  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Tasks" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <div className="page-sub">{filtered.length} of {tasks.length} tasks · board columns follow the SHM workflow stages</div>
        </div>
        <div className="hstack-8">
          <button className={`erp-btn ${view === "kanban" ? "erp-btn-primary" : "erp-btn-outline"}`} onClick={() => setView("kanban")}>
            <LayoutGrid size={14} /> Kanban
          </button>
          <button className={`erp-btn ${view === "list" ? "erp-btn-primary" : "erp-btn-outline"}`} onClick={() => setView("list")}>
            <ListIcon size={14} /> List
          </button>
          <button className="erp-btn erp-btn-primary">+ New Task</button>
        </div>
      </div>

      {/* Filters */}
      <div className="erp-card" style={{ marginBottom: 16 }}>
        <div className="erp-card-body" style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <select className="form-select form-select-sm" style={{ maxWidth: 220 }} value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="All">All Projects</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.bridgeName}</option>)}
          </select>
          <select className="form-select form-select-sm" style={{ maxWidth: 160 }} value={team} onChange={(e) => setTeam(e.target.value as Team | "All")}>
            <option value="All">All Departments</option>
            <option value="Instrumentation">Instrumentation</option>
            <option value="Numerical">Numerical</option>
          </select>
          <select className="form-select form-select-sm" style={{ maxWidth: 200 }} value={engineerId} onChange={(e) => setEngineerId(e.target.value)}>
            <option value="All">All Engineers</option>
            {engineerOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <select className="form-select form-select-sm" style={{ maxWidth: 140 }} value={priority} onChange={(e) => setPriority(e.target.value as Priority | "All")}>
            <option value="All">All Priorities</option>
            {(["Low", "Medium", "High", "Critical"] as Priority[]).map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="hstack-8" style={{ marginLeft: "auto" }}>
            <button className={`erp-btn ${quick === "All" ? "erp-btn-primary" : "erp-btn-outline"}`} onClick={() => setQuick("All")}>All</button>
            <button className={`erp-btn ${quick === "DueToday" ? "erp-btn-primary" : "erp-btn-outline"}`} onClick={() => setQuick("DueToday")}>Due Today</button>
            <button className={`erp-btn ${quick === "Delayed" ? "erp-btn-primary" : "erp-btn-outline"}`} onClick={() => setQuick("Delayed")}>Overdue</button>
          </div>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="erp-kanban">
          {columns.map((col) => {
            const items = filtered.filter((t) => t.stage === col);
            return (
              <div key={col} className="erp-kanban-col">
                <div className="erp-kanban-col-header">
                  <div className="erp-kanban-col-title">{col}</div>
                  <div className="erp-kanban-col-count">{items.length}</div>
                </div>
                {items.map((t) => {
                  const emp = getEmployee(t.assigneeId);
                  const proj = getProject(t.projectId);
                  const overdue = t.stage !== "Completed" && t.dueDate < TODAY_ISO;
                  return (
                    <div key={t.id} className={`erp-kanban-card ${overdue ? "overdue" : ""}`}>
                      <div className="erp-kanban-card-title">{t.name}</div>
                      <div style={{ fontSize: 11, color: "var(--erp-muted)", marginTop: 2 }}>
                        <Link to="/projects/$id" params={{ id: t.projectId }} style={{ color: "var(--erp-primary)", textDecoration: "none" }}>
                          {proj?.code}
                        </Link>{" · "}<strong style={{ color: "var(--erp-text)" }}>{proj?.bridgeName}</strong>
                      </div>
                      <div className="hstack-8" style={{ marginTop: 6, flexWrap: "wrap" }}>
                        <TeamBadge team={t.team} />
                        <span className="erp-badge erp-badge-muted">Project: {proj?.stage}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--erp-muted)", marginTop: 6 }}>
                        Engineer: <strong style={{ color: "var(--erp-text)" }}>{emp?.name}</strong>
                      </div>
                      <div style={{ marginTop: 8 }}><ProgressBar value={t.progress} tone={overdue ? "danger" : "primary"} /></div>
                      <div className="erp-kanban-card-meta">
                        <div className="hstack-8">
                          {emp && <img src={emp.photo} className="erp-kanban-card-avatar" alt="" />}
                          <PriorityBadge priority={t.priority} />
                        </div>
                        <span style={{ color: overdue ? "var(--erp-danger)" : undefined, fontWeight: overdue ? 600 : undefined }}>
                          {overdue && <AlertTriangle size={11} style={{ verticalAlign: "-2px", marginRight: 2 }} />}
                          {t.dueDate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="erp-card">
          <div style={{ overflowX: "auto" }}>
            <table className="erp-table">
              <thead>
                <tr><th>Task</th><th>Project</th><th>Bridge</th><th>Dept.</th><th>Project Stage</th><th>Engineer</th><th>Board Stage</th><th>Priority</th><th>Due</th><th>Progress</th></tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const emp = getEmployee(t.assigneeId);
                  const proj = getProject(t.projectId);
                  const overdue = t.stage !== "Completed" && t.dueDate < TODAY_ISO;
                  return (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td style={{ fontSize: 12 }}><Link to="/projects/$id" params={{ id: t.projectId }}>{proj?.code}</Link></td>
                      <td style={{ fontSize: 12 }}>{proj?.bridgeName}</td>
                      <td style={{ fontSize: 12 }}>{t.team}</td>
                      <td style={{ fontSize: 12 }}>{proj?.stage}</td>
                      <td style={{ fontSize: 12 }}>{emp?.name}</td>
                      <td><TaskStatusBadge status={t.stage} /></td>
                      <td><PriorityBadge priority={t.priority} /></td>
                      <td style={{ fontSize: 12, color: overdue ? "var(--erp-danger)" : undefined, fontWeight: overdue ? 600 : undefined }}>
                        {t.dueDate}{overdue ? " · Overdue" : ""}
                      </td>
                      <td style={{ minWidth: 120 }}><ProgressBar value={t.progress} tone={overdue ? "danger" : "primary"} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ErpShell>
  );
}
