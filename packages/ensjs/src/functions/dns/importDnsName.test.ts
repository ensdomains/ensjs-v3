import { afterEach } from 'node:test'
import { parseAbi, parseEther, type Address, type Hex } from 'viem'
import { beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import {
  deploymentAddresses,
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../test/addTestContracts.js'
import getOwner from '../public/getOwner.js'
import getResolver from '../public/getResolver.js'
import getDnsImportData, {
  type GetDnsImportDataReturnType,
} from './getDnsImportData.js'
import importDnsName from './importDnsName.js'

vi.setConfig({
  testTimeout: 10000,
})

const name = 'taytems.xyz'
const address = '0x8e8Db5CcEF88cca9d624701Db544989C996E3216'

let snapshot: Hex
let accounts: Address[]
let dnsImportData: GetDnsImportDataReturnType

beforeAll(async () => {
  accounts = await walletClient.getAddresses()
  dnsImportData = await getDnsImportData(publicClient, { name })
})

beforeEach(async () => {
  snapshot = await testClient.snapshot()

  await testClient.impersonateAccount({ address })
  await testClient.setBalance({
    address,
    value: parseEther('1'),
  })
  const approveTx = await walletClient.writeContract({
    account: address,
    address: deploymentAddresses.PublicResolver,
    abi: parseAbi([
      'function setApprovalForAll(address operator, bool approved) external',
    ] as const),
    functionName: 'setApprovalForAll',
    args: [deploymentAddresses.DNSRegistrar, true],
  })
  await waitForTransaction(approveTx)
  await testClient.stopImpersonatingAccount({ address })
})

afterEach(async () => {
  await testClient.revert({ id: snapshot })
})

it('should import a DNS name with no address', async () => {
  const tx = await importDnsName(walletClient, {
    name,
    dnsImportData,
    account: accounts[0],
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const owner = await getOwner(publicClient, { name })
  expect(owner!.owner).toBe(address)
})

it('should import a DNS name with an address, using default resolver', async () => {
  await testClient.impersonateAccount({ address })
  await testClient.setBalance({
    address,
    value: parseEther('1'),
  })

  const tx = await importDnsName(walletClient, {
    name,
    address,
    dnsImportData,
    account: address,
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const owner = await getOwner(publicClient, { name })
  expect(owner!.owner).toBe(address)
  const resolver = await getResolver(publicClient, { name })
  expect(resolver).toBe(
    getChainContractAddress({
      client: publicClient,
      contract: 'ensPublicResolver',
    }),
  )
})
it('should import a DNS name with an address, using a custom resolver', async () => {
  await testClient.impersonateAccount({ address })
  await testClient.setBalance({
    address,
    value: parseEther('1'),
  })

  const resolverAddress = deploymentAddresses.PublicResolver

  const tx = await importDnsName(walletClient, {
    name,
    address,
    dnsImportData,
    account: address,
    resolverAddress,
  })
  expect(tx).toBeTruthy()
  const receipt = await waitForTransaction(tx)
  expect(receipt.status).toBe('success')

  const owner = await getOwner(publicClient, { name })
  expect(owner!.owner).toBe(address)
  const resolver = await getResolver(publicClient, { name })
  expect(resolver).toBe(resolverAddress)
})

it('should throw error if resolver is specified when claiming without an address', async () => {
  await expect(
    importDnsName(walletClient, {
      name,
      resolverAddress: address,
      dnsImportData: await getDnsImportData(publicClient, { name }),
      account: accounts[0],
    } as any),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [AdditionalParameterSpecifiedError: Additional parameter specified: resolverAddress

    - Allowed parameters: name, dnsImportData

    Details: resolverAddress cannot be specified when claiming without an address

    Version: @ensdomains/ensjs@1.0.0-mock.0]
  `)
})
