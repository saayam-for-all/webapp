# `react-use-set`

Use [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)-like API with React hook.

![npm](https://img.shields.io/npm/v/react-use-set)
![CI Status](https://github.com/SevenOutman/react-use-set/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/SevenOutman/react-use-set/branch/main/graph/badge.svg?token=G6ymLbwxPj)](https://codecov.io/gh/SevenOutman/react-use-set)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Instsall

Install `react-use-set` npm package

    npm i react-use-set

## Usage

Get a Set-like object from `useSet()` hook.ß

```js
import { useSet } from "react-use-set"

const set = useSet()
```

It's got some Set methods and properties like

- `add` (enhanced)
- `delete` (enhanced)
- `clear`
- `size`

Along with additional utils like

- `toggle`
- `sync`
- `toArray`

Learn more in [API](#api) section.

## API

### `set.add(...values)`

> Calling this method triggers a re-render.

Add values to the Set. Multiple values are supported.

```js
const set = useSet([1, 2, 3])

set.add(4) // Set [1, 2, 3, 4]
set.add(5, 6) // Set [1, 2, 3, 4, 5, 6]
```

### `set.delete(...values)`

> Calling this method triggers a re-render.

Remove values from the Set. Multiple values are supported.

```js
const set = useSet([1, 2, 3])

set.delete(1, 2) // Set [3]
```

### `set.has(value)`

Check whether a value exists in Set.

```js
const set = useSet([1, 2, 3])

set.has(1) // true
set.has(4) // false
```

### `set.toggle(value)`

> Calling this method triggers a re-render.

If `value` exists in the Set, remove it, otherwise add it.

```js
const set = useSet([1, 2, 3])

set.toggle(2) // Set [1, 3]
set.toggle(4) // Set [1, 3, 4]
```

This is useful when you want to store selected options on a list.

```jsx
const selectedValues = useSet()

options.map((option) => (
  <Checkbox onChange={() => selectedValues.toggle(option.value)} />
))
```

### `set.clear()`

> Calling this method triggers a re-render.

Remove all values from the Set.

```js
const set = useSet([1, 2, 3])

set.clear() // Set []
```

#### `set.size`

Return the number of values in the Set.

```js
const set = useSet([1, 2, 3])

set.size // 3
```

### `set.toArray()`

Return the values in the Set as an array.

```js
const set = useSet([1, 2, 3])

set.toArray() // [1, 2, 3]
```

This is useful when you want to display a list of selected options.

```jsx
<ol>
  Selected options ({selectedValues.size})}):
  {selectedValues.toArray().map((value) => (
    <li key={value}>{value}</li>
  ))}
</ol>
```

### `set.sync(values)`

> Calling this method triggers a re-render.

Reset the Set with the given values.

```js
const set = useSet([1, 2, 3])

set.sync([4, 5, 6]) // Set [4, 5, 6]
```

## License

MIT &copy; [Doma](https://github.com/SevenOutman)
