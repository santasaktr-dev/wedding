import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fallbackCmsSnapshot } from "../../../lib/cms/fallback";
import type { CmsSnapshot } from "../../../lib/cms/types";
import { WeddingHomeClient } from "../WeddingHomeClient";

describe("WeddingHomeClient", () => {
  it("renders navigation and section copy from the CMS snapshot", () => {
    const snapshot = structuredClone(fallbackCmsSnapshot) as CmsSnapshot;
    snapshot.content.navigation.items[0].label.en = "Details";
    snapshot.content.eventInfo.title.en = "Custom Celebration";
    snapshot.content.eventInfo.intro.en = "Custom intro from CMS.";

    render(<WeddingHomeClient snapshot={snapshot} />);

    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute("href", "#event-info");
    expect(screen.getByRole("heading", { name: "Custom Celebration" })).toBeInTheDocument();
    expect(screen.getByText("Custom intro from CMS.")).toBeInTheDocument();
  });

  it("renders RSVP relationship options from the CMS snapshot", () => {
    const snapshot = structuredClone(fallbackCmsSnapshot) as CmsSnapshot;
    snapshot.content.rsvp.relationshipOptions[0].label.en = "Groom Side";

    render(<WeddingHomeClient snapshot={snapshot} />);

    expect(screen.getByRole("option", { name: "Groom Side" })).toHaveValue("groom-friend");
  });

  it("links guests to the separate wedding memory book", () => {
    render(<WeddingHomeClient snapshot={structuredClone(fallbackCmsSnapshot) as CmsSnapshot} />);

    const memoryLink = screen.getByRole("link", { name: /Share a Memory/ });
    expect(memoryLink).toHaveAttribute("href", "https://jjhsmartweddingsmemory.vercel.app");
    expect(memoryLink.closest("section")).toHaveAttribute("id", "gallery");
  });

  it("uses the script display font for the J&S brand mark", () => {
    render(<WeddingHomeClient snapshot={structuredClone(fallbackCmsSnapshot) as CmsSnapshot} />);

    expect(screen.getByRole("link", { name: "J&S" })).toHaveClass("script-display");
  });

  it("keeps the editorial page landmarks and section anchors intact", () => {
    render(<WeddingHomeClient snapshot={structuredClone(fallbackCmsSnapshot) as CmsSnapshot} />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    for (const sectionId of [
      "home",
      "event-info",
      "schedule",
      "gallery",
      "location",
      "dress-code",
      "rsvp",
      "faq",
      "contact",
    ]) {
      expect(document.getElementById(sectionId)).toBeInTheDocument();
    }
  });

  it("renders transport guidance as an accessible accordion", () => {
    render(<WeddingHomeClient snapshot={structuredClone(fallbackCmsSnapshot) as CmsSnapshot} />);

    const transportDetails = document.querySelectorAll("#location details");

    expect(transportDetails).toHaveLength(2);
    expect(transportDetails[0]).not.toHaveAttribute("open");
    expect(transportDetails[1]).not.toHaveAttribute("open");
    expect(screen.getByText("Driving")).toBeInTheDocument();
    expect(screen.getByText("Public Transportation")).toBeInTheDocument();
  });
});
