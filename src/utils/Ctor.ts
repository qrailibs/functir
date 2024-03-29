/**
 * Constructor of an instance
 *
 * @template TInstance class with constructor
 */
export type Ctor<TInstance> = new () => TInstance;

/**
 * Constructor with arguments of an instance
 *
 * @template TInstance class with constructor
 * @template TArgs arguments of constructor
 */
export type CtorWithArgs<TInstance, TArgs extends Array<any>> = new (...args: TArgs) => TInstance;
