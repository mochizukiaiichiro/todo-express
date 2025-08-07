"use client"
import { Props } from '../types/types';
import { useInitialize } from '../hooks/useInitialize';
import HeadMeta from './HeadMeta';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import PageLinks, { pages } from "./PageLinks"

// Reactコンポーネントを実装し、外部のモジュールで利用可能なようexport文で公開
export default function TodoPage(props: Props) {
    const { title } = pages[props.page]
    const { todos, addTodo, onChangeCheckbox, onClickDeleteButton } = useInitialize(props);
(id: string) => Promise<void>
    return (
        <>
            <HeadMeta title={title}/>
            <h1>{title}</h1>
            {/* Todoの入力 */}
            <TodoInput addTodo={addTodo} />
            {/* ToDo一覧の表示 */}
            <TodoList
                todos={todos}
                onChangeCheckbox={onChangeCheckbox}
                onClickDeleteButton={onClickDeleteButton} />
            {/* ページリンクの表示 */}
            <PageLinks />
        </>
    )
}