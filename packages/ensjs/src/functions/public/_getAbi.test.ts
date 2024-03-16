import { expect, it } from 'vitest'
import type { ClientWithEns } from '../../contracts/consts.js'
import _getAbi from './_getAbi.js'

it('does not propagate error when strict is false', async () => {
  const result = await _getAbi.decode({} as ClientWithEns, '0x1234', {
    strict: false,
  })
  expect(result).toBeNull()
})

it('propagates error when strict is true', async () => {
  await expect(_getAbi.decode({} as ClientWithEns, '0x1234', { strict: true }))
    .rejects.toThrowErrorMatchingInlineSnapshot(`
    [AbiDecodingDataSizeTooSmallError: Data size of 2 bytes is too small for given parameters.

    Params: (uint256, bytes)
    Data:   0x1234 (2 bytes)

    Version: viem@2.5.0]
  `)
})
