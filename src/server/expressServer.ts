import express, { NextFunction, Request, Response } from "express";
import { TodoBody, TodoReqQuery, Todos, todoSchema } from "../types/types";
import { validate } from "../middlewares/validate";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

//初期データ
const todos: Todos[] = [
  { id: 1, title: "ネーム", completed: false },
  { id: 2, title: "下書き", completed: true },
];

export const expressServer = () => {
  // Next.js 準備完了後に Express サーバー起動
  nextApp.prepare().then(() => {
    const app = express();
    app.use(express.json());

    //一覧、true、falseデータの取得
    app.get(
      "/api/todos",
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
      "/api/todos",
      validate(todoSchema),
      (
        req: Request<
          {}, // Params:
          {}, // ResBody:
          TodoBody, // ReqBody:
          {} // ReqQuery: クエリパラメータ
        >,
        res: Response,
        next: NextFunction
      ) => {
        const { title } = req.body;
        // todoの作成
        const todo: Todos = { id: (maxId += 1), title, completed: false };
        todos.push(todo);
        return res.status(201).json(todo);
      }
    );

    // エラーハンドリングミドルウェア
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err);
      res.status(err.statusCode || 500).json({ message: err.message });
    });

    // Next.js ページのルーティングをすべてハンドル
    app.use((req, res) => {
      return handle(req, res);
    });

    const PORT = parseInt(process.env.PORT || "3000", 10);
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
    });
  });
};
