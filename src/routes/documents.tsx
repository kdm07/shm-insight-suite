import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Upload, Image as ImageIcon, FileType2, Layers } from "lucide-react";
import { ErpShell } from "@/components/erp/Shell";
import { documents, getProject } from "@/data/mock";

const icons = {
  Report: FileText, Drawing: Layers, "Site Photo": ImageIcon,
  "Sensor Layout": Layers, PDF: FileType2,
} as const;

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Documents — KDM SHM ERP" }] }),
  component: () => (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Documents" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <div className="page-sub">{documents.length} project documents · reports, drawings, sensor layouts</div>
        </div>
        <button className="erp-btn erp-btn-primary"><Upload size={14} /> Upload</button>
      </div>
      <div className="erp-grid erp-grid-2">
        {documents.map((d) => {
          const Icon = icons[d.type];
          return (
            <div key={d.id} className="erp-doc-card">
              <div className="erp-doc-thumb"><Icon size={20} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</div>
                <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>
                  <span className="erp-badge erp-badge-muted" style={{ marginRight: 6 }}>{d.type}</span>
                  {d.size} · {d.uploadedAt}
                </div>
                <div style={{ fontSize: 11, color: "var(--erp-muted)", marginTop: 2 }}>
                  {getProject(d.projectId)?.bridgeName} · uploaded by {d.uploadedBy}
                </div>
              </div>
              <button className="erp-btn erp-btn-ghost" title="Download"><Download size={16} /></button>
            </div>
          );
        })}
      </div>
    </ErpShell>
  ),
});
