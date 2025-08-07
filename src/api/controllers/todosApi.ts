import { Request, Response } from "express";
import {
  isTodoHandlingRequest,
  TodoBody,
  TodoReqQuery,
  Todo,
} from "../../types/types";
import { TodoDbService } from "../services/todoDbService";

const db = new TodoDbService("src/api/data/todo-express-db.sqlite3");

//一覧、true、falseデータの取得
export const getTodos = (
  req: Request<{}, {}, {}, TodoReqQuery>, // Request<Params, ResBody, ReqBody, ReqQuery>
  res: Response
): Response<Todo[]> => {
  const { completed } = req.query;

  // "/"の場合
  if (!completed) {
    return res.json(db.getAll());
  }
  // "/?completed=true" or falseの場合
  const isCompleted = completed === "true";
  return res.json(db.getCompleted(isCompleted));
};

// データの追加;
export const addTodo = (
  req: Request<{}, {}, TodoBody, {}>, // Request<Params, ResBody, ReqBody, ReqQuery>
  res: Response
): Response<{ message: string }> => {
  const { todoName } = req.body;
  db.insert(todoName);
  return res.status(201).json({ message: "Todo created" });
};

// 指定IDのcompletedの更新
export const updateTodo = (
  req: isTodoHandlingRequest,
  res: Response
): Response<{ message: string }> => {
  db.update(req.todo!);
  return res.status(200).json({ message: "Todo updated" });
};

// 指定IDのデータの削除
export const deleteTodo = (
  req: isTodoHandlingRequest,
  res: Response
): Response<{ message: string }> => {
  db.delete(req.todo!.id);
  return res.status(200).json({ message: "Todo delete" });
};
