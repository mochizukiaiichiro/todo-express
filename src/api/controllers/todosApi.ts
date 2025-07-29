import { Request, Response } from "express";
import { todosData, getMaxId } from "../data/todosData";
import {
  isTodoHandlingRequest,
  TodoBody,
  TodoReqQuery,
  Todos,
} from "../../types/types";

//一覧、true、falseデータの取得
export const getTodos = (
  req: Request<{}, {}, {}, TodoReqQuery>, // Request<Params, ResBody, ReqBody, ReqQuery>
  res: Response
) => {
  const { completed } = req.query;

  // http://localhost:3000/の場合
  if (!completed) {
    return res.json(todosData);
  }
  // http://localhost:3000/?completed=false,falseの場合
  const isCompleted = completed === "true";
  return res.json(todosData.filter((todo) => todo.completed === isCompleted));
};

// データの追加;
export const addTodo = (
  req: Request<{}, {}, TodoBody, {}>, // Request<Params, ResBody, ReqBody, ReqQuery>
  res: Response
) => {
  const { title } = req.body;
  // データの追加;
  const todo: Todos = { id: getMaxId() + 1, title, completed: false };
  todosData.push(todo);
  res.status(201).json(todo);
};

// 指定IDのcompletedをtrueに更新
// 指定IDのcompletedをfalseに更新

// 指定IDのデータの削除
export const deleteTodo = (req: isTodoHandlingRequest, res: Response) => {
  if (typeof req.todoIndex === "number") {
    todosData.splice(req.todoIndex, 1);
    return res.status(200).json(todosData);
  } else {
    return res.status(500).json({ message: "DELETE error" });
  }
};
