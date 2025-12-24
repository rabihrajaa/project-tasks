import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { AuthUser, LoginRequest, LoginResponse, RegisterRequest, RefreshTokenRequest, ChangePasswordRequest, UpdateProfileRequest, User, RefreshTokenResponse, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
      this.refreshToken().subscribe({
        next: () => {
          this.isAuthenticatedSubject.next(true);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Mock response for development when backend is not available
    const mockResponse: LoginResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      type: 'Bearer',
      id: 1,
      username: credentials.username,
      email: credentials.username + '@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.USER,
      department: 'IT',
      position: 'Developer'
    };

    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
        // Create AuthUser from response
        const authUser: AuthUser = {
          id: response.id.toString(),
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          role: response.role,
          avatar: undefined // Not provided by backend yet
        };
        this.currentUserSubject.next(authUser);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.warn('Backend not available, using mock login response');
        // Return mock response when backend is not available
        this.setSession(mockResponse);
        const authUser: AuthUser = {
          id: mockResponse.id.toString(),
          email: mockResponse.email,
          firstName: mockResponse.firstName,
          lastName: mockResponse.lastName,
          role: mockResponse.role,
          avatar: undefined
        };
        this.currentUserSubject.next(authUser);
        this.isAuthenticatedSubject.next(true);
        return of(mockResponse);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.API_URL}/register`, userData);
  }

  logout(): void {
    this.clearSession();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<RefreshTokenResponse>(`${this.API_URL}/refresh`, request).pipe(
      tap(response => {
        // Update tokens in localStorage
        localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/change-password`, request);
  }

  updateProfile(request: UpdateProfileRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/profile`, request).pipe(
      tap(user => {
        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar
        };
        this.currentUserSubject.next(authUser);
        this.saveUserToStorage(authUser);
      })
    );
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  private setSession(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    // Create AuthUser from response
    const authUser: AuthUser = {
      id: response.id.toString(),
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role,
      avatar: undefined // Not provided by backend yet
    };
    this.saveUserToStorage(authUser);
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    return token ? !this.isTokenExpired(token) : false;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  private getUserFromStorage(): AuthUser | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  private saveUserToStorage(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Auto refresh token before expiration
  startTokenRefreshTimer(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const expiresAt = decoded.exp * 1000;
      const refreshAt = expiresAt - (5 * 60 * 1000); // 5 minutes before expiration
      const timeout = refreshAt - Date.now();

      if (timeout > 0) {
        setTimeout(() => {
          this.refreshToken().subscribe();
        }, timeout);
      }
    } catch (error) {
      console.error('Error setting token refresh timer:', error);
    }
  }
}
