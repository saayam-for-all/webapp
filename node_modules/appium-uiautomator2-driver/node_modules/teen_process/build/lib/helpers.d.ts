/**
 * Decorates ENOENT error received from a spawn system call
 * with a more descriptive message, so it could be properly handled by a user.
 *
 * @param {NodeJS.ErrnoException} error Original error instance. !!! The instance is mutated after
 * this helper function invocation
 * @param {string} cmd Original command to execute
 * @param {string?} [cwd] Optional path to the current working dir
 * @returns {Promise<NodeJS.ErrnoException>} Mutated error instance with an improved description or an
 * unchanged error instance
 */
export function formatEnoent(error: NodeJS.ErrnoException, cmd: string, cwd?: string | null): Promise<NodeJS.ErrnoException>;
//# sourceMappingURL=helpers.d.ts.map