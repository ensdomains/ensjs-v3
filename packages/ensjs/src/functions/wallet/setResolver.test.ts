import type { Address, Hex } from 'viem'
import { afterEach, beforeAll, beforeEach, expect, it } from 'vitest'
import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../test/addTestContracts.js'
import getResolver from '../public/getResolver.js'
import setResolver from './setResolver.js'

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

it('should return a setResolver transaction to the registry and succeed', async () => {
  const tx = await setResolver(walletClient, {
    name: 'test123.eth',
    contract: 'registry',
    resolverAddress: '0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC',
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const resolver = await getResolver(publicClient, {
    name: 'test123.eth',
  })
  expect(resolver).toBe('0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC')
})
it('should return a setResolver transaction to the namewrapper and succeed', async () => {
  const tx = await setResolver(walletClient, {
    name: 'wrapped.eth',
    contract: 'nameWrapper',
    resolverAddress: '0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC',
    account: accounts[1],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const resolver = await getResolver(publicClient, {
    name: 'wrapped.eth',
  })
  expect(resolver).toBe('0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC')
})
it('should error if unknown contract', async () => {
  await expect(
    setResolver(walletClient, {
      name: 'test123.eth',
      contract: 'random' as any,
      resolverAddress: '0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC',
      account: accounts[1],
    }),
  ).rejects.toThrow('Unknown contract: random')
})

// it('should return a transaction for a name and set successfully', async () => {
//   const tx = await setName(walletClient, {
//     name: 'test123.eth',
//     account: accounts[1],
//   })
//   expect(tx).toBeTruthy()
//   const receipt = await publicClient.waitForTransactionReceipt({ hash: tx })
//   expect(receipt.status).toBe('success')

//   const resolvedName = await getName(publicClient, {
//     address: accounts[1],
//   })
//   expect(resolvedName!.name).toBe('test123.eth')
// })

// it("should return a transaction for setting another address' name and succeed", async () => {
//   const setApprovedForAllTx = await walletClient.writeContract({
//     abi: setApprovalForAllSnippet,
//     functionName: 'setApprovalForAll',
//     address: getChainContractAddress({
//       client: walletClient,
//       contract: 'ensRegistry',
//     }),
//     args: [accounts[2], true],
//     account: accounts[1],
//   })
//   expect(setApprovedForAllTx).toBeTruthy()
//   const setApprovedForAllReceipt = await publicClient.waitForTransactionReceipt(
//     { hash: setApprovedForAllTx },
//   )
//   expect(setApprovedForAllReceipt.status).toBe('success')

//   const tx = await setName(walletClient, {
//     name: 'test123.eth',
//     address: accounts[1],
//     account: accounts[2],
//   })
//   expect(tx).toBeTruthy()
//   const receipt = await publicClient.waitForTransactionReceipt({ hash: tx })
//   expect(receipt.status).toBe('success')

//   const resolvedName = await getName(publicClient, {
//     address: accounts[1],
//   })
//   expect(resolvedName!.name).toBe('test123.eth')
// })
