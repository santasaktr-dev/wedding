import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

function isValidSignature(body: string, signature: string | null) {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("base64");
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);
  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-line-signature");

  if (!isValidSignature(body, signature)) {
    return NextResponse.json({ message: "Invalid LINE signature." }, { status: 401 });
  }

  const payload = JSON.parse(body) as {
    events?: Array<{ source?: { userId?: string; groupId?: string; roomId?: string } }>;
  };

  payload.events?.forEach((event) => {
    const source = event.source;
    if (source?.userId) console.info("LINE_NOTIFICATION_USER_ID:", source.userId);
    if (source?.groupId) console.info("LINE_NOTIFICATION_GROUP_ID:", source.groupId);
    if (source?.roomId) console.info("LINE_NOTIFICATION_ROOM_ID:", source.roomId);
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ message: "LINE webhook is ready." });
}
