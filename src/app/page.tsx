import ReactQueryProvider from "@/components/react-query-provider";
import Scheduler from "@/components/scheduler";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import getAvailability from "@/lib/availability/getAvailability";
import getBusyTimes from "@/lib/availability/getBusyTimes";
import getPotentialTimes from "@/lib/availability/getPotentialTimes";
import { DEFAULT_STATE, OWNER_AVAILABILITY } from "@/lib/config";

export default async function Home() {
  const snap = DEFAULT_STATE;
  const busy = await getBusyTimes({
    start: snap.start.toInterval(snap.timeZone).start,
    end: snap.end.toInterval(snap.timeZone).end,
  });

  return (
    <ReactQueryProvider>
      <main className="flex min-h-screen flex-col items-center justify-start p-24">
        <div className="self-end">{/* <ThemeToggle /> */}</div>
        <Scheduler busy={busy} />
      </main>
      <Toaster />
    </ReactQueryProvider>
  );
}
