import { describe, expect, it } from 'vitest'
import {
  decodeContentHash,
  encodeContentHash,
  getProtocolType,
  isValidContentHash,
} from './contentHash.js'

const ipfs = {
  decoded: 'bafybeibj6lixxzqtsb45ysdjnupvqkufgdvzqbnvmhw2kf7cfkesy7r7d4',
  encoded:
    '0xe3010170122029f2d17be6139079dc48696d1f582a8530eb9805b561eda517e22a892c7e3f1f',
} as const

const ipns = {
  decoded: 'k51qzi5uqu5dihst24f3rp2ej4co9berxohfkxaenbq1wjty7nrd5e9xp4afx1',
  encoded:
    '0xe50101720024080112205cbd1cc86ac20d6640795809c2a185bb2504538a2de8076da5a6971b8acb4715',
} as const

const swarm = {
  decoded: 'd1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162',
  encoded:
    '0xe40101fa011b20d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162',
} as const

const onion = {
  decoded: 'zqktlwi4fecvo6ri',
  encoded: '0xbc037a716b746c776934666563766f367269',
} as const

const onion3 = {
  decoded: 'p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd',
  encoded:
    '0xbd037035336c663537716f7679757677736336786e72707079706c79337674716d376c3670636f626b6d797173696f6679657a6e667535757164',
} as const

const skynet = {
  decoded: 'CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg',
  encoded:
    '0x90b2c60508004007fd43b74149b31aacbbf2784e874d09b086bed15fd54cacff7120cce95372',
} as const

const arweave = {
  decoded: 'ys32Pt8uC7TrVxHdOLByOspfPEq2LO63wREHQIM9SJQ',
  encoded:
    '0x90b2ca05cacdf63edf2e0bb4eb5711dd38b0723aca5f3c4ab62ceeb7c1110740833d4894',
} as const

const typeArray = [
  {
    type: 'ipfs',
    ...ipfs,
  },
  {
    type: 'ipns',
    ...ipns,
  },
  {
    type: 'bzz',
    ...swarm,
  },
  {
    type: 'onion',
    ...onion,
  },
  {
    type: 'onion3',
    ...onion3,
  },
  {
    type: 'sia',
    ...skynet,
  },
  {
    type: 'ar',
    ...arweave,
  },
] as const

const displayArray = typeArray.map((item) => ({
  ...item,
  input: `${item.type}://${item.decoded}`,
}))

describe('decodeContentHash', () => {
  it.each(typeArray)(
    '$encoded => $type, $decoded',
    ({ type, encoded, decoded }) => {
      expect(decodeContentHash(encoded)).toEqual({
        protocolType: type,
        decoded,
      })
    },
  )
  it('returns null when undefined', () => {
    expect(decodeContentHash(undefined as any)).toBeNull()
  })
  it('returns null when empty bytes', () => {
    expect(decodeContentHash('0x')).toBeNull()
  })
})
describe('isValidContentHash', () => {
  it('returns true for valid content hash', () => {
    expect(
      isValidContentHash(
        '0xe3010170122029f2d17be6139079dc48696d1f582a8530eb9805b561eda517e22a892c7e3f1f',
      ),
    ).toBe(true)
  })
  it('returns false for invalid content hash', () => {
    expect(isValidContentHash('0x1234')).toBe(false)
  })
})
describe('getProtocolType', () => {
  it.each(displayArray)(
    '$input => $type, $decoded',
    ({ input, type, decoded }) => {
      expect(getProtocolType(input)).toEqual({
        protocolType: type,
        decoded,
      })
    },
  )
  it('returns null for invalid content hash', () => {
    expect(getProtocolType('https://random')).toBe(null)
  })
})
describe('encodeContentHash', () => {
  it.each(displayArray)('$input => $encoded', ({ input, encoded }) => {
    expect(encodeContentHash(input)).toEqual(encoded)
  })
  it('fails to encode onion with invalid length', () => {
    expect(() => encodeContentHash('onion://123')).toThrow()
  })
  it('fails to encode onion3 with invalid length', () => {
    expect(() => encodeContentHash('onion3://123')).toThrow()
  })
})
