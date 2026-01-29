"use client";
import "./style.css";
import { KpiSection } from "./components/KpiSection";
import { HeatmapSection } from "./components/HeatmapSection";
import { RecordsSection } from "./components/RecordsSection";

export default function DashboardPage() {
  return (
    <main className="dashboardPage">
      <KpiSection />
      <HeatmapSection />
      <RecordsSection />
    </main>
  );
}
