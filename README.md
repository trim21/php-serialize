# PHP-Serialize

serialize and deserialize php encoded string to/from js Object/Array/Map.

It also supports `Serializable` objects decode. Here's how you can use them.

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

#### API

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

#### License

This project is licensed under the terms of MIT License. See the License file for more info.
