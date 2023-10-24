import { compareAsc } from "date-fns";
import { CALENDARS_TO_CHECK, OWNER_TIMEZONE } from "../config";
import { DateTimeInterval } from "../types";
import getAccessToken from "./getAccessToken";
import { redirect } from "next/navigation";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

export default async function getBusyTimes({ start, end }: DateTimeInterval) {
  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/freeBusy",
    {
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken().catch((err) => {
          console.log(err);
          redirect("/admin/login");
        })}`,
      },
      body: JSON.stringify({
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        timeZone: OWNER_TIMEZONE,
        items: CALENDARS_TO_CHECK.map((id) => ({ id })),
      }),
    }
  );
  const busyData = (await response.json()) as Record<string, unknown>;
  console.log("busyData", busyData);
  return Object.values(busyData.calendars ?? {})
    .flatMap((calendar) => calendar.busy ?? [])
    .sort(compareAsc)
    .map((busy) => ({
      start: new Date(busy.start ?? ""),
      end: new Date(busy.end ?? ""),
    }));
}
