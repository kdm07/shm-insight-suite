import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { ErpShell } from "@/components/erp/Shell";
import { employees, tasks, getEmployee, currentProjectForEmployee } from "@/data/mock";

export const Route = createFileRoute("/employees")({
  head: () => ({ meta: [{ title: "Employees — KDM SHM ERP" }] }),
  component: EmployeesPage,
});

function EmployeesPage() {
  return (
    <ErpShell crumbs={[{ label: "Home", to: "/" }, { label: "Employees" }]}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Directory</h1>
          <div className="page-sub">{employees.length} employees across management and technical teams</div>
        </div>
        <button className="erp-btn erp-btn-primary">+ Add Employee</button>
      </div>

      <div className="erp-card">
        <div style={{ overflowX: "auto" }}>
          <table className="erp-table">
            <thead>
              <tr>
                <th>Employee</th><th>ID</th><th>Designation</th><th>Department</th>
                <th>Reporting Manager</th><th>Experience</th>
                <th>Current Project</th><th>Workload</th>
                <th>Contact</th><th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => {
                const activeTasks = tasks.filter((t) => t.assigneeId === e.id && t.status !== "Completed").length;
                const doneTasks = tasks.filter((t) => t.assigneeId === e.id && t.status === "Completed").length;
                const cp = currentProjectForEmployee(e.id);
                const manager = e.reportingManagerId ? getEmployee(e.reportingManagerId) : undefined;
                return (
                  <tr key={e.id}>
                    <td>
                      <div className="hstack-12">
                        <img src={e.photo} className="avatar-sm" alt="" />
                        <div><div style={{ fontWeight: 600 }}>{e.name}</div><div style={{ fontSize: 11, color: "var(--erp-muted)" }}>{e.role}</div></div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{e.id}</td>
                    <td style={{ fontSize: 12 }}>{e.designation}</td>
                    <td style={{ fontSize: 12 }}>{e.department}</td>
                    <td style={{ fontSize: 12 }}>{manager?.name ?? "—"}</td>
                    <td style={{ fontSize: 12 }}>{e.experienceYears} yrs</td>
                    <td style={{ fontSize: 12 }}>{cp?.bridgeName ?? "—"}</td>
                    <td style={{ fontSize: 12 }}>
                      <div><strong>{activeTasks}</strong> active</div>
                      <div style={{ color: "var(--erp-muted)" }}>{doneTasks} completed</div>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      <div className="hstack-8"><Mail size={12} /> {e.email}</div>
                      <div className="hstack-8"><Phone size={12} /> {e.phone}</div>
                    </td>
                    <td>
                      <span className={`erp-badge ${e.availability === "Available" ? "erp-badge-success" : e.availability === "Busy" ? "erp-badge-warning" : "erp-badge-muted"}`}>
                        {e.availability}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ErpShell>
  );
}
