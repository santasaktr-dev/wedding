import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoginPage from "../login/page";

describe("LoginPage", () => {
  it("renders email and password fields with a sign-in button", async () => {
    render(await LoginPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});
