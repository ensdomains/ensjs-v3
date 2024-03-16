import { describe, expect, it } from 'vitest'
import {
  encodeSetContentHash,
  type EncodeSetContentHashParameters,
} from './encodeSetContentHash.js'

describe('encodeSetContentHash', () => {
  const namehash =
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  const contentHash = 'ipfs://QmXwMFNjzjRvZuPvzJfYJZ1QqX2QJjzj1YJZ1QqX2QJjzj'

  it('encodes the function data correctly when contentHash is not null', () => {
    const expectedEncodedData =
      '0x304e6ade1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000026e301017012208e9cc47fde7ff64028480ec671a4ddb8f767a71ff71a73247f51a495a6f296340000000000000000000000000000000000000000000000000000'
    const params: EncodeSetContentHashParameters = { namehash, contentHash }
    expect(encodeSetContentHash(params)).toEqual(expectedEncodedData)
  })

  it('encodes the function data correctly when contentHash is null', () => {
    const expectedEncodedData =
      '0x304e6ade1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000'
    const params: EncodeSetContentHashParameters = {
      namehash,
      contentHash: null,
    }
    expect(encodeSetContentHash(params)).toEqual(expectedEncodedData)
  })

  it('throws an error when contentHash is invalid', () => {
    const params: EncodeSetContentHashParameters = {
      namehash,
      contentHash: 'invalid-content-hash',
    }
    expect(() => encodeSetContentHash(params))
      .toThrowErrorMatchingInlineSnapshot(`
        [InvalidContentHashError: Invalid content hash

        Version: @ensdomains/ensjs@1.0.0-mock.0]
      `)
  })
})
