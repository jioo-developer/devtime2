"use client";
import {
  KPI_ITEMS,
  MAX_HOURS,
  WEEKDAY_LABELS,
  WEEKDAY_KEYS,
  HEATMAP_Y_LABELS,
} from "../utils/data";
import { useGetStats } from "../hooks/useGetStats";

export function KpiSection() {
  const { data, isLoading, isError } = useGetStats();

  return (
    <section className="kpiSection" aria-label="요약 통계">
      {KPI_ITEMS.map(({ label, value }) => (
        <div key={value} className="kpiCard">
          <p className="kpiCardLabel">{label}</p>
          <p className="kpiCardValue kpiCardValueLarge" aria-busy={isLoading}>
            {isLoading ? "—" : isError ? "—" : data?.[value] ?? "—"}
          </p>
        </div>
      ))}
      <div className="kpiCard kpiCardChart">
        <p className="weekdayChartTitle">요일별 공부 시간 평균</p>
        <div className="weekdayChartBody">
          <div className="weekdayYAxis">
            {HEATMAP_Y_LABELS.map((yAxisLabel) => (
              <span key={yAxisLabel}>{yAxisLabel}</span>
            ))}
          </div>
          <div className="weekdayChartRight">
            <div className="weekdayBarsWrap" role="img" aria-label="요일별 평균 공부 시간" aria-busy={isLoading}>
              {(data?.weekdayHours ?? [0, 0, 0, 0, 0, 0, 0]).map((hours, weekdayIndex) => (
                <div
                  key={WEEKDAY_KEYS[weekdayIndex]}
                  className="weekdayBarCol"
                  title={`${WEEKDAY_LABELS[weekdayIndex]}: ${hours}시간`}
                >
                  <div className="weekdayBarEmpty" style={{ flex: (MAX_HOURS - hours) / MAX_HOURS }} />
                  <div className="weekdayBarFill" style={{ flex: hours / MAX_HOURS }} />
                </div>
              ))}
            </div>
            <div className="weekdayLabels">
              {WEEKDAY_LABELS.map((weekdayLabel, weekdayIndex) => (
                <div key={WEEKDAY_KEYS[weekdayIndex]} className="weekdayLabelCell">
                  <span className="weekdayLabelCircle">{weekdayLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
