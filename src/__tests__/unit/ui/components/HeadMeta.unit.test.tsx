import { render, waitFor } from '@testing-library/react';
import HeadMeta from '../../../../components/HeadMeta';

// // next/headのモック
jest.mock('next/head', () => (
  { children }: { children: React.ReactNode }
) =>
  <>{children}</>
);

describe('HeadMeta', () => {
  /**
   * 正常系：
   */
  test('タイトルが head に設定される', async () => {
    // --- 実行 ---
    const test = render(<HeadMeta title='テスト' />);

    // --- 検証 ---
    expect(document.title).toBe('テスト');
  });
});
