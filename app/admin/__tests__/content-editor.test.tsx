import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fallbackCmsSnapshot } from "../../../lib/cms/fallback";
import type { WeddingContent } from "../../../lib/cms/types";
import { SectionEditor } from "../components/SectionEditor";

const editorMocks = vi.hoisted(() => ({
  saveDraftContent: vi.fn(),
}));

vi.mock("../../../lib/cms/actions", () => ({
  saveDraftContent: editorMocks.saveDraftContent,
}));

function renderEditor(content: WeddingContent = fallbackCmsSnapshot.content) {
  return render(<SectionEditor initialContent={content} />);
}

describe("SectionEditor", () => {
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
});
