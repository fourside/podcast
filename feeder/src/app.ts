import fastify from "fastify";
import type { FastifyInstance, FastifyServerOptions } from "fastify";
import { routes } from "./router";

export function buildApp(options?: FastifyServerOptions): FastifyInstance {
  const app = fastify(options);
  app.register(routes);
  return app;
}
