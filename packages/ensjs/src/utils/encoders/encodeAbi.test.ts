import { describe, expect, it } from 'vitest'
import {
  contentTypeToEncodeAs,
  encodeAbi,
  encodeAsToContentType,
} from './encodeAbi.js'

describe('encodeAbi', () => {
  it('encodes data as JSON', async () => {
    const data = { foo: 'bar' }
    const result = await encodeAbi({ encodeAs: 'json', data })
    expect(result.contentType).toEqual(1)
    expect(result.encodedData).toEqual('0x7b22666f6f223a22626172227d')
  })

  // Null JSON data
  it('encodes null JSON data', async () => {
    const result = await encodeAbi({ encodeAs: 'json', data: null })
    expect(result.contentType).toEqual(1)
    expect(result.encodedData).toEqual('0x')
  })

  it('encodes data as zlib', async () => {
    const data = { foo: 'bar' }
    const result = await encodeAbi({ encodeAs: 'zlib', data })
    expect(result.contentType).toEqual(2)
    expect(result.encodedData).toEqual(
      '0x789cab564acbcf57b2524a4a2c52aa05001d7a0434',
    )
  })

  // Null zlib data
  it('encodes null zlib data', async () => {
    const result = await encodeAbi({ encodeAs: 'zlib', data: null })
    expect(result.contentType).toEqual(2)
    expect(result.encodedData).toEqual('0x')
  })

  it('encodes data as cbor', async () => {
    const data = { foo: 'bar' }
    const result = await encodeAbi({ encodeAs: 'cbor', data })
    expect(result.contentType).toEqual(4)
    expect(result.encodedData).toEqual('0xa163666f6f63626172')
  })

  // Null CBOR data
  it('encodes null CBOR data', async () => {
    const result = await encodeAbi({ encodeAs: 'cbor', data: null })
    expect(result.contentType).toEqual(4)
    expect(result.encodedData).toEqual('0x')
  })

  it('encodes data as uri', async () => {
    const data = 'foo=bar'
    const result = await encodeAbi({ encodeAs: 'uri', data })
    expect(result.contentType).toEqual(8)
    expect(result.encodedData).toEqual('0x666f6f3d626172')
  })

  // Null URI data
  it('encodes null URI data', async () => {
    const result = await encodeAbi({ encodeAs: 'uri', data: null })
    expect(result.contentType).toEqual(8)
    expect(result.encodedData).toEqual('0x')
  })
})

describe('encodeAsToContentType', () => {
  it('returns the correct content type for json', () => {
    expect(encodeAsToContentType('json')).toEqual(1)
  })
  it('returns the correct content type for zlib', () => {
    expect(encodeAsToContentType('zlib')).toEqual(2)
  })
  it('returns the correct content type for cbor', () => {
    expect(encodeAsToContentType('cbor')).toEqual(4)
  })
  it('returns the correct content type for uri', () => {
    expect(encodeAsToContentType('uri')).toEqual(8)
  })
  it('throws an error for an unknown content type', () => {
    expect(() => encodeAsToContentType('foo' as any)).toThrow(
      'Unknown content type: foo',
    )
  })
})

describe('contentTypeToEncodeAs', () => {
  it('returns the correct encodeAs for json', () => {
    expect(contentTypeToEncodeAs(1)).toEqual('json')
  })
  it('returns the correct encodeAs for zlib', () => {
    expect(contentTypeToEncodeAs(2)).toEqual('zlib')
  })
  it('returns the correct encodeAs for cbor', () => {
    expect(contentTypeToEncodeAs(4)).toEqual('cbor')
  })
  it('returns the correct encodeAs for uri', () => {
    expect(contentTypeToEncodeAs(8)).toEqual('uri')
  })
  it('throws an error for an unknown content type', () => {
    expect(() => contentTypeToEncodeAs(3 as any)).toThrow(
      'Unknown content type: 3',
    )
  })
})
