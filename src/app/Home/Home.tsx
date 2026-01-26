"use client";
import Timer from "@/app/Home/component/Timer/Timer";
import { TimerProvider, useTimerContext } from "@/app/Home/provider/TimerContext";
import "./style.css";

function HomeView() {
  const { todoTitle } = useTimerContext();

  return (
    <main className="mainPageWrap">
      <h2 className="motivationalText">{todoTitle}</h2>
      <Timer />
    </main>
  );
}

export default function Home() {
  return (
    <TimerProvider>
      <HomeView />
    </TimerProvider>
  );
}
// 레이아웃을 만들어서 넣어도 될 꺼 같은데 너무 오버로직 같아서 여기다가 만듬
