import { Metadata } from "next";
import Client from "./Client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "DevTime 회원가입 페이지",
    description: "DevTime 회원가입 페이지",
    openGraph: {
      title: "DevTime 회원가입 페이지",
      description: "DevTime 회원가입 페이지",
    },
  };
}

export default async function Page() {
  return <Client />;
}
