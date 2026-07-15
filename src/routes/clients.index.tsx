import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { ErpShell } from "@/components/erp/Shell";
import { clients, clientStats } from "@/data/mock";

export const Route = createFileRoute("/clients/")({
  head: () => ({ meta: [{ title: "Clients — KDM SHM ERP" }] }),
  component: () => (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Clients" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clients</h1>
          <div className="page-sub">{clients.length} client organizations</div>
        </div>
        <button className="erp-btn erp-btn-primary">+ Add Client</button>
      </div>
      <div className="erp-grid erp-grid-3">
        {clients.map((c) => {
          const s = clientStats(c.id);
          return (
            <Link key={c.id} to="/clients/$id" params={{ id: c.id }} className="erp-card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="erp-card-body">
                <div className="hstack-12" style={{ marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(37,99,235,.1)", color: "var(--erp-primary)", display: "grid", placeItems: "center" }}>
                    <Building2 size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{c.id}</div>
                  </div>
                </div>
                <div className="vstack-4" style={{ fontSize: 12, color: "var(--erp-muted)" }}>
                  <div>Contact: <strong style={{ color: "var(--erp-text)" }}>{c.contactPerson}</strong></div>
                  <div className="hstack-8"><Mail size={12} /> {c.email}</div>
                  <div className="hstack-8"><Phone size={12} /> {c.phone}</div>
                  <div className="hstack-8"><MapPin size={12} /> {c.location}</div>
                </div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--erp-border)", display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="erp-badge erp-badge-primary">{s.active} active</span>
                  <span className="erp-badge erp-badge-success">{s.completed} completed</span>
                </div>
                {s.last && (
                  <div style={{ fontSize: 11, color: "var(--erp-muted)", marginTop: 8 }}>
                    Last project: <strong style={{ color: "var(--erp-text)" }}>{s.last.bridgeName}</strong>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </ErpShell>
  ),
});
