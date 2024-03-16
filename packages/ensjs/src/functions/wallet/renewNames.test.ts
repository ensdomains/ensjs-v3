import { labelhash, type Address, type Hex } from 'viem'
import { afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import { baseRegistrarNameExpiresSnippet } from '../../contracts/baseRegistrar.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../test/addTestContracts.js'
import getPrice from '../public/getPrice.js'
import renewNames from './renewNames.js'

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

const getExpiry = async (name: string) => {
  return publicClient.readContract({
    abi: baseRegistrarNameExpiresSnippet,
    functionName: 'nameExpires',
    address: getChainContractAddress({
      client: publicClient,
      contract: 'ensBaseRegistrarImplementation',
    }),
    args: [BigInt(labelhash(name.split('.')[0]))],
  })
}

it('should return a renew transaction for a single name and succeed', async () => {
  const name = 'to-be-renewed.eth'
  const duration = 31536000n

  const oldExpiry = await getExpiry(name)

  const price = await getPrice(publicClient, {
    nameOrNames: name,
    duration,
  })
  const total = price!.base + price!.premium

  const tx = await renewNames(walletClient, {
    nameOrNames: name,
    duration,
    value: total,
    account: accounts[0],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const newExpiry = await getExpiry(name)
  expect(newExpiry).toBe(oldExpiry + duration)
})

it('should return a renewAll transaction for multiple names and succeed', async () => {
  const names = ['to-be-renewed.eth', 'test123.eth']
  const duration = 31536000n

  const oldExpiries = await Promise.all(names.map(getExpiry))

  const price = await getPrice(publicClient, {
    nameOrNames: names,
    duration,
  })
  const total = price!.base + price!.premium

  const tx = await renewNames(walletClient, {
    nameOrNames: names,
    duration,
    value: total,
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const newExpiries = await Promise.all(names.map(getExpiry))
  for (let i = 0; i < names.length; i += 1) {
    expect(newExpiries[i]).toBe(oldExpiries[i] + duration)
  }
})
