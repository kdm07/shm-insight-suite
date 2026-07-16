import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ErpShell } from "@/components/erp/Shell";
import { calendarEvents, TODAY_ISO } from "@/data/mock";
import type { EventType } from "@/lib/erp-types";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — KDM SHM ERP" }] }),
  component: CalendarPage,
});

const eventClass: Record<EventType, string> = {
  Meeting: "erp-cal-event evt-meeting",
  "Site Visit": "erp-cal-event evt-sitevisit",
  "Sensor Installation": "erp-cal-event evt-sensor",
  "Load Test": "erp-cal-event evt-loadtest",
  "Report Submission": "erp-cal-event evt-report",
  "Client Meeting": "erp-cal-event evt-client",
  Deadline: "erp-cal-event evt-deadline",
  Review: "erp-cal-event evt-review",
  Leave: "erp-cal-event evt-leave",
};

function CalendarPage() {
  // seed month from fixed prototype "today" to keep SSR deterministic
  const [cur, setCur] = useState(() => new Date(TODAY_ISO + "T00:00:00Z"));
  const year = cur.getUTCFullYear();
  const month = cur.getUTCMonth();
  const first = new Date(Date.UTC(year, month, 1));
  const startWeekday = first.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(Date.UTC(year, month, d)));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Calendar" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <div className="page-sub">Meetings, site visits, deadlines, reviews and leave</div>
        </div>
        <div className="hstack-8">
          <button className="erp-btn erp-btn-outline" onClick={() => setCur(new Date(Date.UTC(year, month - 1, 1)))}><ChevronLeft size={14} /></button>
          <div style={{ fontWeight: 600, minWidth: 160, textAlign: "center" }}>
            {cur.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}
          </div>
          <button className="erp-btn erp-btn-outline" onClick={() => setCur(new Date(Date.UTC(year, month + 1, 1)))}><ChevronRight size={14} /></button>
        </div>
      </div>

      <div className="erp-card" style={{ marginBottom: 12 }}>
        <div className="erp-card-body" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(Object.keys(eventClass) as EventType[]).map((t) => (
            <span key={t} className="hstack-8" style={{ fontSize: 12 }}>
              <span className={eventClass[t]} style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, padding: 0 }} />
              {t}
            </span>
          ))}
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
              const dayEvents = calendarEvents.filter((e) => e.date === iso).slice(0, 3);
              const isToday = iso === TODAY_ISO;
              return (
                <div key={i} className={`erp-cal-cell ${isToday ? "today" : ""}`}>
                  <div className="erp-cal-num">{c.getUTCDate()}</div>
                  {dayEvents.map((e, j) => (
                    <span key={j} className={eventClass[e.type]} title={`${e.type}: ${e.title}`}>{e.title}</span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ErpShell>
  );
}
