"use client";
import { useForm } from "react-hook-form";
import { TodoFormData, TodoListFormProps } from "./types";
import { useTodoForm } from "./hooks/useTodoForm";
import { isTimerStartValid } from "./utils/timerValidation";
import { useModalStore } from "@/store/modalStore";
import { CreateForm } from "./components/editor/CreateForm";
import { EditForm } from "./components/editor/EditForm";
import { EndForm } from "./components/editor/EndForm";
import "./style.css";

function TodoListForm(props: TodoListFormProps) {
  // useForm 관련 셋팅
  const form = useForm<TodoFormData>({
    defaultValues: {
      title: props.initialTitle ?? "",
      todoInput: "",
      reflection: "",
    },
    mode: "onChange",
  });
  const { watch, reset, getValues } = form;
  // useForm 관련 셋팅

  const closeModal = useModalStore((state) => state.closeTop);

  const {
    todos,
    todoInputValue,
    handleAddTodo,
    handleRemoveTodo,
    handleTextChange,
  } = useTodoForm(watch, reset, props.initialTodos ?? []);

  if (props.mode === "create") {
    const titleValue = watch("title");
    const canStartTimer = isTimerStartValid(titleValue, todos);

    const onStartTimer = () => {
      const trimmed = titleValue.trim();

      if (trimmed) props.setTodoTitle(trimmed);

      if (canStartTimer) {
        props.onTimerStartSuccess(trimmed, todos);
        closeModal();
      }
    }

    return (
      <CreateForm
        form={form}
        todos={todos}
        todoInputValue={todoInputValue}
        handleAddTodo={handleAddTodo}
        handleRemoveTodo={handleRemoveTodo}
        handleTextChange={handleTextChange}
        canStartTimer={canStartTimer}
        onStartTimer={onStartTimer}
      />
    );
  }

  if (props.mode === "edit") {
    return (
      <EditForm
        form={form}
        todos={todos}
        todoInputValue={todoInputValue}
        handleAddTodo={handleAddTodo}
        handleRemoveTodo={handleRemoveTodo}
        handleTextChange={handleTextChange}
        handleSave={() => {
          const { title } = getValues();
          props.onSave(title, todos);
        }}
      />
    );
  }

  if (props.mode === "end") {
    return (
      <EndForm
        onEditClick={props.onEditClick}
        form={form}
        todos={todos}
        todoInputValue={todoInputValue}
        initialTodos={props.initialTodos ?? []}
        handleAddTodo={handleAddTodo}
        handleRemoveTodo={handleRemoveTodo}
        handleTextChange={handleTextChange}
        onFinish={props.onFinish}
      />
    );
  }

  return null;
}

export default TodoListForm;
