import { NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional(),
  lotId: z.string().max(50).optional(),
  message: z.string().min(5).max(5000),
  locale: z.string().max(5).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }

  const lead = parsed.data;

  // ──────────────────────────────────────────────────────────────────
  // TODO — WIRE UP LEAD DELIVERY
  //
  // For now the lead is only logged to the server console. To receive
  // leads by email, plug in a provider here. Example with Resend
  // (https://resend.com — free tier, ~3 lines):
  //
  //   import { Resend } from "resend";
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: "leads@lomasdelpacifico.com",
  //     to: "owner@example.com",
  //     subject: `New lot inquiry${lead.lotId ? ` — ${lead.lotId}` : ""}`,
  //     text: JSON.stringify(lead, null, 2),
  //   });
  //
  // Add RESEND_API_KEY to .env.local (see .env.example).
  // ──────────────────────────────────────────────────────────────────
  console.log("[contact] New lead:", JSON.stringify(lead, null, 2));

  return NextResponse.json({ ok: true });
}
