import { IO } from "../types/IO";

/**
 * Type that represents registered case
 * @template TInput type of input value
 * @template TOutput type of output value
 */
export type Case<TInput, TOutput> = {
    value: any;
    handler: IO<TInput, TOutput>;
};

/**
 * Constant for creating exceptional/else case in match
 */
export const _ = Symbol.for("_");

/**
 * Do a pattern matching
 * @template TValue type of actual value
 * @template TOutput type of value returned from case handlers
 * @param value actual value
 * @returns function to pass cases for matching. Functions returns output of a case, or `undefined` if none of cases matched.
 */
export function match<TValue, TOutput>(value: TValue): IO<Case<TValue, TOutput>[], TOutput | undefined> {
    return (cases: Case<TValue, TOutput>[]) => {
        let elseCase: Case<TValue, TOutput> | null = null;

        // Walking
        for (const caseValue of cases) {
            // We found else case -> keep it and skip
            if (caseValue.value === _) {
                elseCase = caseValue;
                continue;
            }

            // Compare case
            if (compare(caseValue.value, value)) {
                return caseValue.handler(value);
            }
        }

        // Else case
        if (elseCase) {
            return elseCase.handler(value);
        }

        return;
    };
}

/**
 * Create case for pattern matching
 * @template TInput type of actual value
 * @template TOutput type of value returned by case handler
 * @param value value of the case. can be `"_"` to handle exceptional cases.
 * @param handler handler that returns something when actual value was same as value of the case
 * @returns case object
 */
export function is<TInput, TOutput>(value: any, handler: IO<TInput, TOutput>) {
    return {
        value,
        handler,
    } as Case<TInput, TOutput>;
}

/**
 * Compare case value and actual value.
 * Used instead of `===` because also handles situations when case value is `Option | Either | Box` for example.
 *
 * @param caseValue value of the case
 * @param actualValue actual value
 * @returns is case value equals actual value
 */
export function compare(caseValue: any, actualValue: any): boolean {
    // Class provided in case -> is value instance of class?
    if ("prototype" in caseValue) {
        return actualValue instanceof caseValue;
    }

    // Strict equality
    return caseValue === actualValue;
}
