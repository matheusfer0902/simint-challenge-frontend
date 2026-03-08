import type { Role } from "./types";

const BASE_PATHS = [
  "/dashboard",
  "/teams",
  "/pokemon",
  "/pokedex",
  "/train",
  "/healing",
  "/users",
  "/profile",
] as const;

const TRAINER_PATHS: readonly string[] = [
  "/dashboard",
  "/teams",
  "/pokemon",
  "/train",
  "/healing",
  "/profile",
];

const RESEARCHER_PATHS: readonly string[] = [
  "/dashboard",
  "/teams",
  "/pokemon",
  "/pokedex",
  "/healing",
  "/profile",
];

export const ALLOWED_PATHS_BY_ROLE: Readonly<Record<Role, readonly string[]>> = {
  admin: BASE_PATHS,
  trainer: TRAINER_PATHS,
  researcher: RESEARCHER_PATHS,
};
