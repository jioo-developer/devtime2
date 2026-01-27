const TITLE_MAX_LENGTH = 30;
const TODO_MAX_LENGTH = 30;
const MIN_TODO_COUNT = 1;

export function isTimerStartValid(title: string, todos: string[]): boolean {
  const trimmedTitle = title.trim();

  return (
    trimmedTitle.length > 0 &&
    trimmedTitle.length <= TITLE_MAX_LENGTH &&
    todos.length >= MIN_TODO_COUNT &&
    todos.every((todo) => {
      const trimmedTodo = todo.trim();
      return (
        trimmedTodo.length > 0 &&
        trimmedTodo.length <= TODO_MAX_LENGTH
      );
    })
  );
}
