import { NextResponse } from "next/server";

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

export async function POST(request: Request) {
  const payload = (await request.json()) as RsvpPayload;

  const fullName = cleanValue(payload.fullName);
  const nickname = cleanValue(payload.nickname);
  const email = cleanValue(payload.email);
  const phone = cleanValue(payload.phone);
  const relationship = cleanValue(payload.relationship);
  const attendance = cleanValue(payload.attendance);
  const guestCount = cleanValue(payload.guestCount);
  const message = cleanValue(payload.message);

  if (!fullName || !nickname || !email || !phone || !relationship || !attendance || !guestCount) {
    return NextResponse.json(
      { message: "Please complete all required RSVP fields." },
      { status: 400 },
    );
  }

  const body = new URLSearchParams({
    [formEntries.fullName]: fullName,
    [formEntries.nickname]: nickname,
    [formEntries.phone]: phone,
    [formEntries.relationship]: relationship,
    [formEntries.attendance]: attendance,
    [formEntries.guestCount]: guestCount,
    [formEntries.email]: email,
    [formEntries.message]: message,
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

    return NextResponse.json({ message: "RSVP submitted." });
  } catch (error) {
    console.error("RSVP Google Form error:", error);
    return NextResponse.json(
      { message: "Unable to save RSVP right now. Please try again later." },
      { status: 500 },
    );
  }
}
