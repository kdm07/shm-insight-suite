import { createFileRoute } from "@tanstack/react-router";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ErpShell } from "@/components/erp/Shell";
import { StatusBadge, ProgressBar } from "@/components/erp/Badges";
import { projects, employees } from "@/data/mock";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — KDM SHM ERP" }] }),
  component: Reports,
});

function Reports() {
  const perf = employees
    .filter((e) => e.department !== "Management")
    .slice(0, 10)
    .map((e) => ({ name: e.name.split(" ")[0], performance: e.performance, projects: e.projects.length }));
  const dept = [
    { d: "Instrumentation", projects: projects.length, completed: projects.filter((p) => p.status === "Completed").length },
    { d: "Numerical", projects: projects.length, completed: projects.filter((p) => p.status === "Completed").length },
  ];
  const delayed = projects.filter((p) => p.status === "Delayed");

  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Reports" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <div className="page-sub">Portfolio, team and delivery analytics</div>
        </div>
        <button className="erp-btn erp-btn-outline">Export PDF</button>
      </div>

      <div className="erp-grid erp-grid-2" style={{ marginBottom: 20 }}>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Employee Performance</h3></div>
          <div className="erp-card-body" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perf}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="performance" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Department Performance</h3></div>
          <div className="erp-card-body" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dept}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="d" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="projects" fill="#2563EB" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="erp-card" style={{ marginBottom: 20 }}>
        <div className="erp-card-header"><h3 className="erp-card-title">Project Status Report</h3></div>
        <div style={{ overflowX: "auto" }}>
          <table className="erp-table">
            <thead><tr><th>Code</th><th>Bridge</th><th>Status</th><th>Progress</th><th>Start</th><th>End</th></tr></thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.code}</td><td>{p.bridgeName}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td style={{ minWidth: 160 }}><ProgressBar value={p.progress} /></td>
                  <td style={{ fontSize: 12 }}>{p.startDate}</td>
                  <td style={{ fontSize: 12 }}>{p.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header"><h3 className="erp-card-title">Delayed Projects</h3></div>
        <div style={{ overflowX: "auto" }}>
          <table className="erp-table">
            <thead><tr><th>Code</th><th>Bridge</th><th>Location</th><th>Progress</th><th>End Date</th></tr></thead>
            <tbody>
              {delayed.map((p) => (
                <tr key={p.id}>
                  <td>{p.code}</td><td>{p.bridgeName}</td><td>{p.location}</td>
                  <td style={{ minWidth: 160 }}><ProgressBar value={p.progress} tone="danger" /></td>
                  <td style={{ fontSize: 12 }}>{p.endDate}</td>
                </tr>
              ))}
              {delayed.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--erp-muted)" }}>No delayed projects</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </ErpShell>
  );
}
