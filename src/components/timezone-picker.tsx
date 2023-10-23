import getTimezoneData from "@/lib/timezones";
import { store } from "@/store";
import React from "react";
import { useSnapshot } from "valtio";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { cn } from "@/lib/utils";

const { groupLookupMap, timeZoneMap } = getTimezoneData();

const TimezonePicker = () => {
  const snap = useSnapshot(store);
  const selectedTimeZoneValue = groupLookupMap.get(snap.state.timeZone);
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="md:w-[15rem] w-full justify-between"
          >
            <p className="truncate">
              {selectedTimeZoneValue
                ? "GMT" + selectedTimeZoneValue
                : "Select Time Zone..."}
            </p>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 dark:opacity-100" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[15rem] p-0">
          <Command>
            <CommandInput placeholder="Search Time one..." />
            <CommandEmpty>No Time Zone found.</CommandEmpty>
            <CommandGroup className=" h-[20rem] overflow-y-auto">
              {Array.from(timeZoneMap).map(([display, { value }]) => (
                <CommandItem
                  key={value}
                  onSelect={(currentValue) => {
                    store.state.timeZone = value;
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === snap.state.timeZone
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {`GMT${display}`}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default TimezonePicker;
