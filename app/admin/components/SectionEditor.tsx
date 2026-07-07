"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState, useTransition } from "react";

import { saveDraftContent, uploadHeroImage } from "../../../lib/cms/actions";
import { fallbackCmsSnapshot } from "../../../lib/cms/fallback";
import type { DressColor, Language, LocalizedText, WeddingContent } from "../../../lib/cms/types";
import { LanguageTabs } from "./LanguageTabs";
import { StatusBanner } from "./StatusBanner";

type EditableSection =
  | "navigation"
  | "hero"
  | "eventInfo"
  | "schedule"
  | "location"
  | "dressCode"
  | "gallery"
  | "rsvp"
  | "faq"
  | "contact"
  | "footer";
type SaveStatus = "idle" | "saved" | "error";

const sectionItems: Array<{ id: EditableSection; label: string; description: string }> = [
  { id: "navigation", label: "Navigation", description: "Menu labels and section visibility." },
  { id: "hero", label: "Hero", description: "Headline, date, intro, and primary buttons." },
  { id: "eventInfo", label: "Event Info", description: "Section heading, intro, and detail cards." },
  { id: "schedule", label: "Schedule", description: "Timeline heading and event rows." },
  { id: "location", label: "Location", description: "Venue, maps, address, and transport copy." },
  { id: "dressCode", label: "Dress Code", description: "Dress heading, keywords, and color palette." },
  { id: "gallery", label: "Gallery", description: "Gallery heading, intro, and CTA copy." },
  { id: "rsvp", label: "RSVP", description: "RSVP heading, intro, note, and deadline." },
  { id: "faq", label: "FAQ", description: "FAQ heading, questions, and answers." },
  { id: "contact", label: "Contact", description: "Organizer contact copy and links." },
  { id: "footer", label: "Footer", description: "Closing name and detail line." },
];

function textValue(value: LocalizedText, language: Language) {
  return value[language];
}

