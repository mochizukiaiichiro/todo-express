import { addTodo, deleteTodo, getTodos, updateTodo } from '../../../../api/controllers/todosApi';
import { Todo, TodoRepository, isTodoHandlingRequest } from '../../../../types/types';
import {
  AddTodoRequestType,
  createMockDb,
  createMockRes,
  GetTodosRequestType,
} from '../../../../utils/testUtils';

describe('todosApi', () => {
  describe('getTodos()', () => {
    let mockDb: jest.Mocked<TodoRepository>;

    beforeEach(() => {
      mockDb = createMockDb();
    });

    /**
     * 正常系：
     */
    test('GET /api/todos ,getAll()を呼ぶ', () => {
      // --- 前提 ---
      mockDb.getAll.mockReturnValue([{ id: '1' } as Todo]); // 代替実装
      const req = { query: {} } as GetTodosRequestType; // リクエスト
      const res = createMockRes(); // レスポンス

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
      mockDb.getCompleted.mockReturnValue([{ id: '1' } as Todo]); //代替実装
      const req = { query: { completed: 'true' } } as GetTodosRequestType; // リクエスト
      const res = createMockRes(); // レスポンス

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
      mockDb.getCompleted.mockReturnValue([{ id: '1' } as Todo]); //代替実装
      const req = { query: { completed: 'false' } } as GetTodosRequestType; // リクエスト
      const res = createMockRes(); // レスポンス

      // --- 実行 ---
      getTodos(mockDb)(req, res);

      // --- 検証 ---
      expect(mockDb.getCompleted).toHaveBeenCalledWith(false);
      expect(mockDb.getAll).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
    });
  });

  describe('addTodo()', () => {
    let mockDb: jest.Mocked<TodoRepository>;

    beforeEach(() => {
      mockDb = createMockDb();
    });

    /**
     * 正常系：
     */
    test('POST /api/todos: todoName を登録し、201 Created を返', () => {
      // --- 前提 ---
      const req = { body: { todoName: 'test' } } as AddTodoRequestType; // リクエスト
      const res = createMockRes(); // レスポンス

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
      const req = { body: { todoName: '' } } as AddTodoRequestType; // リクエスト
      const res = createMockRes(); // レスポンス

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
    let mockDb: jest.Mocked<TodoRepository>;

    beforeEach(() => {
      mockDb = createMockDb();
    });

    /**
     * 正常系：
     */
    test('PUT /api/todos/:id/completed でupdateを実行する。200 とメッセージを返す', () => {
      // --- 前提 ---
      // リクエスト
      const req = {
        todo: { id: '1', todoName: 'test', completed: false, created_at: 0 },
      } as isTodoHandlingRequest;

      const res = createMockRes(); // レスポンス

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
      const req = {} as isTodoHandlingRequest; // リクエスト
      const res = createMockRes(); // レスポンス

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
      mockDb.update.mockReturnValue(0);

      // リクエスト
      const req = {
        todo: { id: 'non-existent-id', todoName: 'test', completed: false, created_at: 0 },
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
    let mockDb: jest.Mocked<TodoRepository>;

    beforeEach(() => {
      mockDb = createMockDb();
    });

    /**
     * 正常系：
     */
    test('DELETE /api/todos/:idでremoveを実行する。200 とメッセージを返す', () => {
      // --- 前提 ---
      // リクエスト
      const req = {
        todo: { id: '1', todoName: 'test', completed: false, created_at: 0 },
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
      mockDb.remove.mockReturnValue(0);

      // リクエスト
      const req = {
        todo: { id: 'non-existent-id', todoName: 'test', completed: false, created_at: 0 },
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
