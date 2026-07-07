"use server";

import { redirect } from "next/navigation";

import { getSupabaseConfig } from "../../lib/supabase/config";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const config = getSupabaseConfig();

  if (!config.isConfigured) {
    redirect("/admin/content");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/admin/login?error=invalid");
  }

  redirect("/admin/content");
}

export async function signOutAdmin() {
  const config = getSupabaseConfig();

  if (config.isConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}
