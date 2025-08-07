import { useEffect } from "react";
import { Props } from "../types/types";
import { useFetchUtils } from "./useFetchUtils";
import { pages } from "../components/PageLinks";

/**
 * @module useInitialize
 * @description コンポーネントの初期化
 * @param ページ名
 */
export const useInitialize = (props: Props) => {
  const { fetchQuery } = pages[props.page];
  const { fetchTodos, ...rest } = useFetchUtils(fetchQuery);

  useEffect(() => {
    fetchTodos();
  }, []);

  return rest;
};