function slugifyOptionValue(value: string, fallback: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || fallback
  );
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
  const [content, setContent] = useState(() => ({
    ...initialContent,
    navigation:
      initialContent.navigation?.items?.length > 0 ? initialContent.navigation : fallbackCmsSnapshot.content.navigation,
    rsvp: {
      ...initialContent.rsvp,
      relationshipOptions:
        initialContent.rsvp.relationshipOptions?.length > 0
          ? initialContent.rsvp.relationshipOptions
          : fallbackCmsSnapshot.content.rsvp.relationshipOptions,
    },
  }));
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

  const updateNavigationItem = (id: string, field: "label" | "isVisible", value: string | boolean) => {
    setStatus("idle");
    setContent((current) => ({
      ...current,
      navigation: {
        ...current.navigation,
        items: current.navigation.items.map((item) =>
          item.id === id
            ? field === "label"
              ? {
                  ...item,
                  label: {
                    ...item.label,
                    [language]: value as string,
                  },
                }
              : {
                  ...item,
                  isVisible: value as boolean,
                }
            : item,
        ),
      },
    }));
  };

  const updateScheduleItem = (id: string, field: "time" | "title" | "detail", value: string) => {
    setStatus("idle");
    setContent((current) => ({
      ...current,
      schedule: {
        ...current.schedule,
        items: current.schedule.items.map((item) =>
          item.id === id
            ? field === "time"
              ? { ...item, time: value }
              : {
                  ...item,
                  [field]: {
                    ...item[field],
                    [language]: value,
                  },
                }
            : item,
        ),
      },
    }));
  };

  const updateDressKeyword = (index: number, value: string) => {
    setStatus("idle");
    setContent((current) => ({
      ...current,
      dressCode: {
        ...current.dressCode,
        keywords: current.dressCode.keywords.map((keyword, keywordIndex) =>
          keywordIndex === index
            ? {
                ...keyword,
                [language]: value,
              }
            : keyword,
        ),
      },
    }));
  };

  const updateDressColor = (index: number, field: keyof DressColor, value: string) => {
    setStatus("idle");
    setContent((current) => ({
      ...current,
      dressCode: {
        ...current.dressCode,
        colors: current.dressCode.colors.map((color, colorIndex) =>
          colorIndex === index ? { ...color, [field]: value } : color,
        ),
      },
    }));
  };

  const updateTransportSectionTitle = (id: string, value: string) => {
    setStatus("idle");
    setContent((current) => ({
      ...current,
      location: {
        ...current.location,
        transportSections: current.location.transportSections.map((section) =>
          section.id === id
            ? {
                ...section,
                title: {
                  ...section.title,
                  [language]: value,
                },
              }
            : section,
        ),
      },
    }));
  };

  const updateTransportItem = (sectionId: string, index: number, value: string) => {
    setStatus("idle");
    setContent((current) => ({
      ...current,
      location: {
        ...current.location,
        transportSections: current.location.transportSections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.map((item, itemIndex) =>
                  itemIndex === index
                    ? {
                        ...item,
                        [language]: value,
                      }
                    : item,
                ),
              }
            : section,
        ),
      },
    }));
  };

  const updateFaqItem = (id: string, field: "question" | "answer", value: string) => {
    setStatus("idle");
    setContent((current) => ({
      ...current,
      faq: {
        ...current.faq,
        items: current.faq.items.map((item) =>
          item.id === id
            ? {
                ...item,
                [field]: {
                  ...item[field],
                  [language]: value,
                },
              }
            : item,
        ),
      },
    }));
  };

  const updateRelationshipOption = (
    id: string,
    field: "label" | "value" | "isVisible",
    value: string | boolean,
  ) => {
    setStatus("idle");
    setContent((current) => ({
      ...current,
      rsvp: {
        ...current.rsvp,
        relationshipOptions: current.rsvp.relationshipOptions.map((option) =>
          option.id === id
            ? field === "label"
              ? {
                  ...option,
                  label: {
                    ...option.label,
                    [language]: value as string,
                  },
                }
              : {
                  ...option,
                  [field]: value,
                }
            : option,
        ),
      },
    }));
  };

  const addRelationshipOption = () => {
    setStatus("idle");
    setContent((current) => {
      const sortOrder = current.rsvp.relationshipOptions.length;
      const id = `custom-${Date.now()}`;

      return {
        ...current,
        rsvp: {
          ...current.rsvp,
          relationshipOptions: [
            ...current.rsvp.relationshipOptions,
            {
              id,
              value: slugifyOptionValue(id, `custom-${sortOrder + 1}`),
              label: {
                en: "",
                th: "",
              },
              sortOrder,
              isVisible: true,
            },
          ],
        },
      };
    });
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
          {activeSection === "navigation" ? (
            <div className="grid gap-4">
              {content.navigation.items
                .toSorted((first, second) => first.sortOrder - second.sortOrder)
                .map((item) => (
                  <div className="border border-[#d6c8a5] bg-white p-4" key={item.id}>
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#7c5c3b]">{item.id}</p>
                        <p className="mt-1 text-xs leading-5 text-[#3e4d3a]">Locked link: {item.href}</p>
                      </div>
                      <label className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0a1f44]">
                        <input
                          checked={item.isVisible}
                          className="h-4 w-4 accent-[#0a1f44]"
                          onChange={(event) => updateNavigationItem(item.id, "isVisible", event.target.checked)}
                          type="checkbox"
                        />
                        Show in menu
                      </label>
                    </div>
                    <TextField
                      id={`nav-${item.id}-label`}
                      label={`${item.id} label`}
                      onChange={(value) => updateNavigationItem(item.id, "label", value)}
                      value={textValue(item.label, language)}
                    />
                  </div>
                ))}
            </div>
          ) : null}

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

          {activeSection === "schedule" ? (
            <>
              <TextField
                id="schedule-eyebrow"
                label="Eyebrow"
                onChange={(value) => updateLocalized("schedule", "eyebrow", value)}
                value={textValue(content.schedule.eyebrow, language)}
              />
              <TextField
                id="schedule-title"
                label="Title"
                onChange={(value) => updateLocalized("schedule", "title", value)}
                value={textValue(content.schedule.title, language)}
              />
              <TextField
                id="schedule-intro"
                label="Intro"
                multiline
                onChange={(value) => updateLocalized("schedule", "intro", value)}
                value={textValue(content.schedule.intro, language)}
              />
              <div className="grid gap-4">
                {content.schedule.items
                  .toSorted((first, second) => first.sortOrder - second.sortOrder)
                  .map((item) => (
                    <div className="border border-[#d6c8a5] bg-white p-4" key={item.id}>
                      <p className="mb-3 text-sm font-semibold text-[#7c5c3b]">{item.id}</p>
                      <div className="grid gap-4 md:grid-cols-3">
                        <TextField
                          id={`schedule-${item.id}-time`}
                          label="Time"
                          onChange={(value) => updateScheduleItem(item.id, "time", value)}
                          value={item.time}
                        />
                        <TextField
                          id={`schedule-${item.id}-title`}
                          label="Title"
                          onChange={(value) => updateScheduleItem(item.id, "title", value)}
                          value={textValue(item.title, language)}
                        />
                        <TextField
                          id={`schedule-${item.id}-detail`}
                          label="Detail"
                          onChange={(value) => updateScheduleItem(item.id, "detail", value)}
                          value={textValue(item.detail, language)}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : null}

          {activeSection === "location" ? (
            <>
              <TextField
                id="location-eyebrow"
                label="Eyebrow"
                onChange={(value) => updateLocalized("location", "eyebrow", value)}
                value={textValue(content.location.eyebrow, language)}
              />
              <TextField
                id="location-title"
                label="Title"
                onChange={(value) => updateLocalized("location", "title", value)}
                value={textValue(content.location.title, language)}
              />
              <TextField
                id="location-intro"
                label="Intro"
                multiline
                onChange={(value) => updateLocalized("location", "intro", value)}
                value={textValue(content.location.intro, language)}
              />
              <TextField
                id="location-address"
                label="Address"
                multiline
                onChange={(value) => updateLocalized("location", "address", value)}
                value={textValue(content.location.address, language)}
              />
              <TextField
                id="location-parking-note"
                label="Parking note"
                multiline
                onChange={(value) => updateLocalized("location", "parkingNote", value)}
                value={textValue(content.location.parkingNote, language)}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  id="location-maps-url"
                  label="Google Maps URL"
                  onChange={(value) => updatePlain("location", "mapsUrl", value)}
                  type="url"
                  value={content.location.mapsUrl}
                />
                <TextField
                  id="location-maps-embed-url"
                  label="Map embed URL"
                  onChange={(value) => updatePlain("location", "mapsEmbedUrl", value)}
                  type="url"
                  value={content.location.mapsEmbedUrl}
                />
                <TextField
                  id="location-maps-button"
                  label="Maps button"
                  onChange={(value) => updateLocalized("location", "mapsButton", value)}
                  value={textValue(content.location.mapsButton, language)}
                />
                <TextField
                  id="location-contact-button"
                  label="Contact button"
                  onChange={(value) => updateLocalized("location", "contactButton", value)}
                  value={textValue(content.location.contactButton, language)}
                />
              </div>
              <TextField
                id="location-transport-title"
                label="Transport title"
                onChange={(value) => updateLocalized("location", "transportTitle", value)}
                value={textValue(content.location.transportTitle, language)}
              />
              <div className="grid gap-4">
                {content.location.transportSections
                  .toSorted((first, second) => first.sortOrder - second.sortOrder)
                  .map((section) => (
                    <div className="border border-[#d6c8a5] bg-white p-4" key={section.id}>
                      <TextField
                        id={`transport-${section.id}-title`}
                        label={`${section.id} title`}
                        onChange={(value) => updateTransportSectionTitle(section.id, value)}
                        value={textValue(section.title, language)}
                      />
                      <div className="mt-4 grid gap-4">
                        {section.items.map((item, index) => (
                          <TextField
                            id={`transport-${section.id}-${index}`}
                            key={`${section.id}-${index}`}
                            label={`Item ${index + 1}`}
                            multiline
                            onChange={(value) => updateTransportItem(section.id, index, value)}
                            value={textValue(item, language)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : null}

          {activeSection === "dressCode" ? (
            <>
              <TextField
                id="dress-eyebrow"
                label="Eyebrow"
                onChange={(value) => updateLocalized("dressCode", "eyebrow", value)}
                value={textValue(content.dressCode.eyebrow, language)}
              />
              <TextField
                id="dress-title"
                label="Title"
                onChange={(value) => updateLocalized("dressCode", "title", value)}
                value={textValue(content.dressCode.title, language)}
              />
              <TextField
                id="dress-intro"
                label="Intro"
                multiline
                onChange={(value) => updateLocalized("dressCode", "intro", value)}
                value={textValue(content.dressCode.intro, language)}
              />
              <div className="grid gap-4 md:grid-cols-3">
                {content.dressCode.keywords.map((keyword, index) => (
                  <TextField
                    id={`dress-keyword-${index}`}
                    key={`dress-keyword-${index}`}
                    label={`Keyword ${index + 1}`}
                    onChange={(value) => updateDressKeyword(index, value)}
                    value={textValue(keyword, language)}
                  />
                ))}
              </div>
              <TextField
                id="dress-palette-title"
                label="Palette title"
                onChange={(value) => updateLocalized("dressCode", "paletteTitle", value)}
                value={textValue(content.dressCode.paletteTitle, language)}
              />
              <div className="grid gap-4">
                {content.dressCode.colors.map((color, index) => (
                  <div className="grid gap-4 border border-[#d6c8a5] bg-white p-4 md:grid-cols-[1fr_1fr_auto]" key={`${color.name}-${index}`}>
                    <TextField
                      id={`dress-color-${index}-name`}
                      label="Color name"
                      onChange={(value) => updateDressColor(index, "name", value)}
                      value={color.name}
                    />
                    <TextField
                      id={`dress-color-${index}-hex`}
                      label="Hex"
                      onChange={(value) => updateDressColor(index, "hex", value)}
                      value={color.hex}
                    />
                    <div className="h-12 border border-[#0a1f44]/10 md:mt-8" style={{ backgroundColor: color.hex }} />
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {activeSection === "gallery" ? (
            <>
              <TextField
                id="gallery-eyebrow"
                label="Eyebrow"
                onChange={(value) => updateLocalized("gallery", "eyebrow", value)}
                value={textValue(content.gallery.eyebrow, language)}
              />
              <TextField
                id="gallery-title"
                label="Title"
                onChange={(value) => updateLocalized("gallery", "title", value)}
                value={textValue(content.gallery.title, language)}
              />
              <TextField
                id="gallery-intro"
                label="Intro"
                multiline
                onChange={(value) => updateLocalized("gallery", "intro", value)}
                value={textValue(content.gallery.intro, language)}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  id="gallery-cta"
                  label="CTA"
                  onChange={(value) => updateLocalized("gallery", "cta", value)}
                  value={textValue(content.gallery.cta, language)}
                />
                <TextField
                  id="gallery-album-label"
                  label="Album label"
                  onChange={(value) => updateLocalized("gallery", "albumLabel", value)}
                  value={textValue(content.gallery.albumLabel, language)}
                />
                <TextField
                  id="gallery-photo-count-label"
                  label="Photo count label"
                  onChange={(value) => updateLocalized("gallery", "photoCountLabel", value)}
                  value={textValue(content.gallery.photoCountLabel, language)}
                />
                <TextField
                  id="gallery-coming-soon"
                  label="Coming soon"
                  onChange={(value) => updateLocalized("gallery", "comingSoon", value)}
                  value={textValue(content.gallery.comingSoon, language)}
                />
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
              <div className="grid gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0a1f44]">Relationship options</p>
                    <p className="mt-1 text-xs leading-5 text-[#3e4d3a]">
                      Labels show in the RSVP dropdown. Values are submitted to the RSVP sheet.
                    </p>
                  </div>
                  <button
                    className="min-h-11 border border-[#0a1f44] px-4 text-sm font-semibold text-[#0a1f44] transition hover:bg-[#0a1f44] hover:text-[#fbf8f0]"
                    onClick={addRelationshipOption}
                    type="button"
                  >
                    Add relationship option
                  </button>
                </div>
                {content.rsvp.relationshipOptions
                  .toSorted((first, second) => first.sortOrder - second.sortOrder)
                  .map((option, index) => (
                    <div className="border border-[#d6c8a5] bg-white p-4" key={option.id}>
                      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#7c5c3b]">
                            {option.id.startsWith("custom-") ? "new option" : option.id}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#3e4d3a]">Order {index + 1}</p>
                        </div>
                        <label className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0a1f44]">
                          <input
                            checked={option.isVisible}
                            className="h-4 w-4 accent-[#0a1f44]"
                            onChange={(event) => updateRelationshipOption(option.id, "isVisible", event.target.checked)}
                            type="checkbox"
                          />
                          Show option
                        </label>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <TextField
                          id={`relationship-${option.id}-label`}
                          label={option.id.startsWith("custom-") ? "New option label" : "Label"}
                          onChange={(value) => updateRelationshipOption(option.id, "label", value)}
                          value={textValue(option.label, language)}
                        />
                        <TextField
                          id={`relationship-${option.id}-value`}
                          label="Submission value"
                          onChange={(value) => updateRelationshipOption(option.id, "value", value)}
                          value={option.value}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : null}

          {activeSection === "faq" ? (
            <>
              <TextField
                id="faq-eyebrow"
                label="Eyebrow"
                onChange={(value) => updateLocalized("faq", "eyebrow", value)}
                value={textValue(content.faq.eyebrow, language)}
              />
              <TextField
                id="faq-title"
                label="Title"
                onChange={(value) => updateLocalized("faq", "title", value)}
                value={textValue(content.faq.title, language)}
              />
              <div className="grid gap-4">
                {content.faq.items
                  .toSorted((first, second) => first.sortOrder - second.sortOrder)
                  .map((item) => (
                    <div className="border border-[#d6c8a5] bg-white p-4" key={item.id}>
                      <p className="mb-3 text-sm font-semibold text-[#7c5c3b]">{item.id}</p>
                      <div className="grid gap-4">
                        <TextField
                          id={`faq-${item.id}-question`}
                          label="Question"
                          onChange={(value) => updateFaqItem(item.id, "question", value)}
                          value={textValue(item.question, language)}
                        />
                        <TextField
                          id={`faq-${item.id}-answer`}
                          label="Answer"
                          multiline
                          onChange={(value) => updateFaqItem(item.id, "answer", value)}
                          value={textValue(item.answer, language)}
                        />
                      </div>
                    </div>
                  ))}
              </div>
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
