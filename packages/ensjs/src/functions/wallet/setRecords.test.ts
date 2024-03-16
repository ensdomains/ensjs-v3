import type { Address, Hex } from 'viem'
import { afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../test/addTestContracts.js'
import { encodeAbi } from '../../utils/encoders/encodeAbi.js'
import getRecords from '../public/getRecords.js'
import getResolver from '../public/getResolver.js'
import setRecords from './setRecords.js'

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

it('should return a transaction to the resolver and set successfully', async () => {
  const tx = await setRecords(walletClient, {
    name: 'test123.eth',
    resolverAddress: (await getResolver(publicClient, {
      name: 'test123.eth',
    }))!,
    coins: [
      {
        coin: 'etcLegacy',
        value: '0x42D63ae25990889E35F215bC95884039Ba354115',
      },
    ],
    texts: [{ key: 'foo', value: 'bar' }],
    abi: await encodeAbi({ encodeAs: 'json', data: dummyABI }),
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const records = await getRecords(publicClient, {
    name: 'test123.eth',
    coins: ['etcLegacy'],
    texts: ['foo'],
    abi: true,
  })
  expect(records.abi!.abi).toStrictEqual(dummyABI)
  expect(records.coins).toMatchInlineSnapshot(`
    [
      {
        "id": 61,
        "name": "etcLegacy",
        "value": "0x42D63ae25990889E35F215bC95884039Ba354115",
      },
    ]
  `)
  expect(records.texts).toMatchInlineSnapshot(`
    [
      {
        "key": "foo",
        "value": "bar",
      },
    ]
  `)
})
it('should return a transaction to the resolver and delete successfully', async () => {
  const setupTx = await setRecords(walletClient, {
    name: 'test123.eth',
    resolverAddress: (await getResolver(publicClient, {
      name: 'test123.eth',
    }))!,
    coins: [
      {
        coin: 'etcLegacy',
        value: '0x42D63ae25990889E35F215bC95884039Ba354115',
      },
    ],
    texts: [{ key: 'foo', value: 'bar' }],
    abi: await encodeAbi({ encodeAs: 'json', data: dummyABI }),
    account: accounts[1],
  })
  await waitForTransaction(setupTx)
  const checkRecords = await getRecords(publicClient, {
    name: 'test123.eth',
    coins: ['etcLegacy'],
    texts: ['foo'],
    abi: true,
  })
  expect(checkRecords.abi!.abi).not.toBeNull()
  expect(checkRecords.coins).toHaveLength(1)
  expect(checkRecords.texts).toHaveLength(1)
  const tx = await setRecords(walletClient, {
    name: 'test123.eth',
    resolverAddress: (await getResolver(publicClient, {
      name: 'test123.eth',
    }))!,
    coins: [
      {
        coin: 'etcLegacy',
        value: '',
      },
    ],
    texts: [{ key: 'foo', value: '' }],
    abi: await encodeAbi({ encodeAs: 'json', data: null }),
    account: accounts[1],
  })
  await waitForTransaction(tx)

  const records = await getRecords(publicClient, {
    name: 'test123.eth',
    coins: ['etcLegacy'],
    texts: ['foo'],
    abi: true,
  })
  expect(records.abi).toBeNull()
  expect(records.coins).toHaveLength(0)
  expect(records.texts).toHaveLength(0)
})
it('should return a transaction to the resolver and delete all abis successfully', async () => {
  const tx = await setRecords(walletClient, {
    name: 'with-type-all-abi.eth',
    resolverAddress: (await getResolver(publicClient, {
      name: 'with-type-all-abi.eth',
    }))!,
    abi: [
      await encodeAbi({ encodeAs: 'json', data: null }),
      await encodeAbi({ encodeAs: 'cbor', data: null }),
      await encodeAbi({ encodeAs: 'zlib', data: null }),
      await encodeAbi({ encodeAs: 'uri', data: null }),
    ],
    account: accounts[1],
  })
  await waitForTransaction(tx)

  const records = await getRecords(publicClient, {
    name: 'test123.eth',
    abi: true,
  })
  expect(records.abi).toBeNull()
})
it('should error if there are no records to set', async () => {
  await expect(
    setRecords(walletClient, {
      name: 'test123.eth',
      resolverAddress: (await getResolver(publicClient, {
        name: 'test123.eth',
      }))!,

      account: accounts[1],
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [NoRecordsSpecifiedError: No records specified

    Version: @ensdomains/ensjs@1.0.0-mock.0]
  `)
})
it('should not wrap with multicall if only setting a single record', async () => {
  const encodedData = setRecords.makeFunctionData(walletClient, {
    name: 'test123.eth',
    resolverAddress: (await getResolver(publicClient, {
      name: 'test123.eth',
    }))!,
    coins: [
      {
        coin: 'etcLegacy',
        value: '0x42D63ae25990889E35F215bC95884039Ba354115',
      },
    ],
  })
  // 0x8b95dd71 is the function selector for setAddr(bytes32,uint256,bytes)
  expect(encodedData.data.startsWith('0x8b95dd71')).toBe(true)
})
