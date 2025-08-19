import { Response, NextFunction } from 'express';
import { isTodoHandlerRequest, Todo, TodoRepository } from '../../types/types';

/**
 * 指定されたIDのToDoが存在するかを検証するミドルウェア
 * - 存在しない場合は 404 を返す
 * - 存在する場合は req.todo に格納して次の処理へ
 * @param req - 拡張されたExpressリクエスト（params.id を含む）
 * @param res - Expressレスポンスオブジェクト
 * @param next - 次のミドルウェア関数
 * @returns ToDoが存在しない場合は404レスポンス、存在する場合は next() を呼び出す
 */
export const isTodoHandler =
  (db: TodoRepository) => (req: isTodoHandlerRequest, res: Response, next: NextFunction) => {
    const todo: Todo | undefined = db.getId(req.params.id as string);

    if (!todo) {
      return res.status(404).json({ message: 'isTodoHandler / ToDo not found' });
    }
    req.todo = todo;
    return next();
  };
