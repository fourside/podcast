import { create } from "x/djwt";
import { Env } from "../env.ts";

export async function createJwt(): Promise<string> {
  const buf = new TextEncoder().encode(Env.queueSecretKey);
  const key = await crypto.subtle.importKey(
    "raw",
    buf,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const now = new Date();
  return await create(
    {
      alg: "HS512",
      typ: "JWT",
    },
    {
      sub: crypto.randomUUID(),
      name: Env.queueUsername,
      iss: "private-podcast",
      iat: Math.floor(now.getTime() / 1000),
      exp: Math.floor(new Date(2100, 1, 1).getTime() / 1000),
      nbf: Math.floor(now.getTime() / 1000),
      aud: "podcast-task",
    },
    key,
  );
}
