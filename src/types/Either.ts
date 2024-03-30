import { Box } from "./Box";

export class Left<TValue> extends Box.filled<TValue> {
    public get asRight() {
        return new Right<TValue>(this.value);
    }
}
export class Right<TValue> extends Box.filled<TValue> {
    public get asLeft() {
        return new Left<TValue>(this.value);
    }
}

/**
 * Data type that represents `Left<TLeft>` or `Right<TRight>`
 *
 * @since 1.0.0
 * @template TLeft type of the value in `Left`
 * @template TRight type of the value in `Right`
 */
export type Either<TLeft, TRight> = Left<TLeft> | Right<TRight>;
