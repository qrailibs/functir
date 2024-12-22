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
export type Try<TValue, TError extends Throwable> =
    | Failure<TError>
    | Success<TValue>;

/**
 * Call a method (exception-safe) to get `Failure` or `Success`
 */
export function Try<TValue, TError extends Throwable>(
    cb: () => TValue
): Try<TValue, TError> {
    try {
        return new Success(cb());
    } catch (e) {
        return new Failure(e as TError);
    }
}
