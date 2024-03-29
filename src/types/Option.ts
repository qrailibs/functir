import { Box } from "./Box";

export class None extends Box.empty {}
export class Some<TValue> extends Box.filled<TValue> {}

/**
 * Data type that represents `None` or `Some<T>`
 * @template TValue type of the value in `Some`
 */
export type Option<TValue> = None | Some<TValue>;
