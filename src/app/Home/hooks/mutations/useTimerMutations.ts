import { useStartTimer } from "./useStartTimer";
import { usePauseTimer } from "./usePauseTimer";
import { useResumeTimer } from "./useResumeTimer";
import { useResetTimer } from "./useResetTimer";
import { useFinishTimer } from "./useFinishTimer";
import { useUpdateTasks } from "./useUpdateTasks";

export function useTimerMutations() {
  const startTimerMutation = useStartTimer();
  const pauseTimerMutation = usePauseTimer();
  const resumeTimerMutation = useResumeTimer();
  const resetTimerMutation = useResetTimer();
  const finishTimerMutation = useFinishTimer();
  const updateTasksMutation = useUpdateTasks();

  return {
    startTimerMutation,
    pauseTimerMutation,
    resumeTimerMutation,
    resetTimerMutation,
    finishTimerMutation,
    updateTasksMutation,
  };
}
