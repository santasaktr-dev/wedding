import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminPage from "../(protected)/page";
import ContentPage from "../(protected)/content/page";
import GalleryPage from "../(protected)/gallery/page";
import ProtectedAdminLayout from "../(protected)/layout";
import SettingsPage from "../(protected)/settings/page";
import { signInAdmin, signOutAdmin } from "../actions";
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

  it("connects invalid login errors to the email and password fields", async () => {
    render(await LoginPage({ searchParams: Promise.resolve({ error: "invalid" }) }));

    const error = screen.getByRole("alert");
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);

    expect(error).toHaveTextContent(/invalid email or password/i);
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAttribute("aria-describedby", error.id);
    expect(password).toHaveAttribute("aria-invalid", "true");
    expect(password).toHaveAttribute("aria-describedby", error.id);
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

describe("Admin route redirects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects the admin root to content", () => {
    expect(() => AdminPage()).toThrow("NEXT_REDIRECT:/admin/content");

    expect(adminMocks.redirect).toHaveBeenCalledWith("/admin/content");
  });
});

describe("ContentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    adminMocks.getSupabaseConfig.mockReturnValue({
      url: undefined,
      anonKey: undefined,
      isConfigured: false,
    });
  });

  it("renders the protected content editor", async () => {
    render(await ContentPage());

    expect(screen.getByRole("heading", { name: /edit by section/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save draft/i })).toBeInTheDocument();
  });
});

describe("GalleryPage", () => {
  it("renders a protected gallery placeholder", () => {
    render(<GalleryPage />);

    expect(screen.getByRole("heading", { name: /gallery/i })).toBeInTheDocument();
    expect(screen.getByText(/gallery manager arrives in an upcoming task/i)).toBeInTheDocument();
  });
});

describe("SettingsPage", () => {
  it("renders a protected settings placeholder", () => {
    render(<SettingsPage />);

    expect(screen.getByRole("heading", { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByText(/settings arrive in an upcoming task/i)).toBeInTheDocument();
  });
});

describe("admin auth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to content after a configured successful sign in", async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({ error: null });
    adminMocks.getSupabaseConfig.mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      isConfigured: true,
    });
    adminMocks.createSupabaseServerClient.mockResolvedValue({
      auth: { signInWithPassword },
    });

    const formData = new FormData();
    formData.set("email", "admin@example.com");
    formData.set("password", "password");

    await expect(signInAdmin(formData)).rejects.toThrow("NEXT_REDIRECT:/admin/content");

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "admin@example.com",
      password: "password",
    });
    expect(adminMocks.redirect).toHaveBeenCalledWith("/admin/content");
  });

  it("redirects to the invalid login state after a configured failed sign in", async () => {
    adminMocks.getSupabaseConfig.mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      isConfigured: true,
    });
    adminMocks.createSupabaseServerClient.mockResolvedValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({ error: new Error("invalid") }),
      },
    });

    await expect(signInAdmin(new FormData())).rejects.toThrow(
      "NEXT_REDIRECT:/admin/login?error=invalid",
    );

    expect(adminMocks.redirect).toHaveBeenCalledWith("/admin/login?error=invalid");
  });

  it("redirects to content for the unconfigured local fallback sign in", async () => {
    adminMocks.getSupabaseConfig.mockReturnValue({
      url: undefined,
      anonKey: undefined,
      isConfigured: false,
    });

    await expect(signInAdmin(new FormData())).rejects.toThrow("NEXT_REDIRECT:/admin/content");

    expect(adminMocks.createSupabaseServerClient).not.toHaveBeenCalled();
    expect(adminMocks.redirect).toHaveBeenCalledWith("/admin/content");
  });

  it("signs out when configured and redirects to login", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });
    adminMocks.getSupabaseConfig.mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      isConfigured: true,
    });
    adminMocks.createSupabaseServerClient.mockResolvedValue({
      auth: { signOut },
    });

    await expect(signOutAdmin()).rejects.toThrow("NEXT_REDIRECT:/admin/login");

    expect(signOut).toHaveBeenCalled();
    expect(adminMocks.redirect).toHaveBeenCalledWith("/admin/login");
  });
});
