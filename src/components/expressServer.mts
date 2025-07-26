import express, { NextFunction, Request, Response } from "express";

type Todos = {
  id: number;
  title: string;
  completed: boolean;
};

const todos: Todos[] = [
  { id: 1, title: "ネーム", completed: false },
  { id: 2, title: "下書き", completed: true },
];

type TodoReqQuery = {
  completed?: "true" | "false";
};

type TodoBody = { title: string };

// カスタムエラー型
class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
export const expressServer = (port: number) => {
  const app = express();
  app.use(express.json());

  //一覧、true、falseデータの取得
  app.get(
    "/",
    (
      req: Request<
        {}, // Params:
        {}, // ResBody:
        {}, // ReqBody:
        TodoReqQuery // ReqQuery: クエリパラメータ
      >,
      res: Response
    ) => {
      const { completed } = req.query;

      // http://localhost:3000/の場合
      if (!completed) {
        return res.json(todos);
      }

      // http://localhost:3000/?completed=false か falseの場合
      const isCompleted = completed === "true";
      return res.json(todos.filter((todo) => todo.completed === isCompleted));
    }
  );

  // Idの最大値の取得
  let maxId = todos.reduce((max: number, todo: Todos): number => {
    return todo.id > max ? todo.id : max;
  }, 0);

  // データの追加;
  app.post(
    "/",
    (req: Request<{}, {}, TodoBody, {}>, res: Response, next: NextFunction) => {
      const { title } = req.body;

      // titleがリクエストに含まれない場合はステータスコード400（Bad Request）
      if (typeof title !== "string" || !title) {
        const err = new HttpError("title is required", 400);
        return err;
      }

      // todoの作成
      const todo: Todos = { id: maxId + 1, title, completed: false };
      todos.push(todo);
      return res.status(201).json(todo);
    }
  );

  // エラーハンドリングミドルウェア
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  });

  app.listen(port);
};
