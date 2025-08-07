import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "../../types/types";

/**
 * SQLite3 を用いた ToDo データの永続化サービス
 * - ToDo の作成・取得・更新・削除を提供
 */
export class TodoDbService {
  /** SQLite3 データベースインスタンス */
  private db: InstanceType<typeof Database>;

  /**
   * TodoDbService のコンストラクタ
   * @param path - SQLite データベースファイルのパス
   */
  constructor(path: string) {
    this.db = new Database(path);
    this.init();
  }

  /**
   * 初期化処理
   * - `todos` テーブルが存在しない場合は作成する
   * - completed は INTEGER（0=false, 1=true）として保存
   * @private
   */
  private init() {
    this.db.exec(`
        CREATE TABLE  IF NOT EXISTS todos (
            id TEXT PRIMARY KEY, 
            todoName TEXT, 
            completed INTEGER -- 0 = false/未完了, 1 = true/完了
        );
    `);
  }

  /**
   * 新しい ToDo をデータベースに挿入する
   * @param todoName - 作成する ToDo の名前
   */
  insert(todoName: string) {
    const stmt = this.db.prepare(
      "INSERT INTO todos (id,todoName,completed) VALUES (?,?,?)"
    );
    stmt.run(uuidv4(), todoName, 0);
  }

  /**
   * 指定された ID の ToDo をデータベースから削除する
   * @param id - 削除対象の ToDo の ID
   */
  delete(id: string) {
    const stmt = this.db.prepare(`DELETE FROM todos WHERE id = ?`);
    stmt.run(id);
  }

  /**
   * 指定された ToDo の completed 状態を反転して更新する
   * @param todo - 更新対象の ToDo オブジェクト
   */
  update(todo: Todo) {
    const stmt = this.db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`);
    stmt.run(+!todo.completed, todo.id);
  }

  /**
   * 全ての ToDo を取得する
   * @returns ToDo オブジェクトの配列
   */
  getAll(): Todo[] {
    return this.db.prepare("SELECT * FROM todos").all() as Todo[];
  }

  /**
   * 指定された completed 状態の ToDo を取得する
   * @param completed - 完了状態（true: 完了, false: 未完了）
   * @returns 条件に一致する ToDo オブジェクトの配列
   */
  getCompleted(completed: boolean): Todo[] {
    return this.db
      .prepare("SELECT * FROM todos WHERE completed = ?")
      .all(+completed) as Todo[];
  }

  /**
   * 指定された ID の ToDo を取得する
   * @param id - 検索対象の ToDo の ID
   * @returns 該当する ToDo オブジェクト（存在しない場合は undefined）
   */
  getId(id: string): Todo | undefined {
  const result = this.db.prepare("SELECT * FROM todos WHERE id = ?").get(id);

  // 型ガードで result が Todo 型か確認
  if (result && typeof result === "object" && "id" in result) {
    return result as Todo;
  }

    return undefined;
  }
}
