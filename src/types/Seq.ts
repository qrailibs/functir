import { ignoreError } from "../core/errorHandler";
import { is, match } from "../core/match";
import { IO } from "./IO";
import { Throwable } from "./Throwable";
import { Failure, Safecall, Success, Try } from "./Try";

export type MapPredicate<TItem> = IO<TItem, TItem>;
export type AccumulatePredicate<TItem, TAccumValue> = IO<
    [TAccumValue, TItem],
    TAccumValue
>;
export type FilterPredicate<TItem> = IO<TItem, boolean>;
export type SortPredicate<TItem> = IO<[TItem, TItem], 0 | 1 | -1>;

export type LikeImmutableArray<TItem> = {
    asArray: TItem[];
    asSet: Set<TItem[]>;
    asMap: Map<number, TItem>;
    asObject: Record<number, TItem>;

    /**
     * Copy sequence
     *
     * @returns copy of sequence
     */
    copy(): LikeImmutableArray<TItem>;

    /**
     * Get value at index.
     * _UNSAFE_: may return error if out of bounds, handle it
     *
     * @returns value at index
     */
    at(idx: number): Try<TItem, RangeError>;

    /**
     * Check that item is defined at index
     *
     * @param idx index of item
     * @returns is value exists
     */
    isDefinedAt(idx: number): boolean;

    /**
     * Add value(s) to the start of sequence
     *
     * @param value values to add
     * @returns mutated sequence
     */
    prepended(...value: TItem[]): LikeImmutableArray<TItem>;

    /**
     * Add value(s) to the end of sequence
     *
     * @param value values to add
     * @returns mutated sequence
     */
    appended(...value: TItem[]): LikeImmutableArray<TItem>;

    /**
     * Change values from index `idx` to index `idx+amount`.
     * _UNSAFE_: may return error if out of bounds, handle it
     *
     * @param idx index of item to update
     * @param amount amount from index to patch
     * @param patchValue value to replace
     * @returns mutated sequence
     */
    patched(
        idx: number,
        amount: number,
        patchValue: TItem
    ): Try<LikeImmutableArray<TItem>, RangeError>;

    /**
     * Update value in sequence by index.
     * _UNSAFE_: may return error if out of bounds, handle it
     *
     * @param idx index of item to update
     * @param provide callback that will provide a new value, based on the old one
     * @returns mutated sequence
     */
    updated(
        idx: number,
        provide: MapPredicate<TItem>
    ): Try<LikeImmutableArray<TItem>, RangeError>;

    /**
     * Update value in sequence found by predicate.
     * _UNSAFE_: may return error if not found by predicate, handle it
     *
     * @since 1.3.3
     * @param predicate predicate to find value that should be updated
     * @param provide callback that will provide a new value, based on the old one
     * @returns mutated sequence
     */
    foundUpdated(
        predicate: FilterPredicate<TItem>,
        provide: MapPredicate<TItem>
    ): Try<LikeImmutableArray<TItem>, Error>;

    /**
     * Sort sequence by default predicate. Ascending ASCI sort.
     *
     * @returns sorted sequence
     */
    autoSorted(): LikeImmutableArray<TItem>;

    /**
     * Sort sequence by predicate.
     * _UNSAFE_: may return error if predicate throwed, handle it
     *
     * @returns sorted sequence
     */
    sorted(
        predicate: SortPredicate<TItem>
    ): Try<LikeImmutableArray<TItem>, Throwable>;

    /**
     * Map sequence by predicate.
     * _UNSAFE_: may return error if predicate throwed, handle it
     *
     * @returns mapped sequence
     */
    mapped(
        predicate: MapPredicate<TItem>
    ): Try<LikeImmutableArray<TItem>, Throwable>;

    /**
     * Filter sequence by predicate.
     * _UNSAFE_: may return error if predicate throwed, handle it
     *
     * @returns filtered sequence
     */
    filtered(
        predicate: FilterPredicate<TItem>
    ): Try<LikeImmutableArray<TItem>, Throwable>;

    /**
     * Remove value(s) from the sequence.
     * _SAFE_: if values to be exluded not existed will not throw any error.
     *
     * @since 1.3.3
     * @param value values to remove
     * @returns mutated sequence
     */
    excluded(...value: TItem[]): LikeImmutableArray<TItem>;

    /**
     * Accumulate sequence to one value by predicate.
     * _UNSAFE_: may return error if predicate throwed, handle it
     *
     * @since 1.3.2
     * @returns final accumulated value
     */
    accumulated<TAccumValue>(
        predicate: AccumulatePredicate<TItem, TAccumValue>,
        initialValue: TAccumValue
    ): Try<TAccumValue, Throwable>;

    /**
     * Reverse sequence
     *
     * @returns reversed sequence
     */
    reversed(): LikeImmutableArray<TItem>;

    /**
     * Pads sequence with given value to required length (to start of sequence)
     *
     * @param amount final length of sequence
     * @param fillValue value used for padding
     * @returns mutated sequence
     */
    padStart(amount: number, fillValue: TItem): LikeImmutableArray<TItem>;

    /**
     * Pads sequence with given value to required length (to end of sequence)
     *
     * @param len final length of sequence
     * @param fillValue value used for padding
     * @returns mutated sequence
     */
    padEnd(len: number, fillValue: TItem): LikeImmutableArray<TItem>;

    /**
     * Find index of item
     *
     * @param value value of get index of
     * @returns index, NaN if not found
     */
    indexOf(value: TItem): number | typeof NaN;

    /**
     * Find last index of item
     *
     * @param value value of get index of
     * @returns index, NaN if not found
     */
    lastIndexOf(value: TItem): number | typeof NaN;

    toString(): string;

    [Symbol.iterator](): Iterator<TItem>;
};

