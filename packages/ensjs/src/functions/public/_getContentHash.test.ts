import { expect, it } from 'vitest'
import type { ClientWithEns } from '../../contracts/consts.js'
import _getContentHash from './_getContentHash.js'

it('does not propagate error when strict is false', async () => {
  const result = await _getContentHash.decode({} as ClientWithEns, '0x1234', {
    strict: false,
  })
  expect(result).toBeNull()
})

it('propagates error when strict is true', async () => {
  await expect(
    _getContentHash.decode({} as ClientWithEns, '0x1234', { strict: true }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [AbiDecodingDataSizeTooSmallError: Data size of 2 bytes is too small for given parameters.

    Params: (bytes)
    Data:   0x1234 (2 bytes)

    Version: viem@2.5.0]
  `)
})
