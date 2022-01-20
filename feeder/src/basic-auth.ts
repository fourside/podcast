import type { Request, Response, NextFunction} from "express";

export function basicAuth(req: Request, res: Response, next: NextFunction): void {
  const allowedUser = process.env.USER;
  if (allowedUser === undefined) {
    throw new Error("USER environment variable is not set");
  }
  const allowedPassword = process.env.PASSWORD;
  if (allowedPassword === undefined) {
    throw new Error("PASSWORD environment variable is not set");
  }

  const auth = req.headers.authorization;
  if (auth === undefined) {
    res.status(401).header("WWW-Authenticate", "Basic realm='private podcast'").end();
    return;
  }
  if (auth !== undefined && auth.toLocaleLowerCase().startsWith("basic ")) {
    const [, base64] = auth.split(" ");
    const [username, password] = Buffer.from(base64, "base64").toString().split(":");
    if (username === allowedUser && password === allowedPassword) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(401).send("Unauthorized");
  }
}
