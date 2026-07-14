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
  status: ProjectStatus;
  priority: Priority;
  progress: number;
  health: "Good" | "At Risk" | "Critical";
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
}

export interface DocumentItem {
  id: string;
  name: string;
  projectId: string;
  type: "Report" | "Drawing" | "Site Photo" | "Sensor Layout" | "PDF";
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
