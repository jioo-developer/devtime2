import { useTimerStore } from "@/store/timerStore";
import { useModalStore } from "@/store/modalStore";
import { useStartTimer } from "@/app/Home/hooks/mutations/startTimer/useStartTimer";
import { useUpdateStudyLogTasks } from "@/app/Home/hooks/mutations/updateStudyList/updateStudyList";

type TodoTask = {
  content: string;
  isCompleted: boolean;
};

export function useModalFormActions() {
  const { mutate: startTimer } = useStartTimer();
  const { mutate: updateStudyLogTasks } = useUpdateStudyLogTasks();
  const setTodoTitle = useTimerStore((state) => state.setTodoTitle);
  const setSavedTodos = useTimerStore((state) => state.setSavedTodos);
  const closeTop = useModalStore((state) => state.closeTop);

  const startTimerAction = (title: string, todos: TodoTask[]) => {
    if (!title) return;
    startTimer({
      todayGoal: title,
      tasks: todos.map((todo) => todo.content),
    });
  };

  const saveTasksAction = (studyLogId: string, title: string, todos: TodoTask[]) => {
    const taskList = todos.map((todo) => ({
      content: todo.content,
      isCompleted: todo.isCompleted,
    }));

    updateStudyLogTasks(
      { studyLogId, tasks: taskList },
      {
        onSuccess: () => {
          setTodoTitle(title);
          setSavedTodos(todos.map((todo) => todo.content));
          closeTop();
        },
        onError: (err) => {
          console.error("할 일 목록 저장 실패:", err);
        },
      }
    );
  };

  return { startTimerAction, saveTasksAction };
}
