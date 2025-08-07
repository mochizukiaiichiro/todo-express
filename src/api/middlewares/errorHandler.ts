import { Request, Response, NextFunction } from "express";

/**
 * 共通エラーハンドラー
 * - エラー内容をコンソールに出力し、HTTPステータスコードとメッセージを返す
 * @param err - 発生したエラーオブジェクト（statusCode, message を含む可能性あり）
 * @param req - Expressリクエストオブジェクト
 * @param res - Expressレスポンスオブジェクト
 * @param next - 次のミドルウェア関数（未使用）
 * @returns エラーレスポンス（statusCode: err.statusCode または 500）
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message });
};
