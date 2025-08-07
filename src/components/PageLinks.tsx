
import Link from 'next/link'
import { Pages } from '../types/types'
import styles from "../styles/PageLinks.module.css"

/**
 * 各ページの情報（タイトルとAPIクエリ）を定義するオブジェクト
 */
export const pages: Pages = {
    index: { title: 'すべてのToDo', fetchQuery: '' },
    active: { title: '未完了のToDo', fetchQuery: '?completed=false' },
    completed: { title: '完了したToDo', fetchQuery: '?completed=true' }
}

type Props = {
    currentPage: keyof typeof pages;
};

/**
 * ページ切り替えリンクを表示するナビゲーションコンポーネント
 * @param currentPage - 現在表示中のページキー（index, active, completed）
 * @returns JSXナビゲーションリンク群
 */
export default function PageLinks({ currentPage }: Props) {
    return (
        <nav className={styles.nav}>
            {Object.entries(pages).map(([key, { title }]) =>
                <Link
                    key={key}
                    href={`/${key === 'index' ? '' : key}`}
                    className={`${styles.link} ${currentPage === key ? styles.active : ''}`}
                >
                    {title}
                </Link>
            )}
        </nav>
    );
}