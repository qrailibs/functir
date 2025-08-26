/**
 * This is typescript utility (shorthand).
 *
 * `Awaitable` is simple type utility, means it is a value or value that can be awaited.
 */

/**
 * Function that can be awaited (function or async function)
 *
 * @since 1.0.0
 * @template T result of function
 */
export type Awaitable<T> = T | Promise<T>;
