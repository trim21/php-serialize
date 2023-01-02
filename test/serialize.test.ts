import * as path from 'path'
import * as fs from 'fs'

import { test, expect } from '@jest/globals'

import serializeForTests from './serialize'
import serialize from '../src/serialize'

test('serialize compat with php', async () => {
  const givenOutput: string = await new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'serialize.php.out'), 'utf8', (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
  // NOTE: Patch PHP floating point madness
  const output = givenOutput.replace('1.1000000000000001', '1.1').trim().split('\n')
  const ourOutput = serializeForTests()
  for (let i = 0, { length } = output; i < length; i += 1) {
    expect(output[i]).toEqual(ourOutput[i])
  }
})

test('serialize map', () => {
  expect(serialize(new Map([[1, 'q']]))).toBe('a:1:{i:1;s:1:"q";}')
})
