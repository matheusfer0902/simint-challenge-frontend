import { httpClient } from "@/lib/api/http-client";

/** Resumo de usuário em followedBy / following (GET /me, GET /users/:id) */
export interface UserFollowSummary {
  id: string;
  username: string;
}

/** Resposta de GET /me e GET /users/:id */
export interface MeDto {
  id: string;
  username: string;
  email: string;
  role: "trainer" | "researcher" | "admin";
  followedBy: UserFollowSummary[];
  following: UserFollowSummary[];
}

/** Payload para PATCH /me */
export interface UpdateMeDto {
  username?: string;
  email?: string;
  role?: "trainer" | "researcher";
  password?: string;
}

/** Resumo retornado em PATCH /me e em listagens (POST /users, PATCH /users/:id, GET /users) */
export interface UserListItemDto {
  id: string;
  username: string;
  email: string;
  role: "trainer" | "researcher" | "admin";
}

/** Resposta paginada de GET /users */
export interface UsersListResponseDto {
  data: UserListItemDto[];
  total: number;
  page: number;
  limit: number;
}

/** Payload para POST /users (criar usuário — apenas admin) */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: "trainer" | "researcher";
}

/** Payload para PATCH /users/:id (editar usuário — apenas admin). Pelo menos um campo. */
export interface UpdateUserDto {
  username?: string;
  email?: string;
  role?: "trainer" | "researcher";
  password?: string;
}

class UserService {
  /**
   * GET /me — Retorna os dados do usuário autenticado.
   * Requer cookie access_token.
   */
  async getMe(): Promise<MeDto> {
    return httpClient.get<MeDto>("/me");
  }

  /**
   * PATCH /me — Atualiza username, email, role e/ou password do usuário autenticado.
   */
  async updateMe(data: UpdateMeDto): Promise<UserListItemDto> {
    return httpClient.patch<UserListItemDto>("/me", data);
  }

  /**
   * GET /users — Lista usuários (apenas admin). Paginação, busca e filtro por role via query.
   */
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

  /**
   * GET /users/:id — Busca usuário por ID (apenas admin). Mesmo formato de GET /me.
   */
  async getUserById(id: string): Promise<MeDto> {
    return httpClient.get<MeDto>(`/users/${id}`);
  }

  /**
   * POST /users — Cria usuário (apenas admin). Role apenas trainer ou researcher.
   */
  async createUser(data: CreateUserDto): Promise<UserListItemDto> {
    return httpClient.post<UserListItemDto>("/users", data);
  }

  /**
   * PATCH /users/:id — Edita usuário (apenas admin).
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<UserListItemDto> {
    return httpClient.patch<UserListItemDto>(`/users/${id}`, data);
  }

  /**
   * DELETE /users/:id — Exclui usuário (apenas admin).
   */
  async deleteUser(id: string): Promise<void> {
    return httpClient.delete(`/users/${id}`);
  }
}

export const userService = new UserService();
