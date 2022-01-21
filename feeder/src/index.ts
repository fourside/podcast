import { buildApp } from "./app";
import { Env } from "./env";

try {
  const port = Env.getPort();
  buildApp().listen(port, "0.0.0.0", (err, address) => {
    if (err !== null) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening on ${address}`);
  });
} catch (error) {
  console.error(error);
  process.exit(-1);
}
