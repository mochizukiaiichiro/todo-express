import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body); //結果を success: boolean で取得

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message;
      return res.status(400).json({ message: errorMessage });
    }

    // バリデーション済みデータを req に格納（オプション）
    req.body = result.data;
    return next();
  };
