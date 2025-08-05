import { Response, NextFunction } from "express";
import { todosData } from "../data/todosData";
import { isTodoHandlerRequest, Todos } from "../../types/types";

// 指定IDのToDoの存在を検証する。
export const isTodoHandler = (
  req: isTodoHandlerRequest,
  res: Response,
  next: NextFunction
) => {
  const todo: Todos | undefined = todosData.find(
    (todo) => todo.id === req.params.id
  );

  if (!todo) {
    return res.status(404).json({ message: "ToDo not found" });
  }
  req.todo = todo;
  return next();
};
