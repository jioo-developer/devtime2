const TITLE_MAX_LENGTH = 30;
const TODO_MAX_LENGTH = 30;
const MIN_TODO_COUNT = 1;

export function isTimerStartValid(title: string | undefined, todos: string[]): boolean {
  if (!title) return false;

  return (
    title.length > 0 &&
    title.length <= TITLE_MAX_LENGTH &&
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
