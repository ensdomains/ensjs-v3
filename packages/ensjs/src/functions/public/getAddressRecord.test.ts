import { RawContractError, createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { describe, expect, it } from 'vitest'
import { addEnsContracts } from '../../contracts/addEnsContracts.js'
import type { ClientWithEns } from '../../contracts/consts.js'
import { publicClient } from '../../test/addTestContracts.js'
import getAddressRecord from './getAddressRecord.js'

const mainnetPublicClient = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http('https://mainnet.gateway.tenderly.co/4imxc4hQfRjxrVB2kWKvTo'),
})

describe('getAddressRecord()', () => {
  it('returns the ETH record when no coin is provided', async () => {
    const result = await getAddressRecord(publicClient, {
      name: 'with-profile.eth',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "id": 60,
        "name": "eth",
        "value": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      }
    `)
  })
  it('should return the correct address based on a coin ID input as a number', async () => {
    const result = await getAddressRecord(publicClient, {
      name: 'with-profile.eth',
      coin: 61,
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "id": 61,
        "name": "etcLegacy",
        "value": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      }
    `)
  })
  it('should return the correct address based on a coin ID input as a string', async () => {
    const result = await getAddressRecord(publicClient, {
      name: 'with-profile.eth',
      coin: '61',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "id": 61,
        "name": "etcLegacy",
        "value": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      }
    `)
  })
  it('should return the correct address based on a coin name', async () => {
    const result = await getAddressRecord(publicClient, {
      name: 'with-profile.eth',
      coin: 'etcLegacy',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "id": 61,
        "name": "etcLegacy",
        "value": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      }
    `)
  })
  it('should return null for a non-existent coin', async () => {
    const result = await getAddressRecord(publicClient, {
      name: 'with-profile.eth',
      coin: 'BNB',
    })
    expect(result).toBeNull()
  })
  it('should return value for label > 255 bytes', async () => {
    const result = await getAddressRecord(mainnetPublicClient, {
      name: `696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969.eth`,
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "id": 60,
        "name": "eth",
        "value": "0xde9ba5F62D6047C4a9cCF24455AA733cCC5B8F41",
      }
    `)
  })
  it('should return null on error when strict is false', async () => {
    await expect(
      getAddressRecord.decode(
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
      getAddressRecord.decode(
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

      Version: viem@2.5.0]
    `)
  })
})
