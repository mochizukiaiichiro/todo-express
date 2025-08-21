import { Request, Response } from 'express';
import { errorHandler } from '../../../api/middlewares/errorHandler';
import { CustomError } from '../../../types/types';

describe('errorHandler', () => {
  let err: CustomError;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    err = { name: 'テストname', message: 'テストmessage' };

    mockReq = {};

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    // console.error をスパイ化（元の動作は抑制）
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // スパイを解除して console.error を元に戻す
    consoleErrorSpy.mockRestore();
  });

  /**
   * 正常系：
   */
  test('errにstatusCodeがある場合', () => {
    // --- 前提 ---
    err.statusCode = 404;

    // --- 実行 ---
    errorHandler(err, mockReq as Request, mockRes as Response, next);

    // --- 検証 ---
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'テストmessage' });
  });

  /**
   * 正常系：
   */
  test('errにstatusCodeが無い場合。500 を返す', () => {
    // --- 実行 ---
    errorHandler(err, mockReq as Request, mockRes as Response, next);

    // --- 検証 ---
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'テストmessage' });
  });
});
