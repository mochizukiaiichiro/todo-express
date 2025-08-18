import { Request } from "express";

import z from "zod";

export type Todo = {
  id: string;
  todoName: string;
  completed: boolean;
  created_at: number;
};

export type TodoRow = {
  id: string;
  todoName: string;
  completed: number;
  created_at: number;
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

// todoDbService
export type TodoDbService = {
  /** DB接続を閉じる */
  close: () => void;

  /** 新しいToDoを追加する */
  insert: (todoName: string) => { id: string; changes: number };

  /** 指定IDのToDoを削除する */
  remove: (id: string) => number;

  /** 指定ToDoのcompleted状態を反転する */
  update: (todo: Todo) => number;

  /** 全ToDoを取得する */
  getAll: () => Todo[];

  /** completed状態で絞り込んで取得する */
  getCompleted: (completed: boolean) => Todo[];

  /** 指定IDのToDoを取得する（存在しない場合はundefined） */
  getId: (id: string) => Todo | undefined;
};