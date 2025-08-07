import { useState } from "react";
import { Todo } from "../types/types";

/**
 * ToDoデータの取得・操作を提供するカスタムフック
 * @param fetchQuery - APIクエリ文字列（例: "?completed=true"）
 * @returns ToDo一覧と操作関数群
 */
export const useFetchUtils = (fetchQuery: string) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  /**
   * ToDo一覧をAPIから取得し、状態に反映する
   * @async
   * @returns void
   */
  const fetchTodos = async () => {
    fetch(`/api/todos${fetchQuery}`).then(async (res) =>
      res.ok ? setTodos(await res.json()) : alert(await res.text())
    );
  };

  /**
   * APIレスポンスに応じてfetchTodosを実行する共通処理
   * @param res - APIレスポンス
   * @async
   * @returns void
   */
  const handlePostFetch = async (res: Response) => {
    if (res.ok) {
      await fetchTodos();
    } else {
      alert(await res.text());
    }
  };

  /**
   * 新しいToDoをAPIに登録する
   * @param todoName - 登録するToDoの名前
   * @async
   * @returns void
   */
  const addTodo = async (todoName: string) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todoName }),
    });
    handlePostFetch(res);
  };

  /**
   * 指定したToDoのcompleted状態を更新する
   * @param id - 更新対象のToDo ID
   * @async
   * @returns void
   */
  const onChangeCheckbox = async (id: string) => {
    const res = await fetch(`/api/todos/${id}/completed`, {
      method: "PUT",
    });
    handlePostFetch(res);
  };

  /**
   * 指定したToDoを削除する
   * @param id - 削除対象のToDo ID
   * @async
   * @returns void
   */
  const onClickDeleteButton = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    handlePostFetch(res);
  };

  return {
    todos,
    setTodos,
    fetchTodos,
    handlePostFetch,
    addTodo,
    onChangeCheckbox,
    onClickDeleteButton,
  };
};
