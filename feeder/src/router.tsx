import { Router } from "express";
import { renderToStaticMarkup } from "react-dom/server";
import { Feed } from "./feed";

export const router = Router();

const xmlDocType = '<?xml version="1.0" encoding="UTF-8"?>';

router.get("/feed", (req, res) => {
  const markup = renderToStaticMarkup(<Feed />);
  res.setHeader("Content-Type", "application/xml");
  res.send(xmlDocType + markup);
});
