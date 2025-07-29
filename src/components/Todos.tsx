"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'

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
    const [todos, setTodos] = useState([])
    useEffect(() => {
        fetch(`/api/todos${fetchQuery}`)
            .then(async res => res.ok
                ? setTodos(await res.json())
                : alert(await res.text())
            )
    }, [props.page, fetchQuery]);

    // completed更新
    const onChangeCheckbox = () => {
        
    };

    // データ削除
    const onClickDeleteButton = () => {
        
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
                    // Enterキーが押されたらToDoを登録する
                    const title = e.currentTarget.value
                    if (e.key !== 'Enter' || !title) {
                        return
                    }
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
                                onChange={onChangeCheckbox}
                            />
                            {title}
                        </label>
                        <button onClick={onClickDeleteButton}>削除</button>
                    </li>
                )}
            </ul>
            <div>{pageLinks}</div>
        </>
    )
}