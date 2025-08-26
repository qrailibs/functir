import { Awaitable } from "../utils/Awaitable";
import { Box } from "./Box";
import { Throwable } from "./Throwable";

/**
 * Class represents a try that was failed
 *
 * @since 1.3.3
 * @template TError type of error
 */
export class Failure<TError extends Throwable> extends Box.filled<TError> {}

/**
 * Class represents a try that was successfull
 *
 * @since 1.3.3
 * @template TValue type of value
 */
export class Success<TValue> extends Box.filled<TValue> {}

/**
 * Data type that represents `Failure<TError>` or `Success<T>`
 *
 * @since 1.3.3
 * @template TError type of the error in `Failure`
 * @template TReturns type of the value in `Success`
 */
export type Try<TReturns, TError extends Throwable> =
    | Failure<TError>
    | Success<TReturns>;

/**
 * Call a function (exception-safe) to get `Failure` or `Success`
 *
 * @since 1.3.3
 * @param cb function to call
 */
export function Safecall<TReturns, TError extends Throwable>(
    cb: () => TReturns | TError
): Try<TReturns, TError> {
    try {
        // Run code
        const result = cb();

        // Error -> Failure
        if (result instanceof Error) return new Failure(result as TError);
        // OK -> Success
        return new Success(result);
    } catch (e) {
        // Catched error -> Failure
        return new Failure(e as TError);
    }
}

/**
 * Call a async function (exception-safe) to get `Failure` or `Success`
 *
 * @since 1.3.3
 * @param cb function to call that is async
 */
export async function SafecallAsync<TReturns, TError extends Throwable>(
    cb: () => Awaitable<TReturns | TError>
): Promise<Try<TReturns, TError>> {
    try {
        // Run code
        const result: TReturns | TError = await cb();

        // Error -> Failure
        if (result instanceof Error) return new Failure(result as TError);
        // OK -> Success
        return new Success(result);
    } catch (e) {
        // Catched error -> Failure
        return new Failure(e as TError);
    }
}
