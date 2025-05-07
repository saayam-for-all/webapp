/**
 * Implementation of a generic "create and/or update some file" task
 * @module
 */
import { NormalizedPackageJson } from 'read-pkg';
import { JsonValue, JsonObject } from 'type-fest';
/**
 * Options for a task which are not the {@link ScaffoldTaskOptions base options}
 */
export type TaskSpecificOpts<Opts extends ScaffoldTaskOptions> = Omit<Opts, keyof ScaffoldTaskOptions>;
/**
 * A function which performs some scaffolding task.
 *
 * @see {@linkcode createScaffoldTask}
 */
export type ScaffoldTask<Opts extends ScaffoldTaskOptions, T extends JsonObject> = (opts: Opts) => Promise<ScaffoldTaskResult<T>>;
/**
 * Factory for a {@linkcode ScaffoldTask}.
 *
 * @param defaultFilename Default file to create
 * @param defaultContent Default content to use
 * @param description Description of task
 * @param opts Options
 * @returns A scaffold task
 */
export declare function createScaffoldTask<Opts extends ScaffoldTaskOptions, T extends JsonObject>(defaultFilename: string, defaultContent: T, description: string, { transform, deserialize, serialize, }?: CreateScaffoldTaskOptions<Opts, T>): ScaffoldTask<Opts, T>;
/**
 * Optional function which can be used to post-process the content of a file. Usually used to merge
 * various options with existing content
 */
export type ScaffoldTaskTransformer<Opts extends ScaffoldTaskOptions, T extends JsonValue> = (content: Readonly<T>, opts: TaskSpecificOpts<Opts>, pkg: Readonly<NormalizedPackageJson>) => T;
/**
 * A function which deserializes a string into a JS value.
 */
export type ScaffoldTaskDeserializer<T> = (content: string) => T;
/**
 * A function which serializes a JS value into a string.
 */
export type ScaffoldTaskSerializer<T> = (content: T) => string;
/**
 * Options for {@linkcode createScaffoldTask}
 */
export interface CreateScaffoldTaskOptions<Opts extends ScaffoldTaskOptions, T extends JsonValue> {
    /**
     * Transformer function
     */
    transform?: ScaffoldTaskTransformer<Opts, T>;
    /**
     * Deserializer function
     */
    deserialize?: ScaffoldTaskDeserializer<T>;
    /**
     * Serializer function
     */
    serialize?: ScaffoldTaskSerializer<T>;
}
/**
 * Base options for all scaffold tasks
 */
export interface ScaffoldTaskOptions {
    /**
     * Current working directory
     */
    cwd?: string;
    /**
     * Destination file
     */
    dest?: string;
    /**
     * If `true` will not write files
     */
    dryRun?: boolean;
    /**
     * If `true` will overwrite fields in `typedoc.json`
     */
    overwrite?: boolean;
    /**
     * Path to `package.json`
     */
    packageJson?: string;
}
/**
 * The return value of a {@linkcode ScaffoldTask}
 */
export interface ScaffoldTaskResult<T> {
    /**
     * The content of whatever it wrote or would write
     */
    content: T;
    /**
     * The filepath of whatever it wrote or would write
     */
    path: string;
}
//# sourceMappingURL=scaffold.d.ts.map