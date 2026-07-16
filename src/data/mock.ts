import type {
  Employee,
  Client,
  Project,
  Task,
  DocumentItem,
  Notification,
  Activity,
  TaskStage,
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
  { name: "Pamban Rail Bridge", location: "Rameswaram, Tamil Nadu", division: "Southern Railway — Madurai Division", type: "Vertical Lift Bridge", span: "2.05 km", year: 2024 },
  { name: "Chenab Rail Bridge", location: "Reasi, Jammu & Kashmir", division: "Northern Railway — Jammu Division", type: "Steel Arch Bridge", span: "1.31 km", year: 2023 },
  { name: "Bogibeel Bridge", location: "Dibrugarh, Assam", division: "Northeast Frontier — Tinsukia Division", type: "Truss Bridge", span: "4.94 km", year: 2018 },
  { name: "Godavari Arch Bridge", location: "Rajahmundry, Andhra Pradesh", division: "South Central — Vijayawada Division", type: "Bowstring Arch", span: "2.75 km", year: 1997 },
  { name: "Vembanad Rail Bridge", location: "Kochi, Kerala", division: "Southern Railway — Thiruvananthapuram Division", type: "PSC Girder", span: "4.62 km", year: 2011 },
  { name: "Nehru Setu (Sone Bridge)", location: "Dehri, Bihar", division: "East Central — Dhanbad Division", type: "Steel Girder", span: "3.06 km", year: 1900 },
  { name: "Yamuna Bridge Naini", location: "Prayagraj, Uttar Pradesh", division: "North Central — Prayagraj Division", type: "Steel Truss", span: "1.00 km", year: 1865 },
  { name: "Jubilee Bridge", location: "Hooghly, West Bengal", division: "Eastern Railway — Howrah Division", type: "Cantilever Truss", span: "0.42 km", year: 1887 },
  { name: "Bhupen Hazarika Setu Approach", location: "Sadiya, Assam", division: "Northeast Frontier — Tinsukia Division", type: "PSC Box Girder", span: "9.15 km", year: 2017 },
  { name: "Mahanadi Rail Bridge", location: "Cuttack, Odisha", division: "East Coast — Khurda Road Division", type: "PSC Girder", span: "2.10 km", year: 2008 },
  { name: "Krishna Rail Bridge", location: "Vijayawada, Andhra Pradesh", division: "South Central — Vijayawada Division", type: "Steel Truss", span: "1.28 km", year: 1994 },
  { name: "Tapti Rail Bridge", location: "Surat, Gujarat", division: "Western Railway — Mumbai Division", type: "Steel Girder", span: "0.98 km", year: 1990 },
  { name: "Ganga Rail Bridge (Mokama)", location: "Mokama, Bihar", division: "East Central — Danapur Division", type: "Steel Truss", span: "2.00 km", year: 2016 },
  { name: "Netravati Rail Bridge", location: "Mangalore, Karnataka", division: "Konkan Railway", type: "PSC Girder", span: "0.90 km", year: 1998 },
  { name: "Sharavati Rail Bridge", location: "Honnavar, Karnataka", division: "Konkan Railway", type: "PSC Girder", span: "2.06 km", year: 1998 },
];

export const workflowSteps: ProjectStage[] = [
  "Project Received",
  "MD Assignment",
  "Site Visit",
  "Methodology Preparation",
  "Sensor Installation",
  "Sensor Validation",
  "Load Testing",
  "Data Extraction",
  "Numerical Analysis",
  "Report Preparation",
  "Client Submission",
  "Completed",
];

const stageResponsible: Record<ProjectStage, ResponsibleTeam> = {
  "Project Received": "Management",
  "MD Assignment": "Management",
  "Site Visit": "Numerical",
  "Methodology Preparation": "Numerical",
  "Sensor Installation": "Instrumentation",
  "Sensor Validation": "Instrumentation",
  "Load Testing": "Instrumentation",
  "Data Extraction": "Instrumentation",
  "Numerical Analysis": "Numerical",
  "Report Preparation": "Instrumentation",
  "Client Submission": "Management",
  "Completed": "—",
};

