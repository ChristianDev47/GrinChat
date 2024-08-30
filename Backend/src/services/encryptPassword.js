import { hash, compare } from 'bcrypt';

export async function hashPassword(password) {
  const saltRounds = 10;
  return await hash(password, saltRounds);
}

export async function comparePasswords(password, hashedPassword) {
  return await compare(password, hashedPassword);
}
