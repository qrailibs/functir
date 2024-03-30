import { flatten } from "../core/flatten";
import { match } from "../core/match";
import { pipe } from "../core/pipe";
import { Ctor } from "../utils/Ctor";
import { Left, Right } from "./Either";
import { Immutable } from "../utils/Immutable";
import { Some } from "./Option";

/**
 * Interface that describes empty like-a-box class
 */
export type LikeBox = {
    toString(): string;

    /**
     * Apply pattern matching on wrapped value
     */
    match: ReturnType<typeof match>;
    /**
     * Apply piping on wrapped value
     */
    pipe: ReturnType<typeof pipe<any, any>>;
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
    public readonly value: TValue;

    constructor(value: TValue) {
        this.value = value;
    }

    public match = match(this);
    public pipe() {
        return pipe(this.value);
    }

    public flatten<TNested>(): TNested {
        return flatten<TNested, typeof this>(this, "value");
    }

    public copy() {
        return new Box<TValue>(this.value) as this;
    }

    /**
     * Convert to `Some<T>`
     *
     * @since 1.3.1
     */
    public get asSome() {
        return new Some<TValue>(this.value);
    }

    /**
     * Convert to `Left<T>`
     *
     * @since 1.3.1
     */
    public get asLeft() {
        return new Left<TValue>(this.value);
    }

    /**
     * Convert to `Right<T>`
     *
     * @since 1.3.1
     */
    public get asRight() {
        return new Right<TValue>(this.value);
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
    public static get filled() {
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

            public match = match(this);
            public pipe() {
                return pipe(this.value);
            }

            public flatten<TNested>(): TNested {
                return flatten<TNested, typeof this>(this, "value");
            }
        } as new <T>(value: T) => LikeConvertibleFilledBox<T>;
    }

    /**
     * Create base class like-a-box (empty, without value)
     * @returns `class {}`
     */
    public static get empty() {
        return class {
            constructor() {}

            public toString = (): string => {
                return `${this.constructor.name}()`;
            };

            public match = match(this);
            public pipe() {
                return pipe(undefined);
            }
        } as Ctor<LikeBox>;
    }
}
