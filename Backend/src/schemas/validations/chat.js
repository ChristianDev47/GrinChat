import { z } from 'zod';

// Validate Chat
const chatSchema = z.object({
  // Validate participants
  participants: z
    .array(
      z.object({
        userId: z.string(),
      })
    )
    .optional(),
});

export function validateChat(input) {
  return chatSchema.safeParse(input);
}
export function validatePartialChat(input) {
  return updateUserSchema.partial().safeParse(input);
}
