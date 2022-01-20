import type { Request, Response, NextFunction } from "express";
import { Env } from "./env";

export function basicAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (auth === undefined) {
    res.status(401).header("WWW-Authenticate", "Basic realm='private podcast'").end();
    return;
  }
  if (auth !== undefined && auth.toLocaleLowerCase().startsWith("basic ")) {
    const [, base64] = auth.split(" ");
    const [username, password] = Buffer.from(base64, "base64").toString().split(":");
    if (username === Env.getAllowedUser() && password === Env.getAllowedPassword()) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(401).send("Unauthorized");
  }
}
