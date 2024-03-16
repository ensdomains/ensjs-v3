import type { Address, Hex } from 'viem'
import { afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../test/addTestContracts.js'
import getResolver from '../public/getResolver.js'
import getText from '../public/getTextRecord.js'
import clearRecords from './clearRecords.js'
import setTextRecord from './setTextRecord.js'

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

it('should allow a name to be cleared', async () => {
  const resolverAddress = (await getResolver(publicClient, {
    name: 'wrapped.eth',
  }))!

  const setTextTx = await setTextRecord(walletClient, {
    name: 'wrapped.eth',
    key: 'description',
    value: 'test',
    resolverAddress,
    account: accounts[1],
  })

  expect(setTextTx).toBeTruthy()
  const setTextReceipt = await waitForTransaction(setTextTx)
  expect(setTextReceipt.status).toBe('success')

  const priorResponse = await getText(publicClient, {
    name: 'wrapped.eth',
    key: 'description',
  })
  expect(priorResponse).toBe('test')

  const tx = await clearRecords(walletClient, {
    name: 'wrapped.eth',
    resolverAddress,
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const response = await getText(publicClient, {
    name: 'wrapped.eth',
    key: 'description',
  })
  expect(response).toBeNull()
})
