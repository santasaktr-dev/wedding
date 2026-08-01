import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fallbackCmsSnapshot } from "../../../lib/cms/fallback";
import type { CmsSnapshot } from "../../../lib/cms/types";
import { WeddingHomeClient } from "../WeddingHomeClient";

describe("WeddingHomeClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

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

  it("uses preview photos from every album instead of depending on Highlights", () => {
    const snapshot = structuredClone(fallbackCmsSnapshot) as CmsSnapshot;
    const photo = { ...snapshot.albums[0].images[0], id: "album-two-photo", publicUrl: "/images/album-two.jpg" };
    snapshot.albums = [
      { ...snapshot.albums[0], id: "album-one", slug: "first-album", images: [] },
      { ...snapshot.albums[0], id: "album-two", slug: "second-album", images: [photo] },
    ];

    render(<WeddingHomeClient snapshot={snapshot} />);

    expect(screen.getByRole("img", { name: /prewedding portrait/i })).toHaveAttribute("src", expect.stringContaining("album-two.jpg"));
  });

  it("shows each album as a gallery card on the home page", () => {
    const snapshot = structuredClone(fallbackCmsSnapshot) as CmsSnapshot;
    snapshot.albums = [
      { ...snapshot.albums[0], id: "khao-yai", slug: "khao-yai", title: { en: "Khao Yai", th: "เขาใหญ่" } },
      { ...snapshot.albums[0], id: "talat-noi", slug: "talat-noi", title: { en: "Talat Noi", th: "ตลาดน้อย" } },
    ];

    render(<WeddingHomeClient snapshot={snapshot} />);

    expect(screen.getByRole("link", { name: /khao yai/i })).toHaveAttribute("href", "/gallery?album=khao-yai");
    expect(screen.getByRole("link", { name: /talat noi/i })).toHaveAttribute("href", "/gallery?album=talat-noi");
  });

  it("does not render a redundant full-gallery link beside album cards", () => {
    render(<WeddingHomeClient snapshot={structuredClone(fallbackCmsSnapshot) as CmsSnapshot} />);

    expect(screen.queryByRole("link", { name: /view full gallery/i })).not.toBeInTheDocument();
  });

  it("uses the original compact timeline layout for the ceremony time", () => {
    const snapshot = structuredClone(fallbackCmsSnapshot) as CmsSnapshot;
    snapshot.content.schedule.items[1].time = "15.09";

    render(<WeddingHomeClient snapshot={snapshot} />);

    const ceremonyTime = screen.getByText("15.09");
    expect(ceremonyTime).toHaveClass("whitespace-nowrap");
    expect(ceremonyTime.closest("article")).toHaveClass("grid-cols-[3.5rem_minmax(0,1fr)]");
  });

  it("adds the Thai time suffix without changing the English schedule time", () => {
    const snapshot = structuredClone(fallbackCmsSnapshot) as CmsSnapshot;
    snapshot.content.schedule.items[1].time = "15.09";

    render(<WeddingHomeClient snapshot={snapshot} />);
    fireEvent.click(screen.getByRole("button", { name: "TH" }));

    expect(screen.getByText("15.09 น.")).toBeInTheDocument();
  });

  it("keeps schedule dividers out of the time column", () => {
    render(<WeddingHomeClient snapshot={structuredClone(fallbackCmsSnapshot) as CmsSnapshot} />);

    const firstScheduleItem = screen.getByText("Guest Registration").closest("article");
    expect(firstScheduleItem).not.toHaveClass("border-b");
    expect(firstScheduleItem?.querySelector(".border-b")).toBeInTheDocument();
  });

  it("moves album cards with horizontal scrolling only", () => {
    const snapshot = structuredClone(fallbackCmsSnapshot) as CmsSnapshot;
    snapshot.albums = [
      { ...snapshot.albums[0], id: "first-album", slug: "first-album" },
      { ...snapshot.albums[0], id: "second-album", slug: "second-album" },
    ];
    const scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: vi.fn() });
    Object.defineProperty(HTMLElement.prototype, "scrollTo", { configurable: true, value: scrollTo });

    render(<WeddingHomeClient snapshot={snapshot} />);
    fireEvent.click(screen.getByRole("button", { name: "Next album" }));

    expect(scrollTo).toHaveBeenCalledWith({ behavior: "smooth", left: expect.any(Number) });
  });

  it("automatically advances hero photo cards", () => {
    const snapshot = structuredClone(fallbackCmsSnapshot) as CmsSnapshot;
    snapshot.content.hero.images = ["/images/hero-one.jpg", "/images/hero-two.jpg"];
    snapshot.albums = [];
    const scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", { configurable: true, value: scrollTo });
    vi.useFakeTimers();

    render(<WeddingHomeClient snapshot={snapshot} />);
    expect(screen.getByTestId("hero-carousel")).toBeInTheDocument();

    vi.advanceTimersByTime(6000);

    expect(scrollTo).toHaveBeenCalledWith({ behavior: "smooth", left: expect.any(Number) });
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
