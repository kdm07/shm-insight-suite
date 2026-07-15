import type {
  Employee,
  Client,
  Project,
  Task,
  DocumentItem,
  Notification,
  Activity,
  TaskStatus,
  ProjectStatus,
  Priority,
  ProjectStage,
  ProjectHealth,
  ResponsibleTeam,
  CalendarEvent,
  EventType,
  DocCategory,
} from "@/lib/erp-types";

// Fixed prototype "today" — deterministic across SSR/CSR (prevents hydration mismatch)
export const TODAY_ISO = "2026-06-01";
const TODAY = new Date(TODAY_ISO + "T00:00:00Z");

function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function daysBetween(aIso: string, bIso: string): number {
  const a = new Date(aIso + "T00:00:00Z").getTime();
  const b = new Date(bIso + "T00:00:00Z").getTime();
  return Math.round((a - b) / 86400000);
}

const firstNames = [
  "Arjun", "Priya", "Rohit", "Ananya", "Vikram", "Neha", "Karthik", "Divya",
  "Aditya", "Sneha", "Rahul", "Kavya", "Suresh", "Meera", "Nikhil", "Pooja",
  "Amit", "Riya", "Sanjay", "Isha", "Manoj", "Deepa",
];
const lastNames = [
  "Sharma", "Iyer", "Reddy", "Nair", "Menon", "Patel", "Singh", "Rao",
  "Verma", "Gupta", "Kulkarni", "Krishnan", "Bhatt", "Chandra", "Desai",
];
function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }

// ---------- Employees ----------
const managingDirector: Employee = {
  id: "EMP001", name: "Ravi Krishnamurthy", designation: "Managing Director",
  role: "Managing Director", department: "Management",
  email: "ravi.k@kdmshm.com", phone: "+91 98450 12345",
  photo: "https://i.pravatar.cc/120?img=12", availability: "Available",
  projects: [], completedProjects: 42, performance: 98, experienceYears: 24,
};
const projectManager: Employee = {
  id: "EMP002", name: "Anand Subramanian", designation: "Project Manager",
  role: "Project Manager", department: "Management",
  email: "anand.s@kdmshm.com", phone: "+91 98450 22345",
  photo: "https://i.pravatar.cc/120?img=15", availability: "Busy",
  projects: [], completedProjects: 28, performance: 94,
  reportingManagerId: "EMP001", experienceYears: 16,
};
const instrHod: Employee = {
  id: "EMP003", name: "Dr. Vinod Prakash", designation: "Head — Instrumentation",
  role: "Instrumentation HOD", department: "Instrumentation",
  email: "vinod.p@kdmshm.com", phone: "+91 98450 32345",
  photo: "https://i.pravatar.cc/120?img=52", availability: "Available",
  projects: [], completedProjects: 31, performance: 96,
  reportingManagerId: "EMP002", experienceYears: 18,
};
const numHod: Employee = {
  id: "EMP004", name: "Dr. Lakshmi Narayan", designation: "Head — Numerical Analysis",
  role: "Numerical HOD", department: "Numerical",
  email: "lakshmi.n@kdmshm.com", phone: "+91 98450 42345",
  photo: "https://i.pravatar.cc/120?img=48", availability: "Available",
  projects: [], completedProjects: 29, performance: 95,
  reportingManagerId: "EMP002", experienceYears: 17,
};

const engineers: Employee[] = Array.from({ length: 16 }).map((_, i) => {
  const team = i < 8 ? "Instrumentation" : "Numerical";
  const name = `${pick(firstNames, i)} ${pick(lastNames, i + 3)}`;
  const avail: Employee["availability"] = i % 7 === 0 ? "On Leave" : i % 3 === 0 ? "Available" : "Busy";
  return {
    id: `EMP${String(i + 5).padStart(3, "0")}`,
    name,
    designation: `${team} Engineer`,
    role: team === "Instrumentation" ? "Instrumentation Engineer" : "Numerical Engineer",
    department: team,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@kdmshm.com`,
    phone: `+91 98${String(450000000 + i * 12345).slice(0, 8)}`,
    photo: `https://i.pravatar.cc/120?img=${i + 20}`,
    availability: avail,
    projects: [],
    completedProjects: 3 + (i % 9),
    performance: 78 + ((i * 3) % 20),
    reportingManagerId: team === "Instrumentation" ? instrHod.id : numHod.id,
    experienceYears: 2 + (i % 12),
  };
});

