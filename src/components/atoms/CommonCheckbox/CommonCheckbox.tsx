"use client";
import { ReactNode } from "react";
import { defaultRenderContent } from "./default";

export type PropsType = {
  childrens?: [ReactNode, ReactNode];
  stateValue: boolean;
  setStateHandler: (stateValue: boolean) => void;
  testId?: string;
};

function CommonCheckbox({
  stateValue,
  setStateHandler,
  testId,
  childrens,
}: PropsType) {
  // render 함수
  const renderHandler = () => {
    if (childrens) {
      return stateValue ? childrens[0] : childrens[1];
    } else {
      return defaultRenderContent(stateValue);
    }
  };

  return (
    <button
      type="button"
      className="check__Toggle"
      data-testid={stateValue ? `${testId}-on` : `${testId}-off`}
      style={{ maxHeight: 25 }}
      onClick={() => setStateHandler(!stateValue)}
    >
      {renderHandler()}
    </button>
  );
}

export default CommonCheckbox;
