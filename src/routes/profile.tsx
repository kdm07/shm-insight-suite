import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Award } from "lucide-react";
import { ErpShell } from "@/components/erp/Shell";
import { ProgressBar } from "@/components/erp/Badges";
import { employees, projects } from "@/data/mock";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — KDM SHM ERP" }] }),
  component: () => {
    const me = employees[0];
    const myProjects = projects.slice(0, 6);
    return (
      <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Profile" }]}>
        <div className="erp-card" style={{ marginBottom: 20 }}>
          <div className="erp-card-body hstack-12" style={{ gap: 20 }}>
            <img src={me.photo} className="avatar-lg" alt="" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{me.name}</div>
              <div style={{ color: "var(--erp-muted)" }}>{me.designation} · {me.department}</div>
              <div className="hstack-12" style={{ marginTop: 8, fontSize: 13, color: "var(--erp-muted)" }}>
                <span className="hstack-8"><Mail size={14} /> {me.email}</span>
                <span className="hstack-8"><Phone size={14} /> {me.phone}</span>
                <span className="hstack-8"><Award size={14} /> {me.completedProjects} completed</span>
              </div>
            </div>
            <button className="erp-btn erp-btn-outline">Edit Profile</button>
          </div>
        </div>

        <div className="erp-grid erp-grid-3" style={{ marginBottom: 20 }}>
          <Stat label="Current Workload" value={`${myProjects.length} projects`} />
          <Stat label="Completed" value={me.completedProjects} />
          <Stat label="Performance" value={`${me.performance}%`} />
        </div>

        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Recent Projects</h3></div>
          <div className="erp-card-body vstack-4">
            {myProjects.map((p) => (
              <div key={p.id} style={{ padding: "10px 0", borderBottom: "1px solid var(--erp-border)" }}>
                <div className="hstack-8" style={{ justifyContent: "space-between" }}>
                  <div><div style={{ fontWeight: 600 }}>{p.bridgeName}</div><div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{p.code}</div></div>
                  <div style={{ fontSize: 12, color: "var(--erp-muted)" }}>{p.progress}%</div>
                </div>
                <ProgressBar value={p.progress} />
              </div>
            ))}
          </div>
        </div>
      </ErpShell>
    );
  },
});

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="erp-card">
      <div className="erp-card-body">
        <div style={{ fontSize: 11, color: "var(--erp-muted)", textTransform: "uppercase", letterSpacing: ".3px", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{value}</div>
      </div>
    </div>
  );
}