const stageWaitingFor: Record<ProjectStage, string> = {
  "Project Received": "MD assignment",
  "MD Assignment": "Site visit scheduling",
  "Site Visit": "Site data collection",
  "Methodology Preparation": "Methodology approval",
  "Sensor Installation": "Sensor deployment",
  "Sensor Validation": "Calibration sign-off",
  "Load Testing": "Railway load test slot",
  "Data Extraction": "Raw sensor data processing",
  "Numerical Analysis": "FEM validation",
  "Report Preparation": "Final report drafting",
  "Client Submission": "Client acknowledgement",
  "Completed": "—",
};

const statuses: ProjectStatus[] = ["Planning", "Running", "Running", "Running", "Review", "Completed", "Delayed"];
const priorities: Priority[] = ["Low", "Medium", "High", "Critical"];

// Deterministic stage distribution across the portfolio, so every workflow step is represented
const stageDistribution: ProjectStage[] = [
  "MD Assignment",
  "Site Visit",
  "Methodology Preparation",
  "Sensor Installation",
  "Sensor Validation",
  "Load Testing",
  "Data Extraction",
  "Numerical Analysis",
  "Numerical Analysis",
  "Report Preparation",
  "Client Submission",
  "Completed",
  "Completed",
  "Sensor Installation",
  "Load Testing",
];

function nextStage(s: ProjectStage): ProjectStage | "—" {
  const idx = workflowSteps.indexOf(s);
  return idx >= 0 && idx < workflowSteps.length - 1 ? workflowSteps[idx + 1] : "—";
}

