import { buildApp } from "./app";
import { Env } from "./env";

try {
  const port = Env.getPort();
  buildApp({ logger: true }).listen(port, "0.0.0.0");
} catch (error) {
  console.error(error);
  process.exit(-1);
}
