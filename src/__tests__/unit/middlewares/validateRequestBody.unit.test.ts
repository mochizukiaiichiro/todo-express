import { NextFunction, Request, Response } from 'express';
import { validateRequestBody } from '../../../api/middlewares/validateRequestBody';
import { TodoBody, todoSchema } from '../../../types/types';

describe('validateRequestBody', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  /**
   * 正常系：
   */
  test('バリデーション成功, next() が呼ばれ、req.body が型付けされる', () => {
    // --- 前提 ---
    mockReq.body = { todoName: 'テスト' };

    // --- 実行 ---
    validateRequestBody(todoSchema)(mockReq as Request, mockRes as Response, next as NextFunction);

    // --- 検証 ---
    expect(next).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled(); // エラー応答はしていない
    expect((mockReq.body as TodoBody).todoName).toBe('テスト'); //
  });

  /**
   * 異常系：
   */
  test('バリデーション失敗,400 とエラーメッセージを返すこと', () => {
    // --- 前提 ---
    mockReq.body = { todoName: '' };

    // --- 実行 ---
    validateRequestBody(todoSchema)(mockReq as Request, mockRes as Response, next as NextFunction);

    // --- 検証 ---
    expect(next).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'todoName is required' });
  });
});
