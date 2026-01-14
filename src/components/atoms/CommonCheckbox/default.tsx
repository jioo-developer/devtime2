import { FaRegCheckSquare, FaRegSquare } from "react-icons/fa";

export const defaultRenderContent = (stateValue: boolean) => {
  if (stateValue) {
    return <FaRegCheckSquare key="check-on" size={25} color="gray" />;
  } else {
    return <FaRegSquare key="check-off" size={25} color="gray" />;
  }
};
