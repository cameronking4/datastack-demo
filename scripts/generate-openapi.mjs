#!/usr/bin/env node
/**
 * Generates OpenAPI 3.0 spec from JSDoc-annotated Next.js API routes.
 * Output: openapi/generated.json (used by docdrift for current spec)
 */
import { createSwaggerSpec } from "next-swagger-doc";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const outputPath = join(projectRoot, "openapi", "generated.json");

const spec = createSwaggerSpec({
  apiFolder: "app/api",
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DataStack API",
      version: "1.0.0",
      description: "DataStack platform REST API",
    },
    servers: [
      { url: "/api/v1", description: "API v1" },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "API key for authentication",
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [],
  },
});

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(spec, null, 2));
console.log(`OpenAPI spec written to ${outputPath}`);
