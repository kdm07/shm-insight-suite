import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Calendar, User, Building2, FileText, Download } from "lucide-react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { ErpShell } from "@/components/erp/Shell";
import { StatusBadge, PriorityBadge, ProgressBar } from "@/components/erp/Badges";
import { WorkflowStepper } from "@/components/erp/WorkflowStepper";
import { projects, tasks, documents, activities, getClient, getEmployee } from "@/data/mock";

export const Route = createFileRoute("/projects/$id")({
  loader: ({ params }) => {
    const p = projects.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { project: p };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.project.bridgeName ?? "Project"} — KDM SHM ERP` }],
  }),
  component: ProjectDetail,
  notFoundComponent: () => (
    <ErpShell crumbs={[{ label: "Projects", to: "/projects" }, { label: "Not found" }]}>
      <div className="erp-card"><div className="erp-card-body">Project not found.</div></div>
    </ErpShell>
  ),
});

function ProjectDetail() {
  const { project: p } = Route.useLoaderData();
  const client = getClient(p.clientId);
  const manager = getEmployee(p.managerId);
  const instrHod = getEmployee(p.instrumentationHodId);
  const numHod = getEmployee(p.numericalHodId);
  const projectTasks = tasks.filter((t) => t.projectId === p.id);
  const projectDocs = documents.filter((d) => d.projectId === p.id);
  const [tab, setTab] = useState("overview");

  const healthCls = p.health === "Good" ? "good" : p.health === "At Risk" ? "risk" : "critical";

  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Projects", to: "/projects" }, { label: p.code }]}>
      <div className="page-header">
        <div>
          <div className="hstack-12">
            <h1 className="page-title">{p.bridgeName}</h1>
            <StatusBadge status={p.status} />
            <PriorityBadge priority={p.priority} />
            <span className={`erp-health ${healthCls}`}><span className="erp-health-dot" /> {p.health}</span>
          </div>
          <div className="page-sub">{p.code} · {p.name}</div>
        </div>
        <div className="hstack-8">
          <button className="erp-btn erp-btn-outline">Export</button>
          <button className="erp-btn erp-btn-primary">Edit Project</button>
        </div>
      </div>

      <div className="erp-card" style={{ marginBottom: 20 }}>
        <div className="erp-card-header"><h3 className="erp-card-title">Project Workflow</h3></div>
        <div className="erp-card-body"><WorkflowStepper current={p.workflowStep} /></div>
      </div>

      <div className="erp-grid erp-grid-3" style={{ marginBottom: 20 }}>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Bridge Information</h3></div>
          <div className="erp-card-body vstack-4">
            <div className="hstack-8"><Building2 size={16} className="text-muted-erp" /><strong>{p.bridgeName}</strong></div>
            <div className="hstack-8"><MapPin size={16} className="text-muted-erp" /><span>{p.location}</span></div>
            <div style={{ fontSize: 13, color: "var(--erp-muted)", marginTop: 8 }}>{p.description}</div>
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Client</h3></div>
          <div className="erp-card-body vstack-4">
            <div style={{ fontWeight: 600 }}>{client?.name}</div>
            <div style={{ fontSize: 12, color: "var(--erp-muted)" }}>Contact: {client?.contactPerson}</div>
            <div style={{ fontSize: 12 }}>{client?.email}</div>
            <div style={{ fontSize: 12 }}>{client?.phone}</div>
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Project Statistics</h3></div>
          <div className="erp-card-body vstack-4">
            <div className="hstack-8" style={{ justifyContent: "space-between" }}><span>Progress</span><strong>{p.progress}%</strong></div>
            <ProgressBar value={p.progress} tone={p.status === "Delayed" ? "danger" : "primary"} />
            <div className="hstack-8" style={{ justifyContent: "space-between", marginTop: 6 }}><span>Tasks</span><strong>{projectTasks.length}</strong></div>
            <div className="hstack-8" style={{ justifyContent: "space-between" }}><span>Documents</span><strong>{projectDocs.length}</strong></div>
            <div className="hstack-8" style={{ justifyContent: "space-between" }}><span>Duration</span><strong style={{ fontSize: 12 }}>{p.startDate} → {p.endDate}</strong></div>
          </div>
        </div>
      </div>

      <div className="erp-card">
        <Nav tabs style={{ padding: "0 16px" }}>
          {["overview", "instrumentation", "numerical", "tasks", "documents", "activity"].map((k) => (
            <NavItem key={k}>
              <NavLink active={tab === k} onClick={() => setTab(k)} style={{ cursor: "pointer", textTransform: "capitalize" }}>
                {k === "instrumentation" ? "Instrumentation Team" : k === "numerical" ? "Numerical Team" : k}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <TabContent activeTab={tab} style={{ padding: 20 }}>
          <TabPane tabId="overview">
            <div className="erp-grid erp-grid-2">
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Project Manager</h4>
                <div className="hstack-12">
                  <img src={manager?.photo} className="avatar-md" alt="" />
                  <div><div style={{ fontWeight: 600 }}>{manager?.name}</div><div style={{ fontSize: 12, color: "var(--erp-muted)" }}>{manager?.designation}</div></div>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Timeline</h4>
                <div className="hstack-8"><Calendar size={16} /><span>{p.startDate} — {p.endDate}</span></div>
              </div>
            </div>
          </TabPane>
          <TabPane tabId="instrumentation">
            <TeamPane title="Instrumentation" hod={instrHod} engineerIds={p.instrumentationEngineers} />
          </TabPane>
          <TabPane tabId="numerical">
            <TeamPane title="Numerical" hod={numHod} engineerIds={p.numericalEngineers} />
          </TabPane>
          <TabPane tabId="tasks">
            <table className="erp-table">
              <thead><tr><th>Task</th><th>Team</th><th>Assignee</th><th>Status</th><th>Due</th><th>Progress</th></tr></thead>
              <tbody>
                {projectTasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.name}</td><td style={{ fontSize: 12 }}>{t.team}</td>
                    <td style={{ fontSize: 12 }}>{getEmployee(t.assigneeId)?.name}</td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td style={{ fontSize: 12 }}>{t.dueDate}</td>
                    <td style={{ minWidth: 120 }}><ProgressBar value={t.progress} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabPane>
          <TabPane tabId="documents">
            <div className="erp-grid erp-grid-2">
              {projectDocs.map((d) => (
                <div key={d.id} className="erp-doc-card">
                  <div className="erp-doc-thumb"><FileText size={20} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{d.type} · {d.size} · {d.uploadedAt}</div>
                    <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>By {d.uploadedBy}</div>
                  </div>
                  <button className="erp-btn erp-btn-ghost" title="Download"><Download size={16} /></button>
                </div>
              ))}
              {projectDocs.length === 0 && <div style={{ color: "var(--erp-muted)" }}>No documents yet.</div>}
            </div>
          </TabPane>
          <TabPane tabId="activity">
            <div className="erp-timeline">
              {activities.filter((a) => a.projectId === p.id).map((a) => (
                <div key={a.id} className="erp-timeline-item">
                  <div className="erp-timeline-text"><strong>{a.actor}</strong> {a.action}</div>
                  <div className="erp-timeline-time">{a.time}</div>
                </div>
              ))}
              {activities.filter((a) => a.projectId === p.id).length === 0 && <div style={{ color: "var(--erp-muted)" }}>No activity yet.</div>}
            </div>
          </TabPane>
        </TabContent>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link to="/projects" className="erp-btn erp-btn-ghost">← Back to projects</Link>
      </div>
    </ErpShell>
  );
}

function TeamPane({ title, hod, engineerIds }: { title: string; hod: ReturnType<typeof getEmployee>; engineerIds: string[] }) {
  return (
    <div>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{title} — HOD</h4>
      {hod && (
        <div className="hstack-12" style={{ marginBottom: 20 }}>
          <img src={hod.photo} className="avatar-md" alt="" />
          <div>
            <div style={{ fontWeight: 600 }}>{hod.name}</div>
            <div style={{ fontSize: 12, color: "var(--erp-muted)" }}>{hod.designation} · {hod.email}</div>
          </div>
        </div>
      )}
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Engineers</h4>
      <div className="erp-grid erp-grid-3">
        {engineerIds.map((id) => {
          const e = getEmployee(id);
          if (!e) return null;
          return (
            <div key={id} className="erp-card">
              <div className="erp-card-body hstack-12">
                <img src={e.photo} className="avatar-md" alt="" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{e.designation}</div>
                  <div style={{ fontSize: 11, color: "var(--erp-muted)" }}><User size={11} /> {e.availability}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
