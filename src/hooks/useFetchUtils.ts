import { useState } from "react";
import { Todo } from "../types/types";

/**
 * @module useFetchUtils
 * @description データ取得処理
 * @param fetchQuery:APIパス
 * @returns todos, setTodos, fetchTodos
 */
export const useFetchUtils = (fetchQuery: string) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  // データ取得処理
  const fetchTodos =  
    async () => {
    fetch(`/api/todos${fetchQuery}`).then(async (res) =>
      res.ok ? setTodos(await res.json()) : alert(await res.text())
    );
  };

  // データ取得実行-共通処理
  const handlePostFetch = async (res: Response) => {
    if (res.ok) {
      await fetchTodos();
    } else {
      alert(await res.text());
    }
  };

  // todoの登録
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

  // completed更新
  const onChangeCheckbox = async (id: string) => {
    const res = await fetch(`/api/todos/${id}/completed`, {
      method: "PUT",
    });
    handlePostFetch(res);
  };

  // todo削除
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
