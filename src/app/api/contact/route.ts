import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

import { site } from "@config/site";

// nodemailer opens a TCP connection to the mail server, which the Edge
// runtime cannot do — this route must run on Node.
export const runtime = "nodejs";

const leadSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional(),
  lotId: z.string().max(50).optional(),
  message: z.string().min(5).max(5000),
  locale: z.string().max(5).optional(),
});

type Lead = z.infer<typeof leadSchema>;

/*
 * Delivery goes through the project's own IONOS mailbox over SMTP, so no
 * third-party mail service is involved and the mail is sent from the same
 * domain that receives it (the domain's SPF already authorises IONOS, so
 * it will not be treated as spoofed).
 *
 * Credentials come from the environment and are never committed — see
 * .env.example for what to set, and set the same in Vercel.
 */
const SMTP_HOST = process.env.SMTP_HOST ?? "smtp.ionos.mx";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

function plainBody(lead: Lead): string {
  return [
    `Nombre:   ${lead.name}`,
    `Correo:   ${lead.email}`,
    `Teléfono: ${lead.phone?.trim() || "—"}`,
    `Lote:     ${lead.lotId || "sin lote específico"}`,
    `Idioma:   ${lead.locale ?? "—"}`,
    "",
    "Mensaje:",
    lead.message,
    "",
    "—",
    "Enviado desde el formulario de lomasdelpacifico.mx",
  ].join("\n");
}

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

  // No credentials configured: fail loudly rather than telling the
  // visitor their message was sent and then dropping it. The form's error
  // copy sends them to WhatsApp, which is the preferred channel anyway.
  if (!SMTP_USER || !SMTP_PASSWORD) {
    console.error(
      "[contact] SMTP_USER/SMTP_PASSWORD are not set — lead NOT delivered:",
      JSON.stringify(lead)
    );
    return NextResponse.json({ error: "email_not_configured" }, { status: 503 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // 465 = implicit TLS, 587 = STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });

    await transporter.sendMail({
      // Must be the authenticated mailbox: IONOS rejects sending "as"
      // an address the account does not own.
      from: `"Lomas del Pacífico" <${SMTP_USER}>`,
      to: site.contact.email,
      // So hitting Reply answers the visitor, not ourselves.
      replyTo: `"${lead.name}" <${lead.email}>`,
      subject: lead.lotId
        ? `Consulta del sitio — lote ${lead.lotId}`
        : "Consulta del sitio web",
      text: plainBody(lead),
    });
  } catch (err) {
    console.error("[contact] SMTP delivery failed:", err, JSON.stringify(lead));
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
