import { Awaitable } from "../utils/Awaitable";
import { Box } from "./Box";
import { Throwable } from "./Throwable";

/**
 * Class represents a try that was failed
 *
 * @since 1.4.0
 * @template TError type of error
 */
export class Failure<TError extends Throwable> extends Box.filled<TError> {}

/**
 * Class represents a try that was successfull
 *
 * @since 1.4.0
 * @template TValue type of value
 */
export class Success<TValue> extends Box.filled<TValue> {}

/**
 * Data type that represents `Failure<TError>` or `Success<T>`
 *
 * @since 1.4.0
 * @template TError type of the error in `Failure`
 * @template TValue type of the value in `Success`
 */
export type Try<TValue, TError extends Throwable> = Failure<TError> | Success<TValue>;

/**
 * Call a function (exception-safe) to get `Failure` or `Success`
 *
 * @since 1.4.0
 * @param cb function to call
 */
export function Try<TValue, TError extends Throwable>(cb: () => TValue): Try<TValue, TError> {
    try {
        return new Success<TValue>(cb());
    } catch (e) {
        return new Failure<TError>(e as TError);
    }
}

/**
 * Call a async function (exception-safe) to get `Failure` or `Success`
 *
 * @since 1.4.0
 * @param cb function to call that is async
 */
export async function TryAsync<TValue, TError extends Throwable>(
    cb: () => Awaitable<TValue>
): Promise<Try<TValue, TError>> {
    try {
        return new Success<TValue>(await cb());
    } catch (e) {
        return new Failure<TError>(e as TError);
    }
}
