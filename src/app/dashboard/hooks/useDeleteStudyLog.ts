import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAccessToken } from "@/config/utils/tokenStorage";

export function useDeleteStudyLog() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string | number>({
    mutationFn: async (studyLogId) => {
      const token = getAccessToken();
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      await ApiClient.delete(
        `/api/study-logs/${studyLogId}`,
        undefined,
        headers,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.STUDY_LOGS_LIST] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.STUDY_LOGS] });
    },
  });
}
