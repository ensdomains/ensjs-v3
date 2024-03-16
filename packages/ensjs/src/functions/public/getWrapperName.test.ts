import { describe, expect, it } from 'vitest'
import { publicClient } from '../../test/addTestContracts.js'
import getWrapperName from './getWrapperName.js'

describe('getWrapperName()', () => {
  it('should return name for existing name', async () => {
    const result = await getWrapperName(publicClient, {
      // wrapped.eth
      name: '[4ca938ec1b323ca71c4fb47a712abb68cce1cabf39ea4d6789e42fbc1f95459b].eth',
    })
    expect(result).toBe('wrapped.eth')
  })
  it('should return null for non-existent name', async () => {
    const result = await getWrapperName(publicClient, {
      // test123.eth
      name: '[f81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad].eth',
    })
    expect(result).toBeNull()
  })
})
