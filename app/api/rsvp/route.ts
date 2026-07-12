import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSeuHgJEnr93h-c4T2ptpNXsn8xe9aAW_E7MoSDoNBAmCTqYiw/formResponse";

const formEntries = {
  fullName: "entry.1310555669",
  nickname: "entry.1519022746",
  phone: "entry.1818463357",
  relationship: "entry.348302562",
  attendance: "entry.1990098618",
  guestCount: "entry.1264155504",
  email: "entry.1720531444",
  message: "entry.1411226672",
  reference: "entry.1958890883",
};

const googleFormRelationshipValues: Record<string, string> = {
  "groom-friend": "เพื่อนเจ้าบ่าว",
  "bride-friend": "เพื่อนเจ้าสาว",
  "groom-relative": "ญาติเจ้าบ่าว",
  "bride-relative": "ญาติเจ้าสาว",
  "groom-side-guest": "เพื่อนร่วมงาน",
  "bride-side-guest": "เพื่อนร่วมงาน",
  other: "อื่นๆ",
};

type RsvpPayload = {
  fullName?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  relationship?: string;
  attendance?: string;
  guestCount?: string;
  message?: string;
};

function cleanValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function sendNotifications(reference: string, details: Record<string, string>) {
  const message = [
    `New RSVP ${reference}`,
    `Name: ${details.fullName} (${details.nickname})`,
    `Email: ${details.email}`,
    `Phone: ${details.phone}`,
    `Relationship: ${details.relationship}`,
    `Attendance: ${details.attendance}`,
    `Guests: ${details.guestCount}`,
    details.message ? `Message: ${details.message}` : "",
  ].filter(Boolean).join("\n");

  const jobs: Promise<Response>[] = [];
  if (process.env.RESEND_API_KEY && process.env.RSVP_NOTIFICATION_EMAIL) {
    jobs.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RSVP_NOTIFICATION_FROM ?? "Wedding RSVP <onboarding@resend.dev>",
          to: [process.env.RSVP_NOTIFICATION_EMAIL],
          subject: `New RSVP: ${details.fullName} (${reference})`,
          text: message,
        }),
      }),
    );
  }
  if (process.env.LINE_CHANNEL_ACCESS_TOKEN && process.env.LINE_NOTIFICATION_USER_ID) {
    jobs.push(
      fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: process.env.LINE_NOTIFICATION_USER_ID,
          messages: [{ type: "text", text: message }],
        }),
      }),
    );
  }
  const results = await Promise.allSettled(jobs);
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("RSVP notification error:", result.reason);
      return;
    }
    if (!result.value.ok) {
      console.error("RSVP notification error: provider responded", result.value.status);
    }
  });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as RsvpPayload;

  const fullName = cleanValue(payload.fullName);
  const nickname = cleanValue(payload.nickname);
  const email = cleanValue(payload.email);
  const phone = cleanValue(payload.phone);
  const relationship = cleanValue(payload.relationship);
  const googleRelationship = googleFormRelationshipValues[relationship] ?? relationship;
  const attendance = cleanValue(payload.attendance);
  const guestCount = cleanValue(payload.guestCount);
  const message = cleanValue(payload.message);
  const reference = `JS-${randomUUID().slice(0, 8).toUpperCase()}`;

  if (!fullName || !nickname || !email || !phone || !relationship || !attendance || !guestCount) {
    return NextResponse.json(
      { message: "Please complete all required RSVP fields." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  if (phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json({ message: "Please enter a valid phone number." }, { status: 400 });
  }

  const storedMessage = [`Ref No.: ${reference}`, message].filter(Boolean).join("\n\n");

  const body = new URLSearchParams({
    [formEntries.fullName]: fullName,
    [formEntries.nickname]: nickname,
    [formEntries.phone]: phone,
    [formEntries.relationship]: googleRelationship,
    [formEntries.attendance]: attendance,
    [formEntries.guestCount]: guestCount,
    [formEntries.email]: email,
    [formEntries.message]: storedMessage,
    [formEntries.reference]: reference,
  });

  try {
    const response = await fetch(GOOGLE_FORM_ACTION, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body,
      cache: "no-store",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Google Form responded with ${response.status}.`);
    }

    await sendNotifications(reference, {
      fullName,
      nickname,
      email,
      phone,
      relationship,
      attendance,
      guestCount,
      message: storedMessage,
    });

    return NextResponse.json({ message: "RSVP submitted.", reference });
  } catch (error) {
    console.error("RSVP Google Form error:", error);
    return NextResponse.json(
      { message: "Unable to save RSVP right now. Please try again later." },
      { status: 500 },
    );
  }
}
