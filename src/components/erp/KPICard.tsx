import type { LucideIcon } from "lucide-react";

export function KPICard({
  label, value, delta, icon: Icon, tone = "primary",
}: {
  label: string; value: string | number; delta?: string; icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "danger" | "muted";
}) {
  return (
    <div className="erp-kpi">
      <div className={`erp-kpi-icon tone-${tone}`}>
        <Icon size={20} />
      </div>
      <div className="erp-kpi-body">
        <div className="erp-kpi-label">{label}</div>
        <div className="erp-kpi-value">{value}</div>
        {delta && <div className="erp-kpi-delta">{delta}</div>}
      </div>
    </div>
  );
}
