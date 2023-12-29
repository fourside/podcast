import { z } from "x/zod";

const TaskSchema = z.object({
  id: z.string(),
  stationId: z.string(),
  title: z.string(),
  personality: z.string(),
  fromTime: z.string(),
  duration: z.string(),
});

export const TasksSchema = z.array(TaskSchema);

export type Task = z.infer<typeof TaskSchema>;
