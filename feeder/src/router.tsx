import type { FastifyInstance } from "fastify";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import * as path from "path";
import { Index } from "./components";
import { Feed } from "./feed";
import { getClientSideJs } from "./client-side-js";
import { renderHtml } from "./render-html";

const xmlDocType = '<?xml version="1.0" encoding="UTF-8"?>';

export async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get("/", (request, reply) => {
    const markup = renderToString(<Index />);
    const html = renderHtml(markup);
    reply.header("Content-Type", "text/html").send(html);
  });
  fastify.get<{ Params: JsPathParams }>("/js/:jsFile", (request, reply) => {
    const jsFileName = request.params.jsFile;
    const baseName = path.parse(jsFileName).name;
    try {
      const clientJs = getClientSideJs(path.join(__dirname, `./components/${baseName}.tsx`));
      reply.header("Content-Type", "application/javascript").send(clientJs);
    } catch (error) {
      reply.header("Content-Type", "application/javascript").status(500).send(undefined);
    }
  });
  fastify.get("/feed", async (request, reply) => {
    const baseUrl = `${request.protocol}://${request.hostname}`;
    const markup = renderToStaticMarkup(<Feed baseUrl={baseUrl} />);
    reply.header("Content-Type", "application/xml").send(xmlDocType + markup);
  });
}

type JsPathParams = {
  jsFile: string;
};
