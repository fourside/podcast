import { z } from "x/zod";

const ProgramSchema = z.object({
  id: z.string(),
  stationId: z.string(),
  title: z.string(),
  personality: z.string(),
  fromTime: z.string(),
  duration: z.string(),
});

export const ProgramsSchema = z.array(ProgramSchema);

export type Program = z.infer<typeof ProgramSchema>;
