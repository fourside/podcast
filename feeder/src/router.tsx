import { Router } from "express";
import { renderToStaticMarkup } from "react-dom/server";
import { Feed } from "./feed";

export const router = Router();

const xmlDocType = '<?xml version="1.0" encoding="UTF-8"?>';

router.get("/feed", (req, res) => {
  const baseUrl = `${req.protocol}://${req.hostname}`;
  const markup = renderToStaticMarkup(<Feed baseUrl={baseUrl} />);
  res.setHeader("Content-Type", "application/xml");
  res.send(xmlDocType + markup);
});
