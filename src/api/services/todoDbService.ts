import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import { Todos } from "../../types/types";

export class TodoDbService {
  private db: InstanceType<typeof Database>;

  constructor(path: string) {
    this.db = new Database(path);
    this.init();
  }

  private init() {
    this.db.exec(`
        CREATE TABLE  IF NOT EXISTS todos (
            id TEXT PRIMARY KEY, 
            title TEXT, 
            completed INTEGER -- 0 = false/未完了, 1 = true/完了
        );
    `);
  }

  /**
   * ToDoデータをDBに挿入する
   * @param title - タイトル
   */
  insert(title: string) {
    const stmt = this.db.prepare(
      "INSERT INTO todos (id,title,completed) VALUES (?,?,?)"
    );
    stmt.run(uuidv4(), title, 0);
  }

  /**
   * ToDoデータをDBから削除する
   * @param id - id
   */
  delete(id: string) {
    const stmt = this.db.prepare(`DELETE FROM todos WHERE id = ?`);
    stmt.run(id);
  }

  /**
   * ToDoデータを更新する
   * @param todo - ToDoオブジェクト
   */
  update(todo: Todos) {
    const stmt = this.db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`);
    stmt.run(+!todo.completed, todo.id);
  }

  /**
   * ToDoデータを全件取得する
   * @returns - ToDoオブジェクト配列
   */
  getAll(): Todos[] {
    return this.db.prepare("SELECT * FROM todos").all() as Todos[];
  }

  /**
   * 指定したcompletedのToDoデータを取得する
   * @returns - 指定したcompletedのToDoオブジェクト配列
   */
  getCompleted(completed: boolean): Todos[] {
    return this.db
      .prepare("SELECT * FROM todos WHERE completed = ?")
      .all(+completed) as Todos[];
  }

  /**
   * 指定したidのToDoデータを取得する
   * @returns - 指定したidのToDoオブジェクト配列
   */
  getId(id: string): Todos {
    return this.db
      .prepare("SELECT * FROM todos WHERE id = ?")
      .get(id) as Todos;
  }
}
