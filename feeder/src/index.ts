import express from "express";
import { router } from "./router";

const app = express();
app.use("/", router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
