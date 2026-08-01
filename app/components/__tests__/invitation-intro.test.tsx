import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { InvitationIntro } from "../InvitationIntro";

describe("InvitationIntro", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.history.replaceState({}, "", "/?intro=show");
  });

  it("presents the seal as the primary invitation opening control", () => {
    render(<InvitationIntro />);

    const openControl = screen.getByRole("button", { name: "Open invitation" });

    expect(openControl).toHaveClass("invitation-envelope-trigger");
    expect(openControl.querySelector(".invitation-seal")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open invitation" })).toHaveClass(
      "invitation-envelope-trigger",
    );
  });
});
