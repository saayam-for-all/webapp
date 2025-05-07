A TypeScript loader for lilconfig. Migrated from [@endemolshinegroup/cosmiconfig-typescript-loader](https://www.npmjs.com/package/@endemolshinegroup/cosmiconfig-typescript-loader). Bug reports and feature requests go check [there](https://github.com/EndemolShineGroup/cosmiconfig-typescript-loader) first.

## Installation

```bash
yarn add @sliphua/lilconfig-ts-loader
```

## Usage

```typescript
import { lilconfig } from 'lilconfig';
import { TypeScriptLoader } from '@sliphua/lilconfig-ts-loader';

const moduleName = 'myModuleName';
const explorer = lilconfig(moduleName, {
  searchPlaces: [
    'package.json',
    `.${moduleName}rc`,
    `.${moduleName}rc.json`,
    `.${moduleName}rc.yaml`,
    `.${moduleName}rc.yml`,
    `.${moduleName}rc.ts`,
    `.${moduleName}rc.js`,
    `${moduleName}.config.ts`,
    `${moduleName}.config.js`,
  ],
  loaders: {
    '.ts': TypeScriptLoader,
  },
});
```
