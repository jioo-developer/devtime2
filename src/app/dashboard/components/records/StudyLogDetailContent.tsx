"use client";
import { useGetStudyLog } from "@/app/Home/hooks/getter/useGetStudyLog";

/** 모달 본문: studyLogId로 상세 조회 후 목표·할 일 목록만 렌더 */
export function StudyLogDetailContent({ studyLogId }: { studyLogId: string }) {
  const { data, isLoading } = useGetStudyLog(studyLogId);

  if (isLoading || !data) return <p className="studyLogModalLoading">불러오는 중…</p>;

  return (
    <>
      <p className="studyLogModalGoal">{data.data.todayGoal}</p>
      <ul className="studyLogModalTasks" aria-label="할 일 목록">
        {data.data.tasks.map((task, index) => (
          <li key={index} className={task.isCompleted ? "taskDone" : "taskTodo"}>
            {task.isCompleted ? "✓ " : ""}{task.content}
          </li>
        ))}
      </ul>
    </>
  );
}
