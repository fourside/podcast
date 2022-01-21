import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";
import { Env } from "./env";

export function basicAuth(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction): void {
  const auth = request.headers.authorization;
  if (auth === undefined) {
    reply.status(401).header("WWW-Authenticate", "Basic realm='private podcast'").send();
    done();
  }
  if (auth !== undefined && auth.toLocaleLowerCase().startsWith("basic ")) {
    const [, base64] = auth.split(" ");
    const [username, password] = Buffer.from(base64, "base64").toString().split(":");
    if (username === Env.getAllowedUser() && password === Env.getAllowedPassword()) {
      done();
    } else {
      reply.status(401).send("Unauthorized");
    }
  } else {
    reply.status(401).send("Unauthorized");
  }
}
