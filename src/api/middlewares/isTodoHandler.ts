import { Response, NextFunction } from "express";
import { isTodoHandlerRequest, Todo } from "../../types/types";
import { TodoDbService } from "../services/todoDbService";

const db = new TodoDbService("src/api/data/todo-express-db.sqlite3");

// 指定IDのToDoの存在を検証する。
export const isTodoHandler = (
  req: isTodoHandlerRequest,
  res: Response,
  next: NextFunction
) => {
  const todo: Todo | undefined = db.getId(req.params.id as string);

  if (!todo) {
    return res.status(404).json({ message: "isTodoHandler / ToDo not found" });
  }
  req.todo = todo;
  return next();
};
