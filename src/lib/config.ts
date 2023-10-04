import Day from "./day";
import { AvailabilitySlotsMap, DateTimeInterval } from "./types";

export const ALLOWED_DURATIONS = [15, 30, 60];
export const DEFAULT_DURATION = 30;
export const CALENDARS_TO_CHECK = ["primary"];
export const SLOT_PADDING = 0;
export const OWNER_TIMEZONE = "America/Los_Angeles";
export const LEAD_TIME = 0;

const DEFAULT_WORKDAY = [
  {
    start: {
      hour: 9,
    },
    end: {
      hour: 17,
    },
  },
];

export const OWNER_AVAILABILITY: AvailabilitySlotsMap = {
  1: DEFAULT_WORKDAY,
  2: DEFAULT_WORKDAY,
  3: DEFAULT_WORKDAY,
  4: DEFAULT_WORKDAY,
  5: DEFAULT_WORKDAY,
};

export const LOCAL_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
};

export const LOCAL_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
};

export type StateType = {
  /** The earliest day we’ll offer appointments */
  start: Day;
  /** The latest day we’ll offer appointments */
  end: Day;
  /** The day the user selected (if made) */
  selectedDate: Day;
  /** The end user's timezone string */
  timeZone: string;
  /** The number of minutes being requested,
   * must be one of the values in {@link ALLOWED_DURATIONS}
   */
  duration: number;
  /** The time slot the user selected (if made). */
  selectedTime?: DateTimeInterval;
  name?: string;
  email?: string;
  location?: string;
};

export const DEFAULT_STATE: StateType = {
  timeZone:
    Intl.DateTimeFormat("en-US", { timeZone: OWNER_TIMEZONE }).resolvedOptions()
      .timeZone ?? "UTC",
  start: Day.todayWithOffset(0),
  end: Day.todayWithOffset(14),
  selectedDate: Day.todayWithOffset(0),
  duration: DEFAULT_DURATION,
  modal: "closed",
  name: undefined,
  email: undefined,
  location: undefined,
};
