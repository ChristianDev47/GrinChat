import { z } from 'zod';

// Validate Messages
const messageSchema = z.object({
  // Validate chatId
  chatId: z.string({
    required_error: 'Chat ID is required',
  }),

  // Validate senderId
  senderId: z.string({
    required_error: 'Sender ID is required',
  }),

  // Validate messageType
  messageType: z
    .enum(['Text', 'Image', 'Audio', 'Document', 'Link'])
    .default('Text'),

  // Validate content
  content: z.string().optional(),

  // Validate fileUrl
  fileUrl: z.string().url().optional(),

  // Validate fileName
  fileName: z.string().optional(),

  // Validate timestamp
  timestamp: z.date().default(() => new Date()),

  // Validate status
  status: z.enum(['Sent', 'Delivered', 'Read']).default('Sent'),
});

export function validateMessage(input) {
  return messageSchema.safeParse(input);
}

export function validatePartialMessage(input) {
  return updateUserSchema.partial().safeParse(input);
}
