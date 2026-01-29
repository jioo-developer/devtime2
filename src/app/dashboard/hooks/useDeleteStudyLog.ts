import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

export function useDeleteStudyLog() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string | number>({
    mutationFn: async (studyLogId) => {
      await ApiClient.delete(
        `/api/study-logs/${studyLogId}`,
        undefined,
        getAuthHeaders(),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.STUDY_LOGS_LIST] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.STUDY_LOGS] });
    },
  });
}
