import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProtectedAdminLayout from "../(protected)/layout";
import LoginPage from "../login/page";

const adminMocks = vi.hoisted(() => ({
  getSupabaseConfig: vi.fn(() => ({
    url: undefined,
    anonKey: undefined,
    isConfigured: false,
  })),
  createSupabaseServerClient: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: adminMocks.redirect,
  usePathname: () => "/admin/content",
}));

vi.mock("../../../lib/supabase/config", () => ({
  getSupabaseConfig: adminMocks.getSupabaseConfig,
}));

vi.mock("../../../lib/supabase/server", () => ({
  createSupabaseServerClient: adminMocks.createSupabaseServerClient,
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    adminMocks.getSupabaseConfig.mockReturnValue({
      url: undefined,
      anonKey: undefined,
      isConfigured: false,
    });
  });

  it("renders email and password fields with a sign-in button", async () => {
    render(await LoginPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders without requiring an admin session", async () => {
    adminMocks.getSupabaseConfig.mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      isConfigured: true,
    });

    render(await LoginPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("heading", { name: /admin sign in/i })).toBeInTheDocument();
    expect(adminMocks.createSupabaseServerClient).not.toHaveBeenCalled();
    expect(adminMocks.redirect).not.toHaveBeenCalled();
  });
});

describe("ProtectedAdminLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects before protected content renders when Supabase is configured and no user exists", async () => {
    adminMocks.getSupabaseConfig.mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      isConfigured: true,
    });
    adminMocks.createSupabaseServerClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    });

    await expect(
      ProtectedAdminLayout({ children: <div>Protected admin content</div> }),
    ).rejects.toThrow("NEXT_REDIRECT:/admin/login");

    expect(adminMocks.redirect).toHaveBeenCalledWith("/admin/login");
    expect(screen.queryByText("Protected admin content")).not.toBeInTheDocument();
  });
});
