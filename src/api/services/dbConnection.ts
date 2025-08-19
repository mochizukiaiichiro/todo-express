import Database from 'better-sqlite3';

/**
 * SQLite3 データベース接続を生成する
 * @param path - DBファイルパス（省略時は :memory:）
 * @returns Database インスタンス
 */
export const dbConnection = (path: string = ':memory:') => {
  return new Database(path);
};
