"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

export default function Booked() {
  const param = useSearchParams();
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-3xl">
            The appointment has been confirmed.
          </CardTitle>
        </CardHeader>
        <CardDescription className=""></CardDescription>
        <CardContent>
          It’s now on your calendar and an invite has been sent to them.{" "}
          <a
            href={
              "https://www.google.com/calendar/u/1/r/event?eid=" +
              param.get("url")
            }
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 underline dark:text-blue-400 "
          >
            View it on Google Calendar
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
