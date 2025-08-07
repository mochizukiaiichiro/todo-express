"use client"
import { Props } from '../types/types';
import { useInitialize } from '../hooks/useInitialize';
import HeadMeta from './HeadMeta';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import PageLinks, { pages } from "./PageLinks"
import styles from "../styles/TodoPage.module.css"

/**
 * ToDo管理アプリケーションのメインページコンポーネント
 * - ページに応じたToDo一覧を表示
 * - 入力・削除・完了切り替え機能を提供
 * @param props - ページ情報（pageキー）
 * @returns JSXページ構成
 */
export default function TodoPage(props: Props) {
    const { title } = pages[props.page]
    const { todos, addTodo, onChangeCheckbox, onClickDeleteButton } = useInitialize(props);
    (id: string) => Promise<void>
    return (
        <div className={styles.page}>
            <HeadMeta title={title} />
            <h1 className={styles.title}>ToDo管理アプリケーション</h1>

            {/* Todoの入力 */}
            <div className={styles.section}>
                <TodoInput addTodo={addTodo} />
            </div>

            {/* ページリンクの表示 */}
            <div className={styles.section}>
                <PageLinks currentPage={props.page} />
            </div>

            {/* ToDo一覧の表示 */}
            <div className={styles.section}>
                <TodoList
                    todos={todos}
                    onChangeCheckbox={onChangeCheckbox}
                    onClickDeleteButton={onClickDeleteButton} />
            </div>
        </div>
    )
}