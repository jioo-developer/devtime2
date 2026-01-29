import type { HeatmapResponse, HeatmapItemDto } from "../../types";

/** API가 { heatmap } 또는 { data: { heatmap } } 형태로 올 수 있음. 항목도 정규화 */
export function normalizeHeatmap(
  apiResponse: HeatmapResponse | { data?: { heatmap?: unknown[] } },
): HeatmapResponse {
  let rawList: unknown[] = [];
  if (Array.isArray((apiResponse as HeatmapResponse).heatmap)) {
    rawList = (apiResponse as HeatmapResponse).heatmap;
  } else {
    const heatmapFromData = (apiResponse as { data?: { heatmap?: unknown[] } }).data?.heatmap;
    rawList = Array.isArray(heatmapFromData) ? heatmapFromData : [];
  }
  const rawItems = rawList as Array<{
    date?: string;
    studyTimeHours?: number;
    study_time_hours?: number;
    colorLevel?: number;
    color_level?: number;
  }>;
  return {
    heatmap: rawItems.map((item) => ({
      date: String(item?.date ?? ""),
      studyTimeHours: Number(item?.studyTimeHours ?? item?.study_time_hours ?? 0),
      colorLevel: Math.min(5, Math.max(0, Number(item?.colorLevel ?? item?.color_level ?? 0))),
    })) as HeatmapItemDto[],
  };
}
