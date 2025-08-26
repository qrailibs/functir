import { CtorWithArgs } from "../utils/Ctor";

/**
 * Type for the things that can be error.
 *
 * @since 1.0.0
 */
export type Throwable = Error;

/**
 * Create a trait class for throwable (construct error class)
 *
 * @since 1.0.0
 * @param errorName name of the error class
 * @returns class of the error (`Throwable`)
 */
export function ThrowableTrait(
    errorName: string,
    _message?: string
): CtorWithArgs<Throwable, [string?]> {
    return class extends Error {
        constructor(message: string = _message ?? errorName) {
            super(message);

            this.name = errorName;
        }
    };
}
