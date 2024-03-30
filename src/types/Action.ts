import { IO } from "./IO";
import { Immutable } from "./Immutable";

/**
 * Wrapper for working with IO operations more easily
 *
 * @since 1.3.0
 * @template TOperation type of IO
 */
export class Action<TOperation extends IO<any, any>> implements Immutable {
    private readonly operation: TOperation;

    constructor(operation: TOperation) {
        this.operation = operation;
    }

    public copy(): this {
        return new Action(this.operation) as this;
    }
}
