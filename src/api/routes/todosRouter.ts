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

const router = Router();
// 指定IDのToDoの存在を検証
router.use("/:id", isTodoHandler);

//一覧、true、falseデータを取得
router.get("/", getTodos);

// データを追加。validateRequestBody:Zodスキーマに基づいたリクエストボディの検証
router.post("/", validateRequestBody(todoSchema), addTodo);

// 指定IDのcompletedの更新
router.put("/:id/completed", updateTodo);

// 指定IDのデータを削除
router.delete("/:id", deleteTodo);

export default router;
