import { describe, expect, it } from 'vitest'
import { truncateFormat } from './format.js'

describe('truncateFormat', () => {
  it('should truncate a long name correctly', () => {
    const longName =
      '[0x12345678901234567890123456789012345678901234567890123456dfssss]'
    const expected = '[0x1...sss]'
    const result = truncateFormat(longName)
    expect(result).toEqual(expected)
  })

  it('should not modify a short name', () => {
    const shortName = 'example.eth'
    const result = truncateFormat(shortName)
    expect(result).toEqual(shortName)
  })
})
