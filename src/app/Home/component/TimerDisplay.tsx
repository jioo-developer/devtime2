type TimerDisplayProps = {
  hours: string;
  minutes: string;
  seconds: string;
};

export function TimerDisplay({ hours, minutes, seconds }: TimerDisplayProps) {
  return (
    <div className="timerDisplay">
      <div className="timeSegment">
        <div className="timeValue">{hours}</div>
      </div>
      <span className="colon">:</span>
      <div className="timeSegment">
        <div className="timeValue">{minutes}</div>
      </div>
      <span className="colon">:</span>
      <div className="timeSegment">
        <div className="timeValue">{seconds}</div>
      </div>
    </div>
  );
}