export const employees: Employee[] = [managingDirector, projectManager, instrHod, numHod, ...engineers];

// ---------- Clients ----------
const clientNames = [
  "Indian Railways — Southern Zone",
  "Indian Railways — Western Zone",
  "Indian Railways — Central Zone",
  "Indian Railways — Northern Zone",
  "Indian Railways — Eastern Zone",
  "Konkan Railway Corporation",
  "RVNL — Rail Vikas Nigam",
  "IRCON International",
  "DFCCIL",
  "RITES Ltd.",
];
export const clients: Client[] = clientNames.map((n, i) => ({
  id: `CLT${String(i + 1).padStart(3, "0")}`,
  name: n,
  contactPerson: `${pick(firstNames, i + 4)} ${pick(lastNames, i + 1)}`,
  email: `contact${i + 1}@railways.gov.in`,
  phone: `+91 11 234${String(50000 + i).slice(0, 5)}`,
  location: pick(["New Delhi", "Mumbai", "Chennai", "Kolkata", "Bengaluru", "Hyderabad"], i),
  projectsCount: 1 + (i % 4),
}));

// ---------- Projects ----------
const bridges = [
  { name: "Pamban Rail Bridge", location: "Rameswaram, Tamil Nadu" },
  { name: "Chenab Rail Bridge", location: "Reasi, Jammu & Kashmir" },
  { name: "Bogibeel Bridge", location: "Dibrugarh, Assam" },
  { name: "Godavari Arch Bridge", location: "Rajahmundry, Andhra Pradesh" },
  { name: "Vembanad Rail Bridge", location: "Kochi, Kerala" },
  { name: "Nehru Setu (Sone Bridge)", location: "Dehri, Bihar" },
  { name: "Yamuna Bridge Naini", location: "Prayagraj, Uttar Pradesh" },
  { name: "Jubilee Bridge", location: "Hooghly, West Bengal" },
  { name: "Bhupen Hazarika Setu Approach", location: "Sadiya, Assam" },
  { name: "Mahanadi Rail Bridge", location: "Cuttack, Odisha" },
  { name: "Krishna Rail Bridge", location: "Vijayawada, Andhra Pradesh" },
  { name: "Tapti Rail Bridge", location: "Surat, Gujarat" },
  { name: "Ganga Rail Bridge (Mokama)", location: "Mokama, Bihar" },
  { name: "Netravati Rail Bridge", location: "Mangalore, Karnataka" },
  { name: "Sharavati Rail Bridge", location: "Honnavar, Karnataka" },
];

export const workflowSteps: ProjectStage[] = [
  "Project Received",
  "Planning",
  "Instrumentation Work",
  "Site Monitoring",
  "Numerical Analysis",
  "Report Preparation",
  "Review",
  "Completed",
];

const stageResponsible: Record<ProjectStage, ResponsibleTeam> = {
  "Project Received": "Management",
  "Planning": "Management",
  "Instrumentation Work": "Instrumentation",
  "Site Monitoring": "Instrumentation",
  "Numerical Analysis": "Numerical",
  "Report Preparation": "Numerical",
  "Review": "Management",
  "Completed": "—",
};

const statuses: ProjectStatus[] = ["Planning", "Running", "Running", "Running", "Review", "Completed", "Delayed"];
const priorities: Priority[] = ["Low", "Medium", "High", "Critical"];

