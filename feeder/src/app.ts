import fastify from "fastify";
import type { FastifyInstance, FastifyServerOptions } from "fastify";
import helmet from "fastify-helmet";
import { routes } from "./router";
import { basicAuth } from "./basic-auth";

export function buildApp(options?: FastifyServerOptions): FastifyInstance {
  const app = fastify(options);
  app.register(helmet);
  app.addHook("preHandler", basicAuth);
  app.register(routes);
  return app;
}
