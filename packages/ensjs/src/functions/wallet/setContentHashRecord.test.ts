import type { Address, Hex } from 'viem'
import { afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../test/addTestContracts.js'
import getContentHashRecord from '../public/getContentHashRecord.js'
import getResolver from '../public/getResolver.js'
import setContentHashRecord from './setContentHashRecord.js'

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

it('should allow a contenthash record to be set', async () => {
  const tx = await setContentHashRecord(walletClient, {
    name: 'test123.eth',
    contentHash:
      'ipns://k51qzi5uqu5dgox2z23r6e99oqency055a6xt92xzmyvpz8mwz5ycjavm0u150',
    resolverAddress: (await getResolver(publicClient, {
      name: 'test123.eth',
    }))!,
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const response = await getContentHashRecord(publicClient, {
    name: 'test123.eth',
  })
  expect(response).toMatchInlineSnapshot(`
    {
      "decoded": "k51qzi5uqu5dgox2z23r6e99oqency055a6xt92xzmyvpz8mwz5ycjavm0u150",
      "protocolType": "ipns",
    }
  `)
})

it('should allow a contenthash record to be set to blank', async () => {
  const tx = await setContentHashRecord(walletClient, {
    name: 'with-contenthash.eth',
    contentHash: null,
    resolverAddress: (await getResolver(publicClient, {
      name: 'test123.eth',
    }))!,
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const response = await getContentHashRecord(publicClient, {
    name: 'test123.eth',
  })
  expect(response).toBeNull()
})