export const projects: Project[] = bridges.map((b, i) => {
  const status = pick(statuses, i);
  const progress =
    status === "Completed" ? 100 :
    status === "Review" ? 85 :
    status === "Delayed" ? 45 :
    status === "Planning" ? 10 :
    30 + ((i * 13) % 55);

  const instrEngs = engineers.filter((e) => e.department === "Instrumentation").slice(i % 4, (i % 4) + 3).map((e) => e.id);
  const numEngs = engineers.filter((e) => e.department === "Numerical").slice(i % 4, (i % 4) + 3).map((e) => e.id);

  // deterministic dates (relative to TODAY)
  const startDate = addDays(TODAY, -180 - (i * 11));
  const endDate = addDays(TODAY, 60 + (i * 9));
  // Delay: some Running projects have shifted expected completion after end
  const expectedCompletion = status === "Delayed" ? addDays(TODAY, 15 + (i % 20)) : endDate;
  const delayDays = status === "Delayed" ? 20 + (i % 25) : status === "Completed" ? 0 : Math.max(0, daysBetween(expectedCompletion, endDate));

  let stage: ProjectStage;
  if (status === "Completed") stage = "Completed";
  else if (status === "Review") stage = "Review";
  else if (status === "Planning") stage = "Planning";
  else if (status === "Delayed") stage = pick<ProjectStage>(["Instrumentation Work", "Site Monitoring", "Numerical Analysis"], i);
  else stage = pick<ProjectStage>(["Instrumentation Work", "Site Monitoring", "Numerical Analysis", "Report Preparation"], i);

  const workflowStep = workflowSteps.indexOf(stage);

  let health: ProjectHealth;
  if (status === "Delayed") health = i % 5 === 0 ? "Blocked" : "Delayed";
  else if (status === "Completed") health = "Healthy";
  else if (progress > 60) health = "Healthy";
  else if (progress > 30) health = "Attention";
  else health = "Attention";

  return {
    id: `PRJ${String(i + 1).padStart(3, "0")}`,
    code: `KDM-SHM-${2025}-${String(i + 1).padStart(3, "0")}`,
    name: `SHM — ${b.name}`,
    clientId: pick(clients, i).id,
    bridgeName: b.name,
    location: b.location,
    managerId: projectManager.id,
    instrumentationHodId: instrHod.id,
    numericalHodId: numHod.id,
    instrumentationEngineers: instrEngs,
    numericalEngineers: numEngs,
    startDate,
    endDate,
    expectedCompletion,
    status,
    priority: pick(priorities, i + 1),
    progress,
    health,
    stage,
    responsibleTeam: status === "Completed" ? "—" : stageResponsible[stage],
    delayDays,
    description: `Structural Health Monitoring instrumentation, data acquisition and numerical analysis for ${b.name} located at ${b.location}. Continuous sensor deployment, strain gauge installation, vibration analysis and FEM validation.`,
    workflowStep,
  };
});

// backfill employee project lists
projects.forEach((p) => {
  [projectManager, instrHod, numHod].forEach((e) => { if (!e.projects.includes(p.id)) e.projects.push(p.id); });
  [...p.instrumentationEngineers, ...p.numericalEngineers].forEach((eid) => {
    const emp = employees.find((x) => x.id === eid);
    if (emp && !emp.projects.includes(p.id)) emp.projects.push(p.id);
  });
});

// ---------- Tasks ----------
const taskTemplates = [
  "Sensor calibration", "Strain gauge installation", "Accelerometer deployment",
  "Data acquisition setup", "FEM model preparation", "Modal analysis",
  "Field data collection", "Report drafting", "Client review meeting",
  "Site inspection", "Wireless node testing", "Fatigue analysis",
];
const taskStatuses: TaskStatus[] = ["To Do", "Assigned", "In Progress", "Waiting Review", "Completed"];

