/**
 * Type that should implement immutable types
 *
 * @since 1.3.0
 */
export interface Immutable {
    /**
     * Copy current instance of object
     *
     * @returns copy of instance
     */
    copy(): this;
}
