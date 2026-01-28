const TOTAL_WEEKS = 53;
const DAYS_PER_WEEK = 7;
const TOTAL_CELLS = TOTAL_WEEKS * DAYS_PER_WEEK;

export function getGridDates(targetYear: number): string[] {
  const januaryFirst = new Date(targetYear, 0, 1);
  const dayOfWeek = januaryFirst.getDay();
  const gridStartSunday = new Date(januaryFirst);
  gridStartSunday.setDate(januaryFirst.getDate() - dayOfWeek);

  const gridDates: string[] = [];
  for (let cellIndex = 0; cellIndex < TOTAL_CELLS; cellIndex++) {
    const weekColumnIndex = cellIndex % TOTAL_WEEKS;
    const dayRowIndex = Math.floor(cellIndex / TOTAL_WEEKS);
    const cellDate = new Date(gridStartSunday);
    cellDate.setDate(gridStartSunday.getDate() + weekColumnIndex * DAYS_PER_WEEK + dayRowIndex);
    const year = cellDate.getFullYear();
    const month = String(cellDate.getMonth() + 1).padStart(2, "0");
    const dayOfMonth = String(cellDate.getDate()).padStart(2, "0");
    gridDates.push(`${year}-${month}-${dayOfMonth}`);
  }
  return gridDates;
}
