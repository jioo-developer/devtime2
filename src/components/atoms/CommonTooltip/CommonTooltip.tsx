"use client";
import { ReactNode, useState } from "react";
import styles from "./CommonTooltip.module.css";
import clsx from "clsx";

export interface CommonTooltipProps {
  children: ReactNode;
  content: string | ReactNode;
  testId?: string;
}

function CommonTooltip({ children, content, testId }: CommonTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={styles.tooltipWrapper}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      data-testid={testId}
    >
      {children}
      {isVisible && (
        <div className={clsx(styles.tooltip, styles.top)}>
          <div className={styles.tooltipContent}>{content}</div>
          <div className={styles.tooltipArrow} />
        </div>
      )}
    </div>
  );
}

export default CommonTooltip;
