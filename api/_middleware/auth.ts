import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://mujkpyeennxjkdvezpaz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface AuthenticatedRequest extends VercelRequest {
  userId?: string;
  userRole?: string;
}

export async function verifyAuth(req: AuthenticatedRequest): Promise<{ userId: string; userRole: string } | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    let role = (user.user_metadata?.role as string) || (user.app_metadata?.role as string) || 'customer';

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role) {
        role = profile.role;
      }
    } catch {}

    return {
      userId: user.id,
      userRole: role,
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export async function verifyAdmin(req: AuthenticatedRequest, res: VercelResponse): Promise<boolean> {
  const auth = await verifyAuth(req);

  if (!auth) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
      status: 401,
    });
    return false;
  }

  if (auth.userRole !== 'admin') {
    res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Admin access required',
      },
      status: 403,
    });
    return false;
  }

  req.userId = auth.userId;
  req.userRole = auth.userRole;

  return true;
}
