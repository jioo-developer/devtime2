"use client";

import { TimerProvider } from "@/app/timer/provider/TimerContext";

export default function TimerLayout({ children }: { children: React.ReactNode }) {
  return <TimerProvider>{children}</TimerProvider>;
}
