import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileText, Download, Upload, Image as ImageIcon, FileType2, Layers, Calculator } from "lucide-react";
import { ErpShell } from "@/components/erp/Shell";
import { documents, getProject } from "@/data/mock";
import type { DocCategory } from "@/lib/erp-types";

const icons: Record<DocCategory, typeof FileText> = {
  Reports: FileText,
  Drawings: Layers,
  Photos: ImageIcon,
  "Sensor Layouts": FileType2,
  Calculations: Calculator,
};

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Documents — KDM SHM ERP" }] }),
  component: DocumentsPage,
});

const categories: (DocCategory | "All")[] = ["All", "Reports", "Drawings", "Photos", "Sensor Layouts", "Calculations"];

function DocumentsPage() {
  const [cat, setCat] = useState<DocCategory | "All">("All");
  const filtered = useMemo(() => cat === "All" ? documents : documents.filter((d) => d.category === cat), [cat]);
  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Documents" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <div className="page-sub">{filtered.length} of {documents.length} documents · versioned & approved</div>
        </div>
        <button className="erp-btn erp-btn-primary"><Upload size={14} /> Upload</button>
      </div>

      <div className="erp-card" style={{ marginBottom: 16 }}>
        <div className="erp-card-body" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map((c) => (
            <button key={c} className={`erp-btn ${cat === c ? "erp-btn-primary" : "erp-btn-outline"}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="erp-grid erp-grid-2">
        {filtered.map((d) => {
          const Icon = icons[d.category];
          return (
            <div key={d.id} className="erp-doc-card">
              <div className="erp-doc-thumb"><Icon size={20} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</div>
                <div style={{ fontSize: 11, color: "var(--erp-muted)", marginTop: 2 }}>
                  <span className="erp-badge erp-badge-muted" style={{ marginRight: 6 }}>{d.category}</span>
                  <span className="erp-badge erp-badge-info" style={{ marginRight: 6 }}>{d.version}</span>
                  <span className="erp-badge erp-badge-primary">{d.department}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--erp-muted)", marginTop: 4 }}>
                  {getProject(d.projectId)?.bridgeName} · {d.size} · {d.uploadedAt}
                </div>
                <div style={{ fontSize: 11, color: "var(--erp-muted)" }}>
                  Uploaded by {d.uploadedBy} · Approved by <strong style={{ color: "var(--erp-text)" }}>{d.approvedBy}</strong>
                </div>
              </div>
              <button className="erp-btn erp-btn-ghost" title="Download"><Download size={16} /></button>
            </div>
          );
        })}
      </div>
    </ErpShell>
  );
}
