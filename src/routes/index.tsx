import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import {
  FolderKanban, Play, CheckCircle2, AlertTriangle, ListChecks,
  Users, Clock, TrendingUp, Bell,
} from "lucide-react";
import { ErpShell } from "@/components/erp/Shell";
import { KPICard } from "@/components/erp/KPICard";
import { StatusBadge, PriorityBadge, ProgressBar } from "@/components/erp/Badges";
import { projects, tasks, employees, activities, notifications, getClient } from "@/data/mock";

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
  const running = projects.filter((p) => p.status === "Running").length;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const delayed = projects.filter((p) => p.status === "Delayed").length;
  const todayTasks = tasks.filter((t) => t.status !== "Completed").slice(0, 12).length;
  const working = employees.filter((e) => e.availability === "Busy").length;
  const pendingApprovals = tasks.filter((t) => t.status === "Waiting Review").length;
  const avgProgress = Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length);

  const statusData = [
    { name: "Planning", value: projects.filter((p) => p.status === "Planning").length },
    { name: "Running", value: running },
    { name: "Review", value: projects.filter((p) => p.status === "Review").length },
    { name: "Completed", value: completed },
    { name: "Delayed", value: delayed },
  ];
  const monthly = [
    { m: "Jul", started: 2, completed: 1 }, { m: "Aug", started: 3, completed: 2 },
    { m: "Sep", started: 2, completed: 3 }, { m: "Oct", started: 4, completed: 2 },
    { m: "Nov", started: 3, completed: 4 }, { m: "Dec", started: 2, completed: 3 },
  ];
  const workload = [
    { team: "Instrumentation", tasks: tasks.filter((t) => t.team === "Instrumentation").length },
    { team: "Numerical", tasks: tasks.filter((t) => t.team === "Numerical").length },
  ];
  const progressLine = projects.slice(0, 8).map((p) => ({ n: p.code.slice(-3), progress: p.progress }));

  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Dashboard" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <div className="page-sub">Live overview of Structural Health Monitoring portfolio</div>
        </div>
        <Link to="/projects" className="erp-btn erp-btn-primary">View all projects</Link>
      </div>

      <div className="erp-grid erp-grid-4" style={{ marginBottom: 20 }}>
        <KPICard label="Total Projects" value={total} delta="+2 this month" icon={FolderKanban} tone="primary" />
        <KPICard label="Running" value={running} delta="On track" icon={Play} tone="primary" />
        <KPICard label="Completed" value={completed} delta="+1 this month" icon={CheckCircle2} tone="success" />
        <KPICard label="Delayed" value={delayed} delta="Requires attention" icon={AlertTriangle} tone="danger" />
      </div>
      <div className="erp-grid erp-grid-4" style={{ marginBottom: 20 }}>
        <KPICard label="Today's Tasks" value={todayTasks} icon={ListChecks} tone="warning" />
        <KPICard label="Employees Working" value={working} icon={Users} tone="primary" />
        <KPICard label="Pending Approvals" value={pendingApprovals} icon={Clock} tone="warning" />
        <KPICard label="Avg Completion" value={`${avgProgress}%`} icon={TrendingUp} tone="success" />
      </div>

      <div className="erp-grid erp-grid-2" style={{ marginBottom: 20 }}>
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
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Monthly Projects</h3></div>
          <div className="erp-card-body" style={{ height: 280 }}>
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
      </div>

      <div className="erp-grid erp-grid-2" style={{ marginBottom: 20 }}>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Team Workload</h3></div>
          <div className="erp-card-body" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workload} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="team" type="category" tick={{ fontSize: 12 }} width={110} />
                <Tooltip />
                <Bar dataKey="tasks" fill="#2563EB" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Project Progress (%)</h3></div>
          <div className="erp-card-body" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressLine}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="n" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="progress" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
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
          <div className="erp-card-header"><h3 className="erp-card-title">Upcoming Deadlines</h3></div>
          <div className="erp-card-body">
            {projects.filter((p) => p.status !== "Completed").slice(0, 5).map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--erp-border)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.bridgeName}</div>
                  <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{p.code}</div>
                </div>
                <div style={{ fontSize: 12, color: "var(--erp-muted)", textAlign: "right" }}>
                  <div>{p.endDate}</div>
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

      <div className="erp-grid erp-grid-2">
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Recent Projects</h3></div>
          <div style={{ overflowX: "auto" }}>
            <table className="erp-table">
              <thead><tr><th>Code</th><th>Bridge</th><th>Client</th><th>Status</th><th>Progress</th></tr></thead>
              <tbody>
                {projects.slice(0, 6).map((p) => (
                  <tr key={p.id}>
                    <td><Link to="/projects/$id" params={{ id: p.id }}>{p.code}</Link></td>
                    <td>{p.bridgeName}</td>
                    <td style={{ fontSize: 12 }}>{getClient(p.clientId)?.name}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td style={{ minWidth: 120 }}><ProgressBar value={p.progress} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Recent Tasks</h3></div>
          <div style={{ overflowX: "auto" }}>
            <table className="erp-table">
              <thead><tr><th>Task</th><th>Team</th><th>Priority</th><th>Due</th></tr></thead>
              <tbody>
                {tasks.slice(0, 6).map((t) => (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td style={{ fontSize: 12 }}>{t.team}</td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td style={{ fontSize: 12 }}>{t.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ErpShell>
  );
}
