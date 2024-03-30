import { Box } from "./Box";
import { Left, Right } from "./Either";

/**
 * Class represents a option that doesn't have value
 */
export class None extends Box.empty {}

/**
 * Class represents a option that has value
 *
 * @template TValue type of value
 */
export class Some<TValue> extends Box.filled<TValue> {
    /**
     * Convert to `Left<T>`
     *
     * @since 1.3.1
     */
    public get asLeft() {
        return new Left<TValue>(this.value);
    }

    /**
     * Convert to `Right<T>`
     *
     * @since 1.3.1
     */
    public get asRight() {
        return new Right<TValue>(this.value);
    }
}

/**
 * Data type that represents `None` or `Some<T>`
 *
 * @since 1.0.0
 * @template TValue type of the value in `Some`
 */
export type Option<TValue> = None | Some<TValue>;
