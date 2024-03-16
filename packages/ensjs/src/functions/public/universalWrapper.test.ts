import { RawContractError, decodeFunctionData, hexToBytes } from 'viem'
import { expect, it } from 'vitest'
import { universalResolverResolveSnippet } from '../../contracts/universalResolver.js'
import {
  deploymentAddresses,
  publicClient,
} from '../../test/addTestContracts.js'
import { bytesToPacket } from '../../utils/hexEncodedName.js'
import universalWrapper from './universalWrapper.js'

it('returns with passthrough containing args and address on encode', () => {
  const result = universalWrapper.encode(publicClient, {
    name: 'test.eth',
    data: '0x1234',
  })
  expect(result.passthrough).toMatchInlineSnapshot(`
    {
      "address": "${deploymentAddresses.UniversalResolver}",
      "args": [
        "0x04746573740365746800",
        "0x1234",
      ],
    }
  `)
})

it('encodes labels larger than 255 bytes', () => {
  const result = universalWrapper.encode(publicClient, {
    name: '696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969696969.eth',
    data: '0x',
  })
  const {
    args: [hexEncodedName],
  } = decodeFunctionData({
    abi: universalResolverResolveSnippet,
    data: result.data,
  })
  const name = bytesToPacket(hexToBytes(hexEncodedName))
  expect(name).toMatchInlineSnapshot(
    `"[5af85b2a63602b9af41f41d514011c4a19d643827fb73d85526283d764d80ede].eth"`,
  )
})

it('does not throw on result decode error when strict is false', async () => {
  await expect(
    universalWrapper.decode(
      publicClient,
      '0x1234',
      {
        address: '0x1234567890abcdef',
        args: ['0x', '0x'],
      },
      { strict: false },
    ),
  ).resolves.toBeNull()
})

it('throws on result decode error when strict is true', async () => {
  await expect(
    universalWrapper.decode(
      publicClient,
      '0x1234',
      {
        address: '0x1234567890abcdef',
        args: ['0x', '0x'],
      },

      { strict: true },
    ),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [AbiDecodingDataSizeTooSmallError: Data size of 2 bytes is too small for given parameters.

    Params: (bytes data, address resolver)
    Data:   0x1234 (2 bytes)

    Version: viem@2.5.0]
  `)
})

it('does not throw known contract error when strict is false', async () => {
  await expect(
    universalWrapper.decode(
      publicClient,
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

it('throws on known contract error when strict is true', async () => {
  await expect(
    universalWrapper.decode(
      publicClient,
      new RawContractError({
        data: '0x7199966d', // ResolverNotFound()
      }),
      {
        address: '0x1234567890abcdef',
        args: ['0x', '0x'],
      },
      { strict: true },
    ),
  ).rejects.toMatchInlineSnapshot(`
  [ContractFunctionExecutionError: The contract function "resolve" reverted.

  Error: ResolverNotFound()
   
  Contract Call:
    address:   0x1234567890abcdef
    function:  resolve(bytes name, bytes data)
    args:             (0x, 0x)

  Version: viem@2.5.0]
`)
})

it('throws on unknown contract error when strict is false', async () => {
  await expect(
    universalWrapper.decode(
      publicClient,
      new RawContractError({
        data: '0x4ced43fb', // SwagError()
      }),
      {
        address: '0x1234567890abcdef',
        args: ['0x', '0x'],
      },
      { strict: false },
    ),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [ContractFunctionExecutionError: The contract function "resolve" reverted with the following signature:
    0x4ced43fb

    Unable to decode signature "0x4ced43fb" as it was not found on the provided ABI.
    Make sure you are using the correct ABI and that the error exists on it.
    You can look up the decoded signature here: https://openchain.xyz/signatures?query=0x4ced43fb.
     
    Contract Call:
      address:   0x1234567890abcdef
      function:  resolve(bytes name, bytes data)
      args:             (0x, 0x)

    Docs: https://viem.sh/docs/contract/decodeErrorResult
    Version: viem@2.5.0]
  `)
})

it('throws on unknown contract error when strict is true', async () => {
  await expect(
    universalWrapper.decode(
      publicClient,
      new RawContractError({
        data: '0x4ced43fb', // SwagError()
      }),
      {
        address: '0x1234567890abcdef',
        args: ['0x', '0x'],
      },
      { strict: true },
    ),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [ContractFunctionExecutionError: The contract function "resolve" reverted with the following signature:
    0x4ced43fb

    Unable to decode signature "0x4ced43fb" as it was not found on the provided ABI.
    Make sure you are using the correct ABI and that the error exists on it.
    You can look up the decoded signature here: https://openchain.xyz/signatures?query=0x4ced43fb.
     
    Contract Call:
      address:   0x1234567890abcdef
      function:  resolve(bytes name, bytes data)
      args:             (0x, 0x)

    Docs: https://viem.sh/docs/contract/decodeErrorResult
    Version: viem@2.5.0]
  `)
})
