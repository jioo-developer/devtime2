import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

export type UpdateStudyLogTasksItem = {
  content: string;
  isCompleted: boolean;
};

export type UpdateStudyLogTasksRequest = {
  studyLogId: string;
  tasks: UpdateStudyLogTasksItem[];
};

/**
 * PUT /api/{studyLogId}/tasks — 타이머 진행 중 할 일 목록 전체 업데이트
 */
export const useUpdateStudyLogTasks = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateStudyLogTasksRequest>({
    mutationFn: async ({ studyLogId, tasks }) => {
      await ApiClient.put(
        `/api/${studyLogId}/tasks`,
        { tasks },
        getAuthHeaders()
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.STUDY_LOGS, variables.studyLogId],
      });
    },
  });
};
