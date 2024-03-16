import type { Address, Hex } from 'viem'
import { afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../test/addTestContracts.js'
import getOwner from '../public/getOwner.js'
import unwrapName from './unwrapName.js'

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

it('should return a .eth unwrap name transaction and succeed', async () => {
  const tx = await unwrapName(walletClient, {
    name: 'wrapped.eth',
    newOwnerAddress: accounts[1],
    newRegistrantAddress: accounts[1],
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const owner = await getOwner(publicClient, {
    name: 'wrapped.eth',
  })
  expect(owner!.owner).toBe(accounts[1])
  expect(owner!.registrant).toBe(accounts[1])
  expect(owner!.ownershipLevel).toBe('registrar')
})
it('should return a regular unwrap name transaction and succeed', async () => {
  const tx = await unwrapName(walletClient, {
    name: 'test.wrapped-with-subnames.eth',
    newOwnerAddress: accounts[1],
    account: accounts[2],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const owner = await getOwner(publicClient, {
    name: 'test.wrapped-with-subnames.eth',
  })
  expect(owner!.owner).toBe(accounts[1])
  expect(owner!.ownershipLevel).toBe('registry')
})
it('should error if newRegistrantAddress is not specified for .eth', async () => {
  await expect(
    unwrapName(walletClient, {
      name: 'wrapped.eth',
      newOwnerAddress: accounts[1],
      account: accounts[1],
    } as any),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [RequiredParameterNotSpecifiedError: Required parameter not specified: newRegistrantAddress

    Details: Must provide newRegistrantAddress for eth-2ld names

    Version: @ensdomains/ensjs@1.0.0-mock.0]
  `)
})
it('should error if newRegistrantAddress is specified for non .eth', async () => {
  await expect(
    unwrapName(walletClient, {
      name: 'test.wrapped-with-subnames.eth',
      newOwnerAddress: accounts[1],
      newRegistrantAddress: accounts[1],
      account: accounts[2],
    } as any),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [AdditionalParameterSpecifiedError: Additional parameter specified: newRegistrantAddress

    - Allowed parameters: name, newOwnerAddress

    Details: newRegistrantAddress can only be specified for eth-2ld names

    Version: @ensdomains/ensjs@1.0.0-mock.0]
  `)
})
