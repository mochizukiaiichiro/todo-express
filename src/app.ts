import express from "express";
import next from "next";
import todosRouter from "./api/routes/todosRouter";
import { errorHandler } from "./api/middlewares/errorHandler";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  app.use(express.json());

  // APIルーティング
  app.use("/api/todos", todosRouter);

  // Next.jsのページ
  app.use((req, res) => handle(req, res));

  // エラーハンドリングミドルウェア
  app.use(errorHandler);
  
  const PORT = parseInt(process.env.PORT || "3000", 10);
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
});
