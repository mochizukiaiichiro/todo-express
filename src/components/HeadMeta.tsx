import Head from 'next/head';

type Props = {
  title: string;
};

/**
 * ページの `<head>` にタイトルを設定するコンポーネント
 * @param title - ページタイトル
 * @returns Head要素（titleタグを含む）
 */
export default function HeadMeta({ title }: Props) {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}
