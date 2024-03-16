import { describe, expect, it } from 'vitest'
import { encodeAbi } from './encodeAbi.js'
import { encodeSetAbi, type EncodeSetAbiParameters } from './encodeSetAbi.js'

describe('encodeSetAbi', () => {
  const namehash =
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  const contentType = 1
  const encodedData = '0x'

  const parameters: EncodeSetAbiParameters = {
    namehash,
    contentType,
    encodedData,
  }

  it('encodes the setAbi function data correctly with null encodedData', async () => {
    const expected =
      '0x623195b01234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000'
    const result = encodeSetAbi(parameters)
    expect(result).toEqual(expected)
  })

  it('encodes the setAbi function data correctly with encodedData', async () => {
    const result = encodeSetAbi({
      namehash,
      ...(await encodeAbi({ encodeAs: 'json', data: { foo: 'bar' } })),
    })
    expect(result).toEqual(
      '0x623195b01234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000d7b22666f6f223a22626172227d00000000000000000000000000000000000000',
    )
  })
})
