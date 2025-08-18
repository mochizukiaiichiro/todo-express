import { Request, Response } from "express";
import {
  isTodoHandlingRequest,
  TodoBody,
  TodoReqQuery,
  Todo,
  TodoRepository,
} from "../../types/types";

/**
 * ToDo一覧を取得するAPIハンドラー
 * - クエリパラメータ `completed` に応じてフィルタリング
 * @route GET /api/todos
 * @param req - Expressリクエスト（クエリ: completed）
 * @param res - Expressレスポンス
 * @returns ToDo配列（全件 or completed=true/false に応じた絞り込み）
 */
export const getTodos =
  (db: TodoRepository) =>
  (
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

/**
 * 新しいToDoを追加するAPIハンドラー
 * @route POST /api/todos
 * @param req - Expressリクエスト（body: todoName）
 * @param res - Expressレスポンス
 * @returns 作成成功メッセージ
 */
export const addTodo =
  (db: TodoRepository) =>
  (
    req: Request<{}, {}, TodoBody, {}>, // Request<Params, ResBody, ReqBody, ReqQuery>
    res: Response
  ): Response<{ message: string }> => {
    const { todoName } = req.body;
    db.insert(todoName);
    return res.status(201).json({ message: "Todo created" });
  };

/**
 * 指定されたToDoの completed 状態を更新するAPIハンドラー
 * @route PUT /api/todos/:id/completed
 * @param req - Expressリクエスト（拡張済み: req.todo）
 * @param res - Expressレスポンス
 * @returns 更新成功メッセージ
 */
export const updateTodo =
  (db: TodoRepository) =>
  (
    req: isTodoHandlingRequest,
    res: Response
  ): Response<{ message: string }> => {
    db.update(req.todo!);
    return res.status(200).json({ message: "Todo updated" });
  };

/**
 * 指定されたToDoを削除するAPIハンドラー
 * @route DELETE /api/todos/:id
 * @param req - Expressリクエスト（拡張済み: req.todo）
 * @param res - Expressレスポンス
 * @returns 削除成功メッセージ
 */
export const deleteTodo =
  (db: TodoRepository) =>
  (
    req: isTodoHandlingRequest,
    res: Response
  ): Response<{ message: string }> => {
    db.remove(req.todo!.id);
    return res.status(200).json({ message: "Todo delete" });
  };
