import { expect, it } from 'vitest'
import {
  deploymentAddresses,
  publicClient,
} from '../../test/addTestContracts.js'
import getSupportedInterfaces from './getSupportedInterfaces.js'

it('returns true for a single supported interface', async () => {
  const result = await getSupportedInterfaces(publicClient, {
    address: deploymentAddresses.DNSRegistrar,
    interfaces: ['0x2f435428'],
  })

  expect(result).toEqual([true])
})

it('returns false for a single unsupported interface', async () => {
  const result = await getSupportedInterfaces(publicClient, {
    address: deploymentAddresses.DNSRegistrar,
    interfaces: ['0x23b872dd'],
  })

  expect(result).toEqual([false])
})

it('returns correct values for multiple supported interfaces', async () => {
  const result = await getSupportedInterfaces(publicClient, {
    address: deploymentAddresses.DNSRegistrar,
    interfaces: ['0x2f435428', '0x01ffc9a7'],
  })

  expect(result).toEqual([true, true])
})

it('returns correct values for multiple unsupported interfaces', async () => {
  const result = await getSupportedInterfaces(publicClient, {
    address: deploymentAddresses.DNSRegistrar,
    interfaces: ['0x23b872dd', '0x28ed4f6c'],
  })

  expect(result).toEqual([false, false])
})

it('returns correct values for mixed supported and unsupported interfaces', async () => {
  const result = await getSupportedInterfaces(publicClient, {
    address: deploymentAddresses.DNSRegistrar,
    interfaces: ['0x2f435428', '0x01ffc9a7', '0x23b872dd', '0x28ed4f6c'],
  })

  expect(result).toEqual([true, true, false, false])
})
