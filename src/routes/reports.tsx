import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ErpShell } from "@/components/erp/Shell";
import { StatusBadge, ProgressBar, HealthBadge } from "@/components/erp/Badges";
import { projects, employees, TODAY_ISO } from "@/data/mock";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — KDM SHM ERP" }] }),
  component: Reports,
});

type Range = "Today" | "Weekly" | "Monthly" | "Quarterly" | "Yearly";
const ranges: Range[] = ["Today", "Weekly", "Monthly", "Quarterly", "Yearly"];

function rangeStartISO(r: Range): string {
  const t = new Date(TODAY_ISO + "T00:00:00Z");
  const d = new Date(t);
  const days = r === "Today" ? 0 : r === "Weekly" ? 7 : r === "Monthly" ? 30 : r === "Quarterly" ? 90 : 365;
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function Reports() {
  const [range, setRange] = useState<Range>("Monthly");
  const start = useMemo(() => rangeStartISO(range), [range]);

  const perf = employees
    .filter((e) => e.department !== "Management")
    .slice(0, 10)
    .map((e) => ({ name: e.name.split(" ")[0], performance: e.performance, projects: e.projects.length }));

  const filteredProjects = projects.filter((p) => p.endDate >= start || p.startDate >= start);
  const dept = [
    { d: "Instrumentation", projects: filteredProjects.length, completed: filteredProjects.filter((p) => p.status === "Completed").length },
    { d: "Numerical", projects: filteredProjects.length, completed: filteredProjects.filter((p) => p.status === "Completed").length },
  ];
  const delayed = projects.filter((p) => p.status === "Delayed");

  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Reports" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <div className="page-sub">Portfolio, team and delivery analytics · window: {range.toLowerCase()}</div>
        </div>
        <button className="erp-btn erp-btn-outline">Export PDF</button>
      </div>

      <div className="erp-card" style={{ marginBottom: 16 }}>
        <div className="erp-card-body" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ranges.map((r) => (
            <button key={r} className={`erp-btn ${range === r ? "erp-btn-primary" : "erp-btn-outline"}`} onClick={() => setRange(r)}>{r}</button>
          ))}
        </div>
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
            <thead><tr><th>Code</th><th>Bridge</th><th>Status</th><th>Health</th><th>Progress</th><th>Start</th><th>End</th></tr></thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.code}</td><td>{p.bridgeName}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td><HealthBadge health={p.health} /></td>
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
            <thead><tr><th>Code</th><th>Bridge</th><th>Location</th><th>Progress</th><th>Delay</th></tr></thead>
            <tbody>
              {delayed.map((p) => (
                <tr key={p.id}>
                  <td>{p.code}</td><td>{p.bridgeName}</td><td>{p.location}</td>
                  <td style={{ minWidth: 160 }}><ProgressBar value={p.progress} tone="danger" /></td>
                  <td style={{ fontSize: 12, color: "var(--erp-danger)", fontWeight: 600 }}>+{p.delayDays} days</td>
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
