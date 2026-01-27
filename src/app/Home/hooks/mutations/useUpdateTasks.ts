import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import { ResponseMessage, StudyLogIdWithData } from "./type";

export interface UpdateTasksVariables extends StudyLogIdWithData {
  tasks: string[];
};

export const useUpdateTasks = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseMessage, Error, UpdateTasksVariables>({
    mutationFn: async ({ studyLogId, tasks }) => {
      return await ApiClient.put<ResponseMessage>(
        `/api/${studyLogId}/tasks`,
        tasks,
        getAuthHeaders()
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.STUDY_LOGS, variables.studyLogId] });
    },
  });
};
