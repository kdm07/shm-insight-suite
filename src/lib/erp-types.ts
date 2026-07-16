export type Role =
  | "Admin"
  | "Managing Director"
  | "Project Manager"
  | "Instrumentation HOD"
  | "Numerical HOD"
  | "Instrumentation Engineer"
  | "Numerical Engineer"
  | "Viewer";

export type ProjectStatus = "Planning" | "Running" | "Review" | "Completed" | "Delayed";
export type Priority = "Low" | "Medium" | "High" | "Critical";
export type Team = "Instrumentation" | "Numerical";

// Full SHM workflow (12 stages, in order)
export type ProjectStage =
  | "Project Received"
  | "MD Assignment"
  | "Site Visit"
  | "Methodology Preparation"
  | "Sensor Installation"
  | "Sensor Validation"
  | "Load Testing"
  | "Data Extraction"
  | "Numerical Analysis"
  | "Report Preparation"
  | "Client Submission"
  | "Completed";

// Task board columns — the executable subset of the workflow
export type TaskStage =
  | "Site Visit"
  | "Methodology"
  | "Sensor Installation"
  | "Load Testing"
  | "Data Extraction"
  | "Numerical Analysis"
  | "Report Preparation"
  | "Completed";

// kept for backward compatibility (some files still import TaskStatus)
export type TaskStatus = TaskStage;

export type ProjectHealth = "Healthy" | "Attention" | "Delayed" | "Blocked";
export type ResponsibleTeam = "Instrumentation" | "Numerical" | "Management" | "—";

export type EventType =
  | "Meeting"
  | "Site Visit"
  | "Sensor Installation"
  | "Load Test"
  | "Report Submission"
  | "Client Meeting"
  | "Deadline"
  | "Review"
  | "Leave";

export type DocCategory = "Reports" | "Drawings" | "Photos" | "Sensor Layouts" | "Calculations";

// Status enums for stage-specific tracking
export type SensorStatus = "Not Started" | "In Progress" | "Installed" | "Validated";
export type CalibrationStatus = "Pending" | "In Progress" | "Calibrated" | "Failed";
export type LoadTestStatus = "Not Scheduled" | "Scheduled" | "In Progress" | "Completed";
export type AnalysisStatus = "Not Started" | "In Progress" | "Under Review" | "Approved";

export interface Employee {
  id: string;
  name: string;
  designation: string;
  role: Role;
  department: Team | "Management";
  email: string;
  phone: string;
  photo: string;
  availability: "Available" | "Busy" | "On Leave";
  projects: string[];
  completedProjects: number;
  performance: number;
  reportingManagerId?: string;
  experienceYears: number;
}

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  projectsCount: number;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  clientId: string;
  bridgeName: string;
  location: string;
  railwayDivision: string;
  bridgeType: string;
  spanLength: string;
  yearBuilt: number;
  managerId: string;
  instrumentationHodId: string;
  numericalHodId: string;
  instrumentationEngineers: string[];
  numericalEngineers: string[];
  currentEngineerId: string;
  startDate: string;
  endDate: string;
  expectedCompletion: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  health: ProjectHealth;
  stage: ProjectStage;
  nextStage: ProjectStage | "—";
  waitingFor: string;
  responsibleTeam: ResponsibleTeam;
  delayDays: number;
  description: string;
  workflowStep: number;
  // Instrumentation snapshot
  sensorsPlanned: number;
  sensorsInstalled: number;
  sensorStatus: SensorStatus;
  calibrationStatus: CalibrationStatus;
  loadTestStatus: LoadTestStatus;
  dataExtractionProgress: number;
  // Numerical snapshot
  siteVisitStatus: "Pending" | "Completed";
  methodologyStatus: "Draft" | "Under Review" | "Approved";
  analysisProgress: number;
  femStatus: AnalysisStatus;
  reportReviewStatus: "Not Started" | "In Review" | "Approved" | "Submitted";
}

export interface Task {
  id: string;
  name: string;
  projectId: string;
  assigneeId: string;
  team: Team;
  stage: TaskStage;          // task board column = stage
  priority: Priority;
  dueDate: string;
  progress: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  projectId: string;
  category: DocCategory;
  version: string;
  department: Team | "Management";
  approvedBy: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Notification {
  id: string;
  type: "Task" | "Deadline" | "Delay" | "Document" | "System";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Activity {
  id: string;
  projectId?: string;
  actor: string;
  action: string;
  time: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: EventType;
  projectId?: string;
}
