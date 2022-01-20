import express from "express";
import helmet from "helmet";
import { basicAuth } from "./basic-auth";
import { Env } from "./env";
import { router } from "./router";

const app = express();
app.use(helmet());
app.use("/", basicAuth);
app.use("/", router);

const port = Env.getPort();

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
