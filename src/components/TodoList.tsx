import { Todo } from "../types/types"
import TodoItem from './TodoItem';
import styles from '../styles/TodoList.module.css';

type Props = {
    todos: Todo[];
    onChangeCheckbox: (id: string) => Promise<void>;
    onClickDeleteButton: (id: string) => Promise<void>;
};

/**
 * ToDo一覧を表示するコンポーネント
 * - 各ToDoを TodoItem として描画
 * @param todos - 表示対象のToDo配列
 * @param onChangeCheckbox - 完了状態変更処理
 * @param onClickDeleteButton - 削除処理
 * @returns JSXリスト要素
 */
export default function TodoList(props: Props) {
    const {todos,onChangeCheckbox,onClickDeleteButton} = props;

    return (
        <ul className={styles.list}>
            {todos.map(todo =>
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onChangeCheckbox={onChangeCheckbox}
                    onClickDeleteButton={onClickDeleteButton} />
            )}
        </ul>
    );
}