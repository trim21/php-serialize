/* eslint-disable max-classes-per-file, class-methods-use-this */
import { expect, test } from '@jest/globals'

import { serialize, unserialize } from '../src/index'

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
  expect(unserialize(serialize(input))).toEqual(input)
})

test('it works well with serialiables too', () => {
  class User {
    name: string
    age: number

    constructor() {
      this.name = 'Steel Brain'
      this.age = 17
    }

    serialize() {
      return JSON.stringify({ age: this.age, name: this.name })
    }

    unserialize(stuff) {
      const decoded = JSON.parse(stuff)
      this.age = decoded.age
      this.name = decoded.name
    }
  }

  expect(unserialize(serialize(new User(), { User }), { User })).toEqual(new User())
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

  expect(unserialize(serialize(new User()), { User })).toEqual(new User())
})

test('it works with nested serializable classes too', () => {
  class ChildObject {
    name: string

    constructor(name) {
      this.name = name
    }
  }

  class ChildClass {
    name: string

    constructor(name) {
      this.name = name
    }

    serialize() {
      return this.name
    }

    unserialize(stuff) {
      this.name = stuff
    }
  }

  class Parent {
    propObj: ChildObject
    propClass: ChildClass

    constructor() {
      this.propObj = new ChildObject('Steel')
      this.propClass = new ChildClass('Brain')
    }

    serialize() {
      return serialize([this.propObj, this.propClass])
    }

    unserialize(stuff) {
      const [propObj, propClass] = unserialize(stuff, SCOPE)
      this.propObj = propObj
      this.propClass = propClass
    }
  }

  const SCOPE = { Parent, ChildObject, ChildClass }
  expect(unserialize(serialize(new Parent(), SCOPE), SCOPE)).toEqual(new Parent())
})

test('it accepts serialiazable classes not available in scope when strict mode is off', () => {
  const unserialized = unserialize(
    'C:10:"TestParent":50:{a:2:{i:0;C:4:"Test":3:{asd}i:1;O:7:"TestTwo":0:{}}}',
    {},
    { strict: false },
  )
  expect(unserialized.constructor.name).toEqual('__PHP_Incomplete_Class')
  expect(unserialized.__PHP_Incomplete_Class_Name).toEqual('TestParent')
  expect(typeof unserialized.a).toEqual('undefined')
})

test('it accepts classes not available in scope when strict mode is off', () => {
  class TestParent {
    a: number

    constructor() {
      this.a = 10
    }
  }

  const item = new TestParent()
  const unserialized = unserialize(serialize(item), {}, { strict: false })
  expect(unserialized.constructor.name).toEqual('__PHP_Incomplete_Class')
  expect(unserialized.__PHP_Incomplete_Class_Name).toEqual('TestParent')
  expect(unserialized.a).toEqual(10)
})

test('unserialize key pairs correctly, not serialized by self', () => {
  expect(unserialize(`a:1:{s:12:"97YEAY3JO237";s:2:"hi"}`)).toMatchSnapshot()
  expect(unserialize(`a:1:{s:12:"02YJXTVI6ZOJ";s:2:"hi"}`)).toMatchSnapshot()
  expect(unserialize(`a:1:{s:12:"X0YJXTVI6ZOJ";s:2:"hi"}`)).toMatchSnapshot()
  expect(unserialize(`a:1:{s:2:"X0";s:2:"hi"}`)).toMatchSnapshot()
  expect(unserialize(`a:1:{s:12:"0XYJXTVI6ZOJ";s:2:"hi"}`)).toMatchSnapshot()
  expect(unserialize(`a:1:{s:2:"0x";s:2:"hi"}`)).toMatchSnapshot()
  expect(unserialize(`a:1:{s:2:"0N";s:2:"hi"}`)).toMatchSnapshot()
})

test('converts arrays with missing keys to objects', () => {
  const unserialized = unserialize('a:2:{i:25;i:105;i:31;i:106;}')
  expect(unserialized).toEqual({
    25: 105,
    31: 106,
  })
})

// test('converts private and protected fields properly', t => {
//   class Foo {
//   }
//
//   const unserialized = unserialize('O:3:"Foo":3:{s:12:" Foo private";N;s:12:" * protected";N;s:6:"public";N;}', {
//     Foo,
//   })
//   const expected = new Foo()
//   // @ts-ignore
//   expected.private = null
//   // @ts-ignore
//   expected.protected = null
//   // @ts-ignore
//   expected.public = null
//   expect(unserialized).toEqual(expected)
// })
