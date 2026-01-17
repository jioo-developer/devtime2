import { FaRegCheckSquare, FaRegSquare } from "react-icons/fa";

export const defaultRenderContent = (
  stateValue: boolean,
  color?: string,
  size: number = 25
) => {
  const checkColor = color || "gray";

  if (stateValue) {
    return <FaRegCheckSquare key="check-on" size={size} color={checkColor} />;
  } else {
    return <FaRegSquare key="check-off" size={size} color={checkColor} />;
  }
};
