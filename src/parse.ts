import { Parser } from './parser'
import { isInteger } from './helpers'
import { ObjectName } from './symbol'

export interface Options {
  strict: boolean
  encoding: BufferEncoding
}

function deserializePairs(parser: Parser, length: number, options: Options): Array<{ key: any; value: any }> {
  const pairs: ReturnType<typeof deserializePairs> = []
  for (let i = 0; i < length; i += 1) {
    const key = deserializeItem(parser, options)
    parser.seekExpected(';')
    const value = deserializeItem(parser, options)
    if (parser.peekAhead(1) === ';') {
      parser.advance(1)
    }
    pairs.push({ key, value })
  }
  return pairs
}

function deserializeItem(parser: Parser, options: Options): any {
  const type = parser.getType()
  if (type === 'null') {
    return null
  }

  if (type === 'int' || type === 'float') {
    const value = parser.readUntil(';')
    return type === 'int' ? parseInt(value, 10) : parseFloat(value)
  }

  if (type === 'boolean') {
    const value = parser.readAhead(1)
    return value === '1'
  }

  if (type === 'string') {
    return parser.getByLength('"', '"', (length) => parser.readAhead(length))
  }

  if (type === 'array-object') {
    const pairs = parser.getByLength('{', '}', (length) => deserializePairs(parser, length, options))

    const isArray = pairs.every((item, idx) => isInteger(item.key) && idx === item.key)
    const result = isArray ? [] : Object.create(null)
    pairs.forEach(({ key, value }) => {
      result[key] = value
    })
    return result
  }

  if (type === 'object') {
    const name = parser.getByLength('"', '"', (length) => parser.readAhead(length))
    parser.seekExpected(':')

    const result = Object.create(null)
    result[ObjectName] = name

    const pairs = parser.getByLength('{', '}', (length) => deserializePairs(parser, length, options))
    pairs.forEach(({ key, value }) => {
      result[key] = value
    })
    return result
  }

  if (type === 'serializable-class') {
    if (options.strict) {
      throw new TypeError(`can't parse serializable class yet`)
    }

    const name = parser.getByLength('"', '"', (length) => parser.readAhead(length))
    parser.seekExpected(':')

    const result = Object.create(null)
    result[ObjectName] = name

    return parser.getByLength('{', '}', (length) => parser.readAhead(length))
  }

  throw new Error(`Invalid type '${type}' encounter while deserializing`)
}

export function parse(item: string | Buffer, givenOptions: Partial<Options> = {}): any {
  const options = {
    strict: givenOptions.strict ?? true,
    encoding: givenOptions.encoding ?? 'utf-8',
  }

  const parser = new Parser(Buffer.from(item), 0, options)

  return deserializeItem(parser, options)
}
