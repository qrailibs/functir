import { IO } from "./IO";
import { Immutable } from "../utils/Immutable";
import { _ } from "../core/match";
import { Throwable } from "./Throwable";

/**
 * Wrapper for working with IO operations more easily
 *
 * @since 1.3.0
 * @implements Immutable
 * @template TInput type of action arguments
 * @template TOperation type of IO
 */
export class Action<
    TInput,
    TOutput,
    TError extends Throwable,
    TOperation extends IO<TInput, TOutput, TError> = IO<TInput, TOutput, TError>
> implements Immutable
{
    private readonly operation: TOperation;
    private failStrategy: "fail" | "silent" | "ignore" = "fail";

    constructor(operation: TOperation, args?: TInput) {
        this.operation = operation;
    }

    public copy(): this {
        return new Action(this.operation) as this;
    }

    public throwFail() {
        this.failStrategy = "fail";
    }
    public silentFail() {
        this.failStrategy = "silent";
    }
    public ignoreFail() {
        this.failStrategy = "ignore";
    }

    public call(args: TInput): TOutput | TError | null {
        try {
            const output = this.operation(args);

            if (Array.isArray(output)) {
            }
            if (output instanceof Error) {
                if (this.failStrategy === "fail") throw output;
                else if (this.failStrategy === "silent") return output as TError;
                else return null;
            }

            return output;
        } catch (err) {
            if (this.failStrategy === "fail") throw err;
            else if (this.failStrategy === "silent") return err as TError;
            else return null;
        }
    }

    /**
     * Wrap an IO operation into Action
     * @param operation IO function
     * @returns `Action` instance
     */
    public static wrap(operation: IO<any, any>) {
        return new Action(operation);
    }

    /**
     *
     * @param operations
     * @returns
     */
    public static aggregate<TOutput, TError>(...operationResults: (TOutput | TError | null)[]) {
        return new Action<undefined, any, Throwable>(() => operationResults);
    }
}

/* TODO: syntax like
		AsyncAction(this.receiveGatherCommand)
			.call(contact as GatherCommand)
			.thenIfResult(this.send)
			.thenIfError(this.report)
		*/

/*
    const mt100 = (a) => a > 100 ? 1 : new Error();

    const result = Action.aggregate(
        Action.wrap(mt100).call(200)
        Action.wrap(mt100).call(1)
    ).ignoreFail()

    console.log(result) // [1, _]

    new ActionAggregator(
        new Action().onFail(nothing),
        new Action().onFail(nothing)
    ).onFail()
    */
