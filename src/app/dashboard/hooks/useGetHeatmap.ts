import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import type { HeatmapResponse } from "../types";
import { normalizeHeatmap } from "../utils/heatMap/normalizeHeatmapResponse";

export function useGetHeatmap(enabled: boolean = true): UseQueryResult<HeatmapResponse, Error> {
  return useQuery({
    queryKey: [QueryKey.HEATMAP],
    enabled,
    queryFn: async () => {
      const res = await ApiClient.get<HeatmapResponse | { data?: { heatmap?: HeatmapResponse["heatmap"] } }>(
        "/api/heatmap",
        undefined,
        getAuthHeaders(),
      );
      return normalizeHeatmap(res);
    },
    staleTime: 60 * 1000,
  });
}
