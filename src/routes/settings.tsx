import { createFileRoute } from "@tanstack/react-router";
import { ErpShell } from "@/components/erp/Shell";

const roles = ["Admin", "Managing Director", "Project Manager", "Instrumentation HOD", "Numerical HOD", "Instrumentation Engineer", "Numerical Engineer", "Viewer"];

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — KDM SHM ERP" }] }),
  component: () => (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Settings" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <div className="page-sub">Company profile, preferences and role management</div>
        </div>
      </div>

      <div className="erp-grid erp-grid-2" style={{ marginBottom: 20 }}>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">Company Profile</h3></div>
          <div className="erp-card-body vstack-4">
            <Field label="Company Name" value="KDM Structural Health Monitoring Pvt. Ltd." />
            <Field label="Industry" value="Civil Infrastructure Monitoring" />
            <Field label="Headquarters" value="Bengaluru, Karnataka, India" />
            <Field label="Registered Since" value="2014" />
            <Field label="Support Email" value="ops@kdmshm.com" />
          </div>
        </div>
        <div className="erp-card">
          <div className="erp-card-header"><h3 className="erp-card-title">User Preferences</h3></div>
          <div className="erp-card-body vstack-4">
            <Row label="Theme"><span className="erp-badge erp-badge-primary">Light</span></Row>
            <Row label="Language"><select className="form-select form-select-sm" style={{ maxWidth: 200 }}><option>English (India)</option><option>हिन्दी</option></select></Row>
            <Row label="Timezone"><select className="form-select form-select-sm" style={{ maxWidth: 200 }}><option>Asia/Kolkata (IST)</option></select></Row>
            <Row label="Email notifications"><input type="checkbox" defaultChecked className="form-check-input" /></Row>
            <Row label="Desktop notifications"><input type="checkbox" defaultChecked className="form-check-input" /></Row>
          </div>
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card-header"><h3 className="erp-card-title">Role Management</h3></div>
        <div style={{ overflowX: "auto" }}>
          <table className="erp-table">
            <thead><tr><th>Role</th><th>Access Level</th><th>Permissions</th><th></th></tr></thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r}>
                  <td style={{ fontWeight: 600 }}>{r}</td>
                  <td><span className="erp-badge erp-badge-primary">{r === "Admin" || r === "Managing Director" ? "Full" : r === "Viewer" ? "Read-only" : "Scoped"}</span></td>
                  <td style={{ fontSize: 12, color: "var(--erp-muted)" }}>Projects, Tasks, Documents, Reports</td>
                  <td><button className="erp-btn erp-btn-outline">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ErpShell>
  ),
});

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--erp-muted)", textTransform: "uppercase", letterSpacing: ".3px", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 14, marginTop: 2 }}>{value}</div>
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="hstack-8" style={{ justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--erp-border)" }}>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
      <div>{children}</div>
    </div>
  );
}
