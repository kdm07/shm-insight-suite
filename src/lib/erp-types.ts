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
export type TaskStatus = "To Do" | "Assigned" | "In Progress" | "Waiting Review" | "Completed";
export type Team = "Instrumentation" | "Numerical";

export type ProjectStage =
  | "Project Received"
  | "Planning"
  | "Instrumentation Work"
  | "Site Monitoring"
  | "Numerical Analysis"
  | "Report Preparation"
  | "Review"
  | "Completed";

export type ProjectHealth = "Healthy" | "Attention" | "Delayed" | "Blocked";
export type ResponsibleTeam = "Instrumentation" | "Numerical" | "Management" | "—";

export type EventType = "Meeting" | "Site Visit" | "Deadline" | "Review" | "Leave";
export type DocCategory = "Reports" | "Drawings" | "Photos" | "Sensor Layouts" | "Calculations";

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
  managerId: string;
  instrumentationHodId: string;
  numericalHodId: string;
  instrumentationEngineers: string[];
  numericalEngineers: string[];
  startDate: string;
  endDate: string;
  expectedCompletion: string;
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  health: ProjectHealth;
  stage: ProjectStage;
  responsibleTeam: ResponsibleTeam;
  delayDays: number;
  description: string;
  workflowStep: number;
}

export interface Task {
  id: string;
  name: string;
  projectId: string;
  assigneeId: string;
  team: Team;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  progress: number;
  stage: ProjectStage;
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