export const projects: Project[] = bridges.map((b, i) => {
  const stage: ProjectStage = stageDistribution[i % stageDistribution.length];
  const workflowStep = workflowSteps.indexOf(stage);
  const responsibleTeam = stageResponsible[stage];

  // Status derived from stage + a bit of variety
  let status: ProjectStatus;
  if (stage === "Completed") status = "Completed";
  else if (stage === "Client Submission") status = "Review";
  else if (workflowStep <= 1) status = "Planning";
  else status = pick(statuses, i);
  if (status === "Delayed" && stage === "Completed") status = "Completed";

  // Progress reflects workflow position
  const progress =
    stage === "Completed" ? 100 :
    Math.min(96, Math.round((workflowStep / (workflowSteps.length - 1)) * 100) + ((i * 5) % 8));

  const instrEngs = engineers.filter((e) => e.department === "Instrumentation").slice(i % 4, (i % 4) + 3).map((e) => e.id);
  const numEngs = engineers.filter((e) => e.department === "Numerical").slice(i % 4, (i % 4) + 3).map((e) => e.id);

  const currentEngineerId =
    responsibleTeam === "Instrumentation" ? instrEngs[i % instrEngs.length] :
    responsibleTeam === "Numerical" ? numEngs[i % numEngs.length] :
    projectManager.id;

  const startDate = addDays(TODAY, -180 - (i * 11));
  const endDate = addDays(TODAY, 60 + (i * 9));
  const expectedCompletion = status === "Delayed" ? addDays(TODAY, 15 + (i % 20)) : endDate;
  const delayDays = status === "Delayed" ? 20 + (i % 25) : status === "Completed" ? 0 : Math.max(0, daysBetween(expectedCompletion, endDate));

  let health: ProjectHealth;
  if (status === "Delayed") health = i % 5 === 0 ? "Blocked" : "Delayed";
  else if (status === "Completed") health = "Healthy";
  else if (progress > 60) health = "Healthy";
  else health = "Attention";

  // Stage-specific snapshots
  const sensorsPlanned = 24 + (i % 5) * 6;
  const sensorsInstalled =
    workflowStep < workflowSteps.indexOf("Sensor Installation") ? 0 :
    workflowStep === workflowSteps.indexOf("Sensor Installation") ? Math.round(sensorsPlanned * 0.55) :
    sensorsPlanned;

  const passedInstall = workflowStep > workflowSteps.indexOf("Sensor Installation");
  const passedValidate = workflowStep > workflowSteps.indexOf("Sensor Validation");
  const passedLoad = workflowStep > workflowSteps.indexOf("Load Testing");
  const passedData = workflowStep > workflowSteps.indexOf("Data Extraction");
  const passedAnalysis = workflowStep > workflowSteps.indexOf("Numerical Analysis");
  const passedReport = workflowStep > workflowSteps.indexOf("Report Preparation");
  const passedSite = workflowStep > workflowSteps.indexOf("Site Visit");
  const passedMethod = workflowStep > workflowSteps.indexOf("Methodology Preparation");

  return {
    id: `PRJ${String(i + 1).padStart(3, "0")}`,
    code: `KDM-SHM-2025-${String(i + 1).padStart(3, "0")}`,
    name: `SHM — ${b.name}`,
    clientId: pick(clients, i).id,
    bridgeName: b.name,
    location: b.location,
    railwayDivision: b.division,
    bridgeType: b.type,
    spanLength: b.span,
    yearBuilt: b.year,
    managerId: projectManager.id,
    instrumentationHodId: instrHod.id,
    numericalHodId: numHod.id,
    instrumentationEngineers: instrEngs,
    numericalEngineers: numEngs,
    currentEngineerId,
    startDate,
    endDate,
    expectedCompletion,
    status,
    priority: pick(priorities, i + 1),
    progress,
    health,
    stage,
    nextStage: nextStage(stage),
    waitingFor: stageWaitingFor[stage],
    responsibleTeam,
    delayDays,
    description: `Structural Health Monitoring instrumentation, load testing and numerical analysis for ${b.name} (${b.type}, span ${b.span}) located on ${b.division}. Sensor deployment, load-test coordination with Railway authorities and FEM validation.`,
    workflowStep,
    sensorsPlanned,
    sensorsInstalled,
    sensorStatus:
      workflowStep < workflowSteps.indexOf("Sensor Installation") ? "Not Started" :
      workflowStep === workflowSteps.indexOf("Sensor Installation") ? "In Progress" :
      workflowStep === workflowSteps.indexOf("Sensor Validation") ? "Installed" :
      "Validated",
    calibrationStatus:
      !passedInstall && workflowStep < workflowSteps.indexOf("Sensor Validation") ? "Pending" :
      workflowStep === workflowSteps.indexOf("Sensor Validation") ? "In Progress" :
      "Calibrated",
    loadTestStatus:
      workflowStep < workflowSteps.indexOf("Load Testing") ? (workflowStep >= workflowSteps.indexOf("Sensor Validation") ? "Scheduled" : "Not Scheduled") :
      workflowStep === workflowSteps.indexOf("Load Testing") ? "In Progress" :
      "Completed",
    dataExtractionProgress:
      workflowStep < workflowSteps.indexOf("Data Extraction") ? 0 :
      workflowStep === workflowSteps.indexOf("Data Extraction") ? 45 + ((i * 7) % 30) :
      100,
    siteVisitStatus: passedSite || stage === "Site Visit" ? (stage === "Site Visit" ? "Pending" : "Completed") : "Pending",
    methodologyStatus:
      workflowStep < workflowSteps.indexOf("Methodology Preparation") ? "Draft" :
      workflowStep === workflowSteps.indexOf("Methodology Preparation") ? "Under Review" :
      "Approved",
    analysisProgress:
      workflowStep < workflowSteps.indexOf("Numerical Analysis") ? 0 :
      workflowStep === workflowSteps.indexOf("Numerical Analysis") ? 35 + ((i * 11) % 40) :
      100,
    femStatus:
      workflowStep < workflowSteps.indexOf("Numerical Analysis") ? "Not Started" :
      workflowStep === workflowSteps.indexOf("Numerical Analysis") ? "In Progress" :
      passedAnalysis ? "Approved" : "Under Review",
    reportReviewStatus:
      workflowStep < workflowSteps.indexOf("Report Preparation") ? "Not Started" :
      workflowStep === workflowSteps.indexOf("Report Preparation") ? "In Review" :
      workflowStep === workflowSteps.indexOf("Client Submission") ? "Approved" :
      passedReport ? "Submitted" : "In Review",
  };
});
// suppress unused warnings for computed flags
void 0;

