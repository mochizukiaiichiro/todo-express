import { Todo } from "../../types/types";

export default function isTodoRow(value: unknown): value is Todo {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "todoName" in value &&
    "completed" in value
  );
}
