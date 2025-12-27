// Lightweight, resilient notification helper for inspection bookings
// - Lazy-loads optional dependencies (nodemailer, twilio)
// - Returns a structured result and never throws (best-effort)

// Lazy require nodemailer so the server can run without it installed during dev
let nodemailer: unknown = null;
try {
  // @ts-expect-error: optional runtime dependency, types may not be installed in all environments
  nodemailer = (await import("nodemailer")) as unknown;
} catch (e) {
  nodemailer = null;
}

// Lazy load Twilio if configured
let Twilio: unknown = null;
try {
  // @ts-expect-error: optional runtime dependency, types may not be installed in all environments
  Twilio = (await import("twilio")) as unknown;
} catch (e) {
  Twilio = null;
}

export type NotifyResult = {
  email: {
    ok: boolean;
    info?: Record<string, unknown>;
    error?: string;
    reason?: string;
  };
  sms: {
    ok: boolean;
    info?: Record<string, unknown>;
    error?: string;
    reason?: string;
  };
};

export type Booking = {
  id?: string;
  car_id?: string;
  name?: string;
  phone?: string;
  email?: string;
  preferred_time?: string;
  scheduled_time?: string;
  slot_id?: string;
  message?: string;
  created_at?: string;
};

export type Car = {
  make?: string;
  model?: string;
  dealer_phone?: string;
};

async function initializeDependencies() {
  if (!nodemailer) {
    try {
      // @ts-expect-error: optional runtime dependency, types may not be installed in all environments
      nodemailer = (await import("nodemailer")) as unknown;
    } catch (e) {
      nodemailer = null;
    }
  }
  if (!Twilio) {
    try {
      // @ts-expect-error: optional runtime dependency, types may not be installed in all environments
      Twilio = (await import("twilio")) as unknown;
    } catch (e) {
      Twilio = null;
    }
  }
}

export async function sendInspectionNotifications(opts: {
  booking: Booking;
  car?: Car;
}): Promise<NotifyResult> {
  await initializeDependencies();
  const { booking, car } = opts || {};
  const results: NotifyResult = {
    email: { ok: false, reason: "not attempted" },
    sms: { ok: false, reason: "not attempted" },
  };

  // EMAIL (admin notification + optional user confirmation)
  const adminEmail = process.env.ADMIN_EMAIL;
  const smtpHost = process.env.SMTP_HOST;

  if (!nodemailer) {
    results.email = { ok: false, reason: "nodemailer not installed" };
  } else if (!smtpHost || !adminEmail) {
    results.email = {
      ok: false,
      reason: "smtp not configured or ADMIN_EMAIL missing",
    };
  } else {
    try {
      const transporter = (
        nodemailer as unknown as {
          createTransport: (
            config: Record<string, unknown>
          ) => Record<string, unknown>;
        }
      ).createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      });

      const subject = `New inspection booking ${booking?.id || "(new)"} for ${
        car?.make || ""
      } ${car?.model || ""}`;
      const body = `A new inspection booking was created:\n\nBooking ID: ${
        booking?.id
      }\nCar ID: ${booking?.car_id}\nName: ${booking?.name}\nPhone: ${
        booking?.phone
      }\nPreferred time: ${
        booking?.preferred_time || booking?.scheduled_time || "n/a"
      }\nSlot: ${booking?.slot_id || "n/a"}\nMessage: ${
        booking?.message
      }\nCreated at: ${booking?.created_at}\n`;

      const mailRes = await (
        transporter as Record<
          string,
          (args: Record<string, unknown>) => Promise<Record<string, unknown>>
        >
      ).sendMail({
        from:
          process.env.EMAIL_FROM ||
          `no-reply@${(smtpHost || "example.com").split(":")[0]}`,
        to: adminEmail,
        subject,
        text: body,
      });

      results.email = { ok: true, info: mailRes };

      // Send user confirmation if an email was provided
      if (booking?.email) {
        try {
          await (
            transporter as Record<
              string,
              (args: Record<string, unknown>) => Promise<Record<string, unknown>>
            >
          ).sendMail({
            from:
              process.env.EMAIL_FROM ||
              `no-reply@${(smtpHost || "example.com").split(":")[0]}`,
            to: booking.email,
            subject: `Your inspection booking (${booking?.id || ""})`,
            text: `Thanks ${
              booking?.name || ""
            }, we received your booking for ${car?.make || ""} ${
              car?.model || ""
            } scheduled: ${
              booking?.preferred_time || booking?.scheduled_time || "n/a"
            }. We will contact you shortly.`,
          });
        } catch (err) {
          console.warn("Failed to send user confirmation email:", err);
          // Do not overwrite the admin email success, just note the error
          results.email = { ok: true, info: mailRes, error: String(err) };
        }
      }
    } catch (err) {
      console.error("email notify error", err);
      results.email = { ok: false, error: String(err) };
    }
  }

  // SMS (Twilio) - notify dealer phone if configured
  const twSid = process.env.TWILIO_ACCOUNT_SID;
  const twToken = process.env.TWILIO_AUTH_TOKEN;
  const twFrom = process.env.TWILIO_FROM;

  if (!Twilio) {
    results.sms = { ok: false, reason: "twilio not installed" };
  } else if (!twSid || !twToken || !twFrom || !car?.dealer_phone) {
    results.sms = {
      ok: false,
      reason: "twilio not configured or dealer phone missing",
    };
  } else {
    try {
      const client = (
        Twilio as unknown as (
          sid: string,
          token: string
        ) => Record<string, unknown>
      )(twSid, twToken);
      const body = `New inspection booking for car ${car?.make || ""} ${
        car?.model || ""
      }. Name: ${booking?.name || ""}. Phone: ${booking?.phone || ""}. Time: ${
        booking?.preferred_time || "n/a"
      }`;
      const msg = await (
        (client as Record<string, unknown>).messages as Record<
          string,
          (args: Record<string, unknown>) => Promise<Record<string, unknown>>
        >
      ).create({
        body,
        from: twFrom,
        to: car.dealer_phone,
      });
      results.sms = { ok: true, info: msg };
    } catch (err) {
      console.error("twilio notify error", err);
      results.sms = { ok: false, error: String(err) };
    }
  }

  return results;
}
