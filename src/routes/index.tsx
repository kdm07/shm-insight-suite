import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  FolderKanban, CheckCircle2, AlertTriangle,
  MapPin, ClipboardList, Cpu, Gauge, LineChart, FileText, Send, Bell, AlertOctagon,
} from "lucide-react";
import { ErpShell } from "@/components/erp/Shell";
import { KPICard } from "@/components/erp/KPICard";
import { StatusBadge, PriorityBadge, ProgressBar, HealthBadge, TeamBadge, StageBadge } from "@/components/erp/Badges";
import { projects, tasks, employees, activities, notifications, getClient, getEmployee, teamStats, workflowSteps, TODAY_ISO } from "@/data/mock";
import type { ProjectStage } from "@/lib/erp-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — KDM SHM ERP" },
      { name: "description", content: "Executive dashboard for SHM project portfolio." },
    ],
  }),
  component: Dashboard,
});

const COLORS = ["#2563EB", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9"];

function Dashboard() {
  const total = projects.length;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const delayed = projects.filter((p) => p.status === "Delayed").length;

  const byStage = (s: ProjectStage) => projects.filter((p) => p.stage === s).length;
  const stageKpis: { label: string; count: number; icon: typeof MapPin; tone: "primary" | "success" | "warning" | "danger" | "muted" }[] = [
    { label: "In Site Visit", count: byStage("Site Visit"), icon: MapPin, tone: "primary" },
    { label: "In Methodology", count: byStage("Methodology Preparation"), icon: ClipboardList, tone: "primary" },
    { label: "In Sensor Installation", count: byStage("Sensor Installation") + byStage("Sensor Validation"), icon: Cpu, tone: "primary" },
    { label: "In Load Testing", count: byStage("Load Testing"), tone: "warning", icon: Gauge },
    { label: "In Numerical Analysis", count: byStage("Numerical Analysis"), icon: LineChart, tone: "primary" },
    { label: "In Report Preparation", count: byStage("Report Preparation"), icon: FileText, tone: "warning" },
    { label: "Completed", count: completed, icon: CheckCircle2, tone: "success" },
    { label: "Delayed Projects", count: delayed, icon: AlertTriangle, tone: "danger" },
  ];

  const statusData = [
    { name: "Planning", value: projects.filter((p) => p.status === "Planning").length },
    { name: "Running", value: projects.filter((p) => p.status === "Running").length },
    { name: "Review", value: projects.filter((p) => p.status === "Review").length },
    { name: "Completed", value: completed },
    { name: "Delayed", value: delayed },
  ];
  const monthly = [
    { m: "Jul", started: 2, completed: 1 }, { m: "Aug", started: 3, completed: 2 },
    { m: "Sep", started: 2, completed: 3 }, { m: "Oct", started: 4, completed: 2 },
    { m: "Nov", started: 3, completed: 4 }, { m: "Dec", started: 2, completed: 3 },
  ];

  // Critical projects (delayed / blocked)
  const criticalProjects = projects.filter((p) => p.health === "Delayed" || p.health === "Blocked" || p.status === "Delayed");

  // Current responsibility snapshot — who is holding what right now
  const activeProjects = projects.filter((p) => p.status !== "Completed");

  const instr = teamStats("Instrumentation");
  const num = teamStats("Numerical");

  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Dashboard" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <div className="page-sub">Live overview of SHM project pipeline across Indian Railway bridges</div>
        </div>
        <Link to="/projects" className="erp-btn erp-btn-primary">View all projects</Link>
      </div>

      {/* Portfolio totals */}
      <div className="erp-grid erp-grid-4" style={{ marginBottom: 20 }}>
        <KPICard label="Total Projects" value={total} delta="Active portfolio" icon={FolderKanban} tone="primary" />
        <KPICard label="In Progress" value={activeProjects.length} delta={`${activeProjects.length} live`} icon={Send} tone="primary" />
        <KPICard label="Completed" value={completed} delta="Submitted to client" icon={CheckCircle2} tone="success" />
        <KPICard label="Delayed" value={delayed} delta="Requires MD attention" icon={AlertTriangle} tone="danger" />
      </div>

      {/* Projects by SHM workflow stage */}
      <div className="erp-card" style={{ marginBottom: 20 }}>
        <div className="erp-card-header">
          <h3 className="erp-card-title">Projects by SHM Workflow Stage</h3>
          <div className="erp-card-sub">Live count across our end-to-end monitoring process</div>
        </div>
        <div className="erp-card-body">
          <div className="erp-grid erp-grid-4" style={{ marginBottom: 12 }}>
            {stageKpis.slice(0, 4).map((k) => (
              <KPICard key={k.label} label={k.label} value={k.count} icon={k.icon} tone={k.tone} />
            ))}
          </div>
          <div className="erp-grid erp-grid-4">
            {stageKpis.slice(4).map((k) => (
              <KPICard key={k.label} label={k.label} value={k.count} icon={k.icon} tone={k.tone} />
            ))}
          </div>
        </div>
      </div>

      {/* Current responsibility */}
      <div className="erp-grid erp-grid-2" style={{ marginBottom: 20 }}>
        <div className="erp-card">
          <div className="erp-card-header">
            <h3 className="erp-card-title">Current Responsible Team</h3>
            <span className="erp-card-sub">{activeProjects.length} active projects</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="erp-table">
              <thead><tr><th>Bridge</th><th>Stage</th><th>Team</th><th>Waiting For</th></tr></thead>
              <tbody>
                {activeProjects.slice(0, 8).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link to="/projects/$id" params={{ id: p.id }}>{p.bridgeName}</Link>
                      <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{p.code}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>{p.stage}</td>
                    <td><TeamBadge team={p.responsibleTeam} /></td>
                    <td style={{ fontSize: 12, color: "var(--erp-muted)" }}>{p.waitingFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="erp-card">
          <div className="erp-card-header">
            <h3 className="erp-card-title">Current Responsible Engineer</h3>
            <span className="erp-card-sub">Point-of-contact for each live project</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="erp-table">
              <thead><tr><th>Bridge</th><th>Engineer</th><th>Next Stage</th></tr></thead>
              <tbody>
                {activeProjects.slice(0, 8).map((p) => {
                  const eng = getEmployee(p.currentEngineerId);
                  return (
                    <tr key={p.id}>
                      <td>
                        <Link to="/projects/$id" params={{ id: p.id }}>{p.bridgeName}</Link>
                        <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{p.code}</div>
                      </td>
                      <td>
                        <div className="hstack-8">
                          {eng && <img src={eng.photo} className="avatar-sm" alt="" />}
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{eng?.name ?? "—"}</div>
                            <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{eng?.designation}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 12 }}>{p.nextStage}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="erp-grid erp-grid-2" style={{ marginBottom: 20 }}>
        {/* Critical Projects widget */}
        <div className="erp-card">
          <div className="erp-card-header">
            <h3 className="erp-card-title"><AlertOctagon size={14} style={{ verticalAlign: "-2px", marginRight: 6, color: "var(--erp-danger)" }} />Critical Projects</h3>
            <span className="erp-badge erp-badge-danger">{criticalProjects.length}</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="erp-table">
              <thead><tr><th>Bridge</th><th>Stage</th><th>Responsible</th><th>Health</th><th>Delay</th></tr></thead>
              <tbody>
                {criticalProjects.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--erp-muted)" }}>No critical projects</td></tr>
                )}
                {criticalProjects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link to="/projects/$id" params={{ id: p.id }}>{p.bridgeName}</Link>
                      <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{p.code}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>{p.stage}</td>
                    <td><TeamBadge team={p.responsibleTeam} /></td>
                    <td><HealthBadge health={p.health} /></td>
                    <td style={{ fontSize: 12, color: "var(--erp-danger)", fontWeight: 600 }}>{p.delayDays > 0 ? `+${p.delayDays}d` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Project Status Distribution</h3></div>
          <div className="erp-card-body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Workload cards */}
      <div className="erp-grid erp-grid-2" style={{ marginBottom: 20 }}>
        {[
          { team: "Instrumentation" as const, s: instr },
          { team: "Numerical" as const, s: num },
        ].map(({ team, s }) => (
          <div key={team} className="erp-card">
            <div className="erp-card-header">
              <h3 className="erp-card-title">{team} — Team Workload</h3>
              <TeamBadge team={team} />
            </div>
            <div className="erp-card-body">
              <div className="erp-grid erp-grid-4" style={{ marginBottom: 14 }}>
                <MiniStat label="Current Projects" value={s.currentProjects.length} />
                <MiniStat label="Members" value={s.members.length} />
                <MiniStat label="Pending Tasks" value={s.pendingTasks} />
                <MiniStat label="Task Completion" value={`${s.completionPct}%`} />
              </div>
              <div style={{ fontSize: 11, color: "var(--erp-muted)", marginBottom: 6 }}>Task completion</div>
              <ProgressBar value={s.completionPct} tone={s.completionPct > 60 ? "success" : "warning"} />
            </div>
          </div>
        ))}
      </div>

      <div className="erp-grid erp-grid-2" style={{ marginBottom: 20 }}>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Monthly Projects</h3></div>
          <div className="erp-card-body" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="m" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="started" fill="#2563EB" radius={[6, 6, 0, 0]} />
                <Bar dataKey="completed" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Pipeline by Workflow Stage</h3></div>
          <div className="erp-card-body" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workflowSteps.map((s) => ({ s, n: projects.filter((p) => p.stage === s).length }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="s" tick={{ fontSize: 9 }} interval={0} angle={-25} textAnchor="end" height={90} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="n" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="erp-grid erp-grid-3" style={{ marginBottom: 20 }}>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Recent Activity</h3></div>
          <div className="erp-card-body">
            <div className="erp-timeline">
              {activities.slice(0, 6).map((a) => (
                <div key={a.id} className="erp-timeline-item">
                  <div className="erp-timeline-text"><strong>{a.actor}</strong> {a.action}</div>
                  <div className="erp-timeline-time">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Upcoming Report Submissions</h3></div>
          <div className="erp-card-body">
            {projects.filter((p) => p.status !== "Completed").slice(0, 5).map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--erp-border)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.bridgeName}</div>
                  <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{p.code}</div>
                </div>
                <div style={{ fontSize: 12, color: "var(--erp-muted)", textAlign: "right" }}>
                  <div>{p.expectedCompletion}</div>
                  <PriorityBadge priority={p.priority} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-card-header">
            <h3 className="erp-card-title">Notifications</h3>
            <Link to="/notifications" style={{ fontSize: 12, color: "var(--erp-primary)", textDecoration: "none" }}>View all</Link>
          </div>
          <div className="erp-card-body" style={{ padding: 0 }}>
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className={`erp-notification-item ${!n.read ? "unread" : ""}`}>
                <div className="erp-noti-icon"><Bell size={16} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: "var(--erp-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: "var(--erp-muted-2)", marginTop: 2 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header"><h3 className="erp-card-title">Recent Projects</h3></div>
        <div style={{ overflowX: "auto" }}>
          <table className="erp-table">
            <thead><tr><th>Code</th><th>Bridge</th><th>Client</th><th>Stage</th><th>Status</th><th>Health</th><th>Progress</th></tr></thead>
            <tbody>
              {projects.slice(0, 6).map((p) => (
                <tr key={p.id}>
                  <td><Link to="/projects/$id" params={{ id: p.id }}>{p.code}</Link></td>
                  <td>{p.bridgeName}</td>
                  <td style={{ fontSize: 12 }}>{getClient(p.clientId)?.name}</td>
                  <td style={{ fontSize: 12 }}>{p.stage}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td><HealthBadge health={p.health} /></td>
                  <td style={{ minWidth: 120 }}><ProgressBar value={p.progress} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ErpShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ padding: 12, background: "var(--erp-bg)", borderRadius: 10 }}>
      <div style={{ fontSize: 10, color: "var(--erp-muted)", textTransform: "uppercase", letterSpacing: ".3px", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}
// StageBadge and tasks import kept for future use
void StageBadge; void tasks;
