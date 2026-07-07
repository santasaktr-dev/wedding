"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState, useTransition } from "react";

import { saveDraftContent, uploadHeroImage } from "../../../lib/cms/actions";
import type { Language, LocalizedText, WeddingContent } from "../../../lib/cms/types";
import { LanguageTabs } from "./LanguageTabs";
import { StatusBanner } from "./StatusBanner";

type EditableSection = "hero" | "eventInfo" | "rsvp" | "contact" | "footer";
type SaveStatus = "idle" | "saved" | "error";

const sectionItems: Array<{ id: EditableSection; label: string; description: string }> = [
  { id: "hero", label: "Hero", description: "Headline, date, intro, and primary buttons." },
  { id: "eventInfo", label: "Event Info", description: "Section heading, intro, and detail cards." },
  { id: "rsvp", label: "RSVP", description: "RSVP heading, intro, note, and deadline." },
  { id: "contact", label: "Contact", description: "Organizer contact copy and links." },
  { id: "footer", label: "Footer", description: "Closing name and detail line." },
];

function textValue(value: LocalizedText, language: Language) {
  return value[language];
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: "text" | "url" | "date" | "tel";
};

function TextField({ id, label, value, onChange, multiline = false, type = "text" }: FieldProps) {
  const sharedClasses =
    "mt-2 w-full border border-[#d6c8a5] bg-white px-3 py-3 text-sm text-[#0a1f44] shadow-inner outline-none transition focus:border-[#0a1f44] focus:ring-2 focus:ring-[#d6c8a5]";

  return (
    <label className="block" htmlFor={id}>
      <span className="text-sm font-semibold text-[#0a1f44]">{label}</span>
      {multiline ? (
        <textarea
          className={`${sharedClasses} min-h-28 resize-y leading-6`}
          id={id}
          onChange={(event) => onChange(event.target.value)}
          value={value}
        />
      ) : (
        <input
          className={sharedClasses}
          id={id}
          onChange={(event) => onChange(event.target.value)}
          type={type}
          value={value}
        />
      )}
    </label>
  );
}

