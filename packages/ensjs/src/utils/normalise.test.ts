import { describe, expect, it } from 'vitest'
import { namehash } from './normalise.js'

describe('namehash()', () => {
  it('returns namehash for name', () => {
    expect(namehash('test.eth')).toEqual(
      '0xeb4f647bea6caa36333c816d7b46fdcb05f9466ecacc140ea8c66faf15b3d9f1',
    )
  })
  it('returns namehash for name with encoded labelhash', () => {
    expect(
      namehash(
        '[9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658].eth',
      ),
    ).toEqual(
      '0xeb4f647bea6caa36333c816d7b46fdcb05f9466ecacc140ea8c66faf15b3d9f1',
    )
  })
})

it('exports functions from ens-normalize', async () => {
  const modules = await import('./normalise.js')
  expect(modules).toMatchInlineSnapshot(`
    {
      "beautify": [Function],
      "emoji": [Function],
      "isCombiningMark": [Function],
      "namehash": [Function],
      "normalise": [Function],
      "normaliseFragment": [Function],
      "shouldEscape": [Function],
      "split": [Function],
      "tokenise": [Function],
    }
  `)
})
