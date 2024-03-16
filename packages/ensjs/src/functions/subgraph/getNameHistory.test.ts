import { expect, it } from 'vitest'
import { publicClient } from '../../test/addTestContracts.js'
import getNameHistory from './getNameHistory.js'

it('returns null for a non-existent name', async () => {
  const result = await getNameHistory(publicClient, {
    name: 'test123123cool.eth',
  })
  expect(result).toBeNull()
})

it('returns the history of a name', async () => {
  const result = await getNameHistory(publicClient, {
    name: 'with-profile.eth',
  })
  if (!result) throw new Error('No result')
  expect(result.domainEvents.length).toBeGreaterThan(0)
  expect(result.registrationEvents!.length).toBeGreaterThan(0)
  expect(result.resolverEvents!.length).toBeGreaterThan(0)
})

it('returns the history of a wrapped name', async () => {
  const result = await getNameHistory(publicClient, {
    name: 'wrapped.eth',
  })
  if (!result) throw new Error('No result')
  expect(result.domainEvents.length).toBeGreaterThan(0)
  expect(result.registrationEvents!.length).toBeGreaterThan(0)
  expect(result.resolverEvents).not.toBeNull()
})

it('returns the history of a subname', async () => {
  const result = await getNameHistory(publicClient, {
    name: 'test.wrapped-with-subnames.eth',
  })
  if (!result) throw new Error('No result')
  expect(result.domainEvents.length).toBeGreaterThan(0)
  expect(result.registrationEvents).toBeNull()
  expect(result.resolverEvents).not.toBeNull()
})
