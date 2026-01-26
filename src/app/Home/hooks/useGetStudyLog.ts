import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

export type StudyLogResponse = {
  todayGoal: string;
  tasks: string[];
};

export const useGetStudyLog = (
  studyLogId: string | undefined
): UseQueryResult<StudyLogResponse, Error> => {
  return useQuery<StudyLogResponse, Error>({
    queryKey: [QueryKey.STUDY_LOGS, studyLogId],
    queryFn: async () => {
      if (!studyLogId) {
        throw new Error("studyLogId is required");
      }
      return await ApiClient.get<StudyLogResponse>(
        `/api/study-logs/${studyLogId}`,
        undefined,
        getAuthHeaders()
      );
    },
    enabled: Boolean(studyLogId),
    retry: false,
  });
};
