// app/api/send-invite-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "~~/types/env";

export async function POST(req: NextRequest) {
  const { email, url } = await req.json();

  const msg = {
    to: email,
    from: "email_service@targecy.xyz", // Your verified SendGrid email
    subject: "You have received a secret Tornado Code",
    text: `Hello anon,

    You have been selected for an unique opportunity.
    
    Please click the following link to enter this secret code, and get free access to an exclusive feature:

    ${url}

    Best regards,
    Some Company`,
  };

  try {
    const resend = new Resend(env.RESEND_API_KEY);

    const res = await resend.emails.send({
      from: msg.from,
      to: msg.to,
      subject: msg.subject,
      text: msg.text,
    });
    if (res.error) {
      console.error(res.error);
      return NextResponse.json({ message: "Error sending email", error: res.error }, { status: 500 });
    }
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error sending email", error }, { status: 500 });
  }
}
