import { expect, test } from '@jest/globals'

import { stringify, parse, ObjectName } from '../src/'

test.each([
  'Hey I am a very long string, this is to test if this package works with long strings, See #2',
  1,
  1.1,
  null,
  true,
  false,
  [1, 2, 3],
  { some: 'thing', hello: 'buddy', someWeirdCoolLongKey: 'SomeWeirdCoolLongValue' },
  { some: { hey: 'Hello' } },
  [],
  { some: [] },
  '你好世界',
  ['Helló', 'World'],
])('%s', (input) => {
  expect(parse(stringify(input))).toEqual(input)
})

test('it works well with serializable too', () => {
  class User {
    [ObjectName] = 'User'
    name: string
    age: number

    constructor({ name, age }: { name: string; age: number } = { name: 'Steel Brain', age: 17 }) {
      this.name = name
      this.age = age
    }
  }

  const r = stringify(new User())

  expect(r).toMatchInlineSnapshot(`"O:4:"User":2:{s:4:"name";s:11:"Steel Brain";s:3:"age";i:17;}"`)

  expect(parse(r)).toEqual({ [ObjectName]: 'User', name: 'Steel Brain', age: 17 })
})

test('it works with non serializable classes too', () => {
  class User {
    name: string
    age: number

    constructor() {
      this.name = 'Steel Brain'
      this.age = 17
    }
  }

  expect(parse(stringify(new User()))).toEqual(new User())
})

test('it works with nested serializable classes too', () => {
  class ChildObject {
    name: string

    constructor(name: string) {
      this.name = name
    }
  }

  class ChildClass {
    name: string

    constructor(name: string) {
      this.name = name
    }

    serialize(): string {
      return this.name
    }
  }

  class Parent {
    propObj: ChildObject
    propClass: ChildClass

    constructor(propObj?: ChildObject, propClass?: ChildClass) {
      this.propObj = propObj ?? new ChildObject('Steel')
      this.propClass = propClass ?? new ChildClass('Brain')
    }
  }

  const s = stringify(new Parent())

  expect(s).toMatchInlineSnapshot(
    `"a:2:{s:7:"propObj";a:1:{s:4:"name";s:5:"Steel";}s:9:"propClass";a:1:{s:4:"name";s:5:"Brain";}}"`,
  )

  expect(parse(s)).toEqual(new Parent())
})

test('should failed to parse class in strict mode', () => {
  expect(() => {
    parse('C:10:"TestParent":50:{a:2:{i:0;C:4:"Test":3:{asd}i:1;O:7:"TestTwo":0:{}}}')
  }).toThrow(TypeError)
})

test('should return to parse class with strict mode off', () => {
  const r = parse('C:10:"TestParent":50:{a:2:{i:0;C:4:"Test":3:{asd}i:1;O:7:"TestTwo":0:{}}}', { strict: false })

  expect(r).toMatchInlineSnapshot(`"a:2:{i:0;C:4:"Test":3:{asd}i:1;O:7:"TestTwo":0:{}}"`)
})

test('deserialize key pairs correctly, not serialized by self', () => {
  expect(parse(`a:1:{s:12:"97YEAY3JO237";s:2:"hi"}`)).toMatchInlineSnapshot(`
    {
      "97YEAY3JO237": "hi",
    }
  `)
  expect(parse(`a:1:{s:12:"02YJXTVI6ZOJ";s:2:"hi"}`)).toMatchInlineSnapshot(`
    {
      "02YJXTVI6ZOJ": "hi",
    }
  `)
  expect(parse(`a:1:{s:12:"X0YJXTVI6ZOJ";s:2:"hi"}`)).toMatchInlineSnapshot(`
    {
      "X0YJXTVI6ZOJ": "hi",
    }
  `)
  expect(parse(`a:1:{s:2:"X0";s:2:"hi"}`)).toMatchInlineSnapshot(`
    {
      "X0": "hi",
    }
  `)
  expect(parse(`a:1:{s:12:"0XYJXTVI6ZOJ";s:2:"hi"}`)).toMatchInlineSnapshot(`
    {
      "0XYJXTVI6ZOJ": "hi",
    }
  `)
  expect(parse(`a:1:{s:2:"0x";s:2:"hi"}`)).toMatchInlineSnapshot(`
    {
      "0x": "hi",
    }
  `)
  expect(parse(`a:1:{s:2:"0N";s:2:"hi"}`)).toMatchInlineSnapshot(`
    {
      "0N": "hi",
    }
  `)
})

test('converts arrays with missing keys to objects', () => {
  const deserialized = parse('a:2:{i:25;i:105;i:31;i:106;}')
  expect(deserialized).toEqual({
    25: 105,
    31: 106,
  })
})
