export type BaseTodoListFormProps = {
  /** 폼 초기 제목 (타이머/스터디 로그 제목) */
  initialTitle?: string;
  /** 폼 초기 할 일 목록 */
  initialTodos?: string[];
};

export type CreateModeProps = BaseTodoListFormProps & {
  mode: "create";
  /** 입력한 제목을 상위(TimerContext 등)에 반영할 때 호출 */
  setTodoTitle: (title: string) => void;
  /** 타이머 시작 API 성공 후 (제목, 할 일 목록)으로 부모 상태 갱신 시 호출 */
  onTimerStartSuccess: (title: string, todos: string[]) => void;
};

export type EditModeProps = BaseTodoListFormProps & {
  mode: "edit";
  /** 할 일 목록 저장 버튼 클릭 시 (제목, 할 일 목록)으로 부모가 갱신/API 호출할 때 사용 */
  onSave: (title: string, todos: string[]) => void;
};

export type EndModeProps = BaseTodoListFormProps & {
  mode: "end";
  /** 회고 입력 후 종료 버튼 클릭 시, 부모가 타이머 종료 API 호출할 때 사용 */
  onFinish: (reflection: string) => void;
  /** "할 일 수정" 버튼 클릭 시, 목록 편집 모달로 전환할 때 호출 */
  onEditClick: () => void;
};

export type ResetModeProps = BaseTodoListFormProps & {
  mode: "reset";
  onReset: () => void;
  onEditClick: () => void;
};

export type TodoListFormProps =
  | CreateModeProps
  | EditModeProps
  | EndModeProps
  | ResetModeProps;

export type TodoFormData = {
  title: string;
  todoInput: string;
  reflection?: string;
};
