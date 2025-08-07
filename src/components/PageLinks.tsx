
import Link from 'next/link'
import { Pages } from '../types/types'

// 各ページの情報（タイトル: titleとAPIパス:fetchQuery）の定義
export const pages: Pages = {
    index: { title: 'すべてのToDo', fetchQuery: '' },
    active: { title: '未完了のToDo', fetchQuery: '?completed=false' },
    completed: { title: '完了したToDo', fetchQuery: '?completed=true' }
}

/**
 * ページ切替えのリンクのJSX
 * @module PageLinks
 * @return リンクJSX
 */
export default function PageLinks() {
    const pageLinks = Object.entries(pages).map(([page, info], index) =>
        <Link href={`/${page === 'index' ? '' : page}`} key={index} style={{ marginRight: 10 }}>
            {info.title}
        </Link>
    )

    return (
        <div>{pageLinks}</div>
    )
}