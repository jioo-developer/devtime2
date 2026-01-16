"use client";
import { ReactNode } from "react";
import { defaultRenderContent } from "./default";

export type PropsType = {
  childrens?: [ReactNode, ReactNode];
  stateValue: boolean;
  setStateHandler: (stateValue: boolean) => void;
  testId?: string;
  color?: string;
  size?: number;
  stopPropagation?: boolean;
};

function CommonCheckbox({
  stateValue,
  setStateHandler,
  testId,
  childrens,
  color = "var(--primary-core)",
  size = 25,
  stopPropagation = false,
}: PropsType) {
  // render 함수
  const renderHandler = () => {
    if (childrens) {
      return stateValue ? childrens[0] : childrens[1];
    } else {
      return defaultRenderContent(stateValue, color, size);
    }
  };

  return (
    <button
      type="button"
      className="check__Toggle"
      data-testid={stateValue ? `${testId}-on` : `${testId}-off`}
      style={{ maxHeight: size }}
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation();
        }
        setStateHandler(!stateValue);
      }}
    >
      {renderHandler()}
    </button>
  );
}

export default CommonCheckbox;
