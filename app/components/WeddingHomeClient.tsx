"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  Globe2,
  MapPin,
  MessageCircle,
  Menu,
  Phone,
  Shirt,
  X,
  Users,
} from "lucide-react";
import type { CmsSnapshot } from "../../lib/cms/types";
import { RsvpForm } from "./RsvpForm";
import { ScrollReveal } from "./ScrollReveal";
import { WeddingCountdown } from "./WeddingCountdown";

type Language = "en" | "th";

const icons = {
  date: CalendarDays,
  time: Clock,
  venue: MapPin,
  dress: Shirt,
};

const copy = {
  en: {
    nav: [
      { label: "Info", href: "#event-info" },
      { label: "Schedule", href: "#schedule" },
      { label: "Gallery", href: "#gallery" },
      { label: "Location", href: "#location" },
      { label: "Dress Code", href: "#dress-code" },
      { label: "RSVP", href: "#rsvp" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    languageButton: "TH",
    rsvpButton: "RSVP",
    heroDate: "Sunday, 1 November 2026",
    heroText:
      "Together with their families request the pleasure of your company at the celebration of their wedding at Pearl Wedding Avenue.",
    locationButton: "View Location",
    dressButton: "Dress Code",
    eventEyebrow: "Event Info",
    eventTitle: "The Celebration",
    eventIntro: "A concise guide to the date, arrival time, venue, and overall style of the wedding day.",
    eventCards: [
      { label: "Date", value: "Sunday, 1 November 2026", icon: icons.date },
      { label: "Time", value: "To be confirmed", icon: icons.time },
      { label: "Venue", value: "Pearl Wedding Avenue", icon: icons.venue },
      { label: "Dress Code", value: "Old Money Elegance", icon: icons.dress },
    ],
    scheduleEyebrow: "Schedule",
    scheduleTitle: "Wedding Day Timeline",
    scheduleIntro:
      "The final timeline is being confirmed. Please check back closer to the wedding date for the exact arrival and ceremony times.",
    schedule: [
      { time: "TBC", title: "Guest Registration", detail: "Welcome and arrival" },
      { time: "TBC", title: "Wedding Ceremony", detail: "Ceremony begins" },
      { time: "TBC", title: "Dinner Reception", detail: "Dinner and reception" },
      { time: "TBC", title: "Toast & Celebration", detail: "Toasts and celebration" },
    ],
    galleryEyebrow: "Gallery",
    galleryTitle: "Prewedding Moments",
    galleryIntro:
      "A quiet preview of the celebration, styled with the same refined and timeless mood as the wedding day.",
    galleryCta: "View Full Gallery",
    memoryBookCta: "Share a Memory",
    galleryTabs: [
      { id: "prewedding", label: "Prewedding" },
      { id: "wedding-day", label: "Wedding Day", badge: "Soon" },
    ],
    galleryAlbumLabel: "Albums",
    galleryPhotoCount: "photos",
    galleryAlbums: [
      {
        id: "highlights",
        title: "Highlights",
        description: "A curated first look at the prewedding mood.",
        images: [
          {
            src: "/images/wedding-hero.png",
            alt: "Prewedding portrait of Jajah and Smart",
            caption: "Classic Portrait",
          },
          {
            src: "/images/wedding-hero.png",
            alt: "Elegant prewedding moment of Jajah and Smart",
            caption: "Refined Moment",
          },
          {
            src: "/images/wedding-hero.png",
            alt: "Timeless prewedding styling for Jajah and Smart",
            caption: "Old Money Mood",
          },
          {
            src: "/images/wedding-hero.png",
            alt: "Romantic prewedding detail of Jajah and Smart",
            caption: "Soft Detail",
          },
        ],
      },
      {
        id: "studio",
        title: "Studio Set",
        description: "Polished portraits with a formal, timeless feeling.",
        images: [
          {
            src: "/images/wedding-hero.png",
            alt: "Studio prewedding portrait of Jajah and Smart",
            caption: "Formal Portrait",
          },
          {
            src: "/images/wedding-hero.png",
            alt: "Studio prewedding styling detail",
            caption: "Tailored Detail",
          },
        ],
      },
      {
        id: "outdoor",
        title: "Outdoor Set",
        description: "Softer scenes for a warm and natural album.",
        images: [
          {
            src: "/images/wedding-hero.png",
            alt: "Outdoor prewedding moment of Jajah and Smart",
            caption: "Garden Mood",
          },
          {
            src: "/images/wedding-hero.png",
            alt: "Outdoor prewedding portrait detail",
            caption: "Soft Light",
          },
        ],
      },
    ],
    galleryComingSoon: "Wedding day photos will be added after the celebration.",
    locationEyebrow: "Location",
    locationIntro:
      "Pearl Wedding Avenue is located on Borommaratchachonnani Road outbound, between Phutthamonthon Sai 2 and Sai 3.",
    locationAddress: "Pearl Wedding Avenue, Borommaratchachonnani Road, Bangkok",
    parkingNote: "Please allow extra travel time and follow the Google Maps route to the venue.",
    googleMaps: "Open Google Maps",
    contactOrganizer: "Contact Smart",
    transportTitle: "Getting There",
    transportSections: [
      {
        title: "Driving",
        items: [
          "The venue is on Borommaratchachonnani Road outbound toward Nakhon Pathom, between Phutthamonthon Sai 2 and Sai 3.",
          "Landmarks include Soi Borommaratchachonnani 72 and the entrance to Krisdanakorn Village. Look for the modern round glasshouse building by the main road.",
        ],
      },
      {
        title: "Public Transportation",
        items: [
          "MRT Lak Song or BTS Bang Wa, then continue by taxi toward Borommaratchachonnani Road outbound.",
          'Bus routes 515 and 556 pass nearby. Ask to get off at "Krisdanakorn Village" bus stop, then walk or take a motorcycle taxi to the venue.',
        ],
      },
    ],
    dressEyebrow: "Dress Code",
    dressTitle: "Old Money Elegance",
    dressIntro:
      "Refined, timeless tones inspired by classic tailoring and understated luxury. Choose polished silhouettes, soft textures, and minimal details that feel formal without being ornate.",
    dressKeywords: ["Tailored", "Timeless", "Minimal"],
    paletteTitle: "Suggested Palette",
    rsvpEyebrow: "RSVP",
    rsvpTitle: "Kindly Confirm Your Attendance",
    rsvpIntro:
      "Please confirm your attendance by 30 September 2026. Your response helps us prepare the celebration beautifully for everyone.",
    faqEyebrow: "FAQ",
    faqTitle: "Guest Notes",
    faqs: [
      {
        question: "When should I RSVP?",
        answer: "Please submit your RSVP by 30 September 2026.",
      },
      {
        question: "Is the wedding timeline final?",
        answer: "The date and venue are confirmed. The detailed event time and schedule will be updated once finalized.",
      },
      {
        question: "How should I get to the venue?",
        answer:
          "Please use the Google Maps link on this page. The venue is on Borommaratchachonnani Road outbound, between Phutthamonthon Sai 2 and Sai 3.",
      },
      {
        question: "Who can I contact for questions?",
        answer: "Please contact Smart via LINE Official or phone.",
      },
    ],
    contactEyebrow: "Contact",
    contactTitle: "Smart",
    contactIntro:
      "For questions about the wedding, location, RSVP, or schedule, please contact Smart via LINE Official or phone.",
    contactLineLabel: "Add LINE Official: @990yroaq",
    bottomNav: [
      { label: "Map", href: "#location", icon: MapPin },
      { label: "Time", href: "#schedule", icon: Clock },
      { label: "Dress", href: "#dress-code", icon: Shirt },
      { label: "RSVP", href: "#rsvp", icon: Users },
    ],
  },
  th: {
    nav: [
      { label: "ข้อมูล", href: "#event-info" },
      { label: "กำหนดการ", href: "#schedule" },
      { label: "แกลเลอรี", href: "#gallery" },
      { label: "สถานที่", href: "#location" },
      { label: "ธีมชุด", href: "#dress-code" },
      { label: "ตอบรับ", href: "#rsvp" },
      { label: "FAQ", href: "#faq" },
      { label: "ติดต่อ", href: "#contact" },
    ],
    languageButton: "EN",
    rsvpButton: "ตอบรับ",
    heroDate: "วันอาทิตย์ที่ 1 พฤศจิกายน 2569",
    heroText: "เรียนเชิญร่วมเป็นเกียรติในงานฉลองมงคลสมรสของ Jajah & Smart ณ Pearl Wedding Avenue",
    locationButton: "ดูแผนที่",
    dressButton: "ธีมการแต่งกาย",
    eventEyebrow: "ข้อมูลสำคัญ",
    eventTitle: "รายละเอียดงาน",
    eventIntro: "สรุปวัน เวลา สถานที่ และธีมงาน เพื่อให้แขกเตรียมตัวได้อย่างสะดวก",
    eventCards: [
      { label: "วันที่", value: "วันอาทิตย์ที่ 1 พฤศจิกายน 2569", icon: icons.date },
      { label: "เวลา", value: "รอยืนยันเวลา", icon: icons.time },
      { label: "สถานที่", value: "Pearl Wedding Avenue", icon: icons.venue },
      { label: "ธีมชุด", value: "Old Money Elegance", icon: icons.dress },
    ],
    scheduleEyebrow: "กำหนดการ",
    scheduleTitle: "ลำดับพิธี",
    scheduleIntro: "กำหนดการและเวลางานโดยละเอียดอยู่ระหว่างการยืนยัน และจะอัปเดตอีกครั้งเมื่อใกล้วันงาน",
    schedule: [
      { time: "TBC", title: "ลงทะเบียน", detail: "ต้อนรับแขกและลงทะเบียน" },
      { time: "TBC", title: "พิธีแต่งงาน", detail: "เริ่มพิธีมงคลสมรส" },
      { time: "TBC", title: "งานเลี้ยงฉลอง", detail: "รับประทานอาหารและร่วมฉลอง" },
      { time: "TBC", title: "กล่าวอวยพร", detail: "ช่วงอวยพรและเฉลิมฉลอง" },
    ],
    galleryEyebrow: "แกลเลอรี",
    galleryTitle: "ภาพพรีเวดดิ้ง",
    galleryIntro: "พรีวิวบรรยากาศอบอุ่น เรียบหรู และคลาสสิกในโทนเดียวกับวันงาน",
    galleryCta: "ดูแกลเลอรีทั้งหมด",
    memoryBookCta: "ร่วมแบ่งปันความทรงจำ",
    galleryTabs: [
      { id: "prewedding", label: "Prewedding" },
      { id: "wedding-day", label: "Wedding Day", badge: "เร็ว ๆ นี้" },
    ],
    galleryAlbumLabel: "อัลบั้ม",
    galleryPhotoCount: "รูป",
    galleryAlbums: [
      {
        id: "highlights",
        title: "ไฮไลต์",
        description: "รวมภาพเด่นของบรรยากาศพรีเวดดิ้ง",
        images: [
          {
            src: "/images/wedding-hero.png",
            alt: "ภาพพรีเวดดิ้งของ Jajah และ Smart",
            caption: "ภาพพอร์ตเทรต",
          },
          {
            src: "/images/wedding-hero.png",
            alt: "โมเมนต์พรีเวดดิ้งของ Jajah และ Smart",
            caption: "โมเมนต์เรียบหรู",
          },
          {
            src: "/images/wedding-hero.png",
            alt: "สไตล์พรีเวดดิ้งโทน Old Money ของ Jajah และ Smart",
            caption: "บรรยากาศ Old Money",
          },
          {
            src: "/images/wedding-hero.png",
            alt: "รายละเอียดภาพพรีเวดดิ้งของ Jajah และ Smart",
            caption: "รายละเอียดนุ่มนวล",
          },
        ],
      },
      {
        id: "studio",
        title: "เซ็ตสตูดิโอ",
        description: "ภาพพอร์ตเทรตเรียบหรูและคลาสสิก",
        images: [
          {
            src: "/images/wedding-hero.png",
            alt: "ภาพพรีเวดดิ้งในสตูดิโอของ Jajah และ Smart",
            caption: "พอร์ตเทรตทางการ",
          },
          {
            src: "/images/wedding-hero.png",
            alt: "รายละเอียดสไตล์พรีเวดดิ้งในสตูดิโอ",
            caption: "รายละเอียดชุด",
          },
        ],
      },
      {
        id: "outdoor",
        title: "เซ็ตเอาท์ดอร์",
        description: "ภาพบรรยากาศนุ่มนวลและเป็นธรรมชาติ",
        images: [
          {
            src: "/images/wedding-hero.png",
            alt: "โมเมนต์พรีเวดดิ้งกลางแจ้งของ Jajah และ Smart",
            caption: "บรรยากาศสวน",
          },
          {
            src: "/images/wedding-hero.png",
            alt: "รายละเอียดภาพพรีเวดดิ้งกลางแจ้ง",
            caption: "แสงนุ่ม",
          },
        ],
      },
    ],
    galleryComingSoon: "ภาพวันงานจะเพิ่มหลังจบงานแต่งงาน",
    locationEyebrow: "สถานที่",
    locationIntro:
      "สถานที่ตั้งอยู่ติดถนนบรมราชชนนีฝั่งขาออก ช่วงระหว่างพุทธมณฑลสาย 2 และพุทธมณฑลสาย 3",
    locationAddress: "Pearl Wedding Avenue, ถนนบรมราชชนนี, กรุงเทพฯ",
    parkingNote: "กรุณาเผื่อเวลาเดินทาง และสามารถกด Google Maps เพื่อนำทางมายังสถานที่",
    googleMaps: "เปิด Google Maps",
    contactOrganizer: "ติดต่อ Smart",
    transportTitle: "การเดินทาง",
    transportSections: [
      {
        title: "การเดินทางโดยรถยนต์ส่วนตัว",
        items: [
          "สถานที่ตั้งอยู่ติดถนนบรมราชชนนี ฝั่งขาออก มุ่งหน้านครปฐม ช่วงระหว่างพุทธมณฑลสาย 2 และพุทธมณฑลสาย 3",
          "จุดสังเกตคืออยู่ใกล้ซอยบรมราชชนนี 72 และทางเข้าหมู่บ้านกฤษดานคร ตัวอาคารเป็นกระจกทรงกลมสไตล์โมเดิร์น มองเห็นได้ง่ายจากริมถนนใหญ่",
        ],
      },
      {
        title: "การเดินทางโดยระบบขนส่งสาธารณะ",
        items: [
          "สามารถนั่ง MRT มาลงสถานีหลักสอง หรือ BTS มาลงสถานีบางหว้า แล้วต่อรถแท็กซี่เข้าสู่ถนนบรมราชชนนีฝั่งขาออก",
          'รถเมล์สาย 515 และ 556 วิ่งผ่าน สามารถแจ้งพนักงานเก็บค่าโดยสารว่าลงที่ "ป้ายหมู่บ้านกฤษดานคร" จากนั้นเดินต่อหรือต่อมอเตอร์ไซค์รับจ้างเข้าสู่อาคารจัดงาน',
        ],
      },
    ],
    dressEyebrow: "ธีมการแต่งกาย",
    dressTitle: "Old Money Elegance",
    dressIntro:
      "ขอเชิญแต่งกายในโทนสุภาพ เรียบหรู และคลาสสิก เลือกทรงชุดที่ดูประณีต รายละเอียดน้อย และเหมาะกับบรรยากาศงานช่วงเย็น",
    dressKeywords: ["สุภาพ", "คลาสสิก", "เรียบหรู"],
    paletteTitle: "โทนสีแนะนำ",
    rsvpEyebrow: "ตอบรับคำเชิญ",
    rsvpTitle: "กรุณายืนยันการเข้าร่วมงาน",
    rsvpIntro: "กรุณายืนยันการเข้าร่วมงานภายในวันที่ 30 กันยายน 2569 เพื่อให้เราจัดเตรียมงานได้อย่างเหมาะสมและสวยงามสำหรับทุกคน",
    faqEyebrow: "FAQ",
    faqTitle: "คำถามที่พบบ่อย",
    faqs: [
      {
        question: "ควรตอบรับคำเชิญภายในวันไหน?",
        answer: "กรุณาส่งคำตอบ RSVP ภายในวันที่ 30 กันยายน 2569",
      },
      {
        question: "กำหนดการงาน final แล้วหรือยัง?",
        answer: "วันและสถานที่ยืนยันแล้ว ส่วนเวลางานและกำหนดการโดยละเอียดจะอัปเดตอีกครั้งเมื่อ final",
      },
      {
        question: "เดินทางไปสถานที่อย่างไร?",
        answer:
          "สามารถกด Google Maps บนหน้าเว็บเพื่อนำทางไป Pearl Wedding Avenue ซึ่งตั้งอยู่บนถนนบรมราชชนนีฝั่งขาออก ช่วงระหว่างพุทธมณฑลสาย 2 และสาย 3",
      },
      {
        question: "ติดต่อใครได้หากมีคำถาม?",
        answer: "สามารถติดต่อ Smart ผ่าน LINE Official หรือโทรศัพท์",
      },
    ],
    contactEyebrow: "ติดต่อ",
    contactTitle: "Smart",
    contactIntro: "หากมีคำถามเกี่ยวกับงาน สถานที่ RSVP หรือกำหนดการ สามารถติดต่อ Smart ผ่าน LINE Official หรือโทรศัพท์",
    contactLineLabel: "เพิ่มเพื่อน LINE Official: @990yroaq",
    bottomNav: [
      { label: "แผนที่", href: "#location", icon: MapPin },
      { label: "เวลา", href: "#schedule", icon: Clock },
      { label: "ธีมชุด", href: "#dress-code", icon: Shirt },
      { label: "ตอบรับ", href: "#rsvp", icon: Users },
    ],
  },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#7C5C3B]">
      {children}
    </p>
  );
}

function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2 className="luxury-heading text-3xl font-semibold leading-tight text-current md:text-4xl">
        {title}
      </h2>
      {children ? (
        <div className="mx-auto mt-4 max-w-2xl text-base leading-7 text-current opacity-75 md:text-lg">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function WeddingHomeClient({ snapshot }: { snapshot: CmsSnapshot }) {
  const [language, setLanguage] = useState<Language>("en");
  const t = copy[language];
  const localized = (value: Record<Language, string>, fallback: string) => value[language] || fallback;
  const content = snapshot.content;
  const hero = content.hero;
  const heroImageSrc = hero.imageSrc || "/images/wedding-hero.png";
  const heroImages = hero.images?.length ? hero.images : [heroImageSrc];
  const navItems = content.navigation.items
    .filter((item) => item.isVisible)
    .toSorted((first, second) => first.sortOrder - second.sortOrder);
  const eventCards = content.eventInfo.cards.map((card) => ({
    ...card,
    icon: icons[card.id as keyof typeof icons] ?? CalendarDays,
  }));
  const scheduleItems = content.schedule.items.toSorted((first, second) => first.sortOrder - second.sortOrder);
  const transportSections = content.location.transportSections.toSorted(
    (first, second) => first.sortOrder - second.sortOrder,
  );
  const faqItems = content.faq.items.toSorted((first, second) => first.sortOrder - second.sortOrder);
  const galleryAlbums = snapshot.albums.filter((album) => album.images.length > 0);
  const [albumIndex, setAlbumIndex] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const albumCarouselRef = useRef<HTMLDivElement>(null);
  const heroCarouselRef = useRef<HTMLDivElement>(null);
  const isThai = language === "th";
  const languageStyle = isThai
    ? ({
        "--font-cinzel": "var(--font-kanit)",
        fontFamily: "var(--font-kanit), ui-sans-serif, system-ui, sans-serif",
      } as CSSProperties)
    : undefined;

  const moveAlbum = (direction: -1 | 1) => {
    if (galleryAlbums.length < 2) return;
    const nextIndex = (albumIndex + direction + galleryAlbums.length) % galleryAlbums.length;
    setAlbumIndex(nextIndex);
    const nextAlbum = albumCarouselRef.current?.children[nextIndex] as HTMLElement | undefined;
    albumCarouselRef.current?.scrollTo({ behavior: "smooth", left: nextAlbum?.offsetLeft ?? 0 });
  };


  useEffect(() => {
    if (galleryAlbums.length < 2 || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => moveAlbum(1), 6000);
    return () => window.clearInterval(timer);
  }, [albumIndex, galleryAlbums.length]);

  useEffect(() => {
    if (heroImages.length < 2 || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setHeroIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % heroImages.length;
        const nextCard = heroCarouselRef.current?.children[nextIndex] as HTMLElement | undefined;
        heroCarouselRef.current?.scrollTo({ behavior: "smooth", left: nextCard?.offsetLeft ?? 0 });
        return nextIndex;
      });
    }, 6000);
    return () => window.clearInterval(timer);
  }, [heroImages.length]);

  return (
    <main
      className={`subtle-paper min-h-screen overflow-hidden bg-[#FBF8F0] ${isThai ? "lang-th" : ""}`}
      style={languageStyle}
    >
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[#0A1F44]/90 text-[#FBF8F0] backdrop-blur">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        >
          <a className="script-display text-2xl font-semibold leading-none" href="#home">
            J&S
          </a>
          <div className="hidden items-center gap-7 text-sm font-medium md:flex">
            {navItems.map((item) => (
              <a className="transition hover:text-[#D6C8A5]" href={item.href} key={item.href}>
                {localized(item.label, item.id)}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label={isThai ? "Switch language to English" : "Switch language to Thai"}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-[#D6C8A5]/70 px-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#FBF8F0] transition hover:bg-[#D6C8A5] hover:text-[#0A1F44]"
              onClick={() => setLanguage(isThai ? "en" : "th")}
              type="button"
            >
              <Globe2 aria-hidden="true" size={15} />
              <span>{t.languageButton}</span>
            </button>
            <a
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#D6C8A5] px-3 text-sm font-semibold text-[#0A1F44] transition hover:bg-[#FBF8F0] sm:px-4"
              href="#rsvp"
            >
              <Users aria-hidden="true" size={16} />
              {t.rsvpButton}
            </a>
            <button aria-expanded={isMobileMenuOpen} aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"} className="grid h-10 w-10 place-items-center rounded-full border border-[#D6C8A5]/55 text-[#FBF8F0] md:hidden" onClick={() => setIsMobileMenuOpen((open) => !open)} type="button">
              {isMobileMenuOpen ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}
            </button>
          </div>
        </nav>
        {isMobileMenuOpen ? <div className="absolute inset-x-0 top-full z-[60] flex min-h-[calc(100svh-4rem)] flex-col overflow-y-auto border-t border-[#D6C8A5] bg-[#FBF8F0] px-4 py-6 text-[#0A1F44] shadow-[0_18px_40px_rgba(10,31,68,0.18)] md:hidden"><p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#7C5C3B]">Explore</p><div className="grid">{navItems.map((item) => <a className="flex min-h-14 items-center border-b border-[#0A1F44]/12 text-base font-semibold transition hover:bg-[#D6C8A5]/30" href={item.href} key={item.href} onClick={() => setIsMobileMenuOpen(false)}>{isThai && item.id === "faq" ? "คำถามที่พบบ่อย" : localized(item.label, item.id)}<span aria-hidden className="ml-auto pr-1 text-[#7C5C3B]">→</span></a>)}</div><p className="mt-auto pt-8 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#7C5C3B]">{hero.coupleName} · {localized(hero.date, t.heroDate)}</p></div> : null}
      </header>

      <section className="grid bg-[#0A1F44] text-[#FBF8F0] md:min-h-[calc(100svh-4.5rem)] md:grid-cols-[0.82fr_1.18fr]" id="home">
        <div className="order-2 flex items-center px-5 py-16 sm:px-10 md:order-1 md:px-12 lg:px-20">
          <div className="max-w-xl">
            <p className="mb-7 text-xs font-semibold uppercase tracking-[0.34em] text-[#D6C8A5]">
              {localized(hero.date, t.heroDate)}
            </p>
            <h1 className="script-display text-6xl font-medium leading-[0.92] tracking-normal sm:text-7xl lg:text-8xl">
              {hero.coupleName || "Jajah & Smart"}
            </h1>
            <div className="my-8 h-px w-24 bg-[#D6C8A5]" />
            <p className="max-w-lg text-lg leading-8 text-[#FBF8F0]/78 md:text-xl">
              {localized(hero.text, t.heroText)}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#D6C8A5] px-6 text-sm font-bold uppercase tracking-[0.12em] text-[#0A1F44] transition hover:bg-[#FBF8F0]"
                href="#location"
              >
                <MapPin aria-hidden="true" className="mr-2" size={18} />
                {localized(hero.locationButton, t.locationButton)}
              </a>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#FBF8F0]/40 px-6 text-sm font-bold uppercase tracking-[0.12em] text-[#FBF8F0] transition hover:border-[#D6C8A5] hover:text-[#D6C8A5]"
                href="#dress-code"
              >
                <Shirt aria-hidden="true" className="mr-2" size={18} />
                {localized(hero.dressButton, t.dressButton)}
              </a>
            </div>
          </div>

        </div>
        <div className="relative order-1 aspect-[4/5] min-h-[21rem] touch-pan-x overflow-x-auto overflow-y-hidden overscroll-x-contain bg-[#0A1F44] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:order-2 md:aspect-auto md:min-h-0">
          <div className="flex h-full snap-x snap-mandatory gap-4 px-4 sm:px-6" data-testid="hero-carousel" onScroll={(event) => setHeroIndex(Math.round(event.currentTarget.scrollLeft / Math.max(event.currentTarget.children[0]?.clientWidth + 16, 1)))} ref={heroCarouselRef}>
            {heroImages.map((image, index) => <div className="relative min-w-[86%] snap-start bg-[#0A1F44] sm:min-w-[78%]" key={`${image}-${index}`}><Image alt="" aria-hidden className="scale-110 object-cover opacity-35 blur-2xl" fill sizes="(min-width: 768px) 60vw, 100vw" src={image} /><Image alt={localized(hero.imageAlt, "Elegant wedding venue with refined old money styling")} className="object-contain" fill priority={index === 0} sizes="(min-width: 768px) 60vw, 100vw" src={image} /><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A1F44]/40 via-transparent to-[#0A1F44]/10" /></div>)}
          </div>
          {heroImages.length > 1 ? <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center gap-2">{heroImages.map((image, index) => <span aria-hidden className={`h-2 rounded-full transition-all ${index === heroIndex ? "w-8 bg-[#0A1F44]" : "w-2 bg-[#0A1F44]/25"}`} key={`${image}-indicator-${index}`} />)}</div> : null}
        </div>
      </section>

      <ScrollReveal>
        <WeddingCountdown language={language} />
      </ScrollReveal>

      <section className="scroll-mt-24 border-b border-[#0A1F44]/12 bg-[#FBF8F0] px-4 py-10 sm:px-6 lg:px-8" id="event-info">
        <ScrollReveal className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-3 md:grid-cols-[0.7fr_1.3fr] md:items-end">
            <div>
              <SectionLabel>{localized(content.eventInfo.eyebrow, t.eventEyebrow)}</SectionLabel>
              <h2 className="luxury-heading text-2xl font-semibold leading-tight text-[#0A1F44] md:text-3xl">
                {localized(content.eventInfo.title, t.eventTitle)}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[#0A1F44]/65 md:justify-self-end md:text-base">
              {localized(content.eventInfo.intro, t.eventIntro)}
            </p>
          </div>
          <div className="grid grid-cols-2 border-y border-[#0A1F44]/12 lg:grid-cols-4">
            {eventCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  className="border-b border-r border-[#0A1F44]/12 px-3 py-5 last:border-b-0 even:border-r-0 sm:px-5 lg:border-b-0 lg:even:border-r"
                  key={card.id}
                >
                  <Icon aria-hidden="true" className="mb-5 text-[#7C5C3B]" size={20} />
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0A1F44]/55">
                    {localized(card.label, card.id)}
                  </h3>
                  <p className="mt-2 text-base font-semibold leading-snug text-[#0A1F44]">
                    {localized(card.value, "")}
                  </p>
                </article>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      <section className="scroll-mt-24 bg-[#0A1F44] px-4 py-20 text-[#FBF8F0] sm:px-6 lg:px-8" id="schedule">
        <ScrollReveal className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionLabel>{localized(content.schedule.eyebrow, t.scheduleEyebrow)}</SectionLabel>
            <h2 className="luxury-heading text-3xl font-semibold leading-tight md:text-5xl">
              {localized(content.schedule.title, t.scheduleTitle)}
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-[#FBF8F0]/68">
              {localized(content.schedule.intro, t.scheduleIntro)}
            </p>
          </div>
          <div className="mx-auto w-full max-w-3xl">
            {scheduleItems.map((item, index) => (
              <article className="relative grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 py-7 first:pt-0 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-5" key={item.id}>
                <div className="relative z-10 flex flex-col items-center">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#D6C8A5] text-xs font-bold text-[#0A1F44]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <time className="mt-3 whitespace-nowrap text-xs font-bold text-[#D6C8A5]">
                    {language === "en"
                      ? item.time.replace(/\s*น\.$/u, "")
                      : /^\d/u.test(item.time) && !item.time.endsWith("น.")
                        ? `${item.time} น.`
                        : item.time}
                  </time>
                  {index !== scheduleItems.length - 1 ? (
                    <div className="absolute bottom-[-1.75rem] left-1/2 top-[4.25rem] w-px -translate-x-1/2 bg-[#D6C8A5]/35" />
                  ) : null}
                </div>
                <div className={`min-w-0 pt-1 ${index !== scheduleItems.length - 1 ? "border-b border-[#D6C8A5]/18 pb-7" : ""}`}>
                  <h3 className="luxury-heading text-lg font-semibold">{localized(item.title, item.id)}</h3>
                  <p className="mt-2 text-[#FBF8F0]/65">{localized(item.detail, "")}</p>
                </div>
              </article>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="scroll-mt-24 bg-white/45 px-4 py-16 sm:px-6 lg:px-8" id="gallery">
        <ScrollReveal className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-5 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <div>
              <SectionLabel>{localized(content.gallery.eyebrow, t.galleryEyebrow)}</SectionLabel>
              <h2 className="luxury-heading max-w-2xl text-3xl font-semibold leading-tight text-[#0A1F44] md:text-4xl">
                {localized(content.gallery.title, t.galleryTitle)}
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[#0A1F44]/68 md:justify-self-end md:text-lg">
              {localized(content.gallery.intro, t.galleryIntro)}
            </p>
          </div>

          <div className="relative">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" onScroll={(event) => {
              const width = event.currentTarget.children[0]?.clientWidth ?? 1;
              setAlbumIndex(Math.round(event.currentTarget.scrollLeft / (width + 16)));
            }} ref={albumCarouselRef}>
              {galleryAlbums.map((album) => {
                const cover = album.images.find((image) => image.id === album.coverImageId) ?? album.images[0];
                return <a className="group relative min-w-[86%] snap-start overflow-hidden rounded-[1.5rem] border border-[#0A1F44]/10 bg-[#0A1F44] shadow-[0_22px_70px_rgba(10,31,68,0.14)] sm:min-w-[58%] lg:min-w-[42%]" href={`/gallery?album=${album.slug}`} key={album.id}>
                  <div className="relative aspect-[4/5] sm:aspect-[16/11]">
                    <Image alt={cover.alt[language]} className="object-cover opacity-95 transition duration-500 group-hover:scale-[1.025]" fill sizes="(min-width: 1024px) 42vw, (min-width: 640px) 58vw, 86vw" src={cover.publicUrl} />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A1F44]/90 to-transparent p-5 pt-24 text-[#FBF8F0]">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6C8A5]">{localized(content.gallery.albumLabel, t.galleryAlbumLabel)}</p>
                      <h3 className="luxury-heading mt-2 text-2xl font-semibold">{localized(album.title, album.slug)}</h3>
                      <p className="mt-2 text-sm text-white/75">{album.images.length} {t.galleryPhotoCount}</p>
                    </div>
                  </div>
                </a>;
              })}
            </div>
            {galleryAlbums.length > 1 ? <div className="mt-2 flex items-center justify-between gap-3"><div className="flex gap-1.5">{galleryAlbums.map((album, index) => <span aria-hidden="true" className={`h-1.5 rounded-full transition-all ${index === albumIndex ? "w-6 bg-[#0A1F44]" : "w-1.5 bg-[#0A1F44]/25"}`} key={album.id} />)}</div><div className="hidden gap-2 sm:flex"><button aria-label="Previous album" className="grid h-11 w-11 place-items-center rounded-full border border-[#0A1F44]/20 text-lg" onClick={() => moveAlbum(-1)} type="button">←</button><button aria-label="Next album" className="grid h-11 w-11 place-items-center rounded-full border border-[#0A1F44]/20 text-lg" onClick={() => moveAlbum(1)} type="button">→</button></div></div> : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <a className="inline-flex min-h-12 items-center rounded-full border border-[#3E4D3A]/30 bg-[#3E4D3A] px-5 text-sm font-semibold text-[#FBF8F0] transition hover:bg-[#7C5C3B]" href="https://jjhsmartweddingsmemory.vercel.app" rel="noreferrer" target="_blank">{t.memoryBookCta}</a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="scroll-mt-24 bg-[#F3EFE5] px-4 py-20 sm:px-6 lg:px-8" id="location">
        <ScrollReveal className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="order-2 lg:order-1">
            <SectionLabel>{localized(content.location.eyebrow, t.locationEyebrow)}</SectionLabel>
            <h2 className="luxury-heading text-3xl font-semibold leading-tight md:text-4xl">
              {localized(content.location.title, "Pearl Wedding Avenue")}
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#0A1F44]/72">
              {localized(content.location.intro, t.locationIntro)}
            </p>
            <div className="mt-8 space-y-4 text-[#0A1F44]/78">
              <p className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-1 shrink-0 text-[#7C5C3B]" size={20} />
                <span>{localized(content.location.address, t.locationAddress)}</span>
              </p>
              <p className="flex gap-3">
                <Check aria-hidden="true" className="mt-1 shrink-0 text-[#3E4D3A]" size={20} />
                <span>{localized(content.location.parkingNote, t.parkingNote)}</span>
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0A1F44] px-5 text-sm font-bold uppercase tracking-[0.12em] text-[#FBF8F0] transition hover:bg-[#7C5C3B]"
                href={content.location.mapsUrl}
                rel="noreferrer"
                target="_blank"
              >
                {localized(content.location.mapsButton, t.googleMaps)}
              </a>
            </div>
          </div>
          <div className="order-1 min-h-[16rem] overflow-hidden rounded-[1.5rem] border border-[#0A1F44]/10 bg-[#BDBFBA]/25 lg:order-2 lg:min-h-[22rem]">
            <iframe
              aria-label="Map to Pearl Wedding Avenue"
              className="h-full min-h-[16rem] w-full lg:min-h-[22rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={content.location.mapsEmbedUrl}
              title="Pearl Wedding Avenue map"
            />
          </div>
        </ScrollReveal>
        <ScrollReveal className="mx-auto mt-10 max-w-7xl border-t border-[#0A1F44]/15 pt-8">
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#7C5C3B]">
            {localized(content.location.transportTitle, t.transportTitle)}
          </h3>
          <div className="max-w-4xl divide-y divide-[#0A1F44]/15 border-y border-[#0A1F44]/15">
            {transportSections.map((section) => (
                <details className="group" key={section.id}>
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-semibold text-[#0A1F44] marker:content-none sm:text-lg">
                    <span>{localized(section.title, section.id)}</span>
                    <span
                      aria-hidden="true"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#0A1F44]/20 text-lg font-normal text-[#7C5C3B] transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <ul className="max-w-3xl space-y-3 pb-6 pl-8 text-sm leading-6 text-[#0A1F44]/72 sm:pl-9">
                    {section.items.map((item, itemIndex) => (
                      <li className="relative pl-5" key={`${section.id}-${itemIndex}`}>
                        <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-[#D6C8A5]" />
                        {localized(item, "")}
                      </li>
                    ))}
                  </ul>
                </details>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="scroll-mt-24 bg-white/55 px-4 py-16 sm:px-6 lg:px-8" id="dress-code">
        <ScrollReveal className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <SectionLabel>{localized(content.dressCode.eyebrow, t.dressEyebrow)}</SectionLabel>
              <h2 className="luxury-heading text-3xl font-semibold leading-tight text-[#0A1F44] md:text-5xl">
                {localized(content.dressCode.title, t.dressTitle)}
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#0A1F44]/72">
                {localized(content.dressCode.intro, t.dressIntro)}
              </p>
              <div className="mt-8 grid gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#0A1F44]/62 sm:grid-cols-3 lg:max-w-xl">
                {content.dressCode.keywords.map((keyword, index) => (
                  <p className="border-l border-[#7C5C3B] pl-4" key={`dress-keyword-${index}`}>
                    {localized(keyword, "")}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#0A1F44]/10 bg-[#FBF8F0] p-5 sm:p-6">
              <div className="mb-5 flex items-end justify-between gap-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0A1F44]/60">
                  {localized(content.dressCode.paletteTitle, t.paletteTitle)}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {content.dressCode.colors.map((color) => (
                  <div
                    className="grid grid-cols-[4.5rem_1fr] items-center gap-3 sm:block sm:space-y-3"
                    key={color.name}
                  >
                    <div
                      aria-label={`${color.name} color swatch`}
                      className="h-28 rounded border border-[#0A1F44]/10 shadow-inner sm:h-44"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <p className="text-sm font-semibold">{color.name}</p>
                      <p className="text-xs uppercase tracking-[0.12em] text-[#0A1F44]/52">
                        {color.hex}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="scroll-mt-24 bg-[#0A1F44] px-4 py-20 text-[#FBF8F0] sm:px-6 lg:px-8" id="rsvp">
        <ScrollReveal className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="lg:pt-5">
            <SectionLabel>{localized(content.rsvp.eyebrow, t.rsvpEyebrow)}</SectionLabel>
            <h2 className="luxury-heading text-3xl font-semibold leading-tight md:text-4xl">
              {localized(content.rsvp.title, t.rsvpTitle)}
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#FBF8F0]/70">
              {localized(content.rsvp.intro, t.rsvpIntro)}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[#FBF8F0] p-4 text-[#0A1F44] shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:p-7">
            <RsvpForm language={language} relationshipOptions={content.rsvp.relationshipOptions} />
          </div>
        </ScrollReveal>
      </section>

      <section className="scroll-mt-24 bg-white/55 px-4 py-16 sm:px-6 lg:px-8" id="faq">
        <ScrollReveal className="mx-auto max-w-5xl">
          <SectionHeader eyebrow={localized(content.faq.eyebrow, t.faqEyebrow)} title={localized(content.faq.title, t.faqTitle)} />
          <div className="mx-auto max-w-3xl border-y border-[#0A1F44]/15">
            {faqItems.map((item) => (
              <details className="group border-b border-[#0A1F44]/15 py-5 last:border-0" key={item.id}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#0A1F44] marker:content-none">
                  {localized(item.question, item.id)}
                  <span aria-hidden="true" className="text-xl font-normal text-[#7C5C3B] transition group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pt-3 text-sm leading-6 text-[#0A1F44]/70">{localized(item.answer, "")}</p>
              </details>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="scroll-mt-24 bg-[#3E4D3A] px-4 py-16 text-[#FBF8F0] sm:px-6 lg:px-8" id="contact">
        <ScrollReveal className="mx-auto max-w-5xl text-center">
          <SectionLabel>{localized(content.contact.eyebrow, t.contactEyebrow)}</SectionLabel>
          <h2 className="luxury-heading text-3xl font-semibold md:text-4xl">
            {localized(content.contact.title, t.contactTitle)}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#FBF8F0]/75">
            {localized(content.contact.intro, t.contactIntro)}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              aria-label="Add LINE Official @990yroaq as a friend"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/18 bg-white/8 px-5 font-semibold transition hover:bg-white/14"
              href={content.contact.lineUrl}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden="true" size={20} />
              {localized(content.contact.lineLabel, t.contactLineLabel)}
            </a>
            <a
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/18 bg-white/8 px-5 font-semibold transition hover:bg-white/14"
              href={content.contact.phoneHref}
            >
              <Phone aria-hidden="true" size={20} />
              {localized(content.contact.phoneLabel, "Phone: 099-656-7965")}
            </a>
          </div>
        </ScrollReveal>
      </section>

      <footer className="bg-[#0A1F44] px-4 py-10 text-center text-[#FBF8F0] sm:px-6 lg:px-8">
        <p className="script-display text-4xl font-medium">{content.footer.coupleName}</p>
        <p className="mt-2 text-sm uppercase tracking-[0.22em] text-[#D6C8A5]">
          {localized(content.footer.details, "1 November 2026 · Pearl Wedding Avenue")}
        </p>
      </footer>

    </main>
  );
}
