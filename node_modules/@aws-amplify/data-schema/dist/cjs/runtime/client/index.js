'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.__modelMeta__ = void 0;
// temporarily export symbols from `data-schema-types` because in case part of the
// problem with the runtime -> data-schema migration comes down to a mismatch
// around this symbol and it's extractor.
//
// before switching to declare these here, we need to prove it won't break any
// customer experiences. this *might* need to happen as a breaking change.
//
// export declare const __modelMeta__: unique symbol;
// export type ExtractModelMeta<T extends Record<any, any>> =
//   T[typeof __modelMeta__];
var data_schema_types_1 = require("@aws-amplify/data-schema-types");
Object.defineProperty(exports, "__modelMeta__", { enumerable: true, get: function () { return data_schema_types_1.__modelMeta__; } });
//# sourceMappingURL=index.js.map
