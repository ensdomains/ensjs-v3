/* eslint-disable no-await-in-loop */

import { describe, expect, it } from 'vitest'
import { publicClient } from '../../test/addTestContracts.js'
import getSubnames from './getSubnames.js'
import type { Name } from './utils.js'

it('returns with default values', async () => {
  const result = await getSubnames(publicClient, {
    name: 'with-subnames.eth',
  })

  expect(result).toBeTruthy()
  // arbitrary number, just to make sure we get some results
  expect(result.length).toBeGreaterThan(2)
})

it('has registration date on .eth names', async () => {
  const result = await getSubnames(publicClient, {
    name: 'eth',
  })

  if (!result.length) throw new Error('No names found')
  for (const name of result) {
    expect(name.registrationDate).toBeTruthy()
  }
})

it('filters by search string', async () => {
  const result = await getSubnames(publicClient, {
    name: 'eth',
    searchString: 'test',
  })

  if (!result.length) throw new Error('No names found')
  for (const name of result) {
    expect(name.labelName).toContain('test')
  }
})
it('does not include expired names by default - .eth 2ld', async () => {
  const result = await getSubnames(publicClient, {
    name: 'eth',
    pageSize: 1000,
  })
  if (!result.length) throw new Error('No names found')
  for (const name of result) {
    expect(name.expiryDate!.value).toBeGreaterThan(Date.now())
  }
})
it('allows including expired names - .eth 2ld', async () => {
  const result = await getSubnames(publicClient, {
    name: 'eth',
    allowExpired: true,
    pageSize: 1000,
  })
  if (!result.length) throw new Error('No names found')
  const expiredNames = result.filter(
    (name) => name.expiryDate!.value < Date.now(),
  )
  expect(expiredNames.length).toBeGreaterThan(0)
})
it('includes names with no expiry', async () => {
  const result = await getSubnames(publicClient, {
    name: 'wrapped-with-expiring-subnames.eth',
    pageSize: 1000,
  })
  if (!result.length) throw new Error('No names found')
  const noExpiryNames = result.filter((name) => !name.expiryDate)
  expect(noExpiryNames.length).toBeGreaterThan(0)
})
it('does not include expired names by default - other', async () => {
  const result = await getSubnames(publicClient, {
    name: 'wrapped-with-expiring-subnames.eth',
    pageSize: 1000,
  })
  if (!result.length) throw new Error('No names found')
  const namesWithExpiry = result.filter((name) => name.expiryDate)
  expect(namesWithExpiry.length).toBeGreaterThan(0)
  for (const name of namesWithExpiry) {
    expect(name.expiryDate!.value).toBeGreaterThan(Date.now())
  }
})
it('allows including expired names - other', async () => {
  const result = await getSubnames(publicClient, {
    name: 'wrapped-with-expiring-subnames.eth',
    allowExpired: true,
    pageSize: 1000,
  })
  if (!result.length) throw new Error('No names found')
  const expiredNames = result.filter(
    (name) => name.expiryDate && name.expiryDate.value < Date.now(),
  )
  expect(expiredNames.length).toBeGreaterThan(0)
})
it('does not include deleted names by default', async () => {
  const result = await getSubnames(publicClient, {
    name: 'deletable.eth',
  })
  if (!result.length) throw new Error('No names found')
  expect(result.length).toBe(2)
})
it('allows including deleted names', async () => {
  const result = await getSubnames(publicClient, {
    name: 'deletable.eth',
    allowDeleted: true,
  })
  if (!result.length) throw new Error('No names found')
  expect(result.length).toBe(4)
})

describe.each([
  {
    orderBy: 'name',
    orderDirection: 'asc',
    compareFn: (a: Name, b: Name) => (a.name || '').localeCompare(b.name || ''),
  },
  {
    orderBy: 'name',
    orderDirection: 'desc',
    compareFn: (a: Name, b: Name) => (b.name || '').localeCompare(a.name || ''),
  },
  {
    orderBy: 'labelName',
    orderDirection: 'asc',
    compareFn: (a: Name, b: Name) => {
      const aLabelName = a.labelName || ''
      const bLabelName = b.labelName || ''
      return aLabelName.localeCompare(bLabelName)
    },
  },
  {
    orderBy: 'labelName',
    orderDirection: 'desc',
    compareFn: (a: Name, b: Name) => {
      const aLabelName = a.labelName || ''
      const bLabelName = b.labelName || ''
      return bLabelName.localeCompare(aLabelName)
    },
  },
  {
    orderBy: 'expiryDate',
    orderDirection: 'asc',
    compareFn: (a: Name, b: Name) => {
      const aExpiryDate = a.expiryDate?.value || Infinity
      const bExpiryDate = b.expiryDate?.value || Infinity
      return aExpiryDate - bExpiryDate
    },
  },
  {
    orderBy: 'expiryDate',
    orderDirection: 'desc',
    compareFn: (a: Name, b: Name) => {
      const aExpiryDate = a.expiryDate?.value || Infinity
      const bExpiryDate = b.expiryDate?.value || Infinity
      return bExpiryDate - aExpiryDate
    },
  },
  {
    orderBy: 'createdAt',
    orderDirection: 'asc',
    compareFn: (a: Name, b: Name) => {
      const aCreatedAt = a.createdAt.value
      const bCreatedAt = b.createdAt.value
      return aCreatedAt - bCreatedAt
    },
  },
  {
    orderBy: 'createdAt',
    orderDirection: 'desc',
    compareFn: (a: Name, b: Name) => {
      const aCreatedAt = a.createdAt.value
      const bCreatedAt = b.createdAt.value
      return bCreatedAt - aCreatedAt
    },
  },
])(
  'filters by $orderBy $orderDirection',
  ({ orderBy, orderDirection, compareFn }) => {
    it('is consistent between full result and paginated results', async () => {
      const fullResult = await getSubnames(publicClient, {
        name: 'eth',
        orderBy: orderBy as any,
        orderDirection: orderDirection as any,
        pageSize: 1000,
      })
      if (!fullResult.length) throw new Error('No names found')
      const paginatedResults = []
      let lastResult: Name[] = []
      do {
        const result = await getSubnames(publicClient, {
          name: 'eth',
          orderBy: orderBy as any,
          orderDirection: orderDirection as any,
          previousPage: lastResult,
          pageSize: 5,
        })
        paginatedResults.push(...result)
        lastResult = result
      } while (lastResult.length)

      expect(paginatedResults.length).toBe(fullResult.length)
      expect(JSON.stringify(paginatedResults)).toEqual(
        JSON.stringify(fullResult),
      )
    })
    it('is sorted correctly', async () => {
      const fullResult = await getSubnames(publicClient, {
        name: 'eth',
        orderBy: orderBy as any,
        orderDirection: orderDirection as any,
        pageSize: 1000,
      })
      if (!fullResult.length) throw new Error('No names found')
      const sortedResult = [...fullResult].sort(compareFn)
      expect(fullResult).toStrictEqual(sortedResult)
    })
  },
)
