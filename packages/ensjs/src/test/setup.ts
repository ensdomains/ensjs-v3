import { beforeAll, vi } from 'vitest'

beforeAll(() => {
  vi.mock('../errors/error-utils.ts', () => ({
    getVersion: vi.fn().mockReturnValue('@ensdomains/ensjs@1.0.0-mock.0'),
  }))
})
