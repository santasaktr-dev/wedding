import type { ReactNode } from "react";

import { getSupabaseConfig } from "../../lib/supabase/config";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { AdminShell } from "./components/AdminShell";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const config = getSupabaseConfig();
  let isAuthenticated = false;

  if (config.isConfigured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    isAuthenticated = Boolean(user);
  }

  return (
    <AdminShell isAuthenticated={isAuthenticated} isSupabaseConfigured={config.isConfigured}>
      {children}
    </AdminShell>
  );
}
