import { Todo } from '../../types/types';

/**
 * 指定された値が {@link Todo} 型の構造を持つかどうかを判定する型ガード関数。
 *
 * この関数は、値がオブジェクトであり、
 * `id`・`todoName`・`completed` の3つのプロパティを持っている場合に `true` を返します。
 * TypeScript の型ガード構文を利用しており、`true` が返った場合は
 * 呼び出し元のスコープで `value` が `Todo` 型として扱えるようになります。
 *
 * @param value - 判定対象の値（型は不明）
 * @returns `value` が `Todo` 型の構造を持つ場合は `true`、それ以外は `false`
 *
 * @example
 * ```ts
 * const data: unknown = { id: 1, todoName: "買い物", completed: false };
 *
 * if (isTodoRow(data)) {
 *   // ここでは data は Todo 型として扱える
 *   console.log(data.todoName);
 * }
 * ```
 */

export default function isTodoRow(value: unknown): value is Todo {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'todoName' in value &&
    'completed' in value
  );
}
