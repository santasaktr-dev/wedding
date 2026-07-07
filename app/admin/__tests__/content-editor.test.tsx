import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fallbackCmsSnapshot } from "../../../lib/cms/fallback";
import type { WeddingContent } from "../../../lib/cms/types";
import { SectionEditor } from "../components/SectionEditor";

const editorMocks = vi.hoisted(() => ({
  saveDraftContent: vi.fn(),
  uploadHeroImage: vi.fn(),
}));

vi.mock("../../../lib/cms/actions", () => ({
  saveDraftContent: editorMocks.saveDraftContent,
  uploadHeroImage: editorMocks.uploadHeroImage,
}));

function renderEditor(content: WeddingContent = fallbackCmsSnapshot.content) {
  return render(<SectionEditor initialContent={content} />);
}

describe("SectionEditor", () => {
  beforeEach(() => {
    editorMocks.saveDraftContent.mockReset();
    editorMocks.uploadHeroImage.mockReset();
  });

  it("edits localized hero copy and saves the draft", async () => {
    editorMocks.saveDraftContent.mockResolvedValue({ ok: true });
    renderEditor();

    fireEvent.change(screen.getByLabelText(/intro text/i), {
      target: { value: "A new English invitation." },
    });
    fireEvent.click(screen.getByRole("button", { name: /save draft/i }));

    await waitFor(() => {
      expect(editorMocks.saveDraftContent).toHaveBeenCalledWith(
        expect.objectContaining({
          hero: expect.objectContaining({
            text: expect.objectContaining({
              en: "A new English invitation.",
            }),
          }),
        }),
      );
    });
    expect(await screen.findByText(/draft saved/i)).toBeInTheDocument();
  });

  it("edits navigation labels and saves the draft", async () => {
    editorMocks.saveDraftContent.mockResolvedValue({ ok: true });
    renderEditor();

    fireEvent.click(screen.getByRole("button", { name: /Navigation/i }));
    fireEvent.change(screen.getByLabelText(/event-info label/i), {
      target: { value: "Details" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save draft/i }));

    await waitFor(() => {
      expect(editorMocks.saveDraftContent).toHaveBeenCalledWith(
        expect.objectContaining({
          navigation: expect.objectContaining({
            items: expect.arrayContaining([
              expect.objectContaining({
                id: "event-info",
                label: expect.objectContaining({
                  en: "Details",
                }),
              }),
            ]),
          }),
        }),
      );
    });
  });

  it("switches to Thai content and edits RSVP fields section-by-section", async () => {
    editorMocks.saveDraftContent.mockResolvedValue({ ok: true });
    renderEditor();

    fireEvent.click(screen.getByRole("tab", { name: "ไทย" }));
    fireEvent.click(screen.getByRole("button", { name: /RSVP/i }));
    fireEvent.change(screen.getByLabelText(/^title$/i), {
      target: { value: "ยืนยันการมาร่วมงาน" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save draft/i }));

    await waitFor(() => {
      expect(editorMocks.saveDraftContent).toHaveBeenCalledWith(
        expect.objectContaining({
          rsvp: expect.objectContaining({
            title: expect.objectContaining({
              th: "ยืนยันการมาร่วมงาน",
            }),
          }),
        }),
      );
    });
  });

  it("adds RSVP relationship options and saves the draft", async () => {
    editorMocks.saveDraftContent.mockResolvedValue({ ok: true });
    renderEditor();

    fireEvent.click(screen.getByRole("button", { name: /RSVP/i }));
    fireEvent.click(screen.getByRole("button", { name: /add relationship option/i }));
    fireEvent.change(screen.getByLabelText(/new option label/i), {
      target: { value: "VIP Guest" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save draft/i }));

    await waitFor(() => {
      expect(editorMocks.saveDraftContent).toHaveBeenCalledWith(
        expect.objectContaining({
          rsvp: expect.objectContaining({
            relationshipOptions: expect.arrayContaining([
              expect.objectContaining({
                label: expect.objectContaining({
                  en: "VIP Guest",
                }),
                isVisible: true,
              }),
            ]),
          }),
        }),
      );
    });
  });

  it("uploads a hero image, updates the preview, and saves the draft", async () => {
    editorMocks.uploadHeroImage.mockResolvedValue({
      ok: true,
      publicUrl: "https://cdn.example.com/hero/new-photo.jpg",
    });
    editorMocks.saveDraftContent.mockResolvedValue({ ok: true });
    renderEditor();

    fireEvent.change(screen.getByLabelText(/upload hero image/i), {
      target: {
        files: [new File(["image"], "new-photo.jpg", { type: "image/jpeg" })],
      },
    });

    await waitFor(() => expect(editorMocks.uploadHeroImage).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(editorMocks.saveDraftContent).toHaveBeenCalledWith(
        expect.objectContaining({
          hero: expect.objectContaining({
            imageSrc: "https://cdn.example.com/hero/new-photo.jpg",
          }),
        }),
      );
    });
    expect(screen.getByAltText(/hero preview/i)).toHaveAttribute("src", "https://cdn.example.com/hero/new-photo.jpg");
    expect(await screen.findByText(/hero image uploaded and saved/i)).toBeInTheDocument();
  });
});
