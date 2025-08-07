import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "../../types/types";

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
            todoName TEXT, 
            completed INTEGER -- 0 = false/未完了, 1 = true/完了
        );
    `);
  }

  /**
   * ToDoデータをDBに挿入する
   * @param todoName - todo名
   */
  insert(todoName: string) {
    const stmt = this.db.prepare(
      "INSERT INTO todos (id,todoName,completed) VALUES (?,?,?)"
    );
    stmt.run(uuidv4(), todoName, 0);
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
  update(todo: Todo) {
    const stmt = this.db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`);
    stmt.run(+!todo.completed, todo.id);
  }

  /**
   * ToDoデータを全件取得する
   * @returns - ToDoオブジェクト配列
   */
  getAll(): Todo[] {
    return this.db.prepare("SELECT * FROM todos").all() as Todo[];
  }

  /**
   * 指定したcompletedのToDoデータを取得する
   * @returns - 指定したcompletedのToDoオブジェクト配列
   */
  getCompleted(completed: boolean): Todo[] {
    return this.db
      .prepare("SELECT * FROM todos WHERE completed = ?")
      .all(+completed) as Todo[];
  }

  /**
   * 指定したidのToDoデータを取得する
   * @returns - 指定したidのToDoオブジェクト配列
   */
  getId(id: string): Todo {
    return this.db.prepare("SELECT * FROM todos WHERE id = ?").get(id) as Todo;
  }
}
