"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Shirt,
  Users,
} from "lucide-react";
import { RsvpForm } from "./components/RsvpForm";

type Language = "en" | "th";

const icons = {
  date: CalendarDays,
  time: Clock,
  venue: MapPin,
  dress: Shirt,
};

const dressColors = [
  { name: "Oxford Navy", hex: "#0A1F44" },
  { name: "Tweed Brown", hex: "#7C5C3B" },
  { name: "Deep Olive", hex: "#3E4D3A" },
  { name: "Camel Beige", hex: "#D6C8A5" },
  { name: "Ash Grey", hex: "#BDBFBA" },
];

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
    rsvpNote: "RSVP responses will be saved to the wedding Google Sheet.",
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
    rsvpNote: "ข้อมูล RSVP จะถูกบันทึกไว้ใน Google Sheet ของงานแต่ง",
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

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const t = copy[language];
  const previewImages = t.galleryAlbums[0].images.slice(0, 3);
  const isThai = language === "th";
  const languageStyle = isThai
    ? ({
        "--font-cinzel": "var(--font-prompt)",
        fontFamily: "var(--font-prompt), ui-sans-serif, system-ui, sans-serif",
      } as CSSProperties)
    : undefined;

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
          <a className="luxury-heading text-lg font-semibold" href="#home">
            J&S
          </a>
          <div className="hidden items-center gap-7 text-sm font-medium md:flex">
            {t.nav.map((item) => (
              <a className="transition hover:text-[#D6C8A5]" href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex min-h-10 items-center rounded border border-[#D6C8A5]/55 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#FBF8F0] transition hover:bg-[#D6C8A5] hover:text-[#0A1F44]"
              onClick={() => setLanguage(isThai ? "en" : "th")}
              type="button"
            >
              {t.languageButton}
            </button>
            <a
              className="inline-flex min-h-10 items-center gap-2 rounded border border-[#D6C8A5]/80 px-4 text-sm font-semibold text-[#FBF8F0] transition hover:bg-[#D6C8A5] hover:text-[#0A1F44]"
              href="#rsvp"
            >
              <Users aria-hidden="true" size={16} />
              {t.rsvpButton}
            </a>
          </div>
        </nav>
      </header>

      <section
        className="relative flex min-h-[92svh] items-end px-4 pb-12 pt-28 text-[#FBF8F0] sm:px-6 md:min-h-screen md:pb-16 lg:px-8"
        id="home"
      >
        <Image
          alt="Elegant wedding venue with refined old money styling"
          className="object-cover"
          fill
          priority
          sizes="100vw"
          src="/images/wedding-hero.png"
        />
        <div className="absolute inset-0 bg-[#0A1F44]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44] via-[#0A1F44]/35 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.34em] text-[#D6C8A5] sm:mb-10">
              {t.heroDate}
            </p>
            <h1 className="script-display text-6xl font-medium leading-[0.92] tracking-normal sm:text-7xl md:text-8xl lg:text-9xl">
              Jajah & Smart
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#FBF8F0]/86 md:text-xl">
              {t.heroText}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-12 items-center justify-center rounded bg-[#D6C8A5] px-6 text-sm font-bold uppercase tracking-[0.12em] text-[#0A1F44] transition hover:bg-[#FBF8F0]"
                href="#location"
              >
                <MapPin aria-hidden="true" className="mr-2" size={18} />
                {t.locationButton}
              </a>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded border border-[#FBF8F0]/55 px-6 text-sm font-bold uppercase tracking-[0.12em] text-[#FBF8F0] transition hover:border-[#D6C8A5] hover:text-[#D6C8A5]"
                href="#dress-code"
              >
                <Shirt aria-hidden="true" className="mr-2" size={18} />
                {t.dressButton}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="event-info">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow={t.eventEyebrow} title={t.eventTitle}>
            <p>{t.eventIntro}</p>
          </SectionHeader>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.eventCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  className="rounded border border-[#0A1F44]/10 bg-white/70 p-6 shadow-[0_18px_60px_rgba(10,31,68,0.08)]"
                  key={card.label}
                >
                  <Icon aria-hidden="true" className="mb-8 text-[#7C5C3B]" size={24} />
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0A1F44]/55">
                    {card.label}
                  </h3>
                  <p className="mt-3 text-xl font-semibold leading-snug text-[#0A1F44]">
                    {card.value}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0A1F44] px-4 py-16 text-[#FBF8F0] sm:px-6 lg:px-8" id="schedule">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow={t.scheduleEyebrow} title={t.scheduleTitle}>
            <p className="text-[#FBF8F0]/72">{t.scheduleIntro}</p>
          </SectionHeader>
          <div className="mx-auto max-w-3xl">
            {t.schedule.map((item, index) => (
              <article className="relative grid grid-cols-[5rem_1fr] gap-5 pb-9" key={item.time}>
                {index !== t.schedule.length - 1 ? (
                  <div className="absolute bottom-0 left-[5.45rem] top-8 w-px bg-[#D6C8A5]/35" />
                ) : null}
                <time className="pt-1 text-lg font-bold text-[#D6C8A5]">{item.time}</time>
                <div className="relative rounded border border-white/12 bg-white/[0.04] p-5">
                  <span className="absolute -left-[1.1rem] top-7 h-3 w-3 rounded-full bg-[#D6C8A5]" />
                  <h3 className="luxury-heading text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-[#FBF8F0]/70">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/45 px-4 py-16 sm:px-6 lg:px-8" id="gallery">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-5 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <div>
              <SectionLabel>{t.galleryEyebrow}</SectionLabel>
              <h2 className="luxury-heading max-w-2xl text-3xl font-semibold leading-tight text-[#0A1F44] md:text-4xl">
                {t.galleryTitle}
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[#0A1F44]/68 md:justify-self-end md:text-lg">
              {t.galleryIntro}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <figure className="group overflow-hidden rounded border border-[#0A1F44]/10 bg-[#0A1F44] shadow-[0_22px_70px_rgba(10,31,68,0.14)]">
              <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:h-full lg:min-h-[28rem]">
                <Image
                  alt={previewImages[0].alt}
                  className="object-cover opacity-95 transition duration-500 group-hover:scale-[1.025]"
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  src={previewImages[0].src}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A1F44]/88 to-transparent p-5 pt-20">
                  <figcaption className="luxury-heading text-sm font-semibold text-[#D6C8A5]">
                    {previewImages[0].caption}
                  </figcaption>
                </div>
              </div>
            </figure>

            <div className="grid gap-4 sm:grid-cols-2">
              {previewImages.slice(1).map((image, index) => (
                <figure
                  className={`group overflow-hidden rounded border border-[#0A1F44]/10 bg-[#0A1F44] shadow-[0_18px_50px_rgba(10,31,68,0.1)] ${
                    index === 0 ? "sm:col-span-2" : ""
                  }`}
                  key={image.caption}
                >
                  <div className={index === 0 ? "relative aspect-[16/9]" : "relative aspect-[4/5] lg:aspect-auto lg:h-full"}>
                    <Image
                      alt={image.alt}
                      className="object-cover opacity-95 transition duration-500 group-hover:scale-[1.03]"
                      fill
                      sizes="(min-width: 1024px) 42vw, (min-width: 640px) 50vw, 100vw"
                      src={image.src}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A1F44]/85 to-transparent p-4 pt-14">
                      <figcaption className="luxury-heading text-xs font-semibold text-[#D6C8A5]">
                        {image.caption}
                      </figcaption>
                    </div>
                  </div>
                </figure>
              ))}

              <a
                className="group flex min-h-40 flex-col justify-between rounded border border-[#0A1F44]/10 bg-[#0A1F44] p-6 text-[#FBF8F0] shadow-[0_18px_50px_rgba(10,31,68,0.12)] transition hover:bg-[#7C5C3B]"
                href="/gallery"
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D6C8A5]">
                  {t.galleryAlbumLabel}
                </span>
                <span className="mt-8 flex items-end justify-between gap-4">
                  <span className="max-w-[12rem] text-lg font-semibold leading-7">
                    {t.galleryCta}
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#D6C8A5]/55 text-xl transition group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="location">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div>
            <SectionLabel>{t.locationEyebrow}</SectionLabel>
            <h2 className="luxury-heading text-3xl font-semibold leading-tight md:text-4xl">
              Pearl Wedding Avenue
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#0A1F44]/72">
              {t.locationIntro}
            </p>
            <div className="mt-8 space-y-4 text-[#0A1F44]/78">
              <p className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-1 shrink-0 text-[#7C5C3B]" size={20} />
                <span>{t.locationAddress}</span>
              </p>
              <p className="flex gap-3">
                <Check aria-hidden="true" className="mt-1 shrink-0 text-[#3E4D3A]" size={20} />
                <span>{t.parkingNote}</span>
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-12 items-center justify-center rounded bg-[#0A1F44] px-5 text-sm font-bold uppercase tracking-[0.12em] text-[#FBF8F0] transition hover:bg-[#7C5C3B]"
                href="https://maps.app.goo.gl/XwnnwTVqNXy3SNzSA"
                rel="noreferrer"
                target="_blank"
              >
                {t.googleMaps}
              </a>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded border border-[#0A1F44]/20 px-5 text-sm font-bold uppercase tracking-[0.12em] text-[#0A1F44] transition hover:border-[#7C5C3B] hover:text-[#7C5C3B]"
                href="#contact"
              >
                {t.contactOrganizer}
              </a>
            </div>
          </div>
          <div className="min-h-[22rem] overflow-hidden rounded border border-[#0A1F44]/10 bg-[#BDBFBA]/25">
            <iframe
              aria-label="Map to Pearl Wedding Avenue"
              className="h-full min-h-[22rem] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Pearl%20Wedding%20Avenue%20Borommaratchachonnani&output=embed"
              title="Pearl Wedding Avenue map"
            />
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl rounded border border-[#0A1F44]/10 bg-white/65 p-5 shadow-[0_18px_60px_rgba(10,31,68,0.08)] sm:p-7">
          <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-[#7C5C3B]">
            {t.transportTitle}
          </h3>
          <div className="grid gap-6 lg:grid-cols-2">
            {t.transportSections.map((section) => (
              <article key={section.title}>
                <h4 className="text-lg font-semibold text-[#0A1F44]">{section.title}</h4>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-[#0A1F44]/72">
                  {section.items.map((item) => (
                    <li className="border-l border-[#D6C8A5] pl-4" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/55 px-4 py-16 sm:px-6 lg:px-8" id="dress-code">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <SectionLabel>{t.dressEyebrow}</SectionLabel>
              <h2 className="luxury-heading text-3xl font-semibold leading-tight text-[#0A1F44] md:text-5xl">
                {t.dressTitle}
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#0A1F44]/72">
                {t.dressIntro}
              </p>
              <div className="mt-8 grid gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#0A1F44]/62 sm:grid-cols-3 lg:max-w-xl">
                {t.dressKeywords.map((keyword) => (
                  <p className="border-l border-[#7C5C3B] pl-4" key={keyword}>
                    {keyword}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded border border-[#0A1F44]/10 bg-[#FBF8F0] p-5 sm:p-6">
              <div className="mb-5 flex items-end justify-between gap-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0A1F44]/60">
                  {t.paletteTitle}
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-5">
                {dressColors.map((color) => (
                  <div
                    className="grid grid-cols-[4.5rem_1fr] items-center gap-3 sm:block sm:space-y-3"
                    key={color.name}
                  >
                    <div
                      aria-label={`${color.name} color swatch`}
                      className="h-16 rounded border border-[#0A1F44]/10 shadow-inner sm:h-44"
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
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="rsvp">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionLabel>{t.rsvpEyebrow}</SectionLabel>
            <h2 className="luxury-heading text-3xl font-semibold leading-tight md:text-4xl">
              {t.rsvpTitle}
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#0A1F44]/72">
              {t.rsvpIntro}
            </p>
            <p className="mt-5 rounded border border-[#D6C8A5]/50 bg-[#D6C8A5]/12 p-4 text-sm leading-6 text-[#0A1F44]/72">
              {t.rsvpNote}
            </p>
          </div>
          <RsvpForm language={language} />
        </div>
      </section>

      <section className="bg-white/55 px-4 py-16 sm:px-6 lg:px-8" id="faq">
        <div className="mx-auto max-w-5xl">
          <SectionHeader eyebrow={t.faqEyebrow} title={t.faqTitle} />
          <div className="grid gap-4 md:grid-cols-2">
            {t.faqs.map((item) => (
              <article
                className="rounded border border-[#0A1F44]/10 bg-[#FBF8F0] p-5 shadow-[0_16px_50px_rgba(10,31,68,0.06)]"
                key={item.question}
              >
                <h3 className="text-base font-semibold text-[#0A1F44]">{item.question}</h3>
                <p className="mt-3 text-sm leading-6 text-[#0A1F44]/70">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#3E4D3A] px-4 py-16 text-[#FBF8F0] sm:px-6 lg:px-8" id="contact">
        <div className="mx-auto max-w-5xl text-center">
          <SectionLabel>{t.contactEyebrow}</SectionLabel>
          <h2 className="luxury-heading text-3xl font-semibold md:text-4xl">{t.contactTitle}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#FBF8F0]/75">
            {t.contactIntro}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              aria-label="Add LINE Official @990yroaq as a friend"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded border border-white/18 bg-white/8 px-5 font-semibold transition hover:bg-white/14"
              href="https://line.me/R/ti/p/%40990yroaq"
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden="true" size={20} />
              {t.contactLineLabel}
            </a>
            <a
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded border border-white/18 bg-white/8 px-5 font-semibold transition hover:bg-white/14"
              href="tel:+66996567965"
            >
              <Phone aria-hidden="true" size={20} />
              Phone: 099-656-7965
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#0A1F44] px-4 py-10 text-center text-[#FBF8F0] sm:px-6 lg:px-8">
        <p className="script-display text-4xl font-medium">Jajah & Smart</p>
        <p className="mt-2 text-sm uppercase tracking-[0.22em] text-[#D6C8A5]">
          1 November 2026 · Pearl Wedding Avenue
        </p>
      </footer>

      <nav
        aria-label="Quick actions"
        className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 overflow-hidden rounded border border-[#0A1F44]/10 bg-[#FBF8F0]/95 text-[#0A1F44] shadow-[0_18px_50px_rgba(10,31,68,0.22)] backdrop-blur md:hidden"
      >
        {t.bottomNav.map((item) => {
          const Icon = item.icon;
          return (
            <a
              className="flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em]"
              href={item.href}
              key={item.href}
            >
              <Icon aria-hidden="true" size={17} />
              {item.label}
            </a>
          );
        })}
      </nav>
    </main>
  );
}