// backfill employee project lists
projects.forEach((p) => {
  [projectManager, instrHod, numHod].forEach((e) => { if (!e.projects.includes(p.id)) e.projects.push(p.id); });
  [...p.instrumentationEngineers, ...p.numericalEngineers].forEach((eid) => {
    const emp = employees.find((x) => x.id === eid);
    if (emp && !emp.projects.includes(p.id)) emp.projects.push(p.id);
  });
});

// ---------- Tasks ----------
// Task templates per stage — realistic SHM activities
const taskTemplatesByStage: Record<TaskStage, { name: string; team: "Instrumentation" | "Numerical" }[]> = {
  "Site Visit": [
    { name: "Bridge dimensioning & site survey", team: "Numerical" },
    { name: "Collect existing drawings from Railway", team: "Numerical" },
    { name: "Meeting with Railway officials", team: "Numerical" },
    { name: "GPS coordinate mapping", team: "Numerical" },
  ],
  "Methodology": [
    { name: "Sensor layout drafting", team: "Numerical" },
    { name: "Monitoring methodology write-up", team: "Numerical" },
    { name: "Instrumentation plan approval", team: "Numerical" },
    { name: "Load test planning", team: "Numerical" },
  ],
  "Sensor Installation": [
    { name: "Strain gauge installation", team: "Instrumentation" },
    { name: "Accelerometer deployment", team: "Instrumentation" },
    { name: "Wireless node commissioning", team: "Instrumentation" },
    { name: "Cable routing & DAQ setup", team: "Instrumentation" },
  ],
  "Load Testing": [
    { name: "Coordinate train load test with Railway", team: "Instrumentation" },
    { name: "Conduct static load test", team: "Instrumentation" },
    { name: "Conduct dynamic load test", team: "Instrumentation" },
    { name: "Record train speed & weight configuration", team: "Instrumentation" },
  ],
  "Data Extraction": [
    { name: "Raw sensor data extraction", team: "Instrumentation" },
    { name: "Signal filtering & processing", team: "Instrumentation" },
    { name: "Data package transfer to Numerical", team: "Instrumentation" },
  ],
  "Numerical Analysis": [
    { name: "FEM model calibration", team: "Numerical" },
    { name: "Modal analysis vs. field data", team: "Numerical" },
    { name: "Fatigue & stress analysis", team: "Numerical" },
    { name: "Result verification", team: "Numerical" },
  ],
  "Report Preparation": [
    { name: "Final report drafting", team: "Instrumentation" },
    { name: "Sensor plots & graphs preparation", team: "Instrumentation" },
    { name: "HOD review of monitoring report", team: "Instrumentation" },
  ],
  "Completed": [
    { name: "Client submission acknowledgement", team: "Numerical" },
  ],
};

const executionStages: TaskStage[] = [
  "Site Visit", "Methodology", "Sensor Installation", "Load Testing",
  "Data Extraction", "Numerical Analysis", "Report Preparation", "Completed",
];

// Map a project stage to the task board column it currently drives
function projectToTaskStage(s: ProjectStage): TaskStage {
  switch (s) {
    case "Site Visit": return "Site Visit";
    case "Methodology Preparation": return "Methodology";
    case "Sensor Installation": return "Sensor Installation";
    case "Sensor Validation": return "Sensor Installation";
    case "Load Testing": return "Load Testing";
    case "Data Extraction": return "Data Extraction";
    case "Numerical Analysis": return "Numerical Analysis";
    case "Report Preparation": return "Report Preparation";
    case "Client Submission": return "Report Preparation";
    case "Completed": return "Completed";
    default: return "Site Visit";
  }
}

