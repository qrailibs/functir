import { Box } from "./Box";
import { CtorWithArgs } from "./Ctor";

/**
 * Class constructed as a trait
 */
export type TraitClass<TClass> = Readonly<TClass> & {
    asObject: TClass;
    asBox: Box<TClass>;

    toString(): string;
};

/**
 * Construct a trait class
 * @param trait properties of the class
 * @returns class with properties, constructor accepts them as object in the first argument
 */
export function Trait<TClass extends object>(): CtorWithArgs<TraitClass<TClass>, [TClass]> {
    return class {
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

        public toString(): string {
            return `${this.constructor.name || "Trait"}(${JSON.stringify(this.asObject)})`;
        }
    } as CtorWithArgs<TraitClass<TClass>, [TClass]>;
}

/**
 * Create immutable fields in object
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
