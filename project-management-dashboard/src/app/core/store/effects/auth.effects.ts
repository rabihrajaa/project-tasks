import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import * as AuthActions from '../actions/auth.actions';
import { AuthService } from '../../services/auth.service';
import { AuthUser } from '../../models/user.model';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(action =>
        this.authService.login({ username: action.username, password: action.password }).pipe(
          map(response => {
            const authUser: AuthUser = {
              id: response.id.toString(),
              email: response.email,
              firstName: response.firstName,
              lastName: response.lastName,
              role: response.role,
              avatar: undefined
            };
            return AuthActions.loginSuccess({ user: authUser, token: response.token });
          }),
          catchError(error => of(AuthActions.loginFailure({ error: error.message || 'Login failed' })))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        of(this.authService.logout()).pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(error => of(AuthActions.logoutFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