export const tasks: Task[] = (() => {
  const out: Task[] = [];
  let counter = 1;
  projects.forEach((p, pi) => {
    // Every project gets 4-6 tasks distributed across current + previous stages
    const currentCol = projectToTaskStage(p.stage);
    const currentIdx = executionStages.indexOf(currentCol);
    const covered = executionStages.slice(0, Math.max(1, currentIdx + 1));
    covered.forEach((stg, si) => {
      const templates = taskTemplatesByStage[stg];
      const tpl = templates[(pi + si) % templates.length];
      const isPast = si < currentIdx;
      const isCurrent = si === currentIdx;
      const team = tpl.team;
      const pool = team === "Instrumentation" ? p.instrumentationEngineers : p.numericalEngineers;
      const assignee = pool[(pi + si) % pool.length] || engineers[(pi + si) % engineers.length].id;
      const dueOffset = isPast ? -10 - si : isCurrent ? (pi % 12) - 3 : 20 + si;
      out.push({
        id: `TSK${String(counter++).padStart(4, "0")}`,
        name: `${tpl.name} — ${p.bridgeName.split(" ")[0]}`,
        projectId: p.id,
        assigneeId: assignee,
        team,
        stage: p.stage === "Completed" ? "Completed" : (isPast ? stg : stg),
        priority: pick(priorities, pi + si),
        dueDate: addDays(TODAY, dueOffset),
        progress:
          p.stage === "Completed" ? 100 :
          isPast ? 100 :
          isCurrent ? 30 + ((pi * 7 + si) % 55) :
          0,
      });
    });
    // Mark past-stage tasks as their own completed column for the board
    // (rewrite the tasks we just pushed so past stages appear in "Completed")
    for (let k = out.length - covered.length; k < out.length; k++) {
      const t = out[k];
      const tIdx = out.length - k - 1;
      const positionFromEnd = covered.length - 1 - (out.length - 1 - k);
      // If this task is not the current-stage one and project isn't sitting there, mark completed
      if (t.progress === 100 && t.stage !== "Completed") {
        t.stage = "Completed";
      }
      void tIdx; void positionFromEnd;
    }
  });
  return out;
})();

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
  { id: "N1", type: "Task", title: "Site visit scheduled", message: "Numerical team site visit assigned for Chenab Rail Bridge.", time: "10 min ago", read: false },
  { id: "N2", type: "Deadline", title: "Load test approaching", message: "Load test with Railway scheduled for Pamban in 2 days.", time: "1 hour ago", read: false },
  { id: "N3", type: "Delay", title: "Project delay flagged", message: "Godavari Arch Bridge sensor installation delayed.", time: "3 hours ago", read: false },
  { id: "N4", type: "Document", title: "Methodology uploaded", message: "Dr. Lakshmi Narayan uploaded Monitoring Methodology v2.", time: "Yesterday", read: true },
  { id: "N5", type: "System", title: "Weekly digest ready", message: "Portfolio performance digest is ready.", time: "2 days ago", read: true },
  { id: "N6", type: "Task", title: "Data transferred to Numerical", message: "Bogibeel processed sensor data handed over to Numerical team.", time: "2 days ago", read: true },
];

// ---------- Activities ----------
export const activities: Activity[] = [
  { id: "A1", projectId: projects[0].id, actor: projectManager.name, action: "assigned Numerical team to Pamban SHM", time: "2h ago" },
  { id: "A2", projectId: projects[1].id, actor: instrHod.name, action: "signed off sensor validation for Chenab", time: "4h ago" },
  { id: "A3", projectId: projects[2].id, actor: numHod.name, action: "approved FEM validation for Bogibeel", time: "Yesterday" },
  { id: "A4", projectId: projects[3].id, actor: engineers[2].name, action: "completed strain gauge installation", time: "Yesterday" },
  { id: "A5", projectId: projects[4].id, actor: projectManager.name, action: "received new project Vembanad SHM from client", time: "2 days ago" },
  { id: "A6", projectId: projects[5].id, actor: managingDirector.name, action: "reviewed monthly performance report", time: "3 days ago" },
];

