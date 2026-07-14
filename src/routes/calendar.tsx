import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ErpShell } from "@/components/erp/Shell";
import { tasks, projects } from "@/data/mock";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — KDM SHM ERP" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const [cur, setCur] = useState(() => new Date());
  const year = cur.getFullYear();
  const month = cur.getMonth();
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const today = new Date();
  const events = [
    ...tasks.map((t) => ({ date: t.dueDate, title: t.name, type: "task" as const })),
    ...projects.map((p) => ({ date: p.endDate, title: `Deadline: ${p.bridgeName}`, type: "project" as const })),
  ];

  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Calendar" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <div className="page-sub">Project deadlines, task due dates and meetings</div>
        </div>
        <div className="hstack-8">
          <button className="erp-btn erp-btn-outline" onClick={() => setCur(new Date(year, month - 1, 1))}><ChevronLeft size={14} /></button>
          <div style={{ fontWeight: 600, minWidth: 160, textAlign: "center" }}>
            {cur.toLocaleString("en-US", { month: "long", year: "numeric" })}
          </div>
          <button className="erp-btn erp-btn-outline" onClick={() => setCur(new Date(year, month + 1, 1))}><ChevronRight size={14} /></button>
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card-body">
          <div className="erp-cal">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="erp-cal-head">{d}</div>
            ))}
            {cells.map((c, i) => {
              if (!c) return <div key={i} className="erp-cal-cell other" />;
              const iso = c.toISOString().slice(0, 10);
              const dayEvents = events.filter((e) => e.date === iso).slice(0, 3);
              const isToday = c.toDateString() === today.toDateString();
              return (
                <div key={i} className={`erp-cal-cell ${isToday ? "today" : ""}`}>
                  <div className="erp-cal-num">{c.getDate()}</div>
                  {dayEvents.map((e, j) => <span key={j} className="erp-cal-event" title={e.title}>{e.title}</span>)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ErpShell>
  );
}
