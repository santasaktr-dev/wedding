import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { requireSupabaseConfig } from "./config";

const SUPABASE_REQUEST_TIMEOUT_MS = 3000;

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_REQUEST_TIMEOUT_MS);

  return fetch(input, {
    ...init,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));
}

export async function createSupabaseServerClient() {
  const config = requireSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    global: {
      fetch: fetchWithTimeout,
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Server Components cannot write cookies. Middleware/server actions still can.
          }
        });
      },
    },
  });
}
