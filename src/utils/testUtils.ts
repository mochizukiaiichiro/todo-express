// test/testUtils.ts
import { Response } from 'express';
import { TodoRepository } from '../types/types';

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
