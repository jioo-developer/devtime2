import { buildSplitTimesForStop, applySafetyBuffer } from "./splitTimesForStop";
import type { FinishTimerRequest, FinishTimerTaskItem } from "@/app/Home/hooks/mutations/finishTimer/useFinishTimer";

export type BuildFinishPayloadInput = {
  timerId: string;
  startTime: string;
  pausedDuration?: number;
  endTime?: string | null;
  tasks: FinishTimerTaskItem[];
  review: string;
};

/**
 * 종료 폼 데이터와 옵션으로부터 useFinishTimer 변수(timerId, data)를 생성한다.
 * splitTimes 계산·안전 버퍼 적용은 여기서 한 곳에서만 담당한다.
 */
export function buildFinishTimerPayload(input: BuildFinishPayloadInput): {
  timerId: string;
  data: FinishTimerRequest;
} {
  const {
    timerId,
    startTime,
    pausedDuration = 0,
    endTime: endTimeFromInput,
    tasks,
    review,
  } = input;

  const endTimeStr = endTimeFromInput ?? null;
  const endTime = endTimeStr ? new Date(endTimeStr) : new Date();

  const splitTimes = buildSplitTimesForStop(startTime, endTime, pausedDuration);
  const rawRangeMs = Math.max(
    0,
    endTime.getTime() - new Date(startTime).getTime() - pausedDuration
  );
  const allowedSec = Math.floor(rawRangeMs / 1000);
  const safeSec = Math.max(0, allowedSec - 10);
  const payloadSplitTimes = applySafetyBuffer(splitTimes, safeSec);

  return {
    timerId,
    data: {
      splitTimes: payloadSplitTimes,
      tasks,
      review,
    },
  };
}
