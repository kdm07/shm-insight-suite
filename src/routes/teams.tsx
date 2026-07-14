import { createFileRoute } from "@tanstack/react-router";
import { ErpShell } from "@/components/erp/Shell";
import { employees, projects, tasks } from "@/data/mock";
import type { Team } from "@/lib/erp-types";

export const Route = createFileRoute("/teams")({
  head: () => ({ meta: [{ title: "Teams — KDM SHM ERP" }] }),
  component: TeamsPage,
});

function TeamCard({ team }: { team: Team }) {
  const hod = employees.find((e) => e.role === (team === "Instrumentation" ? "Instrumentation HOD" : "Numerical HOD"));
  const eng = employees.filter((e) => e.department === team && e.role !== "Instrumentation HOD" && e.role !== "Numerical HOD");
  const current = projects.filter((p) =>
    (team === "Instrumentation" ? p.instrumentationEngineers : p.numericalEngineers).length > 0 && p.status === "Running"
  );
  const completed = projects.filter((p) => p.status === "Completed").length;
  const pending = tasks.filter((t) => t.team === team && t.status !== "Completed").length;
  const perf = Math.round(eng.reduce((s, e) => s + e.performance, 0) / (eng.length || 1));

  return (
    <div className="erp-card">
      <div className="erp-card-header">
        <div>
          <h3 className="erp-card-title">{team} Team</h3>
          <div className="erp-card-sub">Structural Health Monitoring — {team} division</div>
        </div>
        <div className="erp-badge erp-badge-primary">{eng.length + 1} members</div>
      </div>
      <div className="erp-card-body">
        {hod && (
          <div style={{ display: "flex", gap: 14, alignItems: "center", padding: 12, background: "var(--erp-bg)", borderRadius: 10, marginBottom: 16 }}>
            <img src={hod.photo} className="avatar-md" alt="" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{hod.name}</div>
              <div style={{ fontSize: 12, color: "var(--erp-muted)" }}>{hod.designation}</div>
            </div>
            <div className="erp-badge erp-badge-success">HOD</div>
          </div>
        )}

        <div className="erp-grid erp-grid-4" style={{ marginBottom: 16 }}>
          <Stat label="Current Projects" value={current.length} />
          <Stat label="Completed" value={completed} />
          <Stat label="Pending Tasks" value={pending} />
          <Stat label="Performance" value={`${perf}%`} />
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--erp-muted)", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 8 }}>Engineers</div>
        <div className="erp-grid erp-grid-2">
          {eng.map((e) => (
            <div key={e.id} className="hstack-12" style={{ padding: 10, border: "1px solid var(--erp-border)", borderRadius: 8 }}>
              <img src={e.photo} className="avatar-sm" alt="" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{e.name}</div>
                <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{e.designation}</div>
              </div>
              <span className={`erp-badge ${e.availability === "Available" ? "erp-badge-success" : e.availability === "Busy" ? "erp-badge-warning" : "erp-badge-muted"}`}>{e.availability}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ padding: 12, background: "var(--erp-bg)", borderRadius: 10 }}>
      <div style={{ fontSize: 11, color: "var(--erp-muted)", textTransform: "uppercase", letterSpacing: ".3px", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function TeamsPage() {
  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Teams" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Teams</h1>
          <div className="page-sub">Two technical teams working in parallel on every SHM project</div>
        </div>
      </div>
      <div className="erp-grid erp-grid-2">
        <TeamCard team="Instrumentation" />
        <TeamCard team="Numerical" />
      </div>
    </ErpShell>
  );
}
