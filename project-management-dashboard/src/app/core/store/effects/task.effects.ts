import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import * as TaskActions from '../actions/task.actions';
import { TaskService } from '../../services/task.service';
import { CreateTaskRequest, UpdateTaskRequest } from '../../models/task.model';

@Injectable()
export class TaskEffects {
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() =>
        this.taskService.getTasks().pipe(
          map(result => TaskActions.loadTasksSuccess({ tasks: result.tasks, total: result.total })),
          catchError(error => of(TaskActions.loadTasksFailure({ error })))
        )
      )
    )
  );

  loadTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTask),
      mergeMap(action =>
        this.taskService.getTaskById(action.id).pipe(
          map(task => TaskActions.loadTaskSuccess({ task })),
          catchError(error => of(TaskActions.loadTaskFailure({ error })))
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      mergeMap(action =>
        this.taskService.createTask(action.task as CreateTaskRequest).pipe(
          map(task => TaskActions.createTaskSuccess({ task })),
          catchError(error => of(TaskActions.createTaskFailure({ error })))
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap(action =>
        this.taskService.updateTask(action.id, action.task as UpdateTaskRequest).pipe(
          map(task => TaskActions.updateTaskSuccess({ task })),
          catchError(error => of(TaskActions.updateTaskFailure({ error })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(action =>
        this.taskService.deleteTask(action.id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id: action.id })),
          catchError(error => of(TaskActions.deleteTaskFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private taskService: TaskService
  ) {}
}
