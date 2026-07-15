import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { ErpShell } from "@/components/erp/Shell";
import { StatusBadge, HealthBadge, ProgressBar } from "@/components/erp/Badges";
import { clients, clientStats, projectsForClient } from "@/data/mock";

export const Route = createFileRoute("/clients/$id")({
  loader: ({ params }) => {
    const c = clients.find((x) => x.id === params.id);
    if (!c) throw notFound();
    return { client: c };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.client.name ?? "Client"} — KDM SHM ERP` }] }),
  component: ClientDetail,
  notFoundComponent: () => (
    <ErpShell crumbs={[{ label: "Clients", to: "/clients" }, { label: "Not found" }]}>
      <div className="erp-card"><div className="erp-card-body">Client not found.</div></div>
    </ErpShell>
  ),
});

function ClientDetail() {
  const { client: c } = Route.useLoaderData();
  const s = clientStats(c.id);
  const list = projectsForClient(c.id);
  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Clients", to: "/clients" }, { label: c.name }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{c.name}</h1>
          <div className="page-sub">{c.id}</div>
        </div>
        <Link to="/clients" className="erp-btn erp-btn-ghost">← Back</Link>
      </div>

      <div className="erp-grid erp-grid-3" style={{ marginBottom: 20 }}>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Client Details</h3></div>
          <div className="erp-card-body vstack-4">
            <div className="hstack-8"><Building2 size={14} /><strong>{c.name}</strong></div>
            <div className="hstack-8"><MapPin size={14} /> {c.location}</div>
            <div className="hstack-8"><Mail size={14} /> {c.email}</div>
            <div className="hstack-8"><Phone size={14} /> {c.phone}</div>
            <div style={{ fontSize: 12, color: "var(--erp-muted)", marginTop: 6 }}>Contact: <strong style={{ color: "var(--erp-text)" }}>{c.contactPerson}</strong></div>
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Engagement</h3></div>
          <div className="erp-card-body">
            <div className="erp-grid erp-grid-2">
              <Stat label="Active Projects" value={s.active} />
              <Stat label="Completed" value={s.completed} />
              <Stat label="Total" value={s.total} />
              <Stat label="Last Project" value={s.last ? s.last.bridgeName : "—"} small />
            </div>
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Notes</h3></div>
          <div className="erp-card-body" style={{ fontSize: 13, color: "var(--erp-muted)" }}>
            Long-term Indian Railway partner engaged in Structural Health Monitoring for critical bridges across the zone.
          </div>
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header"><h3 className="erp-card-title">Projects</h3></div>
        <div style={{ overflowX: "auto" }}>
          <table className="erp-table">
            <thead><tr><th>Code</th><th>Bridge</th><th>Stage</th><th>Status</th><th>Health</th><th>Progress</th><th>End Date</th></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td><Link to="/projects/$id" params={{ id: p.id }}>{p.code}</Link></td>
                  <td>{p.bridgeName}</td>
                  <td style={{ fontSize: 12 }}>{p.stage}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td><HealthBadge health={p.health} /></td>
                  <td style={{ minWidth: 140 }}><ProgressBar value={p.progress} /></td>
                  <td style={{ fontSize: 12 }}>{p.endDate}</td>
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--erp-muted)" }}>No projects</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </ErpShell>
  );
}
function Stat({ label, value, small }: { label: string; value: string | number; small?: boolean }) {
  return (
    <div style={{ padding: 12, background: "var(--erp-bg)", borderRadius: 10 }}>
      <div style={{ fontSize: 11, color: "var(--erp-muted)", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: small ? 13 : 20, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}
