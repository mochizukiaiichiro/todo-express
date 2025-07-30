"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { TodosType } from '../types/types';

type Page = "index" | "active" | "completed";
type Pages = Record<Page, { title: string, fetchQuery: string }>
type Props = { page: Page };

// 各ページに関する情報の定義
const pages: Pages = {
    index: { title: 'すべてのToDo', fetchQuery: '' },
    active: { title: '未完了のToDo', fetchQuery: '?completed=false' },
    completed: { title: '完了したToDo', fetchQuery: '?completed=true' }
}
// CSRでページを切り替えるためのリンク
const pageLinks = Object.entries(pages).map(([page, info], index) =>
    <Link href={`/${page === 'index' ? '' : page}`} key={index} style={{ marginRight: 10 }}>
        {info.title}
    </Link>
)

// Reactコンポーネントを実装し、外部のモジュールで利用可能なようexport文で公開
export default function Todos(props: Props) {
    const { title, fetchQuery } = pages[props.page]

    // コンポーネントの状態の初期化と、propsの値に応じた更新
    const [todos, setTodos] = useState<TodosType[]>([])
    useEffect(() => {
        fetchTodos();
    }, [props.page, fetchQuery]);

    // データの取得
    const fetchTodos = async () => {
        fetch(`/api/todos${fetchQuery}`)
            .then(async res => res.ok
                ? setTodos(await res.json())
                : alert(await res.text())
            )
    };

    // データの取得関数の実行処理
    const handlePostFetch = async (res: Response) => {
        if (res.ok) {
            await fetchTodos();
        } else {
            alert(await res.text());
        }
    }

    // データの登録
    const addTodo = async (title: string) => {
        const res = await fetch("http://localhost:3000/api/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: title }),
        });
        handlePostFetch(res);
    }

    // completed更新
    const onChangeCheckbox = async (id: number) => {
        const res = await fetch(`http://localhost:3000/api/todos/${id}/completed`, {
            method: "PUT",
        });
        handlePostFetch(res);
    };

    // データ削除
    const onClickDeleteButton = async (id: number) => {
        const res = await fetch(`http://localhost:3000/api/todos/${id}`, {
            method: "DELETE",
        });
        handlePostFetch(res);
    };

    // このコンポーネントが描画するUIをJSX構文で記述して返す
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <h1>{title}</h1>
            <label>
                新しいTodoを入力
                <input onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const title = e.currentTarget.value
                    if (e.key !== 'Enter' || !title) {
                        return
                    }
                    // Enterキーが押されたらToDoを登録する
                    addTodo(title)
                    e.currentTarget.value = ''
                }} />
            </label>
            {/* ToDo一覧の表示 */}
            <ul>
                {todos.map(({ id, title, completed }) =>
                    <li key={id}>
                        <label style={completed ? { textDecoration: 'line-through' } : {}}>
                            <input
                                type="checkbox"
                                checked={completed}
                                onChange={() => onChangeCheckbox(id)}
                            />
                            {title}
                        </label>
                        <button onClick={() => onClickDeleteButton(id)}>削除</button>
                    </li>
                )}
            </ul>
            <div>{pageLinks}</div>
        </>
    )
}