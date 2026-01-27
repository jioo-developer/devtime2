export type TodoFormData = {
  title: string;
  todoInput: string;
  reflection?: string;
};

export type FormMode = "create" | "edit" | "end";