import { render, screen } from '@testing-library/react';
import PageLinks, { pages } from '../../../../components/PageLinks';
import styles from '../../../../styles/PageLinks.module.css';

describe('PageLinks', () => {
  /**
   * 正常系：
   */
  test('リンク数とテキスト・hrefが正しい', () => {
    // --- 実行 ---
    render(<PageLinks currentPage={'index'} />);
    const links = screen.getAllByRole('link');

    // --- 検証 ---
    // リンク数
    expect(links).toHaveLength(Object.keys(pages).length);

    // テキスト・hrefが正しい
    Object.entries(pages).forEach(([key, { title }], i) => {
      expect(links[i]).toHaveTextContent(title);
      expect(links[i]).toHaveAttribute('href', key === 'index' ? '/' : `/${key}`);
    });
  });

  /**
   * 正常系：
   */
  test.each(['index', 'active', 'completed'] as const)(
    'currentPage=%s のとき該当リンクだけ active クラスが付く',
    (page) => {
      render(<PageLinks currentPage={page} />);
      const links = screen.getAllByRole('link');

      links.forEach((link) => {
        if (link.getAttribute('href') === (page === 'index' ? '/' : `/${page}`)) {
          expect(link.className).toContain(styles.active);
        } else {
          expect(link.className).not.toContain(styles.active);
        }
      });
    }
  );
});
