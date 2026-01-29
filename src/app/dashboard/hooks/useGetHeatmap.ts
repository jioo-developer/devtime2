import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAccessToken } from "@/config/utils/tokenStorage";
import type { HeatmapResponse } from "../types";
import { normalizeHeatmap } from "../utils/heatMap/normalizeHeatmapResponse";

export function useGetHeatmap(enabled: boolean = true): UseQueryResult<HeatmapResponse, Error> {
  return useQuery({
    queryKey: [QueryKey.HEATMAP],
    enabled,
    queryFn: async () => {
      const token = getAccessToken();
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await ApiClient.get<HeatmapResponse | { data?: { heatmap?: HeatmapResponse["heatmap"] } }>(
        "/api/heatmap",
        undefined,
        headers,
      );
      return normalizeHeatmap(res);
    },
    staleTime: 60 * 1000,
  });
}
