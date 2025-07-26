import z from "zod";

export type Todos = {
  id: number;
  title: string;
  completed: boolean;
};

export type TodoReqQuery = {
  completed?: "true" | "false";
};

//バリデーションスキーマの宣言
export const todoSchema = z.object({
  title: z.string().min(1, "タイトルは必須です。"), //1文字以上の文字列
});

export type TodoBody = z.infer<typeof todoSchema>;
