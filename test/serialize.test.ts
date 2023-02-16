import { test, expect } from '@jest/globals'

import serialize from '../src/serialize'

test('serialize map', () => {
  expect(serialize(new Map([[1, 'q']]))).toBe('a:1:{i:1;s:1:"q";}')
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
    return serialize([new Test(), new TestTwo()])
  }
}

class DeepUser {}

test('serialize', () => {
  expect(serialize(null)).toMatchInlineSnapshot(`"N;"`)
  expect(serialize(1)).toMatchInlineSnapshot(`"i:1;"`)
  expect(serialize(1.1)).toMatchInlineSnapshot(`"d:1.1;"`)
  expect(serialize(1.7976931348623157e308)).toMatchInlineSnapshot(`"d:1.7976931348623157E+308;"`)
  expect(serialize('你好世界')).toMatchInlineSnapshot(`"s:12:"你好世界";"`)
  expect(serialize([1, 2, 3, 4, 5])).toMatchInlineSnapshot(`"a:5:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;i:4;i:5;}"`)
  expect(serialize(['Helló', 'World'])).toMatchInlineSnapshot(`"a:2:{i:0;s:6:"Helló";i:1;s:5:"World";}"`)
  expect(serialize({ hey: 'hi' })).toMatchInlineSnapshot(`"a:1:{s:3:"hey";s:2:"hi";}"`)
  expect(serialize({ key: 'value', key2: 1 })).toMatchInlineSnapshot(`"a:2:{s:3:"key";s:5:"value";s:4:"key2";i:1;}"`)
  expect(serialize({ key: 1, key2: 'value2' })).toMatchInlineSnapshot(`"a:2:{s:3:"key";i:1;s:4:"key2";s:6:"value2";}"`)
  expect(serialize({ key: '1value', key2: 'value2' })).toMatchInlineSnapshot(
    `"a:2:{s:3:"key";s:6:"1value";s:4:"key2";s:6:"value2";}"`,
  )
  expect(serialize({ key: 'value1', key2: 'value2' })).toMatchInlineSnapshot(
    `"a:2:{s:3:"key";s:6:"value1";s:4:"key2";s:6:"value2";}"`,
  )
  expect(serialize(new Test())).toMatchInlineSnapshot(`"C:4:"Test":3:{asd}"`)
  expect(serialize(new TestTwo())).toMatchInlineSnapshot(`"O:7:"TestTwo":1:{s:4:"test";s:2:"hi";}"`)
  expect(serialize(new TestParent())).toMatchInlineSnapshot(
    `"C:10:"TestParent":70:{a:2:{i:0;C:4:"Test":3:{asd}i:1;O:7:"TestTwo":1:{s:4:"test";s:2:"hi";}}}"`,
  )
  expect(serialize(new DeepUser(), { 'Deep\\User': DeepUser })).toMatchInlineSnapshot(`"O:9:"Deep\\User":0:{}"`)
  expect(serialize(['shallow', undefined, undefined, undefined, 'array'])).toMatchInlineSnapshot(
    `"a:5:{i:0;s:7:"shallow";i:1;N;i:2;N;i:3;N;i:4;s:5:"array";}"`,
  )

  expect(
    serialize(
      (() => {
        const arr: string[] = []
        arr[0] = 'shallow'
        arr[4] = 'array'
        return arr
      })(),
    ),
  ).toMatchInlineSnapshot(`"a:2:{i:0;s:7:"shallow";i:4;s:5:"array";}"`)
})
