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
  // http://localhost:3000/?completed=true or falseの場合
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
  const todo: Todos = { id: String(getMaxId() + 1), title, completed: false };
  todosData.push(todo);
  res.status(201).json(todo);
};

// 指定IDのcompletedの更新
export const updateTodo = (req: isTodoHandlingRequest, res: Response) => {
  const index = todosData.findIndex((todo) => todo.id === req.todo?.id);
  if (index !== -1) {
    todosData[index]!.completed = !todosData[index]!.completed;
    return res.status(200).json(todosData);
  }
  return res.status(404).json({ message: "ToDo not found" });
};

// 指定IDのデータの削除
export const deleteTodo = (req: isTodoHandlingRequest, res: Response) => {
  const index = todosData.findIndex((todo) => todo.id === req.todo?.id);
  if (index !== -1) {
    todosData.splice(index, 1);
    return res.status(200).json(todosData);
  }
  return res.status(404).json({ message: "ToDo not found" });
};
