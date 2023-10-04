"use server";

import { LRUCache } from "lru-cache";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { formatLocalDate, formatLocalTime } from "@/lib/availability/helpers";
import sendMail from "@/lib/email";
import ApprovalEmail from "@/lib/email/messages/approval";
import ConfirmationEmail from "@/lib/email/messages/confirmation";
import getHash from "@/lib/hash";
import type { DateTimeIntervalWithTimezone } from "@/lib/types";
import { OWNER_TIMEZONE } from "@/lib/config";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

// Define the rate limiter
const rateLimitLRU = new LRUCache({
  max: 500,
  ttl: 60_000, // 60_000 milliseconds = 1 minute
});
const REQUESTS_PER_IP_PER_MINUTE_LIMIT = 5;

// Define the schema for the request body
const AppointmentRequestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  start: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Start must be a valid date.",
  }),
  end: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "End must be a valid date.",
  }),
  timeZone: z.string(),
  location: z.enum(["meet", "phone"]),
  duration: z
    .string()
    .refine((value) => !Number.isNaN(Number.parseInt(value)), {
      message: "Duration must be a valid integer.",
    }),
});

export async function submit(prevState: any, formData: FormData) {
  console.log("formData", formData);
  // Validate and parse the request body using Zod
  try {
    const validationResult = AppointmentRequestSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      start: formData.get("start"),
      end: formData.get("end"),
      timeZone: formData.get("timeZone"),
      location: formData.get("location"),
      duration: formData.get("duration"),
    });
    console.log("validationResult", validationResult);

    if (!validationResult.success) {
      throw validationResult.error.message;
    }
    const { data } = validationResult;

    const start = new Date(data.start);
    const end = new Date(data.end);

    const approveUrl = `${
      process.env.ORIGIN ?? "?"
    }/api/confirm/?data=${encodeURIComponent(
      JSON.stringify(data)
    )}&key=${getHash(JSON.stringify(data))}`;

    // Generate and send the approval email
    const approveEmail = ApprovalEmail({
      ...data,
      approveUrl,
      dateSummary: intervalToHumanString({
        start,
        end,
        timeZone: OWNER_TIMEZONE,
      }),
    });
    await sendMail({
      to: process.env.OWNER_EMAIL ?? "",
      subject: approveEmail.subject,
      body: approveEmail.body,
    });

    // Generate and send the confirmation email
    const confirmationEmail = ConfirmationEmail({
      dateSummary: intervalToHumanString({
        start,
        end,
        timeZone: data.timeZone,
      }),
    });
    await sendMail({
      to: data.email,
      subject: confirmationEmail.subject,
      body: confirmationEmail.body,
    });
    console.log("redirecting");
  } catch (error) {
    console.error(error);
    return { message: JSON.stringify(error) };
  }

  return redirect(`/confirmation`);
}

/**
 * Converts a date-time interval to a human-readable string.
 *
 * This function takes a date-time interval with start and end times,
 * and a time zone.
 *
 * It returns a formatted string representing the interval, including
 * the start and end times, and the time zone.
 *
 * @function
 * @param {Object} DateTimeIntervalWithTimezone An object containing the
 * start, end, and time zone of the interval.
 *
 * @param {string} interval.start The start time of the interval
 * as a string or Date object.
 *
 * @param {string} interval.end The end time of the interval as
 * a string or Date object.
 *
 * @param {string} interval.timeZone The time zone used to format
 * the date and time.
 *
 * @returns {string} A human-readable string representation
 * of the date-time interval.
 */
function intervalToHumanString({
  start,
  end,
  timeZone,
}: DateTimeIntervalWithTimezone): string {
  return `${formatLocalDate(start, {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    weekday: "long",
    timeZone,
  })} – ${formatLocalTime(end, {
    hour: "numeric",
    minute: "numeric",
    timeZone,
  })}`;
}
