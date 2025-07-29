import { Response, NextFunction } from "express";
import { todosData } from "../data/todosData";
import { isTodoHandlerRequest } from "../../types/types";

// 指定IDのToDoの存在を検証する。存在すればTodos[]のindexをreqに付加する。
export const isTodoHandler = (
  req: isTodoHandlerRequest,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);
  const index = todosData.findIndex((todo) => todo.id === id);
  console.log("index:", index);

  if (index !== -1) {
    req.todoIndex = index;
    return next();
  } else {
    return res.status(404).json({ message: "Todo not found" });
  }
};
