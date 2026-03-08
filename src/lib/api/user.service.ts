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

/** Resumo retornado em PATCH /me e em listagens (POST /users, PATCH /users/:id) */
export interface UserListItemDto {
  id: string;
  username: string;
  email: string;
  role: "trainer" | "researcher" | "admin";
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
}

export const userService = new UserService();
