"use client";

import { useState } from "react";

import type { SelectOption } from "../../lib/cms/types";

type SubmitState = "idle" | "submitting" | "success" | "error";
type Language = "en" | "th";
type RsvpResult = { message?: string; reference?: string };

const defaultRelationshipOptions: SelectOption[] = [
  {
    id: "groom-friend",
    value: "groom-friend",
    label: { en: "Groom's Friend", th: "เพื่อนเจ้าบ่าว" },
    sortOrder: 0,
    isVisible: true,
  },
  {
    id: "bride-friend",
    value: "bride-friend",
    label: { en: "Bride's Friend", th: "เพื่อนเจ้าสาว" },
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: "groom-relative",
    value: "groom-relative",
    label: { en: "Groom's Relative", th: "ญาติเจ้าบ่าว" },
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: "bride-relative",
    value: "bride-relative",
    label: { en: "Bride's Relative", th: "ญาติเจ้าสาว" },
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: "groom-side-guest",
    value: "groom-side-guest",
    label: { en: "Groom's Side Guest", th: "แขกฝ่ายเจ้าบ่าว" },
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: "bride-side-guest",
    value: "bride-side-guest",
    label: { en: "Bride's Side Guest", th: "แขกฝ่ายเจ้าสาว" },
    sortOrder: 5,
    isVisible: true,
  },
  {
    id: "other",
    value: "other",
    label: { en: "Other", th: "อื่น ๆ" },
    sortOrder: 6,
    isVisible: true,
  },
];

const attendanceOptions = [
  { en: "Attending", th: "เข้าร่วมงาน", value: "ยืนยันเข้าร่วมงาน" },
  { en: "Unable to attend", th: "ไม่สามารถเข้าร่วมได้", value: "ไม่สามารถเข้าร่วมงานได้" },
];

const guestCountOptions = [
  { en: "1 guest", th: "1 ท่าน", value: "1 คน" },
  { en: "2 guests", th: "2 ท่าน", value: "2 คน" },
  {
    en: "3 or more guests",
    th: "3 ท่านขึ้นไป",
    value: "3 คน หรือมากกว่า (โปรดระบุในส่วนข้อความเพิ่มเติม)",
  },
];

const formCopy = {
  en: {
    fullName: "Full Name",
    fullNamePlaceholder: "Your full name",
    nickname: "Nickname",
    nicknamePlaceholder: "Your nickname",
    email: "Email",
    emailPlaceholder: "you@example.com",
    phone: "Phone",
    phonePlaceholder: "099-xxx-xxxx",
    relationship: "Relationship",
    attendance: "Attendance",
    guestCount: "Guest Count",
    select: "Please select",
    message: "Message / Additional Notes",
    messagePlaceholder: "Leave a note for Jajah & Smart, or add details for 3+ guests",
    submit: "Submit RSVP",
    submitting: "Submitting...",
    success: "Thank you. Your RSVP has been received.",
    error: "Unable to submit RSVP.",
    incomplete: "Please complete all required RSVP fields.",
    modalEyebrow: "RSVP Received",
    modalTitle: "Thank you",
    modalText: "Your RSVP has been received. Add the wedding to your calendar so the date is saved on your device.",
    googleCalendar: "Add to Google Calendar",
    ics: "Download .ics",
    close: "Close",
    reference: "Reference",
  },
  th: {
    fullName: "ชื่อ-นามสกุล",
    fullNamePlaceholder: "กรอกชื่อและนามสกุล",
    nickname: "ชื่อเล่น",
    nicknamePlaceholder: "กรอกชื่อเล่น",
    email: "อีเมล",
    emailPlaceholder: "you@example.com",
    phone: "เบอร์โทรศัพท์",
    phonePlaceholder: "099-xxx-xxxx",
    relationship: "ความสัมพันธ์กับคู่บ่าวสาว",
    attendance: "การเข้าร่วมงาน",
    guestCount: "จำนวนผู้ร่วมงาน",
    select: "กรุณาเลือก",
    message: "ข้อความเพิ่มเติม",
    messagePlaceholder: "ฝากข้อความถึง Jajah & Smart หรือระบุรายละเอียดเพิ่มเติมสำหรับผู้ติดตาม 3 ท่านขึ้นไป",
    submit: "ส่งคำตอบ",
    submitting: "กำลังส่ง...",
    success: "ขอบคุณค่ะ/ครับ เราได้รับคำตอบ RSVP ของคุณแล้ว",
    error: "ไม่สามารถส่ง RSVP ได้",
    incomplete: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน",
    modalEyebrow: "ได้รับ RSVP แล้ว",
    modalTitle: "ขอบคุณ",
    modalText: "เราได้รับคำตอบของคุณแล้ว สามารถเพิ่มวันงานลงในปฏิทินเพื่อบันทึกวันสำคัญไว้ได้ทันที",
    googleCalendar: "เพิ่มลง Google Calendar",
    ics: "ดาวน์โหลด .ics",
    close: "ปิด",
    reference: "เลขอ้างอิง",
  },
};

