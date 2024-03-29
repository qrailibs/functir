import { IO } from "../types/IO";
import { Throwable, ThrowableTrait } from "../types/Throwable";

/**
 * Error that happens when pipe() is called with no pipe functions
 */
export class PipeEmptyError extends ThrowableTrait("PipeEmptyError", "Failed to pipe(), pipe functions was empty") {}

/**
 * Do a piping flow
 *
 * @since 1.0.0
 * @template TInput type of input data in pipe
 * @template TOutput type of data returned by pipe functions
 * @param value value passed to a first pipe function
 * @returns function to pass pipe functions. Returns result of last pipe function
 */
export function pipe<TValue, TError extends Throwable = Throwable>(
    value: TValue
): IO<IO<TValue, TValue, TError>[], TValue, PipeEmptyError | Throwable> {
    return (functions: IO<TValue, TValue, TError>[]) => {
        // Empty -> error
        if (functions.length === 0) {
            return new PipeEmptyError();
        }

        let currentValue: TValue = value;

        // Execute every pipe function
        for (const pipeFn of functions) {
            const result = pipeFn(currentValue);

            // Error -> stop pipe, return error
            if (result instanceof Error) return result;
            // Ok -> continue
            else currentValue = result;
        }

        return currentValue;
    };
}
