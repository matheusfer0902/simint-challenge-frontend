import { httpClient } from "@/lib/api/http-client";

export interface UserFollowSummary {
  id: string;
  username: string;
}

export interface MeDto {
  id: string;
  username: string;
  email: string;
  role: "trainer" | "researcher" | "admin";
  followedBy: UserFollowSummary[];
  following: UserFollowSummary[];
}

export interface UpdateMeDto {
  username?: string;
  email?: string;
  role?: "trainer" | "researcher";
  password?: string;
}

export interface UserListItemDto {
  id: string;
  username: string;
  email: string;
  role: "trainer" | "researcher" | "admin";
}

export interface UsersListResponseDto {
  data: UserListItemDto[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: "trainer" | "researcher";
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: "trainer" | "researcher";
  password?: string;
}

class UserService {
  async getMe(): Promise<MeDto> {
    return httpClient.get<MeDto>("/me");
  }

  async updateMe(data: UpdateMeDto): Promise<UserListItemDto> {
    return httpClient.patch<UserListItemDto>("/me", data);
  }

  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    filter?: "trainer" | "researcher" | "admin";
  }): Promise<UsersListResponseDto> {
    const q = new URLSearchParams();
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.limit != null) q.set("limit", String(params.limit));
    if (params?.search?.trim()) q.set("search", params.search.trim());
    if (params?.filter) q.set("filter", params.filter);
    const query = q.toString();
    return httpClient.get<UsersListResponseDto>(`/users${query ? `?${query}` : ""}`);
  }

  async getUserById(id: string): Promise<MeDto> {
    return httpClient.get<MeDto>(`/users/${id}`);
  }

  async createUser(data: CreateUserDto): Promise<UserListItemDto> {
    return httpClient.post<UserListItemDto>("/users", data);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserListItemDto> {
    return httpClient.patch<UserListItemDto>(`/users/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    return httpClient.delete(`/users/${id}`);
  }
}

export const userService = new UserService();