const mapsUrl = "https://maps.app.goo.gl/XwnnwTVqNXy3SNzSA";
const calendarDetails = [
  "Thank you very much for your RSVP.",
  "",
  "We are delighted to share the calendar invitation for Jajah & Smart's wedding celebration.",
  "",
  "Date: Sunday, 1 November 2026",
  "Time: To be confirmed",
  "Venue: Pearl Wedding Venue",
  `Google Maps: ${mapsUrl}`,
  "",
  "We look forward to celebrating this special day with you and would be honored to have you join us.",
].join("\n");

const icsDescription = calendarDetails
  .replace(/\\/g, "\\\\")
  .replace(/\n/g, "\\n")
  .replace(/,/g, "\\,")
  .replace(/;/g, "\\;");

const googleCalendarUrl = new URL("https://calendar.google.com/calendar/render");
googleCalendarUrl.search = new URLSearchParams({
  action: "TEMPLATE",
  text: "Jajah & Smart Wedding",
  dates: "20261101/20261102",
  ctz: "Asia/Bangkok",
  details: calendarDetails,
  location: "Pearl Wedding Venue",
}).toString();

const appleCalendarHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Jajah and Smart Wedding//Calendar//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:jajah-smart-wedding-20261101@jajah-smart-wedding",
    "DTSTAMP:20260530T000000Z",
    "DTSTART;VALUE=DATE:20261101",
    "DTEND;VALUE=DATE:20261102",
    "SUMMARY:Jajah & Smart Wedding",
    "LOCATION:Pearl Wedding Venue",
    `DESCRIPTION:${icsDescription}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n"),
)}`;

