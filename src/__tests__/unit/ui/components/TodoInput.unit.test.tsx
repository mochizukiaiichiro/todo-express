import { render, screen } from '@testing-library/react';
import TodoInput from '../../../../components/TodoInput';
import userEvent from '@testing-library/user-event';

describe('TodoInput', () => {
  describe('登録ボタンのクリックの確認', () => {
    /**
     * 正常系：
     */
    test('Todo（todoName）に値がある場合、addTodoが実行される', async () => {
      // --- 前提 ---
      const addTodo = jest.fn();

      // --- 実行 ---
      render(<TodoInput addTodo={addTodo} />);
      // 入力欄に値を入力
      const input = screen.getByPlaceholderText('例: 買い物に行く');
      await userEvent.type(input, 'テスト');
      // 登録ボタンのクリック
      await userEvent.click(screen.getByRole('button', { name: '登録' }));

      // --- 検証 ---
      expect(addTodo).toHaveBeenCalledTimes(1);
      expect(addTodo).toHaveBeenCalledWith('テスト');
    });

    /**
     * 正常系：
     */
    test('Todo（todoName）が空白の場合、addTodoが実行されない', async () => {
      // --- 前提 ---
      const addTodo = jest.fn();

      // --- 実行 ---
      render(<TodoInput addTodo={addTodo} />);
      // 登録ボタンのクリック
      await userEvent.click(screen.getByRole('button', { name: '登録' }));

      // --- 検証 ---
      expect(addTodo).toHaveBeenCalledTimes(0);
    });
  });

  describe('Enterキーで登録の確認', () => {
    /**
     * 正常系：
     */
    test('Todo（todoName）に値がある場合、addTodoが実行される', async () => {
      // --- 前提 ---
      const addTodo = jest.fn();

      // --- 実行 ---
      render(<TodoInput addTodo={addTodo} />);
      // 値を入力
      const input = screen.getByPlaceholderText('例: 買い物に行く');
      await userEvent.type(input, 'テスト');
      // Enterキー押下
      await userEvent.keyboard('{Enter}');

      // --- 検証 ---
      expect(addTodo).toHaveBeenCalledTimes(1);
    });

    /**
     * 正常系：
     */
    test('Todo（todoName）が空白の場合、addTodoが実行されない', async () => {
      // --- 前提 ---
      const addTodo = jest.fn();

      // --- 実行 ---
      render(<TodoInput addTodo={addTodo} />);
      // Enterキー押下
      await userEvent.keyboard('{Enter}');

      // --- 検証 ---
      expect(addTodo).toHaveBeenCalledTimes(0);
    });
  });

  describe('登録後の入力欄のクリア', () => {
    test('登録後に入力欄が空になる', async () => {
      const addTodo = jest.fn();
      render(<TodoInput addTodo={addTodo} />);

      // 値を入力して登録
      const input = screen.getByPlaceholderText('例: 買い物に行く') as HTMLInputElement;
      await userEvent.type(input, 'パンを買う');
      await userEvent.click(screen.getByRole('button', { name: '登録' }));

      // クリアされていることを確認
      expect(input.value).toBe('');
    });
  });
});
