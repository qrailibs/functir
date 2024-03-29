/**
 * Function that can be awaited (function or async function)
 *
 * @since 1.0.0
 * @template T result of function
 */
export type Awaitable<T> = T | Promise<T>;
