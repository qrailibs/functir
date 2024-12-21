import { Box } from "./Box";

/**
 * Class represents a option that doesn't have value
 */
export class None extends Box.empty {}

/**
 * Class represents a option that has value
 *
 * @template TValue type of value
 */
export class Some<TValue> extends Box.filled<TValue> {}

/**
 * Data type that represents `None` or `Some<T>`
 *
 * @since 1.0.0
 * @template TValue type of the value in `Some`
 */
export type Option<TValue> = None | Some<TValue>;
