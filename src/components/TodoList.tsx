import { Todo } from "../types/types"
import TodoItem from './TodoItem';
import styles from '../styles/TodoList.module.css';

type Props = {
    todos: Todo[];
    onChangeCheckbox: (id: string) => Promise<void>;
    onClickDeleteButton: (id: string) => Promise<void>;
};

export default function TodoList(props: Props) {
    const {todos,onChangeCheckbox,onClickDeleteButton} = props;

    return (
        <ul className={styles.todoList}>
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