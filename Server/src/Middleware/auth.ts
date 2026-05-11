import { Request, Response, NextFunction } from 'express';
import { supabase } from '@/Config/Db.js';
import { User } from '@supabase/supabase-js';

export interface AuthRequest extends Request {
  user?: User;
}

/**
 * Authentication Middleware
 * Validates the Supabase JWT from the Authorization header
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Set the user in the request for later use
    req.user = user;

    next();
  } catch (error: unknown) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};
