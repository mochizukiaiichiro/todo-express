import { useEffect } from 'react';
import { Props } from '../types/types';
import { useFetchUtils } from './useFetchUtils';
import { pages } from '../components/PageLinks';

/**
 * ページに応じた初期化処理を行うカスタムフック
 * - 初回レンダリング時にToDo一覧を取得
 * @param props - ページ情報（page名を含む）
 * @returns useFetchUtilsの返却値（todos, 操作関数群）
 */
export const useInitialize = (props: Props) => {
  const { fetchQuery } = pages[props.page];
  const { fetchTodos, ...rest } = useFetchUtils(fetchQuery);

  useEffect(() => {
    fetchTodos();
  }, []);

  return rest;
};
