import { render } from '@testing-library/react';
import HeadMeta from '../../../../components/HeadMeta';

// next/headのモック
jest.mock('next/head', () => ({ children }: { children: React.ReactNode }) => <>{children}</>);

describe('HeadMeta', () => {
  /**
   * 正常系：
   */
  test('タイトルが head に設定される', () => {
    // --- 実行 ---
    render(<HeadMeta title="テスト" />);

    // --- 検証 ---
    expect(document.title).toBe('テスト');
  });
});
