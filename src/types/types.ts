import { Request } from "express";

import z from "zod";

export type Todo = {
  id: string;
  todoName: string;
  completed: boolean;
};

export type TodoReqQuery = {
  completed?: "true" | "false";
};

//バリデーションスキーマの宣言
export const todoSchema = z.object({
  todoName: z.string().min(1, "タイトルは必須です。"), //1文字以上の文字列
});

export type TodoBody = z.infer<typeof todoSchema>;

// isTodoHandlerミドルウェアのRequest
export type isTodoHandlerRequest = Request<{ id: string }, {}, {}, {}> & {
  todo?: Todo;
};

// isTodoHandlerのnextを受けるAPIのRequest
export type isTodoHandlingRequest = Request & { todo?: Todo };

// UI Component Types
export type Page = "index" | "active" | "completed";
export type Pages = Record<Page, { title: string; fetchQuery: string }>;
export type Props = { page: Page };
