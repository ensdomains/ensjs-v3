import { describe, expect, it } from 'vitest'
import { expiryToBigInt, wrappedLabelLengthCheck } from './wrapper.js'

describe('expiryToBigInt', () => {
  it('returns default value when expiry is undefined', () => {
    expect(expiryToBigInt(undefined)).toEqual(0n)
  })
  it('allows custom default value', () => {
    expect(expiryToBigInt(undefined, 123n)).toEqual(123n)
  })
  it('returns bigint expiry when expiry is bigint', () => {
    expect(expiryToBigInt(123n)).toEqual(123n)
  })
  it('returns bigint expiry when expiry is string', () => {
    expect(expiryToBigInt('123')).toEqual(123n)
  })
  it('returns bigint expiry when expiry is number', () => {
    expect(expiryToBigInt(123)).toEqual(123n)
  })
  it('returns bigint expiry when expiry is Date', () => {
    expect(expiryToBigInt(new Date(123000))).toEqual(123n)
  })
  it('throws when expiry is not bigint, string, number or Date', () => {
    expect(() => expiryToBigInt({} as any)).toThrowErrorMatchingInlineSnapshot(
      `[TypeError: Expiry must be a bigint, string, number or Date]`,
    )
  })
})

describe('wrappedLabelLengthCheck', () => {
  it('returns undefined when label is less than 255 bytes', () => {
    expect(wrappedLabelLengthCheck('a'.repeat(255))).toBeUndefined()
  })
  it('throws when label is more than 255 bytes', () => {
    expect(() => wrappedLabelLengthCheck('a'.repeat(256)))
      .toThrowErrorMatchingInlineSnapshot(`
        [WrappedLabelTooLargeError: Supplied label was too long

        - Supplied label: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        - Max byte length: 255
        - Actual byte length: 256

        Version: @ensdomains/ensjs@1.0.0-mock.0]
      `)
  })
})
