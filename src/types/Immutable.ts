/**
 * Type that should implement immutable types
 */
export interface Immutable {
    /**
     * Copy current instance of object
     */
    copy(): this;
}
