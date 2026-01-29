import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import type { StatsResponse } from "../types";
import { toStatsDisplay, type StatsDisplay } from "../utils/heatMap/normalizeStatsResponse";

export type { StatsDisplay } from "../utils/heatMap/normalizeStatsResponse";

export function useGetStats(enabled: boolean = true): UseQueryResult<StatsDisplay, Error> {
  return useQuery({
    queryKey: [QueryKey.STATS],
    enabled,
    queryFn: async () => {
      const res = await ApiClient.get<StatsResponse>("/api/stats", undefined, getAuthHeaders());
      return toStatsDisplay(res);
    },
    staleTime: 60 * 1000,
  });
}
