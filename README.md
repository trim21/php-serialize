# PHP-Serialize

serialize and unserialize php encoded string to or from js Object/Array/Map.

It also supports `Serializable` objects decode. Here's how you can use them.

```typescript
import type { Serializable } from '@trim21/php-serialize'
import { serialize, unserialize } from '@trim21/php-serialize'

class User implements Serializable {
  private name: string
  private age: number

  constructor({ name, age }) {
    this.name = name
    this.age = age
  }

  serialize() {
    return JSON.stringify({ name: this.name, age: this.age })
  }

  unserialize(rawData) {
    const { name, age } = JSON.parse(rawData)
    this.name = name
    this.age = age
  }
}

const steel = new User({ name: 'Steel Brain', age: 17 })
const serialized = serialize(steel)
const unserialized = unserialize(serialized, { User: User }) // Passing available classes
console.log(unserialized instanceof User) // true

const serializedForNamespace = serialize(steel, {
  'MyApp\\User': User,
})
// ^ Above code will serialize User class to given name

// If you need to serialize to php array with int key

serialize(new Map([[1, 'q']]))
```

#### API

```ts
export function serialize(
  item: any,
  phpToJsScope: Object = {},
  options: { encoding: 'utf8' | 'binary' } = { encoding: 'utf8' },
): string
export function unserialize(
  item: string,
  scope: Object = {},
  options: { strict: boolean; encoding: 'utf8' | 'binary' } = { strict: false, encoding: 'utf8' },
): any
export function isSerialized(item: any, strict: false): boolean
```

#### License

This project is licensed under the terms of MIT License. See the License file for more info.
