import { Router } from "express";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todosApi";
import { todoSchema } from "../../types/types";
import { validateRequestBody } from "../middlewares/validateRequestBody";
import { isTodoHandler } from "../middlewares/isTodoHandler";
import { createTodoDbService } from "../services/createTodoDbService";

const router = Router();
const db = createTodoDbService("src/api/services/todo-express-db.sqlite3");

// 指定IDのToDoの存在を検証
router.use("/:id", isTodoHandler(db));

//一覧、true、falseデータを取得
router.get("/", getTodos(db));

// データを追加。validateRequestBody:Zodスキーマに基づいたリクエストボディの検証
router.post("/", validateRequestBody(todoSchema), addTodo(db));

// 指定IDのcompletedの更新
router.put("/:id/completed", updateTodo(db));

// 指定IDのデータを削除
router.delete("/:id", deleteTodo(db));

export default router;
