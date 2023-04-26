import { test, expect } from '@jest/globals'

import { stringify } from '../src/'
import { ObjectName } from '../src/symbol'

test('serialize map', () => {
  expect(stringify(new Map([[1, 'q']]))).toBe('a:1:{i:1;s:1:"q";}')
})

class Test {
  serialize(): string {
    return 'asd'
  }
}

class TestTwo {
  test: string

  constructor() {
    this.test = 'hi'
  }
}

class TestParent {
  serialize(): string {
    return stringify([new Test(), new TestTwo()])
  }
}

class DeepUser {}

test('serialize', () => {
  expect(stringify(null)).toMatchInlineSnapshot(`"N;"`)
  expect(stringify(undefined)).toMatchInlineSnapshot(`"N;"`)

  expect(stringify(1)).toMatchInlineSnapshot(`"i:1;"`)

  expect(stringify(1.1)).toMatchInlineSnapshot(`"d:1.1;"`)

  expect(stringify(1.7976931348623157e308)).toMatchInlineSnapshot(`"d:1.7976931348623157E+308;"`)

  expect(stringify('你好世界')).toMatchInlineSnapshot(`"s:12:"你好世界";"`)

  expect(stringify([1, 2, 3, 4, 5])).toMatchInlineSnapshot(`"a:5:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;i:4;i:5;}"`)

  expect(stringify(['Helló', 'World'])).toMatchInlineSnapshot(`"a:2:{i:0;s:6:"Helló";i:1;s:5:"World";}"`)

  expect(stringify({ hey: 'hi' })).toMatchInlineSnapshot(`"a:1:{s:3:"hey";s:2:"hi";}"`)

  expect(stringify({ key: 'value', key2: 1 })).toMatchInlineSnapshot(`"a:2:{s:3:"key";s:5:"value";s:4:"key2";i:1;}"`)

  expect(stringify({ key: 1, key2: 'value2' })).toMatchInlineSnapshot(`"a:2:{s:3:"key";i:1;s:4:"key2";s:6:"value2";}"`)

  expect(stringify({ key: '1value', key2: 'value2' })).toMatchInlineSnapshot(
    `"a:2:{s:3:"key";s:6:"1value";s:4:"key2";s:6:"value2";}"`,
  )

  expect(stringify({ key: 'value1', key2: 'value2' })).toMatchInlineSnapshot(
    `"a:2:{s:3:"key";s:6:"value1";s:4:"key2";s:6:"value2";}"`,
  )

  expect(stringify(new Test())).toMatchInlineSnapshot(`"a:0:{}"`)

  expect(stringify(new TestTwo())).toMatchInlineSnapshot(`"a:1:{s:4:"test";s:2:"hi";}"`)

  expect(stringify(new TestParent())).toMatchInlineSnapshot(`"a:0:{}"`)

  expect(stringify(new DeepUser())).toMatchInlineSnapshot(`"a:0:{}"`)

  expect(stringify(['shallow', undefined, undefined, undefined, 'array'])).toMatchInlineSnapshot(
    `"a:5:{i:0;s:7:"shallow";i:1;N;i:2;N;i:3;N;i:4;s:5:"array";}"`,
  )

  expect(
    stringify(
      (() => {
        const arr: string[] = []
        arr[0] = 'shallow'
        arr[4] = 'array'
        return arr
      })(),
    ),
  ).toMatchInlineSnapshot(`"a:2:{i:0;s:7:"shallow";i:4;s:5:"array";}"`)

  class O {
    [ObjectName] = 'OO'
  }

  expect(stringify(new O())).toMatchInlineSnapshot(`"O:2:"OO":0:{}"`)

  expect(stringify(10000000000000000n)).toMatchInlineSnapshot(`"i:10000000000000000;"`)
})

test('plain object name', () => {
  expect(stringify({ [ObjectName]: 'NN' })).toMatchInlineSnapshot(`"O:2:"NN":0:{}"`)

  expect(stringify({ hello: { [ObjectName]: 'NN', k: 'vv' } })).toMatchInlineSnapshot(
    `"a:1:{s:5:"hello";O:2:"NN":1:{s:1:"k";s:2:"vv";}}"`,
  )
})

test('symbol', () => {
  expect(stringify(Symbol('s'))).toMatchInlineSnapshot(`"s:9:"Symbol(s)";"`)
  expect(stringify(Symbol.for('s'))).toMatchInlineSnapshot(`"s:9:"Symbol(s)";"`)
})
