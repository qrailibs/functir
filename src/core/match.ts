import { IO } from "../types/IO";
import { Ctor, CtorWithArgs } from "../utils/Ctor";

/**
 * Values that can be handled by pattern matching
 *
 * @since 1.3.0
 */
type HandledCaseValue =
    | string
    | number
    | boolean
    | symbol
    | BigInt
    | null
    | undefined
    | Ctor<any>
    | CtorWithArgs<any, any>
    | RegExp;

/**
 * Type that represents registered case
 *
 * @since 1.0.0
 * @template TInput type of input value
 * @template TOutput type of output value
 */
export type Case<TInput, TOutput> = {
    value: HandledCaseValue;
    handler: IO<TInput, TOutput>;
};

/**
 * Constant for creating exceptional/else case in match
 */
export const _ = Symbol.for("_");

/**
 * Do a pattern matching
 *
 * @since 1.0.0
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
 *
 * @since 1.0.0
 * @template TInput type of actual value
 * @template TOutput type of value returned by case handler
 * @param value value of the case. can be `"_"` to handle exceptional cases.
 * @param handler handler that returns something when actual value was same as value of the case
 * @returns case object
 */
export function is<TInput, TOutput>(value: HandledCaseValue, handler: IO<TInput, TOutput>) {
    return {
        value,
        handler,
    } as Case<TInput, TOutput>;
}

/**
 * Compare case value and actual value.
 * Used instead of `===` because also handles situations when case value is `Option | Either | Box` for example.
 *
 * @since 1.0.0
 * @param caseValue value of the case
 * @param actualValue actual value
 * @returns is case value equals actual value
 */
export function compare(caseValue: any, actualValue: any): boolean {
    const type = classify(caseValue);

    // RegExp provided in case -> test value match with regexp
    if (caseValue instanceof RegExp) {
        return caseValue.test(actualValue);
    }

    // Class provided in case -> is value instance of class?
    // Makes it work with traits and basic classes
    if (type === "class") {
        return actualValue instanceof caseValue;
    }

    // Strict equality
    return caseValue === actualValue;
}

/**
 * Classify a value type
 *
 * @param val value to check
 * @returns type of value, classified
 */
function classify(val: any) {
    return typeof val === "function"
        ? val.prototype
            ? Object.getOwnPropertyDescriptor(val, "prototype")?.writable
                ? "function"
                : "class"
            : val.constructor.name === "AsyncFunction"
            ? "async"
            : "arrow"
        : "primitive";
}
