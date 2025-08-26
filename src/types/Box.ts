import { flatten } from "../core/flatten";
import { match } from "../core/match";
import { pipe } from "../core/pipe";
import { Ctor } from "../utils/Ctor";
import { Immutable } from "../utils/Immutable";

/**
 * Interface that describes empty like-a-box class
 */
export type LikeBox = {
    toString(): string;

    /**
     * Apply pattern matching on wrapped value
     */
    match: ReturnType<typeof match>;
};

/**
 * Interface that describes filled like-a-box class
 *
 * @implements LikeBox<T>
 * @template T type of a value inside
 */
export type LikeFilledBox<T> = LikeBox & {
    readonly value: T;

    /**
     * Flatten nested wrapped box values
     */
    flatten<TNested>(): TNested;

    /**
     * Apply piping on wrapped value
     */
    pipe: ReturnType<typeof pipe<T>>;
};

/**
 * Interface that describes filled like-a-box class, that is convertible into Box
 *
 * @implements LikeFilledBox<T>
 * @template T type of a value inside
 */
export type LikeConvertibleFilledBox<T> = LikeFilledBox<T> & {
    /**
     * Convert to `Box<T>`
     */
    asBox: Box<T>;
};

/**
 * Some value wrapped in a box, immutable
 *
 * @since 1.0.0
 * @implements LikeFilledBox<T>
 * @implements Immutable
 * @template TValue type of the value wrapped
 */
export class Box<TValue> implements LikeFilledBox<TValue>, Immutable {
    constructor(public readonly value: TValue) {}

    public get match() {
        return match(this);
    }
    public get pipe() {
        return pipe(this.value);
    }

    public flatten<TNested>(): TNested {
        return flatten<TNested, typeof this>(this, "value");
    }

    public copy() {
        return new Box<TValue>(this.value) as this;
    }

    /**
     * Transform wrapped value into another, immutable operation
     * @param mutator function that mutates value
     * @returns transformed value wrapped in the box
     */
    public mutate(mutator: (value: TValue) => TValue): Box<TValue> {
        return new Box<TValue>(mutator(this.value));
    }

    /**
     * Create base class like-a-box (immutable)
     * @returns `class<TValue> { value: TValue }`
     */
    public static get filled(): new <T>(
        value: T
    ) => LikeConvertibleFilledBox<T> {
        return class<TValue> {
            readonly #value: TValue;
            public get value(): TValue {
                return this.#value;
            }

            public get asBox(): Box<TValue> {
                return new Box<TValue>(this.value);
            }

            constructor(value: TValue) {
                this.#value = value;
            }

            public toString(): string {
                return `${this.constructor.name}(${String(this.value)})`;
            }

            public get match() {
                return match(this);
            }
            public get pipe() {
                return pipe(this.value);
            }

            public flatten<TNested>(): TNested {
                return flatten<TNested, typeof this>(this, "value");
            }
        } satisfies new <T>(value: T) => LikeConvertibleFilledBox<T>;
    }

    /**
     * Create base class like-a-box (empty, without value)
     * @returns `class {}`
     */
    public static get empty(): Ctor<LikeBox> {
        return class {
            constructor() {}

            public toString = (): string => {
                return `${this.constructor.name}()`;
            };

            public get match() {
                return match(this);
            }
            public get pipe() {
                return pipe(undefined);
            }
        } satisfies Ctor<LikeBox>;
    }
}
