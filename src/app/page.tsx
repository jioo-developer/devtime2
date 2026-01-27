import { Metadata } from "next";
import MainPage from "./Home/Home";

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
  return <MainPage />;
}
