import jwt from 'jsonwebtoken';
import { Request } from 'express';

const secret = process.env.JWT_SECRET || 'supersecret';
const expiration = '2h';

export function signToken(user: { _id: string; username: string; email: string }): string {
  return jwt.sign({ _id: user._id, username: user.username, email: user.email }, secret, { expiresIn: expiration });
}

export function authenticateToken(req: Request): any {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null; // No token provided
  }

  let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;

  try {
    return jwt.verify(token, secret);
  } catch {
    return null; // Invalid token
  }
}