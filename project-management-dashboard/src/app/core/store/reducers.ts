import { ActionReducerMap } from '@ngrx/store';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import * as ProjectActions from './actions/project.actions';
import * as TaskActions from './actions/task.actions';

// Define state interfaces
export interface ProjectState {
  selectedProject: Project | null;
  projects: Project[];
  total: number;
  loading: boolean;
  error: any;
}

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  total: number;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  project: ProjectState;
  task: TaskState;
}

// Initial states
export const initialProjectState: ProjectState = {
  selectedProject: null,
  projects: [],
  total: 0,
  loading: false,
  error: null
};

export const initialTaskState: TaskState = {
  tasks: [],
  selectedTask: null,
  total: 0,
  loading: false,
  error: null
};

// Project reducer
export function projectReducer(state = initialProjectState, action: any): ProjectState {
  switch (action.type) {
    case ProjectActions.loadProjects.type:
      return { ...state, loading: true, error: null };
    case ProjectActions.loadProjectsSuccess.type:
      return { ...state, loading: false, projects: action.projects, total: action.total };
    case ProjectActions.loadProjectsFailure.type:
      return { ...state, loading: false, error: action.error };
    case ProjectActions.loadProject.type:
      return { ...state, loading: true, error: null };
    case ProjectActions.loadProjectSuccess.type:
      return { ...state, loading: false, selectedProject: action.project };
    case ProjectActions.loadProjectFailure.type:
      return { ...state, loading: false, error: action.error };
    case ProjectActions.createProject.type:
      return { ...state, loading: true, error: null };
    case ProjectActions.createProjectSuccess.type:
      return { ...state, loading: false, projects: [...state.projects, action.project] };
    case ProjectActions.createProjectFailure.type:
      return { ...state, loading: false, error: action.error };
    case ProjectActions.updateProject.type:
      return { ...state, loading: true, error: null };
    case ProjectActions.updateProjectSuccess.type:
      return {
        ...state,
        loading: false,
        projects: state.projects.map(p => p.id === action.project.id ? action.project : p),
        selectedProject: state.selectedProject?.id === action.project.id ? action.project : state.selectedProject
      };
    case ProjectActions.updateProjectFailure.type:
      return { ...state, loading: false, error: action.error };
    case ProjectActions.deleteProject.type:
      return { ...state, loading: true, error: null };
    case ProjectActions.deleteProjectSuccess.type:
      return {
        ...state,
        loading: false,
        projects: state.projects.filter(p => p.id !== action.id),
        selectedProject: state.selectedProject?.id === action.id ? null : state.selectedProject
      };
    case ProjectActions.deleteProjectFailure.type:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

// Task reducer
export function taskReducer(state = initialTaskState, action: any): TaskState {
  switch (action.type) {
    case TaskActions.loadTasks.type:
      return { ...state, loading: true, error: null };
    case TaskActions.loadTasksSuccess.type:
      return { ...state, loading: false, tasks: action.tasks, total: action.total };
    case TaskActions.loadTasksFailure.type:
      return { ...state, loading: false, error: action.error };
    case TaskActions.loadTask.type:
      return { ...state, loading: true, error: null };
    case TaskActions.loadTaskSuccess.type:
      return { ...state, loading: false, selectedTask: action.task, tasks: state.tasks.map(t => t.id === action.task.id ? action.task : t) };
    case TaskActions.loadTaskFailure.type:
      return { ...state, loading: false, error: action.error };
    case TaskActions.createTask.type:
      return { ...state, loading: true, error: null };
    case TaskActions.createTaskSuccess.type:
      return { ...state, loading: false, tasks: [...state.tasks, action.task] };
    case TaskActions.createTaskFailure.type:
      return { ...state, loading: false, error: action.error };
    case TaskActions.updateTask.type:
      return { ...state, loading: true, error: null };
    case TaskActions.updateTaskSuccess.type:
      return { ...state, loading: false, tasks: state.tasks.map(t => t.id === action.task.id ? action.task : t) };
    case TaskActions.updateTaskFailure.type:
      return { ...state, loading: false, error: action.error };
    case TaskActions.deleteTask.type:
      return { ...state, loading: true, error: null };
    case TaskActions.deleteTaskSuccess.type:
      return { ...state, loading: false, tasks: state.tasks.filter(t => t.id !== action.id) };
    case TaskActions.deleteTaskFailure.type:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

// Define reducers
export const reducers: ActionReducerMap<AppState> = {
  project: projectReducer,
  task: taskReducer
};

// Export root reducer
export const rootReducer = reducers;
