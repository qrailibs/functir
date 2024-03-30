import { ignoreError } from "../core/errorHandler";
import { IO } from "./IO";

export type MapPredicate<TItem> = IO<TItem, TItem>;
export type FilterPredicate<TItem> = IO<TItem, boolean>;
export type SortPredicate<TItem> = IO<[TItem, TItem], 0 | 1 | -1>;

export type LikeImmutableArray<TItem> = {
    asArray: TItem[];
    asSet: Set<TItem[]>;
    asMap: Map<number, TItem>;

    /**
     * Copy sequence
     *
     * @returns copy of sequence
     */
    copy(): LikeImmutableArray<TItem>;

    /**
     * Check that item is defined at index
     *
     * @param idx index of item
     * @returns is value exists
     */
    isDefinedAt(idx: number): boolean;

    /**
     * Add value to a start of sequence
     *
     * @param value value to add
     * @returns mutated sequence
     */
    prepended(...value: TItem[]): LikeImmutableArray<TItem>;

    /**
     * Add value to a end of sequence
     *
     * @param value value to add
     * @returns mutated sequence
     */
    appended(...value: TItem[]): LikeImmutableArray<TItem>;

    /**
     * Change values from index `idx` to index `idx+amount`
     *
     * @param idx index of item to update
     * @param amount amount from index to patch
     * @param patchValue value to replace
     * @returns mutated sequence
     */
    patched(idx: number, amount: number, patchValue: TItem): LikeImmutableArray<TItem>;

    /**
     * Update value in sequence by index
     *
     * @param idx index of item to update
     * @param value new value
     * @returns mutated sequence
     */
    updated(idx: number, value: TItem): LikeImmutableArray<TItem>;

    // TODO: instead of ignoring errors -> aggregate them and return as IO

    /**
     * Sort sequence by default predicate. Ascending ASCI sort.
     *
     * @returns sorted sequence
     */
    autoSorted(): LikeImmutableArray<TItem>;

    /**
     * Sort sequence by predicate.
     * If predicate will return throwable -> item will be at same place (like predicate () => 0)
     *
     * @returns sorted sequence
     */
    sorted(predicate: SortPredicate<TItem>): LikeImmutableArray<TItem>;

    /**
     * Map sequence by predicate.
     * If predicate will return throwable -> item will be not mapped
     *
     * @returns mapped sequence
     */
    mapped(predicate: MapPredicate<TItem>): LikeImmutableArray<TItem>;

    /**
     * Filter sequence by predicate.
     * If predicate will return throwable -> item will be not included in new sequence
     *
     * @returns filtered sequence
     */
    filtered(predicate: FilterPredicate<TItem>): LikeImmutableArray<TItem>;

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
    indexOf(value: TItem): number;

    /**
     * Find last index of item
     *
     * @param value value of get index of
     * @returns index, NaN if not found
     */
    lastIndexOf(value: TItem): number;

    toString(): string;

    [Symbol.iterator](): Iterator<TItem>;
};

function ImmutableArray() {
    const List = class<TItem> {
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
            return this.#value.reduce((map, value, key) => map.set(key, value), new Map<number, TItem>());
        }

        public get length() {
            return this.#value.length;
        }

        private new = (values: TItem[]) => new List<TItem>(...values);
        public copy = () => new List<TItem>(...this.#value);

        //#region Mutations
        public prepended = (...value: TItem[]) => this.new(value.concat(this.#value));
        public appended = (...value: TItem[]) => this.new(this.#value.concat(value));

        public patched(idx: number, amount: number, patchValue: TItem) {
            // Check out of bounds
            if (idx + amount >= this.length)
                return RangeError(`Out of array bounds (length=${this.length}, index=${idx}, amount=${amount})`);

            const data = this.copy().asArray;

            let currentAmount = amount;
            for (let curIdx = idx; curIdx < this.length && currentAmount > 0; curIdx++) {
                data[curIdx] = patchValue;
                currentAmount--;
            }

            return this.new(data);
        }

        public updated(idx: number, value: TItem) {
            // Check out of bounds
            if (idx >= this.length) return RangeError(`Out of array bounds (length=${this.length}, index=${idx})`);

            const data = this.copy().asArray;
            data[idx] = value;

            return this.new(data);
        }

        public autoSorted = () => this.new(this.#value.sort());
        public sorted = (predicate: SortPredicate<TItem>) =>
            this.new(this.#value.sort((a, b) => ignoreError(predicate([a, b]), 0)));

        public mapped = (predicate: MapPredicate<TItem>) =>
            this.new(this.#value.map((_) => ignoreError(predicate(_), _)));

        public filtered = (predicate: FilterPredicate<TItem>) =>
            this.new(this.#value.filter((_) => ignoreError(predicate(_), false)));

        public padStart = (amount: number, fillValue: TItem) =>
            this.new(
                Array(amount - this.length)
                    .fill(fillValue)
                    .concat(this.#value)
            );
        public padEnd = (amount: number, fillValue: TItem) =>
            this.new(this.#value.concat(Array(amount - this.length).fill(fillValue)));

        public reversed = () => this.new(this.#value.reverse());
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

    return List;
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
