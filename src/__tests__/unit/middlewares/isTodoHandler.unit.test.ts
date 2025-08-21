import { NextFunction, Response } from 'express';
import { isTodoHandlerRequest, Todo, TodoRepository } from '../../../types/types';
import { createMockDb } from '../../../utils/testUtils';
import { isTodoHandler } from '../../../api/middlewares/isTodoHandler';

describe('isTodoHandler ', () => {
  let mockDb: jest.Mocked<TodoRepository>;
  let mockReq: isTodoHandlerRequest;
  let mockRes: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    mockDb = createMockDb();

    mockReq = { params: { id: '1' } } as unknown as isTodoHandlerRequest;

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  /**
   * 正常系：
   * - DB に ToDo が存在
   * - req.todo にセットされ next() が呼ばれる
   */
  test('DB に ToDo が存在する場合。req.todo にセットし next() を呼び出すケース', () => {
    // --- 前提 ---
    const todo = { id: '1', todoName: 'テスト', completed: false, created_at: 0 };
    mockDb.getId.mockReturnValue(todo);

    // --- 実行 ---
    isTodoHandler(mockDb)(mockReq, mockRes as Response, next as NextFunction);

    // --- 検証 ---
    expect(next).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled(); // エラー応答はしていない
    expect((mockReq.todo as Todo).todoName).toBe('テスト'); //
  });

  /**
   * 異常系：
   * - DB に ToDo が存在しない
   * - 404 を返し next() は呼ばれない
   */
  test('DB に ToDo が存在しない場合。 404 を返す', () => {
    // --- 前提 ---
    mockDb.getId.mockReturnValue(undefined);

    // --- 実行 ---
    isTodoHandler(mockDb)(mockReq, mockRes as Response, next as NextFunction);

    // --- 検証 ---
    expect(next).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'isTodoHandler / ToDo not found' });
  });
});
