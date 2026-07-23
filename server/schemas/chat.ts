import { z } from "zod";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(2_000),
});

export const chatRequestSchema = z
  .object({
    message: z.string().trim().min(1).max(1_000),
    history: z.array(chatMessageSchema).max(20).default([]),
  })
  .strict();

export type ChatRequest = z.infer<typeof chatRequestSchema>;
