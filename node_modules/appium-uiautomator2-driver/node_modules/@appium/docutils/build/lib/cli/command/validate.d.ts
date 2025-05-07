/**
 * Yargs command module for the `validate` command.
 * @module
 */
import type { CommandModule, InferredOptionTypes } from 'yargs';
declare enum ValidateCommandGroup {
    Behavior = "Validation Behavior:",
    Paths = "Custom Paths:"
}
declare const opts: {
    readonly mkdocs: {
        readonly default: true;
        readonly description: "Validate MkDocs environment";
        readonly group: ValidateCommandGroup.Behavior;
        readonly type: "boolean";
    };
    readonly 'mkdocs-yml': {
        readonly defaultDescription: "./mkdocs.yml";
        readonly description: "Path to mkdocs.yml";
        readonly group: ValidateCommandGroup.Paths;
        readonly nargs: 1;
        readonly normalize: true;
        readonly requiresArg: true;
        readonly type: "string";
    };
    readonly 'npm-path': {
        readonly defaultDescription: "(derived from shell)";
        readonly description: "Path to npm executable";
        readonly group: ValidateCommandGroup.Paths;
        readonly nargs: 1;
        readonly normalize: true;
        readonly requiresArg: true;
        readonly type: "string";
    };
    readonly python: {
        readonly default: true;
        readonly description: "Validate Python 3 environment";
        readonly group: ValidateCommandGroup.Behavior;
        readonly type: "boolean";
    };
    readonly 'python-path': {
        readonly defaultDescription: "(derived from shell)";
        readonly description: "Path to python3 executable";
        readonly group: ValidateCommandGroup.Paths;
        readonly nargs: 1;
        readonly normalize: true;
        readonly requiresArg: true;
        readonly type: "string";
    };
    readonly 'tsconfig-json': {
        readonly defaultDescription: "./tsconfig.json";
        readonly describe: "Path to tsconfig.json";
        readonly group: ValidateCommandGroup.Paths;
        readonly nargs: 1;
        readonly normalize: true;
        readonly requiresArg: true;
        readonly type: "string";
    };
    readonly typescript: {
        readonly default: true;
        readonly description: "Validate TypeScript environment";
        readonly group: ValidateCommandGroup.Behavior;
        readonly type: "boolean";
    };
};
type ValidateOptions = InferredOptionTypes<typeof opts>;
declare const _default: CommandModule<object, ValidateOptions>;
export default _default;
//# sourceMappingURL=validate.d.ts.map