export function getByteLength(contents: string | Buffer): number {
  return Buffer.byteLength(contents)
}

// isInteger = is NOT a float but still a number
export function isInteger(value: any): boolean {
  return typeof value === 'number' && parseInt(value.toString(), 10) === value
}
