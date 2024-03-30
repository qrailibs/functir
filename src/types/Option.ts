import { Box } from "./Box";
import { Left, Right } from "./Either";

export class None extends Box.empty {}
export class Some<TValue> extends Box.filled<TValue> {
    public get asLeft() {
        return new Left<TValue>(this.value);
    }
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
