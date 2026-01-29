import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAccessToken } from "@/config/utils/tokenStorage";
import type { StatsResponse } from "../types";
import { toStatsDisplay, type StatsDisplay } from "../utils/heatMap/normalizeStatsResponse";

export type { StatsDisplay } from "../utils/heatMap/normalizeStatsResponse";

export function useGetStats(enabled: boolean = true): UseQueryResult<StatsDisplay, Error> {
  return useQuery({
    queryKey: [QueryKey.STATS],
    enabled,
    queryFn: async () => {
      const token = getAccessToken();
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await ApiClient.get<StatsResponse>("/api/stats", undefined, headers);
      return toStatsDisplay(res);
    },
    staleTime: 60 * 1000,
  });
}
