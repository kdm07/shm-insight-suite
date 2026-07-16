import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ErpShell } from "@/components/erp/Shell";
import { StatusBadge, ProgressBar, HealthBadge, TeamBadge } from "@/components/erp/Badges";
import { projects, employees, tasks, workflowSteps, TODAY_ISO, teamStats, getEmployee } from "@/data/mock";

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

  const projectsByStage = workflowSteps.map((s) => ({
    stage: s.length > 12 ? s.split(" ").map((w) => w[0]).join("") : s,
    full: s,
    n: projects.filter((p) => p.stage === s).length,
  }));

  const instr = teamStats("Instrumentation");
  const num = teamStats("Numerical");

  const teamPerformance = [
    { team: "Instrumentation", "Sensors Installed": instr.sensorsInstalled, "Load Tests": instr.loadTestsDone, "Reports in Prep": instr.reportsInPrep },
    { team: "Numerical", "Site Visits": num.siteVisitsDone, "Methodologies": num.methodologiesApproved, "Analyses Done": num.analysisCompleted },
  ];

  const engineerProductivity = employees
    .filter((e) => e.department !== "Management")
    .slice(0, 10)
    .map((e) => {
      const done = tasks.filter((t) => t.assigneeId === e.id && t.stage === "Completed").length;
      const active = tasks.filter((t) => t.assigneeId === e.id && t.stage !== "Completed").length;
      return { name: e.name.split(" ")[0], completed: done, active };
    });

  const monthlyCompleted = [
    { m: "Jul", completed: 1 }, { m: "Aug", completed: 2 }, { m: "Sep", completed: 3 },
    { m: "Oct", completed: 2 }, { m: "Nov", completed: 4 }, { m: "Dec", completed: 3 },
    { m: "Jan", completed: 2 }, { m: "Feb", completed: 3 },
  ];

  const filteredProjects = projects.filter((p) => p.endDate >= start || p.startDate >= start);
  const delayed = projects.filter((p) => p.status === "Delayed");
  const pipeline = projects.filter((p) => p.status !== "Completed");

  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Reports" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <div className="page-sub">SHM portfolio, team and delivery analytics · window: {range.toLowerCase()} · {filteredProjects.length} projects in range</div>
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
          <div className="erp-card-header"><h3 className="erp-card-title">Projects by Workflow Stage</h3></div>
          <div className="erp-card-body" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectsByStage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="full" tick={{ fontSize: 9 }} interval={0} angle={-30} textAnchor="end" height={90} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="n" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Monthly Completed Projects</h3></div>
          <div className="erp-card-body" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCompleted}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="m" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="completed" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="erp-grid erp-grid-2" style={{ marginBottom: 20 }}>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Instrumentation Team Performance</h3></div>
          <div className="erp-card-body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[teamPerformance[0]]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="team" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip /><Legend />
                <Bar dataKey="Sensors Installed" fill="#2563EB" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Load Tests" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Reports in Prep" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Numerical Team Performance</h3></div>
          <div className="erp-card-body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[teamPerformance[1]]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="team" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip /><Legend />
                <Bar dataKey="Site Visits" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Methodologies" fill="#2563EB" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Analyses Done" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="erp-card" style={{ marginBottom: 20 }}>
        <div className="erp-card-header"><h3 className="erp-card-title">Engineer Productivity</h3></div>
        <div className="erp-card-body" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engineerProductivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip /><Legend />
              <Bar dataKey="completed" fill="#22C55E" radius={[6, 6, 0, 0]} />
              <Bar dataKey="active" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="erp-card" style={{ marginBottom: 20 }}>
        <div className="erp-card-header"><h3 className="erp-card-title">Current Project Pipeline</h3></div>
        <div style={{ overflowX: "auto" }}>
          <table className="erp-table">
            <thead><tr><th>Code</th><th>Bridge</th><th>Current Stage</th><th>Responsible</th><th>Engineer</th><th>Status</th><th>Progress</th></tr></thead>
            <tbody>
              {pipeline.map((p) => (
                <tr key={p.id}>
                  <td>{p.code}</td><td>{p.bridgeName}</td>
                  <td style={{ fontSize: 12 }}>{p.stage}</td>
                  <td><TeamBadge team={p.responsibleTeam} /></td>
                  <td style={{ fontSize: 12 }}>{getEmployee(p.currentEngineerId)?.name}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td style={{ minWidth: 160 }}><ProgressBar value={p.progress} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header"><h3 className="erp-card-title">Project Delay Analysis</h3></div>
        <div style={{ overflowX: "auto" }}>
          <table className="erp-table">
            <thead><tr><th>Code</th><th>Bridge</th><th>Stage</th><th>Health</th><th>Progress</th><th>Delay</th></tr></thead>
            <tbody>
              {delayed.map((p) => (
                <tr key={p.id}>
                  <td>{p.code}</td><td>{p.bridgeName}</td>
                  <td style={{ fontSize: 12 }}>{p.stage}</td>
                  <td><HealthBadge health={p.health} /></td>
                  <td style={{ minWidth: 160 }}><ProgressBar value={p.progress} tone="danger" /></td>
                  <td style={{ fontSize: 12, color: "var(--erp-danger)", fontWeight: 600 }}>+{p.delayDays} days</td>
                </tr>
              ))}
              {delayed.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--erp-muted)" }}>No delayed projects</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </ErpShell>
  );
}
