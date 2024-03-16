import type { Address, Hex } from 'viem'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { registrySetApprovalForAllSnippet } from '../../contracts/registry.js'
import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../test/addTestContracts.js'
import getOwner from '../public/getOwner.js'
import getResolver from '../public/getResolver.js'
import getWrapperData from '../public/getWrapperData.js'
import wrapName from './wrapName.js'

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

const approve = async () => {
  return walletClient.writeContract({
    abi: registrySetApprovalForAllSnippet,
    address: getChainContractAddress({
      client: walletClient,
      contract: 'ensRegistry',
    }),
    functionName: 'setApprovalForAll',
    args: [
      getChainContractAddress({
        client: walletClient,
        contract: 'ensNameWrapper',
      }),
      true,
    ],
    account: accounts[2],
  })
}

describe('eth 2ld', () => {
  it('should return a wrap name transaction and succeed', async () => {
    const tx = await wrapName(walletClient, {
      name: 'test123.eth',
      newOwnerAddress: accounts[2],
      account: accounts[1],
    })
    expect(tx).toBeTruthy()
    const receipt = await waitForTransaction(tx)
    expect(receipt.status).toBe('success')

    const owner = await getOwner(publicClient, {
      name: 'test123.eth',
    })
    expect(owner!.owner).toBe(accounts[2])
    expect(owner!.ownershipLevel).toBe('nameWrapper')
  })
  it('should allow initial fuses', async () => {
    const tx = await wrapName(walletClient, {
      name: 'test123.eth',
      newOwnerAddress: accounts[2],
      fuses: {
        named: ['CANNOT_UNWRAP', 'CANNOT_SET_TTL'],
      },
      account: accounts[1],
    })
    expect(tx).toBeTruthy()
    const receipt = await waitForTransaction(tx)
    expect(receipt.status).toBe('success')

    const wrapperData = await getWrapperData(publicClient, {
      name: 'test123.eth',
    })
    expect(wrapperData!.fuses.value).toBe(196625)
  })
  it('should allow a non-default resolver address', async () => {
    const tx = await wrapName(walletClient, {
      name: 'test123.eth',
      newOwnerAddress: accounts[2],
      resolverAddress: '0x42D63ae25990889E35F215bC95884039Ba354115',
      account: accounts[1],
    })
    expect(tx).toBeTruthy()
    const receipt = await waitForTransaction(tx)
    expect(receipt.status).toBe('success')

    const resolver = await getResolver(publicClient, {
      name: 'test123.eth',
    })
    expect(resolver).toBe('0x42D63ae25990889E35F215bC95884039Ba354115')
  })
  it('should error for labels longer than 255 bytes', async () => {
    const label = 'a'.repeat(256)
    await expect(
      wrapName(walletClient, {
        name: `${label}.eth`,
        newOwnerAddress: accounts[2],
        account: accounts[1],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [WrappedLabelTooLargeError: Supplied label was too long

      - Supplied label: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      - Max byte length: 255
      - Actual byte length: 256

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })
})

describe('other', () => {
  beforeEach(async () => {
    await approve()
  })
  it('should return a wrap name transaction and succeed', async () => {
    const tx = await wrapName(walletClient, {
      name: 'test.with-subnames.eth',
      newOwnerAddress: accounts[2],
      account: accounts[2],
    })
    expect(tx).toBeTruthy()
    const receipt = await waitForTransaction(tx)
    expect(receipt.status).toBe('success')

    const owner = await getOwner(publicClient, {
      name: 'test.with-subnames.eth',
    })
    expect(owner!.owner).toBe(accounts[2])
    expect(owner!.ownershipLevel).toBe('nameWrapper')
  })
  it('should allow a non-default resolver address', async () => {
    const tx = await wrapName(walletClient, {
      name: 'test.with-subnames.eth',
      newOwnerAddress: accounts[2],
      resolverAddress: '0x42D63ae25990889E35F215bC95884039Ba354115',
      account: accounts[2],
    })
    expect(tx).toBeTruthy()
    const receipt = await waitForTransaction(tx)
    expect(receipt.status).toBe('success')

    const resolver = await getResolver(publicClient, {
      name: 'test.with-subnames.eth',
    })
    expect(resolver).toBe('0x42D63ae25990889E35F215bC95884039Ba354115')
  })
  it('should error if initial fuses are provided', async () => {
    await expect(
      wrapName(walletClient, {
        name: 'test.with-subnames.eth',
        newOwnerAddress: accounts[2],
        fuses: {
          named: ['CANNOT_UNWRAP', 'CANNOT_SET_TTL'],
        } as any,
        account: accounts[2],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [AdditionalParameterSpecifiedError: Additional parameter specified: fuses

      - Allowed parameters: name, wrappedOwner, resolverAddress

      Details: Fuses cannot be initially set when wrapping non eth-2ld names

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })
  it('should error for a label longer than 255 bytes', async () => {
    const label = 'a'.repeat(256)
    await expect(
      wrapName(walletClient, {
        name: `${label}.with-subnames.eth`,
        newOwnerAddress: accounts[2],
        account: accounts[2],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [WrappedLabelTooLargeError: Supplied label was too long

      - Supplied label: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      - Max byte length: 255
      - Actual byte length: 256

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })
})
