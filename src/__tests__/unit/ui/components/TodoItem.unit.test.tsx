import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from '../../../../components/TodoItem';
import { Todo } from '../../../../types/types';

describe('TodoItem', () => {
	const todo: Todo = { id: '1', todoName: '未完了', completed: false, created_at: 12 };

	/**
	 * 正常系：
	 */
	test('todoName が表示される', () => {
		// --- 実行 ---
		render(
			<TodoItem
				todo={todo}
				onChangeCheckbox={jest.fn()}
				onClickDeleteButton={jest.fn()}
			/>
		);

		// --- 検証 ---
		expect(screen.getByText('未完了')).toBeInTheDocument();
	});

	/**
	 * 正常系：
	 */
	test('チェックボックス変更でonChangeCheckboxが呼ばれる', async () => {
		// --- 前提 ---
		const onChangeCheckbox = jest.fn();

		// --- 実行 ---
		render(
			<TodoItem
				todo={todo}
				onChangeCheckbox={onChangeCheckbox}
				onClickDeleteButton={jest.fn()}
			/>
		);

		await userEvent.click(screen.getByRole('checkbox'));

		// --- 検証 ---
		expect(onChangeCheckbox).toHaveBeenCalledWith('1');

	});

	/**
	 * 正常系：
	 */
	test('削除ボタン押下でonClickDeleteButtonが呼ばれる', async () => {
		// --- 前提 ---
		const onClickDeleteButton = jest.fn();

		// --- 実行 ---
		render(
			<TodoItem
				todo={todo}
				onChangeCheckbox={jest.fn()}
				onClickDeleteButton={onClickDeleteButton}
			/>
		);

		await userEvent.click(screen.getByRole('button', { name: '削除' }));

		// --- 検証 ---
		expect(onClickDeleteButton).toHaveBeenCalledWith('1');

	});

	/**
 * 正常系：
 */
	test('未完了の場合（completed=false のとき） completedLabel クラスが付与される', () => {
		// --- 実行 ---
		render(
			<TodoItem
				todo={todo}
				onChangeCheckbox={jest.fn()}
				onClickDeleteButton={jest.fn()}
			/>
		);

		// --- 検証 ---
		const label = screen.getByText('未完了');
		expect(label).not.toHaveClass('completedLabel');
	});

	/**
	 * 正常系：
	 */
	test('完了済みの場合（completed=true のとき） completedLabel クラスが付与される', () => {
		// --- 前提 ---
		const todo: Todo = { id: '2', todoName: '完了済み', completed: true, created_at: 34 };

		// --- 実行 ---
		render(
			<TodoItem
				todo={todo}
				onChangeCheckbox={jest.fn()}
				onClickDeleteButton={jest.fn()}
			/>
		);

		// --- 検証 ---
		const label = screen.getByText('完了済み');
		expect(label).toHaveClass('completedLabel');
	});

});
