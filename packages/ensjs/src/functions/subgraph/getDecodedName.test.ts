import { expect, it } from 'vitest'
import { publicClient } from '../../test/addTestContracts.js'
import getDecodedName from './getDecodedName.js'

it('should decode a name via namehash lookup', async () => {
  const result = await getDecodedName(publicClient, {
    name: '[9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658].wrapped-with-subnames.eth',
  })
  expect(result).toBe('test.wrapped-with-subnames.eth')
})
it('should decode a name via labelhash lookup', async () => {
  const result = await getDecodedName(publicClient, {
    name: '[f81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad].eth',
  })
  expect(result).toBe('test123.eth')
})
it('should partially decode a name when allowIncomplete is true', async () => {
  const result = await getDecodedName(publicClient, {
    name: '[7bffb6e3ebf801bbc438fea5c11d957ba49978bdc8d52b71cba974139d22edea].[6c14e1739568670447af1d5af8a571008f7a582068af18bcd7ac2dbc13bb37c1].eth',
    allowIncomplete: true,
  })
  expect(result).toBe(
    '[7bffb6e3ebf801bbc438fea5c11d957ba49978bdc8d52b71cba974139d22edea].with-unknown-subnames.eth',
  )
})
it('should not partially decode a name when allowIncomplete is false', async () => {
  const result = await getDecodedName(publicClient, {
    name: '[7bffb6e3ebf801bbc438fea5c11d957ba49978bdc8d52b71cba974139d22edea].[6c14e1739568670447af1d5af8a571008f7a582068af18bcd7ac2dbc13bb37c1].eth',
    allowIncomplete: false,
  })
  expect(result).toBeNull()
})
