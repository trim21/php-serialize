import { isInteger, getByteLength } from './helpers'
import { ObjectName } from './symbol'

function serializePlainObject(item: any): string {
  const processed = Object.keys(item).map((key) => `${stringify(key)}${stringify(item[key])}`)
  const { length } = processed.filter((entry) => typeof entry !== 'undefined')
  return `${length}:{${processed.join('')}}`
}

function serializeArray(item: unknown[]): string {
  const processed = item.map((value, index) => `${stringify(index)}${stringify(value)}`)
  const { length } = processed.filter((entry) => typeof entry !== 'undefined')
  return `${length}:{${processed.join('')}}`
}

export function stringify(item: any): string {
  if (item === null) {
    return 'N;'
  }
  if (item === undefined) {
    return 'N;'
  }

  const type = typeof item

  if (type === 'number') {
    if (isInteger(item)) {
      return `i:${item};`
    }
    return `d:${item.toString().toUpperCase()};`
  }

  if (type === 'bigint') {
    return `i:${item.toString()};`
  }

  if (type === 'string') {
    return `s:${getByteLength(item)}:"${item}";`
  }

  if (type === 'boolean') {
    return `b:${item ? '1' : '0'};`
  }

  if (Buffer.isBuffer(item)) {
    return `s:${Buffer.byteLength(item)}:"${item.toString()}";`
  }

  if (Array.isArray(item)) {
    return `a:${serializeArray(item)}`
  }

  if (item instanceof Map) {
    return `a:${item.size}:{${Array.from(item.entries()).map(([value, key]) => {
      return `${stringify(value)}${stringify(key)}`
    })}}`
  }

  if (type === 'symbol') {
    const s = item.toString()
    return `s:${Buffer.byteLength(s)}:"${s}";`
  }

  if (type !== 'object') {
    throw new TypeError(`Unexpected type '${type}' encountered while attempting to serialize`)
  }

  const objectName = item[ObjectName]
  if (objectName) {
    return `O:${Buffer.byteLength(objectName)}:"${objectName}":${serializePlainObject(item)}`
  }

  return `a:${serializePlainObject(item)}`
}
