import { Metadata } from "next";
import HomePage from "./Home/page";

export const metadata: Metadata = {
  title: "DevTime",
  description: "DevTime",
  openGraph: {
    title: "DevTime",
    description: "DevTime",
  },
};

export default function Main() {
  return <HomePage />;
}
