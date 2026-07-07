"use client";

import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { signOutAdmin } from "../actions";

type AdminShellProps = {
  children: ReactNode;
  isAuthenticated: boolean;
  isSupabaseConfigured: boolean;
};

const navItems = [
  { href: "/admin/content", label: "Content" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ children, isAuthenticated, isSupabaseConfigured }: AdminShellProps) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (isSupabaseConfigured && !isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#fbf8f0] text-[#0a1f44]">
      <header className="border-b border-[#d6c8a5] bg-[#fffdf7]/95 shadow-[0_12px_40px_rgba(10,31,68,0.08)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="luxury-heading text-xs font-semibold text-[#7c5c3b]">Jah & Smart</p>
            <h1 className="mt-1 text-xl font-semibold text-[#0a1f44]">Wedding CMS</h1>
          </div>

          <nav aria-label="Admin navigation" className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-[#0a1f44] bg-[#0a1f44] text-white"
                      : "border-[#d6c8a5] bg-white text-[#0a1f44] hover:border-[#0a1f44]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <form action={signOutAdmin}>
            <button
              type="submit"
              className="border border-[#7c5c3b] px-4 py-2 text-sm font-semibold text-[#7c5c3b] transition hover:bg-[#f7efe2] focus:outline-none focus:ring-2 focus:ring-[#d6c8a5]"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
