import { TodosType } from "../../types/types";

//初期データ
export const todosData:TodosType[] = [
  { id: 1, title: "ネーム", completed: false },
  { id: 2, title: "下書き", completed: true },
];

// Idの最大値の取得
export const getMaxId = () => {
  return todosData.reduce((max: number, todo: TodosType): number => {
    return Math.max(max, todo.id);
  }, 0);
};
