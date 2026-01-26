import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

type UpdateTasksRequest = {
  tasks: string[];
};

type UpdateTasksResponse = {
  message: string;
};

export const useUpdateTasks = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateTasksResponse, Error, { studyLogId: string; data: UpdateTasksRequest }>({
    mutationFn: async ({ studyLogId, data }) => {
      return await ApiClient.put<UpdateTasksResponse>(
        `/api/${studyLogId}/tasks`,
        data,
        getAuthHeaders()
      );
    },
    onSuccess: (_, variables) => {
      // studyLog 상태 갱신
      queryClient.invalidateQueries({ queryKey: [QueryKey.STUDY_LOGS, variables.studyLogId] });
    },
  });
};
