import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ErpShell } from "@/components/erp/Shell";
import { StatusBadge, PriorityBadge, ProgressBar } from "@/components/erp/Badges";
import { projects, getClient, getEmployee } from "@/data/mock";
import type { ProjectStatus } from "@/lib/erp-types";

export const Route = createFileRoute("/projects/")({
  head: () => ({ meta: [{ title: "Projects — KDM SHM ERP" }] }),
  component: ProjectsList,
});

function ProjectsList() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "All">("All");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (status !== "All" && p.status !== status) return false;
      if (q && ![p.name, p.code, p.bridgeName, p.location].join(" ").toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Projects" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <div className="page-sub">{filtered.length} projects across Indian Railway bridges</div>
        </div>
        <button className="erp-btn erp-btn-primary">+ New Project</button>
      </div>

      <div className="erp-card">
        <div className="erp-card-header" style={{ gap: 12 }}>
          <div className="hstack-12" style={{ flex: 1, maxWidth: 420, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, color: "var(--erp-muted)" }} />
            <input
              className="form-control form-control-sm"
              style={{ paddingLeft: 34 }}
              placeholder="Search by name, code, bridge, location…"
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="form-select form-select-sm"
            style={{ maxWidth: 180 }}
            value={status}
            onChange={(e) => { setStatus(e.target.value as ProjectStatus | "All"); setPage(1); }}
          >
            {["All", "Planning", "Running", "Review", "Completed", "Delayed"].map((s) =>
              <option key={s} value={s}>{s}</option>
            )}
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="erp-table">
            <thead>
              <tr>
                <th>Code</th><th>Project</th><th>Client</th><th>Location</th><th>Manager</th>
                <th>Start</th><th>End</th><th>Status</th><th>Priority</th><th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id}>
                  <td><Link to="/projects/$id" params={{ id: p.id }}>{p.code}</Link></td>
                  <td><div style={{ fontWeight: 600 }}>{p.bridgeName}</div><div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{p.name}</div></td>
                  <td style={{ fontSize: 12 }}>{getClient(p.clientId)?.name}</td>
                  <td style={{ fontSize: 12 }}>{p.location}</td>
                  <td style={{ fontSize: 12 }}>{getEmployee(p.managerId)?.name}</td>
                  <td style={{ fontSize: 12 }}>{p.startDate}</td>
                  <td style={{ fontSize: 12 }}>{p.endDate}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td><PriorityBadge priority={p.priority} /></td>
                  <td style={{ minWidth: 140 }}>
                    <div className="hstack-8">
                      <ProgressBar value={p.progress} tone={p.status === "Delayed" ? "danger" : p.status === "Completed" ? "success" : "primary"} />
                      <span style={{ fontSize: 12, fontWeight: 600, minWidth: 32 }}>{p.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, borderTop: "1px solid var(--erp-border)" }}>
          <div style={{ fontSize: 12, color: "var(--erp-muted)" }}>
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </div>
          <div className="hstack-8">
            <button className="erp-btn erp-btn-outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
            <span style={{ fontSize: 13 }}>Page {page} / {pageCount}</span>
            <button className="erp-btn erp-btn-outline" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>
    </ErpShell>
  );
}
