"use client";
import React, { useState } from "react";
// @ts-expect-error
import { experimental_useFormState as useFormState } from "react-dom";

import AvailableTimes from "./available-times";
import { DateTimeInterval } from "@/lib/types";
import { store } from "@/store";
import { format } from "date-fns-tz";
import { useSnapshot } from "valtio";
import DurationPicker from "./duration-picker";
import TimezonePicker from "./timezone-picker";
import getPotentialTimes from "@/lib/availability/getPotentialTimes";
import getAvailability from "@/lib/availability/getAvailability";
import { OWNER_AVAILABILITY } from "@/lib/config";
import CalendarPopover from "./calendar-popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Booking from "./booking";
import { Button } from "./ui/button";
import { submit } from "@/app/actions";
import { useToast } from "./ui/use-toast";
import SubmitButton from "./submit-button";

const initialState = {
  message: null,
};

const Scheduler = ({ busy }: { busy: DateTimeInterval[] }) => {
  const snap = useSnapshot(store);
  const [res, formAction] = useFormState(submit, initialState);

  const { toast } = useToast();

  let maximumAvailability = 0;
  const potential = getPotentialTimes({
    start: snap.state.start,
    end: snap.state.end,
    duration: snap.state.duration,
    availabilitySlots: OWNER_AVAILABILITY,
  });
  const availability = getAvailability({
    busy: busy.map(({ start, end }) => ({
      start: new Date(start),
      end: new Date(end),
    })),
    potential,
  });

  const availabilityByDate = availability.reduce<
    Record<string, DateTimeInterval[]>
  >((acc, slot) => {
    // Gives us the same YYYY-MM-DD format as Day.toString()
    const date = format(slot.start, "yyyy-MM-dd", {
      timeZone: snap.state.timeZone,
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);

    if (acc[date].length > maximumAvailability) {
      maximumAvailability = acc[date].length;
    }
    return acc;
  }, {});

  const availableTimes = snap.state.selectedDate
    ? availabilityByDate[snap.state.selectedDate.toString()] ?? []
    : [];

  const reset = () => {
    store.resetStore();
  };
  if (res?.message) {
    // toast({
    //   title: "Error creating event",
    //   description: res.message,
    //   variant: "destructive",
    // });
    console.log(res.message);
  }
  const handleAction = () => {
    const formData = new FormData();
    const startString = store.state.selectedTime
      ? new Date(store.state.selectedTime.start).toISOString()
      : "";
    const endString = store.state.selectedTime
      ? new Date(store.state.selectedTime.end).toISOString()
      : "";
    formData.append("name", store.state.name || "");
    formData.append("email", store.state.email || "");
    formData.append("start", startString);
    formData.append("end", endString);
    formData.append("timeZone", store.state.timeZone);
    formData.append("location", store.state.location || "");
    formData.append("duration", store.state.duration.toString() || "");

    formAction(formData);
  };

  return (
    <form action={handleAction}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-3xl">
            Pick a time for your meeting
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <DurationPicker />
          <TimezonePicker />
          <CalendarPopover availability={availabilityByDate} />
          <AvailableTimes availability={availableTimes} />
          <Booking />
        </CardContent>
        <CardFooter className="flex justify-end gap-5">
          <Button variant={"secondary"} onClick={reset}>
            Reset
          </Button>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
};

export default Scheduler;
