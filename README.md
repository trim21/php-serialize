# PHP-Serialize

[![](https://img.shields.io/npm/v/@trim21/php-serialize)](https://www.npmjs.com/package/@trim21/php-serialize)
![Codecov](https://img.shields.io/codecov/c/github/trim21/php-serialize)

serialize and deserialize php encoded string to/from js Object/Array/Map.

## Install

```shell
npm add @trim21/php-serialize
yarn add @trim21/php-serialize
pnpm add @trim21/php-serialize
```

## Example

```typescript
import * as php from '@trim21/php-serialize'

class User {
  [php.ObjectName] = 'User'

  private name: string
  private age: number

  constructor({ name, age }) {
    this.name = name
    this.age = age
  }
}

php.stringify({
  b: true,

  a: [1, 2, 3, 'a', 100n, null, undefined],

  s: 'str',

  m: new Map([
    [1, 2],
    [2, 'b'],
  ]),

  withObjectName: {
    [php.ObjectName]: 'O',
  },
})

const steel = new User({ name: 'Steel Brain', age: 17 })
const serialized = php.stringify(steel)
console.log(serialized)

const deserialized = php.parse('...', { strict: false }) // won't parse serializable class with default strict=true
```

## API

```typescript
export declare function parse(
  item: any,
  {
    strict = true,
    encoding = 'utf-8',
  }: {
    strict: boolean
    encoding: 'utf-8' | 'binary'
  } = {},
): string

export declare function stringify(item: string | Buffer): any

export declare const ObjectName: unique symbol
```

## parse

php serialized object `"O:1:"A":1:{...}"` will be parsed to object with symbol name `{ {php.ObjectName]: "A", ... }`

## stringify

js Object with symbol as object name `{ {php.ObjectName]: "A" }` will be serialized to php object `"O:1:"A":1:{...}"`

## License

This project is licensed under the terms of MIT License. See the License file for more info.
