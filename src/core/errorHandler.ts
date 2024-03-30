import { AsyncIO, IO } from "../types/IO";
import { Throwable } from "../types/Throwable";

/**
 * Ignore error in value
 *
 * @since 1.3.0
 * @param value value that can be error
 * @param defaultIfError value that can be set if value was error
 * @returns value, but except error
 */
export function ignoreError<T>(value: T | Throwable, defaultIfError: T): T {
    return value instanceof Error ? defaultIfError : value;
}

/**
 * Try to call IO operation, if error thrown -> use else value
 *
 * @since 1.3.0
 * @param action IO operation
 * @param inputValue input for IO operation
 * @param elseValue value that will be used if error thrown
 * @returns result of IO operation (or else value if error thrown)
 */
export function tryOrElse<TInput, TOutput>(
    action: IO<TInput, TOutput>,
    inputValue: TInput,
    elseValue: TOutput
): TOutput {
    return ignoreError<TOutput>(action(inputValue), elseValue);
}
