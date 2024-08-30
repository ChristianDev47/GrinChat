import { z } from 'zod';

// Validate participants
const participantSchema = z.object({
  // Validate userId
  userId: z.string({
    required_error: 'User ID is required',
  }),
  // Validate role
  role: z.enum(['Admin', 'Member']).default('Member'),
});

// Validation GroupChat
const groupChatSchema = z.object({
  // Validate name
  name: z.string({
    required_error: 'Group name is required',
  }),

  // Validate participant
  participants: z.array(participantSchema),
});

export function validateGroupChat(input) {
  return groupChatSchema.safeParse(input);
}
export function validatePartialGroupChat(input) {
  return updateUserSchema.partial().safeParse(input);
}
