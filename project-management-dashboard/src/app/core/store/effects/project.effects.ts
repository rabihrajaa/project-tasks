import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import * as ProjectActions from '../actions/project.actions';
import { ProjectService } from '../../services/project.service';
import { UpdateProjectRequest } from '../../models/project.model';

@Injectable()
export class ProjectEffects {
  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.loadProjects),
      mergeMap(() =>
        this.projectService.getProjects().pipe(
          map(result => ProjectActions.loadProjectsSuccess({ projects: result.projects, total: result.total })),
          catchError(error => of(ProjectActions.loadProjectsFailure({ error })))
        )
      )
    )
  );

  loadProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.loadProject),
      mergeMap(action =>
        this.projectService.getProjectById(action.id).pipe(
          map(project => ProjectActions.loadProjectSuccess({ project })),
          catchError(error => of(ProjectActions.loadProjectFailure({ error })))
        )
      )
    )
  );

  createProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.createProject),
      mergeMap(action =>
        this.projectService.createProject(action.project as any).pipe(
          map(project => ProjectActions.createProjectSuccess({ project })),
          catchError(error => of(ProjectActions.createProjectFailure({ error })))
        )
      )
    )
  );

  updateProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.updateProject),
      mergeMap(action =>
        this.projectService.updateProject(action.id, action.project as UpdateProjectRequest).pipe(
          map(project => ProjectActions.updateProjectSuccess({ project })),
          catchError(error => of(ProjectActions.updateProjectFailure({ error })))
        )
      )
    )
  );

  deleteProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.deleteProject),
      mergeMap(action =>
        this.projectService.deleteProject(action.id).pipe(
          map(() => ProjectActions.deleteProjectSuccess({ id: action.id })),
          catchError(error => of(ProjectActions.deleteProjectFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private projectService: ProjectService
  ) {}
}