export const tasks: Task[] = Array.from({ length: 80 }).map((_, i) => {
  const project = pick(projects, i);
  const team = i % 2 === 0 ? "Instrumentation" : "Numerical";
  const pool = team === "Instrumentation" ? project.instrumentationEngineers : project.numericalEngineers;
  const assignee = pool[i % pool.length] || engineers[i % engineers.length].id;
  const status = pick(taskStatuses, i);
  // deterministic offset around TODAY: [-6 .. +13]
  const offset = (i % 20) - 6;
  return {
    id: `TSK${String(i + 1).padStart(4, "0")}`,
    name: `${pick(taskTemplates, i)} — ${project.bridgeName.split(" ")[0]}`,
    projectId: project.id,
    assigneeId: assignee,
    team,
    status,
    priority: pick(priorities, i),
    dueDate: addDays(TODAY, offset),
    progress:
      status === "Completed" ? 100 :
      status === "Waiting Review" ? 90 :
      status === "In Progress" ? 30 + ((i * 7) % 50) :
      status === "Assigned" ? 5 : 0,
    stage: project.stage,
  };
});

// ---------- Documents ----------
const docCategories: DocCategory[] = ["Reports", "Drawings", "Photos", "Sensor Layouts", "Calculations"];
export const documents: DocumentItem[] = Array.from({ length: 30 }).map((_, i) => {
  const project = pick(projects, i);
  const category = pick(docCategories, i);
  const dept: DocumentItem["department"] =
    category === "Photos" || category === "Sensor Layouts" || category === "Drawings"
      ? "Instrumentation"
      : category === "Calculations"
      ? "Numerical"
      : i % 2 === 0 ? "Instrumentation" : "Numerical";
  const approver = dept === "Instrumentation" ? instrHod.name : dept === "Numerical" ? numHod.name : projectManager.name;
  return {
    id: `DOC${String(i + 1).padStart(3, "0")}`,
    name: `${project.bridgeName} — ${category} v${1 + (i % 3)}.pdf`,
    projectId: project.id,
    category,
    version: `v${1 + (i % 3)}.${i % 5}`,
    department: dept,
    approvedBy: approver,
    size: `${(0.4 + (i % 8) * 0.35).toFixed(1)} MB`,
    uploadedBy: pick(employees, i + 3).name,
    uploadedAt: addDays(TODAY, -i - 1),
  };
});

// ---------- Notifications ----------
export const notifications: Notification[] = [
  { id: "N1", type: "Task", title: "New task assigned", message: "Sensor calibration on Chenab Rail Bridge assigned to you.", time: "10 min ago", read: false },
  { id: "N2", type: "Deadline", title: "Deadline approaching", message: "FEM report for Pamban due in 2 days.", time: "1 hour ago", read: false },
  { id: "N3", type: "Delay", title: "Project delay flagged", message: "Godavari Arch Bridge marked as delayed.", time: "3 hours ago", read: false },
  { id: "N4", type: "Document", title: "Document uploaded", message: "Vinod Prakash uploaded Sensor Layout v2.", time: "Yesterday", read: true },
  { id: "N5", type: "System", title: "Weekly digest ready", message: "Your weekly project performance digest is ready.", time: "2 days ago", read: true },
  { id: "N6", type: "Task", title: "Task completed", message: "Strain gauge installation on Bogibeel completed.", time: "2 days ago", read: true },
];

// ---------- Activities ----------
export const activities: Activity[] = [
  { id: "A1", projectId: projects[0].id, actor: projectManager.name, action: "assigned Numerical team to Pamban SHM", time: "2h ago" },
  { id: "A2", projectId: projects[1].id, actor: instrHod.name, action: "uploaded sensor layout for Chenab", time: "4h ago" },
  { id: "A3", projectId: projects[2].id, actor: numHod.name, action: "approved FEM report for Bogibeel", time: "Yesterday" },
  { id: "A4", projectId: projects[3].id, actor: engineers[2].name, action: "completed strain gauge installation", time: "Yesterday" },
  { id: "A5", projectId: projects[4].id, actor: projectManager.name, action: "created new project Vembanad SHM", time: "2 days ago" },
  { id: "A6", projectId: projects[5].id, actor: managingDirector.name, action: "reviewed monthly performance report", time: "3 days ago" },
];

