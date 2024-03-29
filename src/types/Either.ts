import { Box } from "./Box";

export class Left<TValue> extends Box.filled<TValue> {}
export class Right<TValue> extends Box.filled<TValue> {}

/**
 * Data type that represents `Left<TLeft>` or `Right<TRight>`
 * @template TLeft type of the value in `Left`
 * @template TRight type of the value in `Right`
 */
export type Either<TLeft, TRight> = Left<TLeft> | Right<TRight>;
