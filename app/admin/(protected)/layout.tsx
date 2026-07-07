import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getSupabaseConfig } from "../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { AdminShell } from "../components/AdminShell";

type ProtectedAdminLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedAdminLayout({ children }: ProtectedAdminLayoutProps) {
  const config = getSupabaseConfig();

  if (config.isConfigured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }
  }

  return <AdminShell>{children}</AdminShell>;
}