// ---------- Calendar events ----------
const eventTypes: EventType[] = ["Meeting", "Site Visit", "Deadline", "Review", "Leave"];
export const calendarEvents: CalendarEvent[] = [
  ...projects.map((p, i) => ({
    id: `EVT-D${i}`,
    date: p.expectedCompletion,
    title: `Deadline: ${p.bridgeName}`,
    type: "Deadline" as EventType,
    projectId: p.id,
  })),
  ...Array.from({ length: 18 }).map((_, i) => {
    const project = pick(projects, i);
    const type = pick(eventTypes.filter((t) => t !== "Deadline"), i);
    const offset = (i % 22) - 8;
    return {
      id: `EVT-${i}`,
      date: addDays(TODAY, offset),
      title:
        type === "Meeting" ? `Team meeting — ${project.bridgeName.split(" ")[0]}` :
        type === "Site Visit" ? `Site visit — ${project.location.split(",")[0]}` :
        type === "Review" ? `Design review — ${project.bridgeName.split(" ")[0]}` :
        `${pick(engineers, i).name} on leave`,
      type,
      projectId: type !== "Leave" ? project.id : undefined,
    };
  }),
];

// ---------- Helpers ----------
export function getEmployee(id: string) { return employees.find((e) => e.id === id); }
export function getClient(id: string) { return clients.find((c) => c.id === id); }
export function getProject(id: string) { return projects.find((p) => p.id === id); }

export function projectsForClient(clientId: string) {
  return projects.filter((p) => p.clientId === clientId);
}
export function clientStats(clientId: string) {
  const all = projectsForClient(clientId);
  const active = all.filter((p) => p.status !== "Completed").length;
  const completed = all.filter((p) => p.status === "Completed").length;
  const last = [...all].sort((a, b) => b.endDate.localeCompare(a.endDate))[0];
  return { active, completed, total: all.length, last };
}
export function teamStats(team: "Instrumentation" | "Numerical") {
  const members = employees.filter((e) => e.department === team);
  const eng = members.filter((e) => e.role !== "Instrumentation HOD" && e.role !== "Numerical HOD");
  const teamTasks = tasks.filter((t) => t.team === team);
  const completedTasks = teamTasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = teamTasks.filter((t) => t.status !== "Completed").length;
  const delayedTasks = teamTasks.filter((t) => t.status !== "Completed" && t.dueDate < TODAY_ISO).length;
  const currentProjects = projects.filter((p) =>
    p.status !== "Completed" && (team === "Instrumentation" ? p.instrumentationEngineers.length > 0 : p.numericalEngineers.length > 0)
  );
  const working = members.filter((e) => e.availability === "Busy").length;
  const available = members.filter((e) => e.availability === "Available").length;
  const onLeave = members.filter((e) => e.availability === "On Leave").length;
  const completionPct = teamTasks.length ? Math.round((completedTasks / teamTasks.length) * 100) : 0;
  return {
    members, eng, teamTasks, completedTasks, pendingTasks, delayedTasks,
    currentProjects, working, available, onLeave, completionPct,
  };
}
export function currentTaskForEmployee(empId: string) {
  return tasks.find((t) => t.assigneeId === empId && t.status === "In Progress")
    || tasks.find((t) => t.assigneeId === empId && t.status !== "Completed");
}
export function currentProjectForEmployee(empId: string) {
  const t = currentTaskForEmployee(empId);
  return t ? getProject(t.projectId) : projects.find((p) => p.status !== "Completed" && (p.instrumentationEngineers.includes(empId) || p.numericalEngineers.includes(empId)));
}
