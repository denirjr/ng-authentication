import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import {
  AuthActionTypes,
  LogIn,
  LogInSuccess,
  SignUp,
  SignUpSuccess,
  SignUpFailure,
  LogInFailure,
  GetStatus,
} from '../action/auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  @Effect()
  login: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN),
    map((action: LogIn) => action.payload),
    switchMap((payload: any) => this.callLogin(payload))
  );

  private callLogin(payload: any): Observable<any> {
    return this.authService.logIn(payload.email, payload.password).pipe(
      map((user) => {
        console.log(user);
        return new LogInSuccess({ token: user.token, email: payload.email });
      }),
      catchError((error) => {
        console.log(error);
        return of(new LogInFailure({ error: error }));
      })
    );
  }

  @Effect({ dispatch: false })
  logInSucess: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_SUCCESS),
    tap((user) => {
      localStorage.setItem('token', user.payload.token);
      this.router.navigateByUrl('/');
    })
  );

  @Effect({ dispatch: false })
  LogInFailure: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_FAILURE)
  );

  @Effect()
  SignUp: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.SIGNUP),
    map((action: SignUp) => action.payload),
    switchMap((payload) => this.callSignUp(payload))
  );

  callSignUp(payload): Observable<any> {
    return this.authService.signUp(payload.email, payload.password).pipe(
      map((user) => {
        console.log(user);
        return new SignUpSuccess({ token: user.token, email: payload.email });
      }),
      catchError((error) => {
        console.log(error);
        return of(new SignUpFailure({ error: error }));
      })
    );
  }

  @Effect({ dispatch: false })
  SignUpSuccess: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.SIGNUP_SUCCESS),
    tap((user) => {
      localStorage.setItem('token', user.payload.token);
      this.router.navigateByUrl('/');
    })
  );

  @Effect({ dispatch: false })
  SignUpFailure: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.SIGNUP_FAILURE)
  );

  @Effect({ dispatch: false })
  public LogOut: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGOUT),
    tap((user) => {
      localStorage.removeItem('token');
    })
  );

  @Effect({ dispatch: false })
  GetStatus: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.GET_STATUS),
    map((action: GetStatus) => action),
    switchMap((payload) => {
      return this.authService.getStatus();
    })
  );
}
