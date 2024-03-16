import { RawContractError } from 'viem'
import { describe, expect, it } from 'vitest'
import type { ClientWithEns } from '../../contracts/consts.js'
import { publicClient } from '../../test/addTestContracts.js'
import { generateSupportedContentTypes } from '../../utils/generateSupportedContentTypes.js'
import getAbiRecord from './getAbiRecord.js'

const dummyABI = [
  {
    type: 'event',
    anonymous: false,
    name: 'ABIChanged',
    inputs: [
      {
        type: 'bytes32',
        indexed: true,
      },
      {
        type: 'uint256',
        indexed: true,
      },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    name: 'VersionChanged',
    inputs: [
      {
        type: 'bytes32',
        indexed: true,
      },
      {
        type: 'uint64',
      },
    ],
  },
  {
    type: 'function',
    name: 'ABI',
    constant: true,
    stateMutability: 'view',
    payable: false,
    inputs: [
      {
        type: 'bytes32',
      },
      {
        type: 'uint256',
      },
    ],
    outputs: [
      {
        type: 'uint256',
      },
      {
        type: 'bytes',
      },
    ],
  },
  {
    type: 'function',
    name: 'clearRecords',
    constant: false,
    payable: false,
    inputs: [
      {
        type: 'bytes32',
      },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'recordVersions',
    constant: true,
    stateMutability: 'view',
    payable: false,
    inputs: [
      {
        type: 'bytes32',
      },
    ],
    outputs: [
      {
        type: 'uint64',
      },
    ],
  },
  {
    type: 'function',
    name: 'setABI',
    constant: false,
    payable: false,
    inputs: [
      {
        type: 'bytes32',
      },
      {
        type: 'uint256',
      },
      {
        type: 'bytes',
      },
    ],
    outputs: [],
  },
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

describe('getAbiRecord()', () => {
  it('should return object for type 1 abi', async () => {
    const result = await getAbiRecord(publicClient, {
      name: 'with-type-1-abi.eth',
    })
    expect(result).toBeTruthy()
    if (result) {
      expect(result.contentType).toBe(1)
      expect(result.decoded).toBe(true)
      expect(result.abi).toMatchObject(dummyABI)
    }
  })
  it('should return object for type 2 ABI', async () => {
    const result = await getAbiRecord(publicClient, {
      name: 'with-type-2-abi.eth',
    })
    expect(result).toBeTruthy()
    if (result) {
      expect(result.contentType).toBe(2)
      expect(result.decoded).toBe(true)
      expect(result.abi).toMatchObject(dummyABI)
    }
  })
  it('should return object for type 4 ABI', async () => {
    const result = await getAbiRecord(publicClient, {
      name: 'with-type-4-abi.eth',
    })
    expect(result).toBeTruthy()
    if (result) {
      expect(result.contentType).toBe(4)
      expect(result.decoded).toBe(true)
      expect(result.abi).toMatchObject(dummyABI)
    }
  })
  it('should return unresolved URI for type 8 ABI', async () => {
    const result = await getAbiRecord(publicClient, {
      name: 'with-type-8-abi.eth',
    })
    expect(result).toBeTruthy()
    if (result) {
      expect(result.contentType).toBe(8)
      expect(result.decoded).toBe(true)
      expect(result.abi).toBe('https://example.com')
    }
  })
  it('should return null if unsupported contentType (returned as 0x from contract)', async () => {
    const result = await getAbiRecord(publicClient, {
      name: 'with-type-256-abi.eth',
    })
    expect(result).toBeNull()
  })
  it('should return the result of type 1 abi if the name has multiple abi records', async () => {
    const result = await getAbiRecord(publicClient, {
      name: 'with-type-all-abi.eth',
    })
    expect(result).toBeTruthy()
    if (result) {
      expect(result.contentType).toBe(1)
      expect(result.decoded).toBe(true)
      expect(result.abi).toMatchObject(dummyABI)
    }
  })
  it('should return the result of type 2 abi if supportedContentTypes is zlib', async () => {
    const result = await getAbiRecord(publicClient, {
      name: 'with-type-all-abi.eth',
      supportedContentTypes: generateSupportedContentTypes('zlib'),
    })
    expect(result).toBeTruthy()
    if (result) {
      expect(result.contentType).toBe(2)
      expect(result.decoded).toBe(true)
      expect(result.abi).toMatchObject(dummyABI)
    }
  })
  it('should return the result of type 4 abi if supportedContentTypes is cbor', async () => {
    const result = await getAbiRecord(publicClient, {
      name: 'with-type-all-abi.eth',
      supportedContentTypes: generateSupportedContentTypes('cbor'),
    })
    expect(result).toBeTruthy()
    if (result) {
      expect(result.contentType).toBe(4)
      expect(result.decoded).toBe(true)
      expect(result.abi).toMatchObject(dummyABI)
    }
  })
  it('should return the result of type 8 abi if supportedContentTypes is uri', async () => {
    const result = await getAbiRecord(publicClient, {
      name: 'with-type-all-abi.eth',
      supportedContentTypes: generateSupportedContentTypes('uri'),
    })
    expect(result).toBeTruthy()
    if (result) {
      expect(result.contentType).toBe(8)
      expect(result.decoded).toBe(true)
      expect(result.abi).toBe('https://example.com')
    }
  })
  it('should return null on error when strict is false', async () => {
    await expect(
      getAbiRecord.decode(
        {} as ClientWithEns,
        new RawContractError({
          data: '0x7199966d', // ResolverNotFound()
        }),
        {
          address: '0x1234567890abcdef',
          args: ['0x', '0x'],
        },
        { strict: false },
      ),
    ).resolves.toBeNull()
  })
  it('should throw on error when strict is true', async () => {
    await expect(
      getAbiRecord.decode(
        {} as ClientWithEns,
        new RawContractError({
          data: '0x7199966d', // ResolverNotFound()
        }),
        {
          address: '0x1234567890abcdef',
          args: ['0x', '0x'],
        },

        { strict: true },
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "resolve" reverted.

      Error: ResolverNotFound()
       
      Contract Call:
        address:   0x1234567890abcdef
        function:  resolve(bytes name, bytes data)
        args:             (0x, 0x)

      Version: viem@2.5.0]
    `)
  })
})
