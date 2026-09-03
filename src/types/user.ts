export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface ResetPasswordRequest {
  email: string;
}
