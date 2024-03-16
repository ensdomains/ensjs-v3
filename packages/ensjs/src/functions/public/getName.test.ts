import { RawContractError, type Address, type Hex } from 'viem'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { ClientWithEns } from '../../contracts/consts.js'
import {
  deploymentAddresses,
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../test/addTestContracts.js'
import createSubname from '../wallet/createSubname.js'
import setAddressRecord from '../wallet/setAddressRecord.js'
import setPrimaryName from '../wallet/setPrimaryName.js'
import getName from './getName.js'

let snapshot: Hex
let accounts: Address[]

beforeAll(async () => {
  accounts = await walletClient.getAddresses()
})

beforeEach(async () => {
  snapshot = await testClient.snapshot()
})

afterEach(async () => {
  await testClient.revert({ id: snapshot })
})

describe('getName', () => {
  it('should get a primary name from an address', async () => {
    const result = await getName(publicClient, {
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "match": true,
        "name": "with-profile.eth",
        "resolverAddress": "${deploymentAddresses.LegacyPublicResolver}",
        "reverseResolverAddress": "${deploymentAddresses.PublicResolver}",
      }
    `)
  })
  it('should return null for an address with no primary name', async () => {
    const result = await getName(publicClient, {
      address: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0',
    })
    expect(result).toBeNull()
  })
  it('should return null for a name with no forward resolution when allowMismatch is false', async () => {
    const tx = await setPrimaryName(walletClient, {
      name: 'with-profile.eth',
      account: accounts[0],
    })
    await waitForTransaction(tx)

    const result = await getName(publicClient, {
      address: accounts[0],
    })
    expect(result).toBeNull()
  })
  it('should return with a false match for a name with no forward resolution when allowMismatch is true', async () => {
    const tx = await setPrimaryName(walletClient, {
      name: 'with-profile.eth',
      account: accounts[0],
    })
    await waitForTransaction(tx)

    const result = await getName(publicClient, {
      address: accounts[0],
      allowMismatch: true,
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "match": false,
        "name": "with-profile.eth",
        "resolverAddress": "${deploymentAddresses.LegacyPublicResolver}",
        "reverseResolverAddress": "${deploymentAddresses.PublicResolver}",
      }
    `)
  })
  it('should return null on error when strict is false', async () => {
    await expect(
      getName.decode(
        {} as ClientWithEns,
        new RawContractError({
          data: '0x7199966d', // ResolverNotFound()
        }),
        {
          address: '0x1234567890abcdef',
          args: ['0x', '0x'],
        },
        { address: accounts[0], allowMismatch: true, strict: false },
      ),
    ).resolves.toBeNull()
  })
  it('should throw on error when strict is true', async () => {
    await expect(
      getName.decode(
        {} as ClientWithEns,
        new RawContractError({
          data: '0x7199966d', // ResolverNotFound()
        }),
        {
          address: '0x1234567890abcdef',
          args: ['0x'],
        },

        { address: accounts[0], allowMismatch: true, strict: true },
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "reverse" reverted.

      Error: ResolverNotFound()
       
      Contract Call:
        address:   0x1234567890abcdef
        function:  reverse(bytes reverseName)
        args:             (0x)

      Version: viem@2.5.0]
    `)
  })
  it('should not return unnormalised name', async () => {
    const tx1 = await createSubname(walletClient, {
      name: 'suB.with-profile.eth',
      contract: 'registry',
      owner: accounts[0],
      resolverAddress: deploymentAddresses.PublicResolver,
      account: accounts[0],
    })
    await waitForTransaction(tx1)
    const tx2 = await setAddressRecord(walletClient, {
      name: 'suB.with-profile.eth',
      coin: 'eth',
      resolverAddress: deploymentAddresses.PublicResolver,
      value: accounts[0],
      account: accounts[0],
    })
    await waitForTransaction(tx2)
    const tx3 = await setPrimaryName(walletClient, {
      name: 'suB.with-profile.eth',
      account: accounts[0],
    })
    await waitForTransaction(tx3)

    const result = await getName(publicClient, {
      address: accounts[0],
    })

    expect(result).toBeNull()
  })
})
