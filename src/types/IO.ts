import { Throwable } from "./Throwable";

/**
 * Function that can be awaited (function or async function)
 * @template T result of function
 */
export type Awaitable<T> = T | Promise<T>;

/**
 * Function with described Input-Output
 * @template TInput type of input
 * @template TOutput type of output
 * @template TError type of error
 */
export type IO<TInput, TOutput, TError extends Throwable = Throwable> = (input: TInput) => TOutput | TError;

/**
 * Async function with described Input-Output
 * @template TInput type of input
 * @template TOutput type of output
 * @template TError type of error
 */
export type AsyncIO<TInput, TOutput, TError extends Throwable = Throwable> = (
    input: TInput
) => Awaitable<TOutput | TError>;
