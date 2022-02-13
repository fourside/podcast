import type { FastifyInstance } from "fastify";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { Index } from "./components";
import { Feed } from "./feed";
import { getClientSideJs } from "./client-side-js";
import { renderHtml } from "./render-html";
import { getDiscFreeOfDevDevice } from "./df-dev-device";

const xmlDocType = '<?xml version="1.0" encoding="UTF-8"?>';

export async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get("/", async (request, reply) => {
    const dfByDevices = await getDiscFreeOfDevDevice();
    const markup = renderToString(<Index dfByDevices={dfByDevices} />);
    const html = renderHtml(markup, dfByDevices);
    reply.header("Content-Type", "text/html").send(html);
  });
  fastify.get<{ Params: JsPathParams }>("/js/:jsFile", (request, reply) => {
    try {
      const clientJs = getClientSideJs();
      reply.header("Content-Type", "application/javascript").send(clientJs);
    } catch (error) {
      console.error(error);
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
