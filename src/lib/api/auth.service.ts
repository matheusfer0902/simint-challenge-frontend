import { httpClient } from "@/lib/api/http-client";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: "trainer" | "researcher";
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: "trainer" | "researcher";
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponseDto {
  user: UserDto;
}

class AuthService {
  async login(credentials: LoginDto): Promise<AuthResponseDto> {
    return httpClient.post<AuthResponseDto>("/auth/login", credentials);
  }

  async register(data: RegisterDto): Promise<AuthResponseDto> {
    return httpClient.post<AuthResponseDto>("/auth/register", data);
  }

  async logout(): Promise<void> {
    return httpClient.post<void>("/auth/logout");
  }

  async me(): Promise<UserDto> {
    return httpClient.get<UserDto>("/auth/me");
  }
}

export const authService = new AuthService();