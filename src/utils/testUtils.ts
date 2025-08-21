// test/testUtils.ts
import { Request, Response } from 'express';
import { TodoBody, TodoRepository, TodoReqQuery } from '../types/types';

/**
 * TodoRepository のモックを生成
 */
export const createMockDb = (): jest.Mocked<TodoRepository> => ({
  close: jest.fn(),
  insert: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  getAll: jest.fn(),
  getCompleted: jest.fn(),
  getId: jest.fn(),
});

/**
 * Express のレスポンスモックを生成
 */
export const createMockRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return res as unknown as Response<{ message: string }>;
};

/**
 * getTodosのRequestType
 */
export type GetTodosRequestType = Request<
  Record<string, never>, // パスパラメータ: 不使用（Record<string, never>は空のオブジェクト({})）
  Record<string, never>, // レスポンスボディ: 不使用
  Record<string, never>, // リクエストボディ: 不使用
  TodoReqQuery // クエリ: テストで検証したい型
>;

/**
 * addTodoのRequestType
 */
export type AddTodoRequestType = Request<
  Record<string, never>,
  Record<string, never>,
  TodoBody,
  Record<string, never>
>;
