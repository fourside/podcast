import fastify from "fastify";
import type { FastifyInstance, FastifyServerOptions } from "fastify";
import { routes } from "./router";
import { basicAuth } from "./basic-auth";

export function buildApp(options?: FastifyServerOptions): FastifyInstance {
  const app = fastify(options);
  app.register(routes);
  app.addHook("preHandler", basicAuth);
  return app;
}
