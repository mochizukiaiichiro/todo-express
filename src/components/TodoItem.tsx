import { Todo } from "../types/types"
import styles from '../styles/TodoItem.module.css';

type Props = {
    todo: Todo;
    onChangeCheckbox: (id: string) => Promise<void>;
    onClickDeleteButton: (id: string) => Promise<void>;
};

export default function TodoItem({ todo, onChangeCheckbox, onClickDeleteButton }: Props) {
    const { id, todoName, completed } = todo

    return (
        <li className={`${styles.todoItem} ${completed ? styles.completed : ''}`}>
            <input
                id={`todo-${id}`}
                type="checkbox"
                checked={completed}
                onChange={() => onChangeCheckbox(id)}
            />
            <label htmlFor={`todo-${id}`} style={completed ? { textDecoration: 'line-through' } : {}}>
                {todoName}
            </label>
            <button onClick={() => onClickDeleteButton(id)}>削除</button>
        </li>
    );
}