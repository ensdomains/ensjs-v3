import { describe, expect, it } from 'vitest'
import { publicClient } from '../../test/addTestContracts.js'
import getAvailable from './getAvailable.js'

describe('getAvailable', () => {
  it('should return false for a name that is unavailable', async () => {
    const result = await getAvailable(publicClient, { name: 'test123.eth' })
    expect(typeof result).toBe('boolean')
    expect(result).toBe(false)
  })
  it('should return true for a name that is available', async () => {
    const result = await getAvailable(publicClient, {
      name: 'available-name.eth',
    })
    expect(typeof result).toBe('boolean')
    expect(result).toBe(true)
  })
})
