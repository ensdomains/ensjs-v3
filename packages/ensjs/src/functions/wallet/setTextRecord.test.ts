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

it('should allow a text record to be set', async () => {
  const tx = await setTextRecord(walletClient, {
    name: 'test123.eth',
    key: 'foo',
    value: 'bar',
    resolverAddress: (await getResolver(publicClient, {
      name: 'test123.eth',
    }))!,
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const response = await getText(publicClient, {
    name: 'test123.eth',
    key: 'foo',
  })
  expect(response).toBe('bar')
})

it('should allow a text record to be set to blank', async () => {
  const tx = await setTextRecord(walletClient, {
    name: 'test123.eth',
    key: 'url',
    value: null,
    resolverAddress: (await getResolver(publicClient, {
      name: 'test123.eth',
    }))!,
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const response = await getText(publicClient, {
    name: 'test123.eth',
    key: 'url',
  })
  expect(response).toBeNull()
})
