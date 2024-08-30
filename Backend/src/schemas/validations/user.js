import { z } from 'zod';

// Validación para crear un usuario
const userSchema = z.object({
  // Validate name
  name: z.string({
    invalid_type_error: 'Name must be a string',
    required_error: 'Name is required.',
  }),

  // Validate surname
  surname: z.string({
    invalid_type_error: 'Surname must be a string',
    required_error: 'Surname is required.',
  }),

  // Validate email
  email: z.string({ required_error: 'Email is required.' }).email({
    invalid_type_error: 'Email must be a valid email, e.g., user@gmail.com',
  }),

  // Validate password
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password cannot be more than 20 characters')
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      'The password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),

  // Validate profile picture
  profilePicture: z.string().optional(),

  // Validate status
  status: z.string().optional(),

  // Validate access_token
  access_token: z.string().optional(),

  // Validate expiration
  expiration: z.string().optional(),

  // Validate contacts
  contacts: z
    .array(
      z.object({
        contactId: z.string(),
      })
    )
    .optional(),

  // Validate group
  groups: z
    .array(
      z.object({
        groupId: z.string(),
      })
    )
    .optional(),

  // Validate friendRequest
  friendRequests: z
    .array(
      z.object({
        requestId: z.string(),
        fromUserId: z.string(),
        status: z.enum(['Pending', 'Accepted', 'Rejected']),
      })
    )
    .optional(),
});

// Funciones de validación
export function validateUser(input) {
  return userSchema.safeParse(input);
}

export function validatePartialUser(input) {
  return userSchema.partial().safeParse(input);
}
