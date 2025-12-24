export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueProjects: number;
  totalBudget: number;
  averageProgress: number;
  averageCompletionTime: number;
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

export interface DashboardData {
  projectStats: ProjectStats;
  taskStats: TaskStats;
  recentActivities: Activity[];
  upcomingDeadlines: Deadline[];
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  userId: string;
  projectId?: string;
  taskId?: string;
}

export interface Deadline {
  id: string;
  title: string;
  dueDate: Date;
  type: 'project' | 'task';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  overdue: boolean;
}

export enum ActivityType {
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_COMPLETED = 'PROJECT_COMPLETED',
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  USER_ASSIGNED = 'USER_ASSIGNED',
  COMMENT_ADDED = 'COMMENT_ADDED'
}
