import { useRef } from 'react';
import styles from '../styles/TodoInput.module.css';

type Props = {
  addTodo: (todoName: string) => Promise<void>;
};

/**
 * 新しいToDoを入力・登録するフォームコンポーネント
 * @param addTodo - ToDo登録処理を行う関数
 * @returns JSXフォーム要素
 */
export default function TodoInput({ addTodo }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * 入力値を取得してToDoを登録する
   * - 空白の場合は登録しない
   * - 登録後は入力欄をクリア
   */
  const handleSubmit = async () => {
    //空白文字列除去。inputが空白の場合はaddTodoの実行しない
    const todoName = inputRef.current?.value?.trim();
    if (!todoName) return;

    await addTodo(todoName);

    //inputをクリア
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  /**
   * Enterキーで登録処理を実行する
   * @param e - キーボードイベント
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="todo-input">
        新しいTodoを入力
      </label>
      <input
        className={styles.input}
        id="todo-input"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        placeholder="例: 買い物に行く"
      />
      <button className={styles.button} type="button" onClick={handleSubmit}>
        登録
      </button>
    </div>
  );
}
