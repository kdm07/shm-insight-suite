import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FolderKanban, ListChecks, Users2, UserSquare2, Building2,
  FileText, BarChart3, Calendar, Bell, Settings as SettingsIcon, User,
  ChevronLeft, ChevronRight, Activity,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/teams", label: "Teams", icon: Users2 },
  { to: "/employees", label: "Employees", icon: UserSquare2 },
  { to: "/clients", label: "Clients", icon: Building2 },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/profile", label: "Profile", icon: User },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className={`erp-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="erp-sidebar-brand">
        <div className="erp-brand-logo">
          <Activity size={20} />
        </div>
        {!collapsed && (
          <div className="erp-brand-text">
            <div className="erp-brand-title">KDM SHM</div>
            <div className="erp-brand-sub">ERP System</div>
          </div>
        )}
      </div>
      <nav className="erp-nav">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} className={`erp-nav-item ${active ? "active" : ""}`}>
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <button className="erp-sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}

export function Topbar({ crumbs }: { crumbs: { label: string; to?: string }[] }) {
  const [q, setQ] = useState("");
  return (
    <header className="erp-topbar">
      <div className="erp-crumbs">
        {crumbs.map((c, i) => (
          <span key={i} className="erp-crumb">
            {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
            {i < crumbs.length - 1 && <span className="erp-crumb-sep">/</span>}
          </span>
        ))}
      </div>
      <div className="erp-topbar-right">
        <div className="erp-search">
          <input
            className="form-control form-control-sm"
            placeholder="Search projects, tasks, employees…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Link to="/notifications" className="erp-icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="erp-badge-dot" />
        </Link>
        <Link to="/profile" className="erp-user">
          <img src="https://i.pravatar.cc/64?img=12" alt="User" />
          <div className="erp-user-meta">
            <div className="erp-user-name">Ravi K.</div>
            <div className="erp-user-role">Managing Director</div>
          </div>
        </Link>
      </div>
    </header>
  );
}

export function ErpShell({
  crumbs, children,
}: { crumbs: { label: string; to?: string }[]; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`erp-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="erp-main">
        <Topbar crumbs={crumbs} />
        <div className="erp-content">{children}</div>
      </div>
    </div>
  );
}
