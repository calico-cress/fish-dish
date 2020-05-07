/**
 * 簡易ログ
 * @description `trailer.ts`でしか使わない
 */
export type SimpleLog = (prefix: string, message: string) => void;

/**
 * 配列を構成する個々の型を抽出（Union Types）
 */
export type TupleToUnion<T> = T extends (infer I)[] ? I : never;
