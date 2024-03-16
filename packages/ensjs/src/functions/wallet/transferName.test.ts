import type { Address, Hex } from 'viem'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../test/addTestContracts.js'
import getOwner from '../public/getOwner.js'
import transferName from './transferName.js'

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

it('should allow a transfer on the registry', async () => {
  const tx = await transferName(walletClient, {
    name: 'test.with-subnames.eth',
    newOwnerAddress: accounts[1],
    contract: 'registry',
    account: accounts[2],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const owner = await getOwner(publicClient, {
    name: 'test.with-subnames.eth',
    contract: 'registry',
  })

  expect(owner!.owner).toBe(accounts[1])
})
it('should allow a regular transfer on the registrar', async () => {
  const tx = await transferName(walletClient, {
    name: 'test123.eth',
    newOwnerAddress: accounts[2],
    contract: 'registrar',
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const owner = await getOwner(publicClient, {
    name: 'test123.eth',
    contract: 'registrar',
  })
  expect(owner!.registrant).toBe(accounts[2])
})
it('should allow a reclaim on the registrar', async () => {
  const changeRegistryOwnerTx = await transferName(walletClient, {
    name: 'test123.eth',
    newOwnerAddress: accounts[2],
    contract: 'registry',
    account: accounts[1],
  })
  expect(changeRegistryOwnerTx).toBeTruthy()
  const changeRegistryOwnerReceipt = await waitForTransaction(
    changeRegistryOwnerTx,
  )
  expect(changeRegistryOwnerReceipt.status).toBe('success')

  const tx = await transferName(walletClient, {
    name: 'test123.eth',
    newOwnerAddress: accounts[1],
    contract: 'registrar',
    reclaim: true,
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const owner = await getOwner(publicClient, {
    name: 'test123.eth',
    contract: 'registry',
  })
  expect(owner!.owner).toBe(accounts[1])
})
it('should allow a transfer on the namewrapper', async () => {
  const tx = await transferName(walletClient, {
    name: 'wrapped.eth',
    newOwnerAddress: accounts[2],
    contract: 'nameWrapper',
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const owner = await getOwner(publicClient, {
    name: 'wrapped.eth',
    contract: 'nameWrapper',
  })
  expect(owner!.owner).toBe(accounts[2])
})
it('errors if unknown contract', async () => {
  await expect(
    transferName(walletClient, {
      name: 'test123.eth',
      newOwnerAddress: accounts[2],
      contract: 'random' as any,
      account: accounts[1],
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [InvalidContractTypeError: Invalid contract type: random

    - Supported contract types: registry, registrar, nameWrapper

    Version: @ensdomains/ensjs@1.0.0-mock.0]
  `)
})
it('errors when reclaim is specified and contract is not registrar', async () => {
  await expect(
    transferName(walletClient, {
      name: 'test123.eth',
      newOwnerAddress: accounts[2],
      contract: 'registry',
      reclaim: true,
      account: accounts[1],
    } as any),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [AdditionalParameterSpecifiedError: Additional parameter specified: reclaim

    - Allowed parameters: name, newOwnerAddress, contract

    Details: Can't reclaim a name from any contract other than the registrar

    Version: @ensdomains/ensjs@1.0.0-mock.0]
  `)
})

describe('subnames/asParent', () => {
  it('allows transferring a subname on the registry', async () => {
    const tx = await transferName(walletClient, {
      name: 'test.with-subnames.eth',
      contract: 'registry',
      newOwnerAddress: accounts[1],
      asParent: true,
      account: accounts[1],
    })
    expect(tx).toBeTruthy()
    const receipt = await waitForTransaction(tx)
    expect(receipt.status).toBe('success')

    const owner = await getOwner(publicClient, {
      name: 'test.with-subnames.eth',
      contract: 'registry',
    })
    expect(owner!.owner).toBe(accounts[1])
  })
  it('allows transferring a subname on the namewrapper', async () => {
    const tx = await transferName(walletClient, {
      name: 'test.wrapped-with-subnames.eth',
      contract: 'nameWrapper',
      newOwnerAddress: accounts[1],
      asParent: true,
      account: accounts[1],
    })
    expect(tx).toBeTruthy()
    const receipt = await waitForTransaction(tx)
    expect(receipt.status).toBe('success')

    const owner = await getOwner(publicClient, {
      name: 'test.wrapped-with-subnames.eth',
      contract: 'nameWrapper',
    })
    expect(owner!.owner).toBe(accounts[1])
  })
  it('erorrs when asParent is specified and contract is registrar', async () => {
    await expect(
      transferName(walletClient, {
        name: 'test123.eth',
        newOwnerAddress: accounts[2],
        contract: 'registrar',
        asParent: true,
        account: accounts[1],
      } as any),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [AdditionalParameterSpecifiedError: Additional parameter specified: asParent

      - Allowed parameters: name, newOwnerAddress, contract, reclaim

      Details: Can't transfer a name as the parent owner on the registrar

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })
})
