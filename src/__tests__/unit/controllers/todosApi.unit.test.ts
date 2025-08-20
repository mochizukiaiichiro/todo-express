import { addTodo, deleteTodo, getTodos, updateTodo } from '../../../api/controllers/todosApi';
import { Request, Response } from 'express';
import {
  TodoReqQuery,
  Todo,
  TodoRepository,
  TodoBody,
  isTodoHandlingRequest,
} from '../../../types/types';

//レスポンス用ヘルパー関数
const createMockRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return res as unknown as Response<{ message: string }>;
};

describe('todosApi', () => {
  describe('getTodos()', () => {
    /**
     * 正常系：
     */
    test('GET /api/todos ,getAll()を呼ぶ', () => {
      // --- 前提 ---
      // 代替実装
      const mockDb: jest.Mocked<TodoRepository> = {
        close: jest.fn(),
        insert: jest.fn(),
        remove: jest.fn(),
        update: jest.fn(),
        getAll: jest.fn().mockReturnValue([{ id: '1' } as Todo]),
        getCompleted: jest.fn(),
        getId: jest.fn(),
      };

      // リクエスト
      const req = { query: {} } as Request<
        Record<string, never>, // パスパラメータ: 不使用（Record<string, never>は空のオブジェクト({})）
        Record<string, never>, // レスポンスボディ: 不使用
        Record<string, never>, // リクエストボディ: 不使用
        TodoReqQuery // クエリ: テストで検証したい型
      >;

      // レスポンス
      const res = createMockRes();

      // --- 実行 ---
      getTodos(mockDb)(req, res);

      // --- 検証 ---
      expect(mockDb.getAll).toHaveBeenCalledTimes(1);
      expect(mockDb.getCompleted).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
    });

    /**
     * 正常系：
     */
    test('GET /api/todos/completed=true指定,getCompleted()を呼ぶ', () => {
      // --- 前提 ---
      //代替実装
      const mockDb: jest.Mocked<TodoRepository> = {
        close: jest.fn(),
        insert: jest.fn(),
        remove: jest.fn(),
        update: jest.fn(),
        getAll: jest.fn(),
        getCompleted: jest.fn().mockReturnValue([{ id: '1' } as Todo]),
        getId: jest.fn(),
      };

      // リクエスト
      const req = { query: { completed: 'true' } } as Request<
        Record<string, never>, // パスパラメータ: 不使用（Record<string, never>は空のオブジェクト({})）
        Record<string, never>, // レスポンスボディ: 不使用
        Record<string, never>, // リクエストボディ: 不使用
        TodoReqQuery // クエリ: テストで検証したい型
      >;

      // レスポンス
      const res = createMockRes();

      // --- 実行 ---
      getTodos(mockDb)(req, res);

      // --- 検証 ---
      expect(mockDb.getCompleted).toHaveBeenCalledWith(true);
      expect(mockDb.getAll).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
    });

    /**
     * 正常系：
     */
    test('GET /api/todos/completed=false指定,getCompleted()を呼ぶ', () => {
      // --- 前提 ---
      //代替実装
      const mockDb: jest.Mocked<TodoRepository> = {
        close: jest.fn(),
        insert: jest.fn(),
        remove: jest.fn(),
        update: jest.fn(),
        getAll: jest.fn(),
        getCompleted: jest.fn().mockReturnValue([{ id: '1' } as Todo]),
        getId: jest.fn(),
      };

      // リクエスト
      const req = { query: { completed: 'false' } } as Request<
        Record<string, never>, // パスパラメータ: 不使用（Record<string, never>は空のオブジェクト({})）
        Record<string, never>, // レスポンスボディ: 不使用
        Record<string, never>, // リクエストボディ: 不使用
        TodoReqQuery // クエリ: テストで検証したい型
      >;

      // レスポンス
      const res = createMockRes();

      // --- 実行 ---
      getTodos(mockDb)(req, res);

      // --- 検証 ---
      expect(mockDb.getCompleted).toHaveBeenCalledWith(false);
      expect(mockDb.getAll).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
    });
  });

  describe('addTodo()', () => {
    /**
     * 正常系：
     */
    test('POST /api/todos: todoName を登録し、201 Created を返', () => {
      // --- 前提 ---
      //代替実装
      const mockDb: jest.Mocked<TodoRepository> = {
        close: jest.fn(),
        insert: jest.fn(),
        remove: jest.fn(),
        update: jest.fn(),
        getAll: jest.fn(),
        getCompleted: jest.fn(),
        getId: jest.fn(),
      };

      // リクエスト
      const req = { body: { todoName: 'test' } } as Request<
        Record<string, never>,
        Record<string, never>,
        TodoBody,
        Record<string, never>
      >;

      // レスポンス
      const res = createMockRes();

      // --- 実行 ---
      addTodo(mockDb)(req, res);

      // --- 検証 ---
      expect(mockDb.insert).toHaveBeenCalledWith('test');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Todo created' });
    });

    /**
     * 異常系：
     */
    test('POST /api/todos: "" ,todoName  が空文字の場合、400 とエラーメッセージを返す', async () => {
      // --- 前提 ---
      //代替実装
      const mockDb: jest.Mocked<TodoRepository> = {
        close: jest.fn(),
        insert: jest.fn(),
        remove: jest.fn(),
        update: jest.fn(),
        getAll: jest.fn(),
        getCompleted: jest.fn(),
        getId: jest.fn(),
      };

      // リクエスト
      const req = { body: { todoName: '' } } as Request<
        Record<string, never>,
        Record<string, never>,
        TodoBody,
        Record<string, never>
      >;

      // レスポンス
      const res = createMockRes();

      // --- 実行 ---
      await addTodo(mockDb)(req, res);

      // --- 検証 ---
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('todoName'),
        })
      );
    });
  });

  describe('updateTodo()', () => {
    /**
     * 正常系：
     */
    test('PUT /api/todos/:id/completed でupdateを実行する。200 とメッセージを返す', () => {
      // --- 前提 ---
      //代替実装
      const mockDb: jest.Mocked<TodoRepository> = {
        close: jest.fn(),
        insert: jest.fn(),
        remove: jest.fn(),
        update: jest.fn(),
        getAll: jest.fn(),
        getCompleted: jest.fn(),
        getId: jest.fn(),
      };

      // リクエスト
      const req = {
        todo: {
          id: '1',
          todoName: 'test',
          completed: false,
          created_at: 0,
        },
      } as isTodoHandlingRequest;

      // レスポンス
      const res = createMockRes();

      // --- 実行 ---
      updateTodo(mockDb)(req, res);

      // --- 検証 ---
      expect(mockDb.update).toHaveBeenCalledWith({
        id: '1',
        todoName: 'test',
        completed: false,
        created_at: 0,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Todo updated' });
    });

    /**
     * 異常系：
     */
    test('PUT /api/todos/:id/completed , req.todo が undefined の場合。400 とメッセージを返す', () => {
      // --- 前提 ---
      //代替実装
      const mockDb: jest.Mocked<TodoRepository> = {
        close: jest.fn(),
        insert: jest.fn(),
        remove: jest.fn(),
        update: jest.fn(),
        getAll: jest.fn(),
        getCompleted: jest.fn(),
        getId: jest.fn(),
      };

      // リクエスト
      const req = {} as isTodoHandlingRequest;

      // レスポンス
      const res = createMockRes();

      // --- 実行 ---
      updateTodo(mockDb)(req, res);

      // --- 検証 ---
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
      expect(mockDb.update).not.toHaveBeenCalled();
    });

    /**
     * 異常系：
     */
    test('PUT /api/todos/:id/completed ,存在しないidを指定した場合。400 とメッセージを返す', () => {
      // --- 前提 ---
      //代替実装
      const mockDb: jest.Mocked<TodoRepository> = {
        close: jest.fn(),
        insert: jest.fn(),
        remove: jest.fn(),
        update: jest.fn().mockReturnValue(0),
        getAll: jest.fn(),
        getCompleted: jest.fn(),
        getId: jest.fn(),
      };

      // リクエスト
      const req = {
        todo: {
          id: 'non-existent-id',
          todoName: 'test',
          completed: false,
          created_at: 0,
        },
      } as isTodoHandlingRequest;

      // レスポンス
      const res = createMockRes();

      // --- 実行 ---
      updateTodo(mockDb)(req, res);

      // --- 検証 ---
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
    });
  });

  describe('deleteTodo()', () => {
    /**
     * 正常系：
     */
    test('DELETE /api/todos/:idでremoveを実行する。200 とメッセージを返す', () => {
      // --- 前提 ---
      //代替実装
      const mockDb: jest.Mocked<TodoRepository> = {
        close: jest.fn(),
        insert: jest.fn(),
        remove: jest.fn(),
        update: jest.fn(),
        getAll: jest.fn(),
        getCompleted: jest.fn(),
        getId: jest.fn(),
      };

      // リクエスト
      const req = {
        todo: {
          id: '1',
          todoName: 'test',
          completed: false,
          created_at: 0,
        },
      } as isTodoHandlingRequest;

      // レスポンス
      const res = createMockRes();

      // --- 実行 ---
      deleteTodo(mockDb)(req, res);

      // --- 検証 ---
      expect(mockDb.remove).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Todo delete' });
    });

    /**
     * 異常系：
     */
    test('DELETE /api/todos/:id,存在しないidを指定した場合。400 とメッセージを返す', () => {
      // --- 前提 ---
      //代替実装
      const mockDb: jest.Mocked<TodoRepository> = {
        close: jest.fn(),
        insert: jest.fn(),
        remove: jest.fn().mockReturnValue(0),
        update: jest.fn(),
        getAll: jest.fn(),
        getCompleted: jest.fn(),
        getId: jest.fn(),
      };

      // リクエスト
      const req = {
        todo: {
          id: 'non-existent-id',
          todoName: 'test',
          completed: false,
          created_at: 0,
        },
      } as isTodoHandlingRequest;

      // レスポンス
      const res = createMockRes();

      // --- 実行 ---
      deleteTodo(mockDb)(req, res);

      // --- 検証 ---
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
    });
  });
});
