"use client";
import {
  MONTH_LABELS,
  HEATMAP_WEEKDAY_LABELS,
  HEATMAP_LEGEND_LEVELS,
  HEATMAP_LEGEND_BG,
} from "../utils/data";
import { getMockGrid } from "../utils/heatMap/mockHeatmapGrid";
import { formatHrToHms } from "../utils/formatStats";

export function HeatmapSection() {
  const cells = getMockGrid(new Date().getFullYear());

  return (
    <section className="heatmapSection" aria-label="공부 시간 바다">
      <h2 className="heatmapTitle">공부 시간 바다</h2>
      <div className="heatmapMonths">
        {MONTH_LABELS.map((monthLabel) => (
          <span key={monthLabel} className="heatmapMonth">
            {monthLabel}
          </span>
        ))}
      </div>
      <div className="heatmapGridWrap">
        <div className="heatmapWeekdays">
          {HEATMAP_WEEKDAY_LABELS.map((weekdayLabel) => (
            <span key={weekdayLabel}>{weekdayLabel}</span>
          ))}
        </div>
        <div className="heatmapGrid">
          {cells.map((cell) => (
            <div
              key={cell.date}
              className="heatmapCell"
              data-level={cell.colorLevel}
              role="img"
              aria-label={
                cell.studyTimeHours > 0
                  ? `${cell.date} ${formatHrToHms(cell.studyTimeHours)}`
                  : `${cell.date} 공부 기록 없음`
              }
              title={cell.studyTimeHours > 0 ? formatHrToHms(cell.studyTimeHours) : undefined}
            />
          ))}
        </div>
      </div>
      <div className="heatmapLegend">
        <span className="heatmapLegendLabel">Shallow</span>
        <div className="heatmapLegendBar">
          {HEATMAP_LEGEND_LEVELS.map((legendLevel) => (
            <div
              key={legendLevel}
              className="heatmapLegendCell"
              data-level={legendLevel}
              style={{ background: HEATMAP_LEGEND_BG[legendLevel] }}
            />
          ))}
        </div>
        <span className="heatmapLegendLabel">Deep</span>
      </div>
      <p className="heatmapMockNotice">해당 데이터는 목업데이터 입니다.</p>
    </section>
  );
}
