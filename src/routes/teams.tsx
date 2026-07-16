import { createFileRoute } from "@tanstack/react-router";
import { ErpShell } from "@/components/erp/Shell";
import { ProgressBar } from "@/components/erp/Badges";
import { employees, teamStats, currentProjectForEmployee, currentTaskForEmployee } from "@/data/mock";
import type { Team } from "@/lib/erp-types";

export const Route = createFileRoute("/teams")({
  head: () => ({ meta: [{ title: "Teams — KDM SHM ERP" }] }),
  component: TeamsPage,
});

function TeamCard({ team }: { team: Team }) {
  const hod = employees.find((e) => e.role === (team === "Instrumentation" ? "Instrumentation HOD" : "Numerical HOD"));
  const s = teamStats(team);
  const capacity = s.members.length * 100;
  const utilised = s.working * 100;
  const capacityPct = capacity ? Math.round((utilised / capacity) * 100) : 0;

  return (
    <div className="erp-card">
      <div className="erp-card-header">
        <div>
          <h3 className="erp-card-title">{team} Team</h3>
          <div className="erp-card-sub">Structural Health Monitoring — {team} division</div>
        </div>
        <div className="erp-badge erp-badge-primary">{s.members.length} members</div>
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

        {team === "Instrumentation" ? (
          <div className="erp-grid erp-grid-3" style={{ marginBottom: 12 }}>
            <Stat label="Current Projects" value={s.currentProjects.length} />
            <Stat label="Pending Projects" value={s.pendingProjects.length} />
            <Stat label="Sensors Installed" value={s.sensorsInstalled} />
            <Stat label="Load Tests Done" value={s.loadTestsDone} />
            <Stat label="Reports in Prep" value={s.reportsInPrep} />
            <Stat label="Task Completion" value={`${s.completionPct}%`} />
          </div>
        ) : (
          <div className="erp-grid erp-grid-3" style={{ marginBottom: 12 }}>
            <Stat label="Current Projects" value={s.currentProjects.length} />
            <Stat label="Site Visits Done" value={s.siteVisitsDone} />
            <Stat label="Methodologies Approved" value={s.methodologiesApproved} />
            <Stat label="Analysis Pending" value={s.analysisPending} />
            <Stat label="Analysis Completed" value={s.analysisCompleted} />
            <Stat label="Task Completion" value={`${s.completionPct}%`} />
          </div>
        )}
        <div className="erp-grid erp-grid-4" style={{ marginBottom: 12 }}>
          <Stat label="Team Members" value={s.members.length} />
          <Stat label="Working" value={s.working} />
          <Stat label="Available" value={s.available} />
          <Stat label="On Leave" value={s.onLeave} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div className="hstack-8" style={{ justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "var(--erp-muted)", fontWeight: 600, textTransform: "uppercase" }}>Team Capacity</span>
            <strong style={{ fontSize: 12 }}>{capacityPct}% utilised</strong>
          </div>
          <ProgressBar value={capacityPct} tone={capacityPct > 80 ? "danger" : capacityPct > 60 ? "warning" : "success"} />
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--erp-muted)", textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 8 }}>Engineers</div>
        <div className="erp-grid erp-grid-2">
          {s.eng.map((e) => {
            const cp = currentProjectForEmployee(e.id);
            const ct = currentTaskForEmployee(e.id);
            return (
              <div key={e.id} style={{ padding: 10, border: "1px solid var(--erp-border)", borderRadius: 8 }}>
                <div className="hstack-12">
                  <img src={e.photo} className="avatar-sm" alt="" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{e.designation}</div>
                  </div>
                  <span className={`erp-badge ${e.availability === "Available" ? "erp-badge-success" : e.availability === "Busy" ? "erp-badge-warning" : "erp-badge-muted"}`}>{e.availability}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--erp-muted)", marginTop: 8, paddingTop: 8, borderTop: "1px dashed var(--erp-border)" }}>
                  <div><span style={{ color: "var(--erp-muted-2)" }}>Project:</span> <strong style={{ color: "var(--erp-text)" }}>{cp?.bridgeName ?? "—"}</strong></div>
                  <div><span style={{ color: "var(--erp-muted-2)" }}>Task:</span> {ct?.name ?? "—"}</div>
                </div>
              </div>
            );
          })}
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
