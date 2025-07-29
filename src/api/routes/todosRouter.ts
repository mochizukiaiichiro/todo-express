import { Router } from "express";
import { getTodos, addTodo, deleteTodo } from "../controllers/todosApi";
import { todoSchema } from "../../types/types";
import { validate } from "../middlewares/validate";
import { isTodoHandler } from "../middlewares/isTodoHandler";

const router = Router();
// 指定IDのToDoの存在を検証する。存在すればTodos[]のindexをreqに付加する。
router.use("/:id", isTodoHandler);

//一覧、true、falseデータを取得する。
router.get("/", getTodos);

// データを追加する;
router.post("/", validate(todoSchema), addTodo);
// router.put("/:id/completed")                     // 指定IDのcompletedをtrueに更新
// router.delete("/:id/completed");                 // 指定IDのcompletedをfalseに更新

// 指定IDのデータを削除する。
router.delete("/:id", deleteTodo);

export default router;