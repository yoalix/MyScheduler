import { DateTimeInterval } from "@/lib/types";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import {
  compareDateIntervals,
  formatLocalTime,
} from "@/lib/availability/helpers";
import { useSnapshot } from "valtio";
import { store } from "@/store";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type AvailableTimesProps = {
  availability: DateTimeInterval[];
};

const AvailableTimes = ({ availability }: AvailableTimesProps) => {
  const snap = useSnapshot(store);
  const timeZone = snap.state.timeZone;
  return (
    <>
      <Select
        onValueChange={(time) => (store.state.selectedTime = JSON.parse(time))}
      >
        <SelectTrigger className="md:w-[15rem] w-full">
          <SelectValue placeholder={"Select a time"} />
        </SelectTrigger>
        <SelectContent className="w-[15rem] h-[20rem]">
          <SelectGroup className="w-[15rem] h-[20rem]">
            {availability &&
              availability.map((time) => {
                const value = `${formatLocalTime(time.start, {
                  timeZone,
                })} – ${formatLocalTime(time.end, { timeZone })}`;
                return (
                  <SelectItem
                    key={time.start.toISOString() + time.end.toISOString()}
                    value={JSON.stringify(time)}
                    onClick={() => (store.state.selectedTime = time)}
                  >
                    {value}
                  </SelectItem>
                );
              })}
            {availability == undefined ||
              (availability.length === 0 && (
                <SelectLabel>
                  No availability for selected date 😞 <br /> Please select
                  another date
                </SelectLabel>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export default AvailableTimes;
