import { usePauseTimer } from "./usePauseTimer";
import { useResumeTimer } from "./useResumeTimer";
import { useResetTimer } from "./useResetTimer";
import { useFinishTimer } from "./useFinishTimer";

export function useTimerMutations() {
  const pauseTimerMutation = usePauseTimer();
  const resumeTimerMutation = useResumeTimer();
  const resetTimerMutation = useResetTimer();
  const finishTimerMutation = useFinishTimer();

  return {
    pauseTimerMutation,
    resumeTimerMutation,
    resetTimerMutation,
    finishTimerMutation,
  };
}
