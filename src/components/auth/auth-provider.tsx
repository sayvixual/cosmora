'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    async function initializeAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Create an anonymous session for the user so RLS works
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.error('[AuthProvider] Failed to sign in anonymously', error);
        }
      }
      setMounted(true);
    }
    
    initializeAuth();
  }, []);

  // Prevent flash of unauthenticated state rendering if we need auth
  // But since it's anonymous, we can just render children immediately,
  // RLS mutations will just wait until the session is established.
  return <>{children}</>;
}
