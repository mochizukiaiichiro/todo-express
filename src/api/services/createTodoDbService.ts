import { dbConnection } from './dbConnection';
import { initTodoSchema } from './initSchema';
import { todoRepository } from './todoRepository';
import { TodoRepository } from '../../types/types';

/**
 * ToDo DBサービスのファクトリ関数
 * @param path - DBファイルパス（省略時は :memory:）
 * @returns TodoDbService 型の操作群
 */
export const createTodoDbService = (path?: string): TodoRepository => {
  // DB接続
  const db = dbConnection(path);

  // スキーマの初期化
  initTodoSchema(db);

  return todoRepository(db);
};
