export type BaseTodoListFormProps = {
  initialTitle?: string;
  initialTodos?: string[];
};

export type CreateModeProps = BaseTodoListFormProps & {
  mode: "create";
  setTodoTitle: (title: string) => void;
  onTimerStartSuccess: (title: string, todos: string[]) => void;
};

export type EditModeProps = BaseTodoListFormProps & {
  mode: "edit";
  onSave: (title: string, todos: string[]) => void;
};

export type EndModeProps = BaseTodoListFormProps & {
  mode: "end";
  onFinish: (reflection: string, completedTodos: boolean[]) => void;
  onEditClick: () => void;
};

export type TodoListFormProps =
  | CreateModeProps
  | EditModeProps
  | EndModeProps;

export type TodoFormData = {
  title: string;
  todoInput: string;
  reflection?: string;
};
