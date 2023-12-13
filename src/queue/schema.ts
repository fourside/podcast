import { z } from "x/zod";

export const MessageBodySchema = z.object({
  stationId: z.string(),
  title: z.string(),
  personality: z.string(),
  fromTime: z.string(),
  duration: z.string(),
});