// ---------- Calendar events ----------
export const calendarEvents: CalendarEvent[] = [
  ...projects.map((p, i) => ({
    id: `EVT-D${i}`,
    date: p.expectedCompletion,
    title: `Report submission: ${p.bridgeName}`,
    type: "Report Submission" as EventType,
    projectId: p.id,
  })),
  ...Array.from({ length: 22 }).map((_, i) => {
    const project = pick(projects, i);
    const types: EventType[] = ["Site Visit", "Sensor Installation", "Load Test", "Meeting", "Client Meeting", "Review", "Leave"];
    const type = pick(types, i);
    const offset = (i % 22) - 8;
    const title =
      type === "Site Visit" ? `Site visit — ${project.location.split(",")[0]}` :
      type === "Sensor Installation" ? `Sensor installation — ${project.bridgeName.split(" ")[0]}` :
      type === "Load Test" ? `Load test — ${project.bridgeName.split(" ")[0]}` :
      type === "Meeting" ? `Methodology meeting — ${project.bridgeName.split(" ")[0]}` :
      type === "Client Meeting" ? `Client meeting — ${project.bridgeName.split(" ")[0]}` :
      type === "Review" ? `Design review — ${project.bridgeName.split(" ")[0]}` :
      type === "Report Submission" ? `Report submission — ${project.bridgeName.split(" ")[0]}` :
      type === "Deadline" ? `Deadline — ${project.bridgeName.split(" ")[0]}` :
      `${pick(engineers, i).name} on leave`;
    return {
      id: `EVT-${i}`,
      date: addDays(TODAY, offset),
      title,
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
  const completedTasks = teamTasks.filter((t) => t.stage === "Completed").length;
  const pendingTasks = teamTasks.filter((t) => t.stage !== "Completed").length;
  const delayedTasks = teamTasks.filter((t) => t.stage !== "Completed" && t.dueDate < TODAY_ISO).length;
  const currentProjects = projects.filter((p) =>
    p.status !== "Completed" && p.responsibleTeam === team
  );
  const pendingProjects = projects.filter((p) =>
    p.status !== "Completed" && p.responsibleTeam !== team &&
    (team === "Instrumentation" ? p.instrumentationEngineers.length > 0 : p.numericalEngineers.length > 0)
  );
  const working = members.filter((e) => e.availability === "Busy").length;
  const available = members.filter((e) => e.availability === "Available").length;
  const onLeave = members.filter((e) => e.availability === "On Leave").length;
  const completionPct = teamTasks.length ? Math.round((completedTasks / teamTasks.length) * 100) : 0;

  // Team-specific metrics
  const sensorsInstalled = team === "Instrumentation"
    ? projects.reduce((s, p) => s + p.sensorsInstalled, 0)
    : 0;
  const loadTestsDone = team === "Instrumentation"
    ? projects.filter((p) => p.loadTestStatus === "Completed").length
    : 0;
  const reportsInPrep = team === "Instrumentation"
    ? projects.filter((p) => p.stage === "Report Preparation").length
    : 0;
  const siteVisitsDone = team === "Numerical"
    ? projects.filter((p) => workflowSteps.indexOf(p.stage) > workflowSteps.indexOf("Site Visit")).length
    : 0;
  const methodologiesApproved = team === "Numerical"
    ? projects.filter((p) => p.methodologyStatus === "Approved").length
    : 0;
  const analysisPending = team === "Numerical"
    ? projects.filter((p) => p.femStatus === "In Progress" || p.femStatus === "Under Review").length
    : 0;
  const analysisCompleted = team === "Numerical"
    ? projects.filter((p) => p.femStatus === "Approved").length
    : 0;

  return {
    members, eng, teamTasks, completedTasks, pendingTasks, delayedTasks,
    currentProjects, pendingProjects, working, available, onLeave, completionPct,
    sensorsInstalled, loadTestsDone, reportsInPrep,
    siteVisitsDone, methodologiesApproved, analysisPending, analysisCompleted,
  };
}
export function currentTaskForEmployee(empId: string) {
  return tasks.find((t) => t.assigneeId === empId && t.stage !== "Completed" && t.progress > 0 && t.progress < 100)
    || tasks.find((t) => t.assigneeId === empId && t.stage !== "Completed");
}
export function currentProjectForEmployee(empId: string) {
  const t = currentTaskForEmployee(empId);
  return t ? getProject(t.projectId) : projects.find((p) => p.status !== "Completed" && (p.instrumentationEngineers.includes(empId) || p.numericalEngineers.includes(empId)));
}