export function ImmutableArray() {
    const ImmutableArray = class<TItem> {
        #value: TItem[];
        constructor(...items: TItem[]) {
            this.#value = items;
        }

        public get asArray() {
            return this.#value;
        }

        public get asSet(): Set<TItem> {
            return new Set(this.#value);
        }

        public get asMap(): Map<number, TItem> {
            return this.#value.reduce(
                (map, value, key) => map.set(key, value),
                new Map<number, TItem>()
            );
        }

        public get asObject(): Record<number, TItem> {
            return this.#value.reduce(
                (object, value, key) => ({ ...object, [key]: value }),
                {}
            );
        }

        public get length() {
            return this.#value.length;
        }

        private new = (values: TItem[]) => new ImmutableArray<TItem>(...values);
        public copy = () => new ImmutableArray<TItem>(...this.#value);
        public at(idx: number) {
            // Check out of bounds
            if (idx >= this.length) {
                return new Failure(
                    RangeError(
                        `Out of array bounds (length=${this.length}, index=${idx})`
                    )
                );
            }

            return new Success(this.#value[idx]);
        }

        //#region Mutations
        public prepended = (...value: TItem[]) =>
            this.new(value.concat(this.#value));
        public appended = (...value: TItem[]) =>
            this.new(this.#value.concat(value));

        public patched(idx: number, amount: number, patchValue: TItem) {
            // Check out of bounds
            if (idx + amount >= this.length) {
                return new Failure(
                    RangeError(
                        `Out of array bounds (length=${this.length}, index=${idx}, amount=${amount})`
                    )
                );
            }

            const data = this.copy().asArray;

            let currentAmount = amount;
            for (
                let curIdx = idx;
                curIdx < this.length && currentAmount > 0;
                curIdx++
            ) {
                data[curIdx] = patchValue;
                currentAmount--;
            }

            return new Success(this.new(data));
        }

        public updated(idx: number, provide: MapPredicate<TItem>) {
            // Check out of bounds
            if (idx >= this.length) {
                return new Failure(
                    new RangeError(
                        `Out of array bounds (length=${this.length}, index=${idx})`
                    )
                );
            }

            // Try to call provide(at(idx))
            return Safecall<TItem, Throwable>(() =>
                provide(this.#value[idx])
            ).match([
                // Success -> mutated array
                is(Success, (_) => {
                    const data = this.copy().asArray;
                    data[idx] = _ as TItem;
                    return new Success(this.new(data));
                }),
                // Fail -> Error
                is(Failure, (_) => new Failure(_ as Throwable)),
            ]);
        }

        public foundUpdated(
            predicate: FilterPredicate<TItem>,
            provide: MapPredicate<TItem>
        ) {
            // Find value index
            const { value: idx } = Safecall<number, Throwable>(() =>
                this.#value.findIndex(predicate)
            );
            if (idx instanceof Error) return new Failure(idx);
            else if (typeof idx !== "number" || idx == -1)
                return new Failure(new Error("Not found by predicate"));

            // Try to call provide(at(idx))
            return Safecall<TItem, Throwable>(() =>
                provide(this.#value[idx])
            ).match([
                // Success -> mutated array
                is(Success, (_) => {
                    const data = this.copy().asArray;
                    data[idx] = _ as TItem;
                    return new Success(this.new(data));
                }),
                // Fail -> Error
                is(Failure, (_) => new Failure(_ as Throwable)),
            ]);
        }

        public excluded = (...values: TItem[]) =>
            this.new(this.#value.filter((v) => !values.includes(v)));

        public autoSorted = () => this.new(this.#value.sort());
        public sorted(predicate: SortPredicate<TItem>) {
            const { value } = Safecall(() =>
                this.copy().asArray.sort((a, b) => {
                    const result = predicate([a, b]);
                    if (result instanceof Error) throw result;
                    return result;
                })
            );

            if (value instanceof Error) return new Failure(value);
            return new Success(this.new(value));
        }

        public mapped(predicate: MapPredicate<TItem>) {
            const { value } = Safecall(() =>
                this.#value.map((_) => {
                    const result = predicate(_);
                    if (result instanceof Error) throw result;
                    return result;
                })
            );

            if (value instanceof Error) return new Failure(value);
            return new Success(this.new(value));
        }

        public accumulated<TAccumValue>(
            predicate: AccumulatePredicate<TItem, TAccumValue>,
            initialValue: TAccumValue
        ) {
            const { value } = Safecall(() =>
                this.#value.reduce((prev, _) => {
                    const result = predicate([prev, _]);
                    if (result instanceof Error) throw result;
                    return result;
                }, initialValue)
            );

            if (value instanceof Error) return new Failure(value);
            return new Success(value);
        }

        public filtered(predicate: FilterPredicate<TItem>) {
            const { value } = Safecall(() =>
                this.#value.filter((_) => {
                    const result = predicate(_);
                    if (result instanceof Error) throw result;
                    return result;
                })
            );

            if (value instanceof Error) return new Failure(value);
            return new Success(this.new(value));
        }

        public padStart = (amount: number, fillValue: TItem) =>
            this.new(
                Array(amount - this.length)
                    .fill(fillValue)
                    .concat(this.#value)
            );
        public padEnd = (amount: number, fillValue: TItem) =>
            this.new(
                this.#value.concat(Array(amount - this.length).fill(fillValue))
            );

        public reversed = () => this.new(this.copy().asArray.reverse());
        //#endregion

        //#region Index of
        public indexOf = (value: TItem) => this.#value.indexOf(value);
        public lastIndexOf = (value: TItem) => this.#value.lastIndexOf(value);
        //#endregion

        //#region Checking
        public isDefinedAt = (idx: number): boolean => idx < this.length;
        //#endregion

        public toString = () => `ImmutableArray(${this.#value.join(", ")})`;

        public [Symbol.iterator]() {
            return this.#value[Symbol.iterator]();
        }
    } as new <T>(...value: T[]) => LikeImmutableArray<T>;

    return ImmutableArray;
}

/**
 * Sequence of elements, structure that is alternative for arrays.
 * Fully immutable and with more useful methods than array.
 *
 * @since 1.3.0
 * @template TItem type of elements
 */
export class Seq<TItem> extends ImmutableArray()<TItem> {}

/**
 * Sequence of elements of any type. Works like common Seq<T>,
 * but without T.
 *
 * @since 1.3.0
 * @deprecated Better to use typed Seq, or Seq<unknown>
 */
export class UntypedSeq extends ImmutableArray()<any> {}
