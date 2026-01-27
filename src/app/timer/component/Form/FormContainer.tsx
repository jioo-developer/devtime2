"use client";
import { useForm } from "react-hook-form";
import { TodoFormData, TodoListFormProps } from "./types";
import { useTodoForm } from "./hooks/useTodoForm";
import { isTimerStartValid } from "./utils/timerValidation";
import { CreateForm } from "./components/editor/CreateForm";
import { EditForm } from "./components/editor/EditForm";
import { EndForm } from "./components/editor/EndForm";
import "./style.css";

function FormContainer(props: TodoListFormProps) {
  const { mode, initialTitle = "", initialTodos = [] } = props;

  const form = useForm<TodoFormData>({
    defaultValues: {
      title: initialTitle,
      todoInput: "",
      reflection: "",
    },
    mode: "onChange",
  });
  const { watch, reset, getValues } = form;

  const {
    todos,
    todoInputValue,
    handleAddTodo,
    handleRemoveTodo,
    handleTextChange,
  } = useTodoForm(watch, reset, initialTodos);

  if (mode === "create") {
    const { setTodoTitle, onTimerStartSuccess } = props;
    const titleValue = watch("title");
    const canStartTimer = isTimerStartValid(titleValue, todos);

    const onStartTimer = () => {
      const trimmed = titleValue.trim();
      if (trimmed) setTodoTitle(trimmed);
      if (canStartTimer) onTimerStartSuccess(trimmed, todos);
    };

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

  if (mode === "edit") {
    const { onSave } = props;
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
          onSave(title, todos);
        }}
      />
    );
  }

  if (mode === "end") {
    const { onEditClick, onFinish } = props;
    return (
      <EndForm
        mode="end"
        onEditClick={onEditClick}
        form={form}
        todos={todos}
        initialTodos={initialTodos}
        handleRemoveTodo={handleRemoveTodo}
        handleTextChange={handleTextChange}
        onFinish={onFinish}
      />
    );
  }

  return null;
}

export default FormContainer;
