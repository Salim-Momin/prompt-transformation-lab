export interface AuthUser {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  user: AuthUser;
}

export interface AuthApiError {
  detail?:
    | string
    | Array<{
        msg?: string;
      }>;
}