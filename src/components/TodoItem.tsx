import { Todo } from "../types/types"
import styles from '../styles/TodoItem.module.css';

type Props = {
    todo: Todo;
    onChangeCheckbox: (id: string) => Promise<void>;
    onClickDeleteButton: (id: string) => Promise<void>;
};

/**
 * 単一のToDo項目を表示するコンポーネント
 * - チェックボックスで完了状態を切り替え
 * - 削除ボタンでToDoを削除
 * @param todo - 表示対象のToDoオブジェクト
 * @param onChangeCheckbox - 完了状態変更処理
 * @param onClickDeleteButton - 削除処理
 * @returns JSXリストアイテム
 */
export default function TodoItem({ todo, onChangeCheckbox, onClickDeleteButton }: Props) {
    const { id, todoName, completed } = todo

    return (
        <>
            <li className={styles.todoItem}>
                <input
                    className={styles.input}
                    id={`todo-${id}`}
                    type="checkbox"
                    checked={completed}
                    onChange={() => onChangeCheckbox(id)}
                />
                <label
                    className={`${styles.label} ${completed ? styles.completedLabel : ''}`}
                    htmlFor={`todo-${id}`}
                >
                    {todoName}
                </label>
                <button
                    className={styles.button}
                    onClick={() => onClickDeleteButton(id)}
                >削除
                </button>
            </li>
        </>);
}