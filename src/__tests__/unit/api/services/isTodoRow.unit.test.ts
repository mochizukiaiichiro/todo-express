import isTodoRow from '../../../../api/services/isTodoRow';

describe('isTodoRow', () => {
  /**
   * 正常系：
   */
  test('正しい Todo オブジェクトで true を返す', () => {
    // --- 前提 ---
    const value = { id: 1, todoName: 'テスト', completed: false };

    // --- 実行 ---
    const result = isTodoRow(value);

    // --- 検証 ---
    expect(result).toBe(true);
  });

  /**
   * 異常系：
   */
  test('不完全なオブジェクトで false を返す', () => {
    // --- 前提 ---
    const value = { id: 1, todoName: 'テスト' };

    // --- 実行 ---
    const result = isTodoRow(value);

    // --- 検証 ---
    expect(result).toBe(false);
  });

  /**
   * 異常系：
   */
  test('nullで false を返す', () => {
    // --- 前提 ---
    const value = null;

    // --- 実行 ---
    const result = isTodoRow(value);

    // --- 検証 ---
    expect(result).toBe(false);
  });

  /**
   * 異常系：
   */
  test('undefinedで false を返す', () => {
    // --- 前提 ---
    const value = undefined;

    // --- 実行 ---
    const result = isTodoRow(value);

    // --- 検証 ---
    expect(result).toBe(false);
  });
});
