export type Language = "en" | "th";

export type CmsStatus = "draft" | "published";

export type LocalizedText = Record<Language, string>;

export type EventInfoCard = {
  id: string;
  label: LocalizedText;
  value: LocalizedText;
};

export type ScheduleItem = {
  id: string;
  time: string;
  title: LocalizedText;
  detail: LocalizedText;
  sortOrder: number;
};

export type TransportSection = {
  id: string;
  title: LocalizedText;
  items: LocalizedText[];
  sortOrder: number;
};

export type DressColor = {
  name: string;
  hex: string;
};

export type FaqItem = {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
  sortOrder: number;
};

export type GalleryImage = {
  id: string;
  albumId: string;
  storagePath: string;
  publicUrl: string;
  caption: LocalizedText;
  alt: LocalizedText;
  sortOrder: number;
  isCover: boolean;
  status: CmsStatus;
};

export type GalleryAlbum = {
  id: string;
  slug: string;
  status: CmsStatus;
  sortOrder: number;
  coverImageId?: string;
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  images: GalleryImage[];
};

export type WeddingContent = {
  hero: {
    coupleName: string;
    date: LocalizedText;
    text: LocalizedText;
    imageSrc: string;
    imageAlt: LocalizedText;
    locationButton: LocalizedText;
    dressButton: LocalizedText;
  };
  eventInfo: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    cards: EventInfoCard[];
  };
  schedule: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    items: ScheduleItem[];
  };
  location: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    address: LocalizedText;
    parkingNote: LocalizedText;
    mapsUrl: string;
    mapsEmbedUrl: string;
    mapsButton: LocalizedText;
    contactButton: LocalizedText;
    transportTitle: LocalizedText;
    transportSections: TransportSection[];
  };
  dressCode: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    keywords: LocalizedText[];
    paletteTitle: LocalizedText;
    colors: DressColor[];
  };
  rsvp: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    note: LocalizedText;
    deadline: string;
  };
  gallery: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    cta: LocalizedText;
    albumLabel: LocalizedText;
    photoCountLabel: LocalizedText;
    comingSoon: LocalizedText;
  };
  faq: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    items: FaqItem[];
  };
  contact: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    lineLabel: LocalizedText;
    lineUrl: string;
    phoneLabel: LocalizedText;
    phoneHref: string;
  };
  footer: {
    coupleName: string;
    details: LocalizedText;
  };
};

export type CmsSnapshot = {
  id: string;
  status: CmsStatus;
  content: WeddingContent;
  albums: GalleryAlbum[];
  updatedAt: string;
  publishedAt?: string;
};