function TextInput({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#0A1F44]">{label}</span>
      <input
        className="min-h-12 w-full rounded-xl border border-[#0A1F44]/15 bg-white/85 px-4 text-base text-[#0A1F44] outline-none transition focus:border-[#7C5C3B] focus:ring-2 focus:ring-[#D6C8A5]/35"
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

export function RsvpForm({
  language,
  relationshipOptions = defaultRelationshipOptions,
}: {
  language: Language;
  relationshipOptions?: SelectOption[];
}) {
  const c = formCopy[language];
  const visibleRelationshipOptions = relationshipOptions
    .filter((option) => option.isVisible)
    .toSorted((first, second) => first.sortOrder - second.sortOrder);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [reference, setReference] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: String(formData.get("full_name") ?? "").trim(),
      nickname: String(formData.get("nickname") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      relationship: String(formData.get("relationship") ?? "").trim(),
      attendance: String(formData.get("attendance") ?? "").trim(),
      guestCount: String(formData.get("guest_count") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as RsvpResult;

      if (!response.ok) {
        throw new Error(result.message ?? c.error);
      }

      setSubmitState("success");
      setMessage(c.success);
      setReference(result.reference ?? "");
      setShowCalendarModal(true);
      form.reset();
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : c.error);
    }
  }

  return (
    <form
      className="rounded-[1.5rem] border border-[#0A1F44]/10 bg-white/75 p-5 shadow-[0_22px_70px_rgba(10,31,68,0.09)] sm:p-7"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput label={c.fullName} name="full_name" placeholder={c.fullNamePlaceholder} required />
        <TextInput label={c.nickname} name="nickname" placeholder={c.nicknamePlaceholder} required />
        <TextInput label={c.email} name="email" placeholder={c.emailPlaceholder} required type="email" />
        <TextInput label={c.phone} name="phone" placeholder={c.phonePlaceholder} required type="tel" />
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#0A1F44]">{c.relationship}</span>
          <select
            className="min-h-12 w-full rounded-xl border border-[#0A1F44]/15 bg-white/85 px-4 text-base text-[#0A1F44] outline-none transition focus:border-[#7C5C3B] focus:ring-2 focus:ring-[#D6C8A5]/35"
            defaultValue=""
            name="relationship"
            required
          >
            <option disabled value="">
              {c.select}
            </option>
            {visibleRelationshipOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label[language] || option.label.en}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#0A1F44]">{c.attendance}</span>
          <select
            className="min-h-12 w-full rounded-xl border border-[#0A1F44]/15 bg-white/85 px-4 text-base text-[#0A1F44] outline-none transition focus:border-[#7C5C3B] focus:ring-2 focus:ring-[#D6C8A5]/35"
            defaultValue=""
            name="attendance"
            required
          >
            <option disabled value="">
              {c.select}
            </option>
            {attendanceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option[language]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#0A1F44]">{c.guestCount}</span>
          <select
            className="min-h-12 w-full rounded-xl border border-[#0A1F44]/15 bg-white/85 px-4 text-base text-[#0A1F44] outline-none transition focus:border-[#7C5C3B] focus:ring-2 focus:ring-[#D6C8A5]/35"
            defaultValue="1 คน"
            name="guest_count"
            required
          >
            {guestCountOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option[language]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-[#0A1F44]">
          {c.message}
        </span>
        <textarea
          className="min-h-32 w-full resize-y rounded-xl border border-[#0A1F44]/15 bg-white/85 px-4 py-3 text-base text-[#0A1F44] outline-none transition focus:border-[#7C5C3B] focus:ring-2 focus:ring-[#D6C8A5]/35"
          name="message"
          placeholder={c.messagePlaceholder}
        />
      </label>
      {message && submitState !== "success" ? (
        <div
          className="mt-5 rounded-xl border border-[#7C5C3B]/25 bg-[#7C5C3B]/10 p-4 text-sm leading-6 text-[#7C5C3B]"
          role="status"
        >
          <p>{message}</p>
        </div>
      ) : null}
      <button
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#0A1F44] px-6 text-sm font-bold uppercase tracking-[0.12em] text-[#FBF8F0] transition hover:bg-[#7C5C3B] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        disabled={submitState === "submitting"}
        type="submit"
      >
        {submitState === "submitting" ? c.submitting : c.submit}
      </button>
      {showCalendarModal ? (
        <div
          aria-labelledby="calendar-modal-title"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0A1F44]/65 px-4 py-8 backdrop-blur-sm"
          role="dialog"
        >
          <div className="w-full max-w-lg rounded-[1.5rem] border border-[#0A1F44]/10 bg-[#FBF8F0] p-6 text-[#0A1F44] shadow-[0_30px_90px_rgba(10,31,68,0.28)] sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#7C5C3B]">
              {c.modalEyebrow}
            </p>
            <h3
              className="script-display text-4xl font-medium leading-tight text-[#0A1F44]"
              id="calendar-modal-title"
            >
              {c.modalTitle}
            </h3>
            <p className="mt-4 text-base leading-7 text-[#0A1F44]/72">
              {c.modalText}
            </p>
            {reference ? (
              <p className="mt-4 rounded-xl border border-[#D6C8A5]/70 bg-[#D6C8A5]/20 px-4 py-3 text-sm font-semibold">
                {c.reference}: {reference}
              </p>
            ) : null}
            <div className="mt-7 flex flex-col gap-3">
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0A1F44] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#FBF8F0] transition hover:bg-[#7C5C3B]"
                href={googleCalendarUrl.toString()}
                rel="noreferrer"
                target="_blank"
              >
                {c.googleCalendar}
              </a>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#0A1F44]/20 px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#0A1F44] transition hover:border-[#7C5C3B] hover:text-[#7C5C3B]"
                download="jajah-smart-wedding.ics"
                href={appleCalendarHref}
              >
                {c.ics}
              </a>
              <button
                className="inline-flex min-h-11 items-center justify-center rounded px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#0A1F44]/62 transition hover:text-[#0A1F44]"
                onClick={() => setShowCalendarModal(false)}
                type="button"
              >
                {c.close}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
