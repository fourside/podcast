import { Router } from "express";
import { renderToStaticMarkup } from "react-dom/server";
import { Feed } from "./feed";

export const router = Router();

router.get("/feed", (req, res) => {
  const markup = renderToStaticMarkup(<Feed />);
  res.setHeader("Content-Type", "application/xml");
  res.send(markup);
});
