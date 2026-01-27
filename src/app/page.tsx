import { Metadata } from "next";
import TimerPage from "./timer/page";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "DevTime",
    description: "DevTime",
    openGraph: {
      title: "DevTime",
      description: "DevTime",
    },
  };
}

export default function Main() {
  return <TimerPage />;
}
