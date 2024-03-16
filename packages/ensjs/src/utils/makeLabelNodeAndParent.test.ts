import { expect, it } from 'vitest'
import { makeLabelNodeAndParent } from './makeLabelNodeAndParent.js'

it('makes label node and parent', () => {
  expect(makeLabelNodeAndParent('test.eth')).toMatchInlineSnapshot(`
    {
      "label": "test",
      "labelhash": "0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658",
      "parentNode": "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae",
    }
  `)
})
