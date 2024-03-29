import { Throwable } from "./Throwable";
import { Awaitable } from "../utils/Awaitable";

/**
 * Function with described Input-Output
 *
 * @since 1.0.0
 * @template TInput type of input
 * @template TOutput type of output
 * @template TError type of error
 */
export type IO<TInput, TOutput, TError extends Throwable = Throwable> = (input: TInput) => TOutput | TError;

/**
 * Async function with described Input-Output
 *
 * @since 1.0.0
 * @template TInput type of input
 * @template TOutput type of output
 * @template TError type of error
 */
export type AsyncIO<TInput, TOutput, TError extends Throwable = Throwable> = (
    input: TInput
) => Awaitable<TOutput | TError>;
