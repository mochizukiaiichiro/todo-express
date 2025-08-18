import { Database } from "better-sqlite3";

/**
 * todos テーブルの初期化処理
 * - 存在しない場合は作成
 */
export const initTodoSchema = (db: Database) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      todoName TEXT,
      completed INTEGER NOT NULL CHECK (completed IN (0,1)),
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);
};