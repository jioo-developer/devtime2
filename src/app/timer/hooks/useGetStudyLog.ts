import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

/** API 스펙: tasks는 항상 { id, content, isCompleted }[] */
export type StudyLogResponse = {
  data: {
    todayGoal: string;
    tasks: Array<{ id?: number; content: string; isCompleted?: boolean }>;
  };
};

/** 훅이 반환하는 데이터 형태. tasks는 string[] */
export type StudyLogData = {
  data: { todayGoal: string; tasks: string[] };
};

export const useGetStudyLog = (
  studyLogId: string | undefined
): UseQueryResult<StudyLogData, Error> => {
  return useQuery<StudyLogResponse, Error, StudyLogData>({
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
    select: (res) => ({
      data: {
        todayGoal: res.data.todayGoal,
        tasks: (res.data.tasks ?? []).map((task) => task.content),
      },
    }),
    enabled: Boolean(studyLogId),
    retry: 3,
    staleTime: 0,
    refetchOnMount: true,
  });
};