import { Request, Response } from "express";
import { todos, getMaxId } from "../data/todos";
import { TodoBody, TodoReqQuery, Todos } from "../../types/types";

//一覧、true、falseデータの取得
export const getTodos = (
  req: Request<{}, {}, {}, TodoReqQuery>, // Params,ResBody,ReqBody,ReqQuery
  res: Response
) => {
  const { completed } = req.query;

  // http://localhost:3000/の場合
  if (!completed) {
    return res.json(todos);
  }
  // http://localhost:3000/?completed=false,falseの場合
  const isCompleted = completed === "true";
  return res.json(todos.filter((todo) => todo.completed === isCompleted));
};

// データの追加;
export const addTodo = (
  req: Request<{}, {}, TodoBody, {}>, // Params,ResBody,ReqBody,ReqQuery
  res: Response
) => {
  const { title } = req.body;
  // データの追加;
  const todo: Todos = { id: getMaxId() + 1, title, completed: false };
  todos.push(todo);
  res.status(201).json(todo);
};
