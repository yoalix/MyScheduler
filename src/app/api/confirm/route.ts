import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import createCalendarAppointment from "@/lib/availability/createAppointment";
import getHash from "@/lib/hash";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

const AppointmentPropsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  start: z.string(),
  end: z.string(),
  timeZone: z.string(),
  location: z.enum(["meet", "phone"]),
  duration: z
    .string()
    .refine((value) => !Number.isNaN(Number.parseInt(value)), {
      message: "Duration must be a valid integer.",
    }),
});

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log("req.query", req.url);
  const url = new URL(req.url!);
  const data = url.searchParams.get("data");
  const key = url.searchParams.get("key");
  if (!data) {
    res.status(400).json({ error: "Data is missing" });
    return;
  }
  // Make sure the hash matches before doing anything
  const hash = getHash(decodeURIComponent(data as string));

  if (hash !== key) {
    res.status(403).json({ error: "Invalid key" });
    return;
  }

  const object = JSON.parse(decodeURIComponent(data as string));

  // ...and validate it using Zod's safeParse method
  const validationResult = AppointmentPropsSchema.safeParse(object);

  if (!validationResult.success) {
    res.status(400).json({ error: "Malformed request" });
    return;
  }

  const validObject = validationResult.data;

  // Check if start and end dates are valid
  if (
    Number.isNaN(Date.parse(validObject.start)) ||
    Number.isNaN(Date.parse(validObject.end))
  ) {
    res.status(400).json({ error: "Malformed request" });
    return;
  }

  // Create the confirmed appointment
  const response = await createCalendarAppointment({
    ...validObject,
    requestId: hash,
    summary: `${validObject.duration} minute meeting with ${
      process.env.NEXT_PUBLIC_OWNER_NAME ?? "me"
    }`,
  });

  const details = await response.json();
  console.log("details", details);

  const htmlLink = details.htmlLink;
  const regex = /eid=([^&]+)/;
  const match = htmlLink.match(regex);

  // If we have a link to the event, take us there.
  if (match && match[1]) {
    // res.writeHead(302, {
    //   Location: process.env.ORIGIN,
    //   //add other headers here...
    // });
    return NextResponse.redirect(
      `${process.env.ORIGIN}/booked?url=${encodeURIComponent(match[1])}`
    );
  }

  // Otherwise, something's wrong.
  res.status(500).json({ error: "Error trying to create an appointment" });
}
