"use strict";
/**
 * Yargs command module for the `validate` command.
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
const support_1 = require("@appium/support");
const error_1 = require("../../error");
const validate_1 = require("../../validate");
const logger_1 = require("../../logger");
const check_1 = require("../check");
const log = (0, logger_1.getLogger)('validate');
var ValidateCommandGroup;
(function (ValidateCommandGroup) {
    ValidateCommandGroup["Behavior"] = "Validation Behavior:";
    ValidateCommandGroup["Paths"] = "Custom Paths:";
})(ValidateCommandGroup || (ValidateCommandGroup = {}));
const opts = {
    mkdocs: {
        default: true,
        description: 'Validate MkDocs environment',
        group: ValidateCommandGroup.Behavior,
        type: 'boolean',
    },
    'mkdocs-yml': {
        defaultDescription: './mkdocs.yml',
        description: 'Path to mkdocs.yml',
        group: ValidateCommandGroup.Paths,
        nargs: 1,
        normalize: true,
        requiresArg: true,
        type: 'string',
    },
    'npm-path': {
        defaultDescription: '(derived from shell)',
        description: 'Path to npm executable',
        group: ValidateCommandGroup.Paths,
        nargs: 1,
        normalize: true,
        requiresArg: true,
        type: 'string',
    },
    python: {
        default: true,
        description: 'Validate Python 3 environment',
        group: ValidateCommandGroup.Behavior,
        type: 'boolean',
    },
    'python-path': {
        defaultDescription: '(derived from shell)',
        description: 'Path to python3 executable',
        group: ValidateCommandGroup.Paths,
        nargs: 1,
        normalize: true,
        requiresArg: true,
        type: 'string',
    },
    'tsconfig-json': {
        defaultDescription: './tsconfig.json',
        describe: 'Path to tsconfig.json',
        group: ValidateCommandGroup.Paths,
        nargs: 1,
        normalize: true,
        requiresArg: true,
        type: 'string',
    },
    typescript: {
        default: true,
        description: 'Validate TypeScript environment',
        group: ValidateCommandGroup.Behavior,
        type: 'boolean',
    },
};
exports.default = {
    command: 'validate',
    describe: 'Validate Environment',
    builder(yargs) {
        return yargs.options(opts).check(async (argv) => {
            if (!argv.python && !argv.typescript && !argv.mkdocs) {
                return 'No validation targets specified; one or more of --python, --typescript or --mkdocs must be provided';
            }
            return (0, check_1.checkMissingPaths)(opts, ValidateCommandGroup.Paths, argv);
        });
    },
    async handler(args) {
        let errorCount = 0;
        const validator = new validate_1.DocutilsValidator(args)
            .once(validate_1.DocutilsValidator.BEGIN, (kinds) => {
            log.info(`Validating: ${kinds.join(', ')}`);
        })
            .once(validate_1.DocutilsValidator.END, (errCount) => {
            errorCount = errCount;
        })
            .on(validate_1.DocutilsValidator.FAILURE, (err) => {
            log.error(err.message);
        })
            .on(validate_1.DocutilsValidator.SUCCESS, (msg) => {
            log.success(msg);
        });
        await validator.validate();
        if (errorCount) {
            throw new error_1.DocutilsError(`Validation failed with ${errorCount} ${support_1.util.pluralize('error', errorCount)}`);
        }
    },
};
//# sourceMappingURL=validate.js.map