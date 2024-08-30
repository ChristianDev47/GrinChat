import { z } from 'zod';

// Validate Call
const callSchema = z.object({
  // Validate call type
  callType: z.enum(['Audio', 'Video'], {
    required_error: 'Call type is required',
  }),

  // Validate participants
  participants: z
    .array(
      z.object({
        userId: z.string(),
      })
    )
    .optional(),

  // validate startTime
  startTime: z.date({
    required_error: 'Start time is required',
  }),

  // Validate endTime
  endTime: z.date().optional(),

  // Validate status
  status: z.enum(['Ongoing', 'Missed', 'Completed']).default('Ongoing'),
});

export function validateCall(input) {
  return callSchema.safeParse(input);
}
export function validatePartialCall(input) {
  return updateUserSchema.partial().safeParse(input);
}
