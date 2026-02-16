/**
 * Auth constants mirroring docdrift API policy.
 * Used by API routes for header validation and scopes.
 */
export const AUTH_HEADER = "authorization";
export const AUTH_SCOPE_HEADER = "x-datastack-scope";
export const API_KEY_HEADER = "x-api-key";

export const SCOPES = {
  READ_USERS: "read:users",
  WRITE_USERS: "write:users",
  READ_WORKSPACES: "read:workspaces",
  MANAGE_WORKSPACES: "manage:workspaces",
  READ_CLUSTERS: "read:clusters",
  MANAGE_CLUSTERS: "manage:clusters",
  READ_JOBS: "read:jobs",
  MANAGE_JOBS: "manage:jobs",
  READ_NOTEBOOKS: "read:notebooks",
  MANAGE_NOTEBOOKS: "manage:notebooks",
  READ_SQL: "read:sql",
  MANAGE_SQL: "manage:sql",
  READ_PIPELINES: "read:pipelines",
  MANAGE_PIPELINES: "manage:pipelines",
  READ_STACKS: "read:stacks",
  MANAGE_STACKS: "manage:stacks",
  READ_CONNECTIONS: "read:connections",
  MANAGE_CONNECTIONS: "manage:connections",
  READ_CATALOGS: "read:catalogs",
  MANAGE_CATALOGS: "manage:catalogs",
  READ_SECRETS: "read:secrets",
  MANAGE_SECRETS: "manage:secrets",
  READ_QUERIES: "read:queries",
  MANAGE_QUERIES: "manage:queries",
  READ_DEPLOYMENTS: "read:deployments",
  MANAGE_DEPLOYMENTS: "manage:deployments",
  MANAGE_WEBHOOKS: "manage:webhooks",
  MANAGE_API_KEYS: "manage:api_keys",
} as const;

export type Scope = (typeof SCOPES)[keyof typeof SCOPES];

export const AUTH_SCOPE_VALUE = SCOPES.READ_USERS;
