import { CtorWithArgs } from "./Ctor";

/**
 * Type for the things that can be error. Of course immutable
 */
export type Throwable = Error;

/**
 * Create a trait class for throwable (construct error class)
 * @param errorName name of the error class
 * @returns class of the error (`Throwable`)
 */
export function ThrowableTrait(errorName: string): CtorWithArgs<Throwable, [string]> {
    return class extends Error {
        constructor(message: string) {
            super(message);
            this.name = errorName;
        }
    };
}
