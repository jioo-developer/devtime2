import { getGridDates } from "./heatmapGrid";

export type MockHeatmapCell = {
  date: string;
  studyTimeHours: number;
  colorLevel: number; // 0~5
};

/** 목업: 1~12월 전부 채움, 금·토·일 포함 모든 요일 색 있음. 7·8·10월 약간 진함, 툴팁용 시간은 level에 맞춰 0~8시간대 */
export function getMockGrid(targetYear: number): MockHeatmapCell[] {
  const gridDates = getGridDates(targetYear);
  const TOTAL_WEEKS = 53;

  return gridDates.map((dateStr, cellIndex) => {
    const weekCol = cellIndex % TOTAL_WEEKS;
    const dayRow = Math.floor(cellIndex / TOTAL_WEEKS);
    const month = parseInt(dateStr.slice(5, 7), 10);
    const seed = (cellIndex * 31 + targetYear) % 100;

    let level = (seed % 4) + 1;
    if (month === 7 || month === 8 || month === 10) level = Math.min(5, level + 1);
    if (month === 6) level = Math.max(0, level - 1);
    if (month === 1 && weekCol < 2) level = Math.max(0, level - 1);
    if (dayRow === 1 || dayRow === 2 || dayRow === 4) level = Math.min(5, level + 1);
    if (seed < 6) level = 0;

    const colorLevel = Math.min(5, Math.max(0, level));
    const studyTimeHours =
      colorLevel === 0 ? 0 : colorLevel * 1.2 + (seed % 18) * 0.15 + (seed % 5) * 0.05;

    return { date: dateStr, studyTimeHours, colorLevel };
  });
}
