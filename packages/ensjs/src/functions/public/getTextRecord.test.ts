import { RawContractError } from 'viem'
import { describe, expect, it } from 'vitest'
import type { ClientWithEns } from '../../contracts/consts.js'
import { publicClient } from '../../test/addTestContracts.js'
import getTextRecord from './getTextRecord.js'

describe('getTextRecord()', () => {
  it('should return a record from a key', async () => {
    const result = await getTextRecord(publicClient, {
      name: 'with-profile.eth',
      key: 'description',
    })
    expect(result).toBe('Hello2')
  })

  it('should return null for a non-existent key', async () => {
    const result = await getTextRecord(publicClient, {
      name: 'with-profile.eth',
      key: 'thiskeydoesntexist',
    })
    expect(result).toBeNull()
  })
  it('should return null on error when strict is false', async () => {
    await expect(
      getTextRecord.decode(
        {} as ClientWithEns,
        new RawContractError({
          data: '0x7199966d', // ResolverNotFound()
        }),
        {
          address: '0x1234567890abcdef',
          args: ['0x', '0x'],
        },
        { strict: false },
      ),
    ).resolves.toBeNull()
  })
  it('should throw on error when strict is true', async () => {
    await expect(
      getTextRecord.decode(
        {} as ClientWithEns,
        new RawContractError({
          data: '0x7199966d', // ResolverNotFound()
        }),
        {
          address: '0x1234567890abcdef',
          args: ['0x', '0x'],
        },
        { strict: true },
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "resolve" reverted.

      Error: ResolverNotFound()
       
      Contract Call:
        address:   0x1234567890abcdef
        function:  resolve(bytes name, bytes data)
        args:             (0x, 0x)

      Version: viem@2.9.2]
    `)
  })
})
