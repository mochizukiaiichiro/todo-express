import { Router } from "express";
import { getTodos, addTodo } from "../controllers/todos";
import { todoSchema } from "../../types/types";
import { validate } from "../middlewares/validate";

const router = Router();

router.get("/", getTodos);                          //一覧、true、falseデータの取得
router.post("/", validate(todoSchema), addTodo);    // データの追加;

export default router;
