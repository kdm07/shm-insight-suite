import { createFileRoute } from "@tanstack/react-router";
import { Bell, Calendar, AlertTriangle, FileText, Settings } from "lucide-react";
import { ErpShell } from "@/components/erp/Shell";
import { notifications } from "@/data/mock";

const iconFor = { Task: Bell, Deadline: Calendar, Delay: AlertTriangle, Document: FileText, System: Settings } as const;

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — KDM SHM ERP" }] }),
  component: () => (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Notifications" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <div className="page-sub">All alerts, deadlines and system updates</div>
        </div>
        <button className="erp-btn erp-btn-outline">Mark all read</button>
      </div>
      <div className="erp-card">
        {notifications.map((n) => {
          const Icon = iconFor[n.type];
          return (
            <div key={n.id} className={`erp-notification-item ${!n.read ? "unread" : ""}`}>
              <div className="erp-noti-icon"><Icon size={16} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="hstack-8">
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{n.title}</div>
                  <span className="erp-badge erp-badge-muted">{n.type}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--erp-muted)" }}>{n.message}</div>
                <div style={{ fontSize: 11, color: "var(--erp-muted-2)", marginTop: 2 }}>{n.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </ErpShell>
  ),
});
