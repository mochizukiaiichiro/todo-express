import { render, screen } from '@testing-library/react';
import TodoList from '../../../../components/TodoList';
import { Todo } from '../../../../types/types';
import * as TodoItemModule from '../../../../components/TodoItem';
describe('TodoList', () => {
  describe('TodoList / TodoItem呼び出し確認（spyOn）', () => {
    /**
     * 正常系：
     */
    test('TodoItemが呼び出される', () => {
      // --- 前提 ---
      const todos: Todo[] = [{ id: '1', todoName: '未完了', completed: false, created_at: 12 }];
      const spy = jest.spyOn(TodoItemModule, 'default');

      // --- 実行 ---
      render(
        <TodoList todos={todos} onChangeCheckbox={jest.fn()} onClickDeleteButton={jest.fn()} />
      );

      // --- 検証 ---
      expect(spy).toHaveBeenCalledTimes(1); //呼び出し回数

      // propsの一部確認
      // 1回目の呼び出しの第1引数(props)だけを取り出す
      const [[props]] = (spy as jest.Mock).mock.calls;
      expect(props).toEqual(
        expect.objectContaining({
          todo: todos[0],
          onChangeCheckbox: expect.any(Function),
          onClickDeleteButton: expect.any(Function),
        })
      );
      spy.mockRestore();
    });
  });

  describe('TodoList（spyOn + mockImplementation）', () => {
    test('TodoItem が呼び出される', () => {
      // 実装を差し替え
      const spy = jest
        .spyOn(TodoItemModule, 'default')
        .mockImplementation(() => <li data-testid="mock-todo-item" />);

      const todos: Todo[] = [
        { id: '1', todoName: '未完了', completed: false, created_at: 12 },
        { id: '2', todoName: '完了済み', completed: true, created_at: 34 },
      ];

      render(
        <TodoList todos={todos} onChangeCheckbox={jest.fn()} onClickDeleteButton={jest.fn()} />
      );

      // 呼び出し回数を確認
      expect(spy).toHaveBeenCalledTimes(2);

      // propsの一部確認
      // 1回目の呼び出しの第1引数(props)だけを取り出す
      const [[props]] = (spy as jest.Mock).mock.calls;
      expect(props).toEqual(
        expect.objectContaining({
          todo: todos[0],
          onChangeCheckbox: expect.any(Function),
          onClickDeleteButton: expect.any(Function),
        })
      );

      // DOMにもモックが出ているか確認
      expect(screen.getAllByTestId('mock-todo-item')).toHaveLength(todos.length);
      spy.mockRestore();
    });
  });
});
