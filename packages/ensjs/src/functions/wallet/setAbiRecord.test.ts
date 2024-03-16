import type { Address, Hex } from 'viem'
import { afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../test/addTestContracts.js'
import { encodeAbi } from '../../utils/encoders/encodeAbi.js'
import getAbiRecord from '../public/getAbiRecord.js'
import getResolver from '../public/getResolver.js'
import setAbiRecord from './setAbiRecord.js'

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

const dummyABI = [
  {
    type: 'function',
    name: 'supportsInterface',
    constant: true,
    stateMutability: 'view',
    payable: false,
    inputs: [
      {
        type: 'bytes4',
      },
    ],
    outputs: [
      {
        type: 'bool',
      },
    ],
  },
]

it('should allow an abi record to be set with json content type', async () => {
  const encodedAbi = await encodeAbi({ encodeAs: 'json', data: dummyABI })
  const tx = await setAbiRecord(walletClient, {
    name: 'test123.eth',
    encodedAbi,
    resolverAddress: (await getResolver(publicClient, {
      name: 'test123.eth',
    }))!,
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const response = await getAbiRecord(publicClient, {
    name: 'test123.eth',
  })
  expect(response!.abi).toEqual(dummyABI)
  expect(response!.contentType).toEqual(1)
  expect(response!.decoded).toBe(true)
})

it('should allow an abi record to be set with zlib content type', async () => {
  const encodedAbi = await encodeAbi({ encodeAs: 'zlib', data: dummyABI })
  const tx = await setAbiRecord(walletClient, {
    name: 'test123.eth',
    encodedAbi,
    resolverAddress: (await getResolver(publicClient, {
      name: 'test123.eth',
    }))!,
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const response = await getAbiRecord(publicClient, {
    name: 'test123.eth',
  })
  expect(response!.abi).toEqual(dummyABI)
  expect(response!.contentType).toEqual(2)
  expect(response!.decoded).toBe(true)
})

it('should allow an abi record to be set with cbor content type', async () => {
  const encodedAbi = await encodeAbi({ encodeAs: 'cbor', data: dummyABI })
  const tx = await setAbiRecord(walletClient, {
    name: 'test123.eth',
    encodedAbi,
    resolverAddress: (await getResolver(publicClient, {
      name: 'test123.eth',
    }))!,
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const response = await getAbiRecord(publicClient, {
    name: 'test123.eth',
  })
  expect(response!.abi).toEqual(dummyABI)
  expect(response!.contentType).toEqual(4)
  expect(response!.decoded).toBe(true)
})

it('should allow an abi record to be set with uri content type', async () => {
  const encodedAbi = await encodeAbi({
    encodeAs: 'uri',
    data: 'https://example.com',
  })
  const tx = await setAbiRecord(walletClient, {
    name: 'test123.eth',
    encodedAbi,
    resolverAddress: (await getResolver(publicClient, {
      name: 'test123.eth',
    }))!,
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const response = await getAbiRecord(publicClient, {
    name: 'test123.eth',
  })
  expect(response!.abi).toEqual('https://example.com')
  expect(response!.contentType).toEqual(8)
  expect(response!.decoded).toBe(true)
})

type EncodeAs = Parameters<typeof encodeAbi>[0]['encodeAs']
it.each([
  ['json', 'with-type-1-abi.eth'],
  ['zlib', 'with-type-2-abi.eth'],
  ['cbor', 'with-type-4-abi.eth'],
  ['uri', 'with-type-8-abi.eth'],
] as [EncodeAs, string][])(
  `should allow an abi record to be set to null with %s content type`,
  async (encodeAs, name) => {
    const encodedAbi = await encodeAbi({
      encodeAs,
      data: null,
    })
    const tx = await setAbiRecord(walletClient, {
      name,
      encodedAbi,
      resolverAddress: (await getResolver(publicClient, {
        name,
      }))!,
      account: accounts[1],
    })
    expect(tx).toBeTruthy()
    const receipt = await waitForTransaction(tx)
    expect(receipt.status).toBe('success')

    const response = await getAbiRecord(publicClient, {
      name,
    })
    expect(response).toBeNull()
  },
)
