"use client";
import Timer from "@/app/Home/component/Timer/Timer";
import { TimerProvider } from "@/app/Home/provider/TimerContext";
import "./style.css";

export default function Home() {
  return (
    <main className="mainPageWrap">
      <TimerProvider>
        <Timer />
      </TimerProvider>
    </main>
  );
}
