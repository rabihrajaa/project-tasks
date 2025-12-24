export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedUsers: string[];
  projectId: string;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  dependencies?: string[];
  comments?: Comment[];
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: Date;
  assignedUsers: string[];
  projectId: string;
  tags: string[];
  estimatedHours?: number;
  dependencies?: string[];
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  id: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  assignedUser?: string;
  projectId?: string;
  tags?: string[];
  dueDate?: Date;
  search?: string;
}

export interface TaskStats {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completedThisWeek: number;
  averageCompletionTime: number;
  totalUsers: number;
  taskPriorityDistribution: { [key: string]: number };
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  taskId: string;
}

export interface TaskSummary {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: Date;
  projectName: string;
  overdue: boolean;
}
