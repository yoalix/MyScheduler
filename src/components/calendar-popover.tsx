import React from "react";
import { Calendar } from "./ui/calendar";
import { state } from "@/store";
import Day from "@/lib/day";
import { useSnapshot } from "valtio";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateTimeInterval } from "@/lib/types";

const CalendarPopover = ({
  availability,
}: {
  availability: Record<string, DateTimeInterval[]>;
}) => {
  const snap = useSnapshot(state);
  const [open, setOpen] = React.useState(false);

  let footer = <p>Please pick a day.</p>;
  if (snap.state.selectedDate) {
    footer = <p>You picked {snap.state.selectedDate.toString()}.</p>;
  }
  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "md:w-[15rem] w-full pl-3 text-left font-normal",
              !snap.state.selectedDate && "text-muted-foreground"
            )}
          >
            {snap.state.selectedDate ? (
              format(snap.state.selectedDate.toDate(), "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 dark:opacity-100" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            selected={snap.state.selectedDate.toDate()}
            onSelect={(date) => {
              state.selectedDate = date
                ? Day.dayFromDate(date)
                : Day.todayWithOffset();
              state.selectedTime = undefined;
              setOpen(false);
            }}
            footer={footer}
            mode="single"
            disabled={[
              { dayOfWeek: [0, 6] },
              {
                before: snap.state.start.toDate(),
              },
              // unavailable after foutreen days
              {
                after: snap.state.end.toDate(),
              },
              (date) => {
                const dateKey = date.toISOString().split("T")[0];
                return (
                  availability[dateKey] !== undefined &&
                  availability[dateKey].length === 0
                );
              },
            ]}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CalendarPopover;
