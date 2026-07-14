import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { ErpShell } from "@/components/erp/Shell";
import { PriorityBadge, TaskStatusBadge, ProgressBar } from "@/components/erp/Badges";
import { tasks, getEmployee, getProject } from "@/data/mock";
import type { TaskStatus } from "@/lib/erp-types";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Tasks — KDM SHM ERP" }] }),
  component: TasksPage,
});

const columns: TaskStatus[] = ["To Do", "Assigned", "In Progress", "Waiting Review", "Completed"];

function TasksPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Tasks" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <div className="page-sub">{tasks.length} tasks across all active projects</div>
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

      {view === "kanban" ? (
        <div className="erp-kanban">
          {columns.map((col) => {
            const items = tasks.filter((t) => t.status === col);
            return (
              <div key={col} className="erp-kanban-col">
                <div className="erp-kanban-col-header">
                  <div className="erp-kanban-col-title">{col}</div>
                  <div className="erp-kanban-col-count">{items.length}</div>
                </div>
                {items.map((t) => {
                  const emp = getEmployee(t.assigneeId);
                  const proj = getProject(t.projectId);
                  return (
                    <div key={t.id} className="erp-kanban-card">
                      <div className="erp-kanban-card-title">{t.name}</div>
                      <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>
                        <Link to="/projects/$id" params={{ id: t.projectId }} style={{ color: "var(--erp-primary)", textDecoration: "none" }}>
                          {proj?.code}
                        </Link>
                      </div>
                      <div style={{ marginTop: 8 }}><ProgressBar value={t.progress} /></div>
                      <div className="erp-kanban-card-meta">
                        <div className="hstack-8">
                          {emp && <img src={emp.photo} className="erp-kanban-card-avatar" alt="" />}
                          <PriorityBadge priority={t.priority} />
                        </div>
                        <span>{t.dueDate}</span>
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
                <tr><th>Task</th><th>Project</th><th>Team</th><th>Assignee</th><th>Status</th><th>Priority</th><th>Due</th><th>Progress</th></tr>
              </thead>
              <tbody>
                {tasks.map((t) => {
                  const emp = getEmployee(t.assigneeId);
                  const proj = getProject(t.projectId);
                  return (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td><Link to="/projects/$id" params={{ id: t.projectId }}>{proj?.code}</Link></td>
                      <td style={{ fontSize: 12 }}>{t.team}</td>
                      <td style={{ fontSize: 12 }}>{emp?.name}</td>
                      <td><TaskStatusBadge status={t.status} /></td>
                      <td><PriorityBadge priority={t.priority} /></td>
                      <td style={{ fontSize: 12 }}>{t.dueDate}</td>
                      <td style={{ minWidth: 120 }}><ProgressBar value={t.progress} /></td>
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
