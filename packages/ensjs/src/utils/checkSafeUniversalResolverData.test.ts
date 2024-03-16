import { RawContractError } from 'viem'
import { describe, expect, it } from 'vitest'
import { universalResolverResolveSnippet } from '../contracts/universalResolver.js'
import { checkSafeUniversalResolverData } from './checkSafeUniversalResolverData.js'

describe('checkSafeUniversalResolverData', () => {
  it('returns true when the data is safe to use and strict is false', () => {
    expect(
      checkSafeUniversalResolverData('0x1234567890abcdef', {
        strict: false,
        abi: [],
        args: [],
        functionName: 'resolve',
        address: '0x1234567890abcdef',
      }),
    ).toBe(true)
  })

  it('returns true when the data is safe to use and strict is true', () => {
    expect(
      checkSafeUniversalResolverData('0x1234567890abcdef', {
        strict: true,
        abi: [],
        args: [],
        functionName: 'resolve',
        address: '0x1234567890abcdef',
      }),
    ).toBe(true)
  })

  it('returns false when the data is a known revert error and strict is false', () => {
    expect(
      checkSafeUniversalResolverData(
        new RawContractError({
          data: '0x7199966d', // ResolverNotFound()
        }),
        {
          strict: false,
          abi: universalResolverResolveSnippet,
          args: [[], []],
          functionName: 'resolve',
          address: '0x1234567890abcdef',
        },
      ),
    ).toBe(false)
  })

  it('throws error when the data is a known revert error and strict is true', () => {
    expect(() => {
      checkSafeUniversalResolverData(
        new RawContractError({
          data: '0x7199966d', // ResolverNotFound()
        }),
        {
          strict: true,
          abi: universalResolverResolveSnippet,
          args: ['0x', '0x'],
          functionName: 'resolve',
          address: '0x1234567890abcdef',
        },
      )
    }).toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "resolve" reverted.

      Error: ResolverNotFound()
       
      Contract Call:
        address:   0x1234567890abcdef
        function:  resolve(bytes name, bytes data)
        args:             (0x, 0x)

      Version: viem@2.5.0]
    `)
  })

  it('throws error with args as a function', () => {
    expect(() => {
      checkSafeUniversalResolverData(
        new RawContractError({
          data: '0x7199966d', // ResolverNotFound()
        }),
        {
          strict: true,
          abi: universalResolverResolveSnippet,
          args: () => ['ab', 'cd'],
          functionName: 'resolve',
          address: '0x1234567890abcdef',
        },
      )
    }).toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "resolve" reverted.

      Error: ResolverNotFound()
       
      Contract Call:
        address:   0x1234567890abcdef
        function:  resolve(bytes name, bytes data)
        args:             (ab, cd)

      Version: viem@2.5.0]
    `)
  })

  it('throws error when the data is an unknown error and strict is false', () => {
    expect(() => {
      checkSafeUniversalResolverData(
        new RawContractError({
          data: '0x4ced43fb', // SwagError()
        }),
        {
          strict: false,
          abi: universalResolverResolveSnippet,
          args: ['0x', '0x'],
          functionName: 'resolve',
          address: '0x1234567890abcdef',
        },
      )
    }).toThrowErrorMatchingInlineSnapshot(`
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

  it('throws error when the data is an unknown error and strict is true', () => {
    expect(() => {
      checkSafeUniversalResolverData(
        new RawContractError({
          data: '0x4ced43fb', // SwagError()
        }),
        {
          strict: true,
          abi: universalResolverResolveSnippet,
          args: ['0x', '0x'],
          functionName: 'resolve',
          address: '0x1234567890abcdef',
        },
      )
    }).toThrowErrorMatchingInlineSnapshot(`
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
})
