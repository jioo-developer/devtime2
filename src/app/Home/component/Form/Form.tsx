"use client";
import { FormController } from "./components/editor/FormController";
import { TodoListFormProps } from "./types";
import "./style.css";

function TodoListForm(props: TodoListFormProps) {
  return <FormController {...props} />;
}


export default TodoListForm;
