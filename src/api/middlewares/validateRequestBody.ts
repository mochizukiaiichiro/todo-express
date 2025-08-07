import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { TodoBody } from "../../types/types";

/**
 * Zodスキーマに基づいてリクエストボディを検証するミドルウェア
 * - バリデーション失敗時は400レスポンスを返す
 * - 成功時は req.body に型付けされたデータを格納して次の処理へ
 * @param schema - Zodスキーマ（ToDo作成用など）
 * @returns Expressミドルウェア関数
 */
export const validateRequestBody =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body); //結果を success: boolean で取得

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message;
      return res.status(400).json({ message: errorMessage });
    }

    // バリデーション済みデータを req に格納（オプション）
    req.body = result.data as TodoBody;
    return next();
  };
