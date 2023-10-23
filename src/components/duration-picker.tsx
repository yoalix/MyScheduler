import { ALLOWED_DURATIONS } from "@/lib/config";
import { store } from "@/store";
import clsx from "clsx";
import React from "react";
import { useSnapshot } from "valtio";

const DurationPicker = () => {
  const snap = useSnapshot(store);
  return (
    <div>
      <label
        htmlFor="duration"
        className="block text-sm font-medium leading-0 text-slate-900 dark:text-slate-50"
      >
        Duration
      </label>
      <div className="isolate inline-flex rounded-md shadow-sm mt-1">
        {ALLOWED_DURATIONS.map((duration, i) => (
          <button
            key={duration}
            onClick={() => {
              store.state.duration = duration;
            }}
            type="button"
            className={clsx(
              "relative inline-flex items-center px-3 py-2 text-sm font-semibold ring-1 ring-inset  ring-offset-white focus:z-10 focus-visible:outline-none focus-visible:ring-2 dark:focus-visible:ring-slate-300 dark:ring-offset-slate-950 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ",
              {
                "rounded-l-md": i === 0,
                "rounded-r-md": i === ALLOWED_DURATIONS.length - 1,
                "-ml-px": i > 0,
                "text-slate-forground ring-slate-300 hover:bg-slate hover:text-slate-foreground hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50":
                  duration !== snap.state.duration,
                "bg-primary text-primary-foreground ring-slate-600 shadow-inner shadow-slate-900 bg-slate-900 text-slate-50 hover:bg-slate-900 hover:text-slate-50 focus:bg-slate-900 focus:text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50 dark:hover:text-slate-900 dark:focus:bg-slate-50 dark:focus:text-slate-900 dark:focus-visible:ring-slate-300  ":
                  duration === snap.state.duration,
              }
            )}
          >
            {duration}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DurationPicker;