export function SectionEditor({ initialContent }: { initialContent: WeddingContent }) {
  const [content, setContent] = useState(initialContent);
  const [language, setLanguage] = useState<Language>("en");
  const [activeSection, setActiveSection] = useState<EditableSection>("hero");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [heroImageStatus, setHeroImageStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isPending, startTransition] = useTransition();

  const activeSectionItem = useMemo(
    () => sectionItems.find((item) => item.id === activeSection) ?? sectionItems[0],
    [activeSection],
  );

  const updateLocalized = <Section extends keyof WeddingContent, Field extends keyof WeddingContent[Section]>(
    section: Section,
    field: Field,
    value: string,
  ) => {
    setStatus("idle");
    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: {
          ...(current[section][field] as LocalizedText),
          [language]: value,
        },
      },
    }));
  };

  const updatePlain = <Section extends keyof WeddingContent, Field extends keyof WeddingContent[Section]>(
    section: Section,
    field: Field,
    value: string,
  ) => {
    setStatus("idle");
    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  };

  const updateEventCard = (id: string, field: "label" | "value", value: string) => {
    setStatus("idle");
    setContent((current) => ({
      ...current,
      eventInfo: {
        ...current.eventInfo,
        cards: current.eventInfo.cards.map((card) =>
          card.id === id
            ? {
                ...card,
                [field]: {
                  ...card[field],
                  [language]: value,
                },
              }
            : card,
        ),
      },
    }));
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const result = await saveDraftContent(content);
        setStatus(result.ok ? "saved" : "error");
      } catch {
        setStatus("error");
      }
    });
  };

  const uploadHeroImageFile = async (files: FileList | null) => {
    const file = files?.[0];

    if (!file) {
      return;
    }

    setStatus("idle");
    setHeroImageStatus(null);
    setIsUploadingHero(true);

    const formData = new FormData();
    formData.set("image", file);

    try {
      const uploadResult = await uploadHeroImage(formData);

      if (!uploadResult.ok || !uploadResult.publicUrl) {
        setHeroImageStatus({ ok: false, message: uploadResult.message ?? "Unable to upload hero image." });
        setStatus("error");
        return;
      }

      const nextContent = {
        ...content,
        hero: {
          ...content.hero,
          imageSrc: uploadResult.publicUrl,
        },
      };

      setContent(nextContent);

      const saveResult = await saveDraftContent(nextContent);

      if (!saveResult.ok) {
        setHeroImageStatus({ ok: false, message: "Hero image uploaded, but draft was not saved." });
        setStatus("error");
        return;
      }

      setHeroImageStatus({ ok: true, message: "Hero image uploaded and saved." });
      setStatus("saved");
    } catch {
      setHeroImageStatus({ ok: false, message: "Unable to upload hero image." });
      setStatus("error");
    } finally {
      setIsUploadingHero(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border border-[#d6c8a5] bg-[#fffdf7] p-4">
        <div className="mb-4">
          <p className="luxury-heading text-xs font-semibold text-[#7c5c3b]">Content</p>
          <h2 className="mt-1 text-xl font-semibold text-[#0a1f44]">Edit by section</h2>
        </div>

        <nav aria-label="Content sections" className="grid gap-2">
          {sectionItems.map((item) => {
            const isActive = item.id === activeSection;

            return (
              <button
                className={`border px-3 py-3 text-left transition ${
                  isActive
                    ? "border-[#0a1f44] bg-[#0a1f44] text-white"
                    : "border-[#d6c8a5] bg-white text-[#0a1f44] hover:border-[#0a1f44]"
                }`}
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                type="button"
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className={`mt-1 block text-xs leading-5 ${isActive ? "text-white/75" : "text-[#3e4d3a]"}`}>
                  {item.description}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="border border-[#d6c8a5] bg-[#fffdf7] p-5 shadow-[0_18px_50px_rgba(10,31,68,0.08)] sm:p-7">
        <div className="flex flex-col gap-4 border-b border-[#d6c8a5] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="luxury-heading text-xs font-semibold text-[#7c5c3b]">Wedding CMS</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#0a1f44]">{activeSectionItem.label}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#3e4d3a]">{activeSectionItem.description}</p>
          </div>
          <LanguageTabs language={language} onChange={setLanguage} />
        </div>

        <div className="mt-6 grid gap-5">
          {activeSection === "hero" ? (
            <>
              <TextField
                id="hero-couple-name"
                label="Couple name"
                onChange={(value) => updatePlain("hero", "coupleName", value)}
                value={content.hero.coupleName}
              />
              <TextField
                id="hero-date"
                label="Date"
                onChange={(value) => updateLocalized("hero", "date", value)}
                value={textValue(content.hero.date, language)}
              />
              <TextField
                id="hero-text"
                label="Intro text"
                multiline
                onChange={(value) => updateLocalized("hero", "text", value)}
                value={textValue(content.hero.text, language)}
              />
              <div className="grid gap-4 border border-[#d6c8a5] bg-white p-4 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
                <div className="overflow-hidden border border-[#d6c8a5] bg-[#0a1f44]">
                  <img
                    alt="Hero preview"
                    className="aspect-[16/10] w-full object-cover"
                    src={content.hero.imageSrc || "/images/wedding-hero.png"}
                  />
                </div>
                <div className="grid content-start gap-3">
                  <label className="block" htmlFor="hero-image-upload">
                    <span className="text-sm font-semibold text-[#0a1f44]">Upload hero image</span>
                    <input
                      accept="image/*"
                      className="mt-2 w-full border border-[#d6c8a5] bg-[#fffdf7] px-3 py-3 text-sm text-[#0a1f44] file:mr-3 file:border-0 file:bg-[#0a1f44] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#fbf8f0]"
                      disabled={isUploadingHero}
                      id="hero-image-upload"
                      onChange={(event) => {
                        uploadHeroImageFile(event.currentTarget.files);
                        event.currentTarget.value = "";
                      }}
                      type="file"
                    />
                  </label>
                  <p className="text-xs leading-5 text-[#3e4d3a]">
                    {isUploadingHero
                      ? "Uploading and saving..."
                      : "Choose one image to replace the main Hero background. The draft is saved automatically."}
                  </p>
                  {heroImageStatus ? (
                    <StatusBanner tone={heroImageStatus.ok ? "success" : "error"}>{heroImageStatus.message}</StatusBanner>
                  ) : null}
                </div>
              </div>
              <TextField
                id="hero-image-src"
                label="Hero image path"
                onChange={(value) => updatePlain("hero", "imageSrc", value)}
                value={content.hero.imageSrc}
              />
              <TextField
                id="hero-image-alt"
                label="Hero image alt text"
                onChange={(value) => updateLocalized("hero", "imageAlt", value)}
                value={textValue(content.hero.imageAlt, language)}
              />
            </>
          ) : null}

          {activeSection === "eventInfo" ? (
            <>
              <TextField
                id="event-eyebrow"
                label="Eyebrow"
                onChange={(value) => updateLocalized("eventInfo", "eyebrow", value)}
                value={textValue(content.eventInfo.eyebrow, language)}
              />
              <TextField
                id="event-title"
                label="Title"
                onChange={(value) => updateLocalized("eventInfo", "title", value)}
                value={textValue(content.eventInfo.title, language)}
              />
              <TextField
                id="event-intro"
                label="Intro"
                multiline
                onChange={(value) => updateLocalized("eventInfo", "intro", value)}
                value={textValue(content.eventInfo.intro, language)}
              />
              <div className="grid gap-4">
                {content.eventInfo.cards.map((card) => (
                  <div className="border border-[#d6c8a5] bg-white p-4" key={card.id}>
                    <p className="mb-3 text-sm font-semibold text-[#7c5c3b]">{card.id}</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField
                        id={`event-card-${card.id}-label`}
                        label="Label"
                        onChange={(value) => updateEventCard(card.id, "label", value)}
                        value={textValue(card.label, language)}
                      />
                      <TextField
                        id={`event-card-${card.id}-value`}
                        label="Value"
                        onChange={(value) => updateEventCard(card.id, "value", value)}
                        value={textValue(card.value, language)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {activeSection === "rsvp" ? (
            <>
              <TextField
                id="rsvp-eyebrow"
                label="Eyebrow"
                onChange={(value) => updateLocalized("rsvp", "eyebrow", value)}
                value={textValue(content.rsvp.eyebrow, language)}
              />
              <TextField
                id="rsvp-title"
                label="Title"
                onChange={(value) => updateLocalized("rsvp", "title", value)}
                value={textValue(content.rsvp.title, language)}
              />
              <TextField
                id="rsvp-intro"
                label="Intro"
                multiline
                onChange={(value) => updateLocalized("rsvp", "intro", value)}
                value={textValue(content.rsvp.intro, language)}
              />
              <TextField
                id="rsvp-note"
                label="Note"
                multiline
                onChange={(value) => updateLocalized("rsvp", "note", value)}
                value={textValue(content.rsvp.note, language)}
              />
              <TextField
                id="rsvp-deadline"
                label="Deadline"
                onChange={(value) => updatePlain("rsvp", "deadline", value)}
                type="date"
                value={content.rsvp.deadline}
              />
            </>
          ) : null}

          {activeSection === "contact" ? (
            <>
              <TextField
                id="contact-title"
                label="Title"
                onChange={(value) => updateLocalized("contact", "title", value)}
                value={textValue(content.contact.title, language)}
              />
              <TextField
                id="contact-intro"
                label="Intro"
                multiline
                onChange={(value) => updateLocalized("contact", "intro", value)}
                value={textValue(content.contact.intro, language)}
              />
              <TextField
                id="contact-line-label"
                label="LINE label"
                onChange={(value) => updateLocalized("contact", "lineLabel", value)}
                value={textValue(content.contact.lineLabel, language)}
              />
              <TextField
                id="contact-line-url"
                label="LINE URL"
                onChange={(value) => updatePlain("contact", "lineUrl", value)}
                type="url"
                value={content.contact.lineUrl}
              />
              <TextField
                id="contact-phone-label"
                label="Phone label"
                onChange={(value) => updateLocalized("contact", "phoneLabel", value)}
                value={textValue(content.contact.phoneLabel, language)}
              />
              <TextField
                id="contact-phone-href"
                label="Phone link"
                onChange={(value) => updatePlain("contact", "phoneHref", value)}
                type="tel"
                value={content.contact.phoneHref}
              />
            </>
          ) : null}

          {activeSection === "footer" ? (
            <>
              <TextField
                id="footer-couple-name"
                label="Couple name"
                onChange={(value) => updatePlain("footer", "coupleName", value)}
                value={content.footer.coupleName}
              />
              <TextField
                id="footer-details"
                label="Details"
                onChange={(value) => updateLocalized("footer", "details", value)}
                value={textValue(content.footer.details, language)}
              />
            </>
          ) : null}
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-[#d6c8a5] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="min-h-11 bg-[#0a1f44] px-5 text-sm font-semibold text-[#fbf8f0] transition hover:bg-[#142f5f] disabled:opacity-60"
            disabled={isPending}
            onClick={handleSave}
            type="button"
          >
            {isPending ? "Saving..." : "Save draft"}
          </button>

          <div className="min-h-14 flex-1 sm:max-w-md">
            {status === "idle" ? <StatusBanner tone="info">Draft changes are saved locally in this CMS stub.</StatusBanner> : null}
            {status === "saved" ? <StatusBanner tone="success">Draft saved.</StatusBanner> : null}
            {status === "error" ? <StatusBanner tone="error">Unable to save draft.</StatusBanner> : null}
          </div>
        </div>

      </section>
    </div>
  );
}
