import Head from 'next/head';

type Props = {
  title: string;
};

export default function HeadMeta({ title }: Props) {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}