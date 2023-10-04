import { AvailabilitySlotsMap, DateTimeInterval } from "../types";
import { addMinutes, eachDayOfInterval, set } from "date-fns";
import mergeOverlappingIntervals from "./mergeOverlappingIntervals";
import Day from "../day";
import { OWNER_TIMEZONE } from "../config";

export default function getPotentialTimes({
  start,
  end,
  duration,
  availabilitySlots,
}: {
  start: Day;
  end: Day;
  duration: number;
  availabilitySlots: AvailabilitySlotsMap;
}): DateTimeInterval[] {
  const potentialTimes: DateTimeInterval[] = [];
  if (start >= end || duration <= 0) {
    return potentialTimes;
  }
  // Sort the slots by start time
  const days = eachDayOfInterval({
    start: start.toInterval(OWNER_TIMEZONE).start,
    end: end.toInterval(OWNER_TIMEZONE).end,
  });
  days.forEach((day) => {
    const dayOfWeek = day.getDay();

    const slotsForDay = availabilitySlots[dayOfWeek] ?? [];

    for (const slot of slotsForDay) {
      const slotStart = set(day, {
        hours: slot.start.hour,
        minutes: slot.start.minute,
      });

      const slotEnd = set(day, {
        hours: slot.end.hour,
        minutes: slot.end.minute,
      });

      let currentIntervalStart = slotStart;

      while (
        currentIntervalStart < slotEnd &&
        addMinutes(currentIntervalStart, duration) <= slotEnd
      ) {
        const currentIntervalEnd = addMinutes(currentIntervalStart, duration);

        potentialTimes.push({
          start: currentIntervalStart,
          end: currentIntervalEnd,
        });

        currentIntervalStart = currentIntervalEnd;
      }
    }
  });

  return mergeOverlappingIntervals(potentialTimes);
}
