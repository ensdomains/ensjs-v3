import { expect, it } from 'vitest'
import {
  deploymentAddresses,
  publicClient,
} from '../../test/addTestContracts.js'
import getSubgraphRecords from './getSubgraphRecords.js'

it('gets basic records', async () => {
  const result = await getSubgraphRecords(publicClient, {
    name: 'with-profile.eth',
  })
  expect(result).toBeTruthy()
  const { createdAt, ...snapshot } = result!
  expect(createdAt.date).toBeInstanceOf(Date)
  expect(createdAt.value).toBe(createdAt.date.getTime())
  expect(snapshot).toMatchInlineSnapshot(`
    {
      "coins": [
        "60",
        "61",
        "0",
        "2",
      ],
      "isMigrated": true,
      "texts": [
        "description",
        "url",
        "blankrecord",
        "email",
      ],
    }
  `)
})
it('gets records for custom resolver address', async () => {
  const result = await getSubgraphRecords(publicClient, {
    name: 'with-legacy-resolver.eth',
    resolverAddress: deploymentAddresses.LegacyPublicResolver,
  })
  expect(result).toBeTruthy()
  const { createdAt, ...snapshot } = result!
  expect(createdAt.date).toBeInstanceOf(Date)
  expect(createdAt.value).toBe(createdAt.date.getTime())
  expect(snapshot).toMatchInlineSnapshot(`
    {
      "coins": [
        "60",
      ],
      "isMigrated": true,
      "texts": [],
    }
  `)
})
it('returns null for nonexistent name', async () => {
  const result = await getSubgraphRecords(publicClient, {
    name: 'nonexistent.eth',
  })
  expect(result).toBeNull()
})
it('returns empty texts/coins for nonexistent resolver', async () => {
  const result = await getSubgraphRecords(publicClient, {
    name: 'with-profile.eth',
    resolverAddress: '0xb794F5eA0ba39494cE839613fffBA74279579268',
  })
  expect(result).toBeTruthy()
  const { createdAt, ...snapshot } = result!
  expect(createdAt.date).toBeInstanceOf(Date)
  expect(createdAt.value).toBe(createdAt.date.getTime())
  expect(snapshot).toMatchInlineSnapshot(`
    {
      "coins": [],
      "isMigrated": true,
      "texts": [],
    }
  `)
})
