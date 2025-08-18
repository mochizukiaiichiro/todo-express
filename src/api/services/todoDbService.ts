import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import { Todo, TodoDbService, TodoRow } from "../../types/types";
import isTodoRow from "./isTodoRow";

/**
 * SQLite3 を用いた ToDo データの永続化サービス
 * - ToDo の作成・取得・更新・削除を提供
 */
export const todoDbService = (path: string = ":memory:"): TodoDbService => {
  /** SQLite3 データベースインスタンス */
  const db = new Database(path);

  /**
   * 初期化処理
   * - `todos` テーブルが存在しない場合は作成する
   * - completed は INTEGER（0=false, 1=true）として保存
   */
  const init = () => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        todoName TEXT,
        completed INTEGER NOT NULL CHECK (completed IN (0,1)),
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
    `);
  };
  init();

  /**
   * データベース接続を閉じます。
   * @throws {Error} 接続のクローズ処理中にエラーが発生した場合
   */
  const close = () => {
    db.close();
  };

  /**
   * TODO を1件挿入し、生成した ID と変更件数を返します。
   *
   * - UUID で一意な ID を生成し、todos テーブルに INSERT します。
   * - completed は常に false（0）で初期化します。
   *
   * @param {string} todoName - 登録する TODO の名称。
   * @returns {{ id: string, changes: number }} 生成した ID と、変更件数（通常は 1）。
   * @throws {Error} データベース操作（prepare/run）が失敗した場合にスローされます。
   */
  const insert = (todoName: string) => {
    const id = uuidv4();
    const completed = false;
    const res = db
      .prepare("INSERT INTO todos (id,todoName,completed) VALUES (?,?,?)")
      .run(id, todoName, Number(completed)); //Number(completed) true → 1, false → 0

    return { id, changes: res.changes };
  };

  /**
   * 指定されたIDのToDoをデータベースから削除します。
   *
   * @param {string} id - 削除対象のToDoのID
   * @returns {number} 削除によって変更された行数（削除成功時は通常1、該当レコードなしの場合は0）
   *
   * @throws {Error} データベース操作中にエラーが発生した場合
   */
  const remove = (id: string) => {
    return db.prepare(`DELETE FROM todos WHERE id = ?`).run(id).changes;
  };

  /**
   * 指定された Todo の完了状態を反転し、データベースに保存します。
   *
   * @param {Todo} todo - 更新対象の Todo オブジェクト。
   *   - `id` は既存レコードの ID である必要があります。
   *   - `completed` は現在の完了状態。更新時にこの値が反転されます。
   *
   * @returns {number} 更新されたレコード数。
   *   - 通常は 1（更新成功）または 0（該当レコードなし）。
   *
   * @throws {Error} データベース更新処理に失敗した場合。
   */
  const update = (todo: Todo) => {
    const res = db
      .prepare(`UPDATE todos SET completed = ? WHERE id = ?`)
      .run(Number(!todo.completed), todo.id);

    return res.changes;
  };

  /**
   * すべてのToDo項目を取得します。
   *
   * `todos` テーブルから全レコードを取得し、
   * `completed` フィールド（数値 0/1）を boolean 型に変換して返します。
   *
   * @returns {Todo[]} 変換済みの全ToDoデータ配列
   *
   * @throws {Error} データベース操作中にエラーが発生した場合
   */
  const getAll = (): Todo[] => {
    const rows = db.prepare("SELECT * FROM todos").all() as TodoRow[];
    return rows.map((r) => ({
      ...r,
      completed: Boolean(r.completed),
    })) as Todo[];
  };

  /**
   * 指定された完了状態（`completed`）に一致する Todo を取得します。
   *
   * @param {boolean} completed - 取得対象とする完了状態。
   *   - `true` の場合: 完了済みの Todo を取得
   *   - `false` の場合: 未完了の Todo を取得
   * @returns {Todo[]} 完了状態を変換済み（数値→真偽値）の Todo オブジェクト配列。
   *
   *  * @remarks
   * - DBの `completed` カラムは数値(0/1)で保持されるため、返却時に boolean に変換しています。
   */
  const getCompleted = (completed: boolean): Todo[] => {
    const rows = db
      .prepare("SELECT * FROM todos WHERE completed = ?")
      .all(Number(completed)) as Array<TodoRow>; //Number(completed) true → 1, false → 0

    return rows.map((r) => ({
      ...r,
      completed: Boolean(r.completed),
    })) as Todo[];
  };

  /**
   * 指定IDの Todo を取得する。
   *
   * @param {string} id - 検索対象の Todo ID
   * @returns {Todo|undefined} 該当する Todo。存在しない場合は undefined を返す。
   */
  const getId = (id: string): Todo | undefined => {
    const result = db.prepare("SELECT * FROM todos WHERE id = ?").get(id);
    // 型ガードで result が Todo 型か確認
    if (isTodoRow(result)) {
      return {
        ...result,
        completed: Boolean(result.completed),
      };
    }

    return undefined;
  };
  // 関数群をオブジェクトとして返す
  return {
    close,
    insert,
    remove,
    update,
    getAll,
    getCompleted,
    getId,
  };
};
