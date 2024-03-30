import { Box } from "./Box";
import { CtorWithArgs } from "../utils/Ctor";

/**
 * Class constructed as a trait
 *
 * @since 1.0.0
 */
export type TraitClass<TClass> = Readonly<TClass> & {
    /**
     * Convert Trait into object
     */
    asObject: TClass;

    /**
     * Convert Trait into Box<Trait>
     */
    asBox: Box<TClass>;

    /**
     * Copy trait instance
     *
     * @since 1.3.0
     * @param changes changes applied to copied instance
     */
    copy(changes?: Partial<TClass>): TraitClass<TClass>;

    toString(): string;
};

/**
 * Construct a trait class
 *
 * @since 1.0.0
 * @param trait properties of the class
 * @returns class with properties, constructor accepts them as object in the first argument
 */
export function Trait<TClass extends object>(): CtorWithArgs<TraitClass<TClass>, [TClass]> {
    const ContructedTrait = class {
        constructor(opts: TClass) {
            createFields<TClass>(this as unknown as TClass, opts);
        }

        public get asObject(): TClass {
            const { ...object } = this;
            return object as TClass;
        }
        public get asBox(): Box<TClass> {
            return new Box<TClass>(this.asObject);
        }

        public copy(changes?: Partial<TClass>): TraitClass<TClass> {
            return new ContructedTrait({ ...this.asObject, ...changes });
        }

        public toString(): string {
            return `${this.constructor.name || "Trait"}(${JSON.stringify(this.asObject)})`;
        }
    } as CtorWithArgs<TraitClass<TClass>, [TClass]>;

    return ContructedTrait;
}

/**
 * Create immutable fields in object
 *
 * @since 1.0.0
 * @param target target object to create fields inside
 * @param fields fields that we should create and their values
 * @returns nothing, object is changed directly
 */
function createFields<T extends object>(target: T, fields: T) {
    for (const [prop, propValue] of Object.entries(fields)) {
        Object.defineProperty(target, prop as keyof T, {
            value: propValue,
            enumerable: true,
            writable: false,
        });
    }
}
