import type { FastifyInstance } from "fastify";
import { renderToStaticMarkup } from "react-dom/server";
import { Feed } from "./feed";

const xmlDocType = '<?xml version="1.0" encoding="UTF-8"?>';

export async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get("/feed", async (request, reply) => {
    const baseUrl = `${request.protocol}://${request.hostname}`;
    const markup = renderToStaticMarkup(<Feed baseUrl={baseUrl} />);
    reply.header("Content-Type", "application/xml").send(xmlDocType + markup);
  });
}
