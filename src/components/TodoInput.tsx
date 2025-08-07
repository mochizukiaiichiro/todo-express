import { useRef } from "react";

type Props = {
    addTodo: (todoName: string) => Promise<void>;
};

export default function TodoInput({ addTodo }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        //Enterキー以外が押された場合はaddTodoの実行しない
        if (e.key !== "Enter") return;

        //空白文字列除去。inputが空白の場合はaddTodoの実行しない
        const todoName = inputRef.current?.value?.trim();
        if (!todoName) return;

        await addTodo(todoName);

        //inputをクリア
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <label>
            新しいTodoを入力
            <input ref={inputRef} onKeyDown={handleKeyDown} />
        </label>
    );
}