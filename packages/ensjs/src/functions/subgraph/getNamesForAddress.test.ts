/* eslint-disable no-await-in-loop */

import type { Address } from 'viem'
import { beforeAll, describe, expect, it } from 'vitest'
import { publicClient, walletClient } from '../../test/addTestContracts.js'
import { EMPTY_ADDRESS } from '../../utils/consts.js'
import getNamesForAddress, {
  type NameWithRelation,
} from './getNamesForAddress.js'

let accounts: Address[]

beforeAll(async () => {
  accounts = await walletClient.getAddresses()
})

it('returns with default values', async () => {
  const result = await getNamesForAddress(publicClient, {
    address: accounts[1],
  })

  expect(result).toBeTruthy()
  // arbitrary number, just to make sure we get some results
  expect(result.length).toBeGreaterThan(10)
})

it('has registration date on .eth names', async () => {
  const result = await getNamesForAddress(publicClient, {
    address: accounts[1],
  })
  if (!result.length) throw new Error('No names found')
  for (const name of result) {
    if (name.parentName === 'eth') {
      expect(name.registrationDate).toBeTruthy()
    }
  }
})
describe('filter', () => {
  it('filters by owner', async () => {
    const result = await getNamesForAddress(publicClient, {
      address: accounts[1],
      filter: {
        owner: true,
        registrant: false,
        resolvedAddress: false,
        wrappedOwner: false,
      },
    })
    if (!result.length) throw new Error('No names found')
    for (const name of result) {
      expect(name.owner).toBe(accounts[1])
      expect(name.relation.owner).toBe(true)
    }
  })
  it('filters by registrant', async () => {
    const result = await getNamesForAddress(publicClient, {
      address: accounts[1],
      filter: {
        owner: false,
        registrant: true,
        resolvedAddress: false,
        wrappedOwner: false,
      },
    })
    if (!result.length) throw new Error('No names found')
    for (const name of result) {
      expect(name.registrant).toBe(accounts[1])
      expect(name.relation.registrant).toBe(true)
    }
  })
  it('filters by resolved address', async () => {
    const result = await getNamesForAddress(publicClient, {
      address: accounts[1],
      filter: {
        owner: false,
        registrant: false,
        resolvedAddress: true,
        wrappedOwner: false,
      },
    })
    if (!result.length) throw new Error('No names found')
    for (const name of result) {
      expect(name.resolvedAddress).toBe(accounts[1])
      expect(name.relation.resolvedAddress).toBe(true)
    }
  })
  it('filters by wrapped owner', async () => {
    const result = await getNamesForAddress(publicClient, {
      address: accounts[1],
      filter: {
        owner: false,
        registrant: false,
        resolvedAddress: false,
        wrappedOwner: true,
      },
    })
    if (!result.length) throw new Error('No names found')
    for (const name of result) {
      expect(name.wrappedOwner).toBe(accounts[1])
      expect(name.relation.wrappedOwner).toBe(true)
    }
  })
  it('allows including expired names', async () => {
    const result = await getNamesForAddress(publicClient, {
      address: accounts[1],
      filter: {
        owner: true,
        registrant: true,
        resolvedAddress: true,
        wrappedOwner: true,
        allowExpired: true,
      },
    })
    if (!result.length) throw new Error('No names found')
    const expiredNames = result.filter(
      (x) => x.expiryDate?.date && x.expiryDate.date < new Date(),
    )
    expect(expiredNames.length).toBeGreaterThan(0)
  })
  it('allows including reverse record', async () => {
    const result = await getNamesForAddress(publicClient, {
      address: accounts[2],
      filter: {
        owner: true,
        registrant: true,
        resolvedAddress: true,
        wrappedOwner: true,
        allowReverseRecord: true,
      },
    })
    if (!result.length) throw new Error('No names found')
    const reverseRecordNames = result.filter(
      (x) => x.parentName === 'addr.reverse',
    )
    expect(reverseRecordNames.length).toBeGreaterThan(0)
  })
  it('does not include deleted names by default', async () => {
    const result = await getNamesForAddress(publicClient, {
      address: accounts[1],
      pageSize: 1000,
    })
    if (!result.length) throw new Error('No names found')
    const deletedNames = result.filter(
      (x) => x.parentName === 'deletable.eth' && x.owner === EMPTY_ADDRESS,
    )
    expect(deletedNames.length).toBe(0)
  })
  it('allows including deleted names', async () => {
    const result = await getNamesForAddress(publicClient, {
      address: accounts[1],
      pageSize: 1000,
      filter: {
        owner: true,
        registrant: true,
        resolvedAddress: true,
        wrappedOwner: true,
        allowDeleted: true,
      },
    })
    if (!result.length) throw new Error('No names found')
    const deletedNames = result.filter(
      (x) => x.parentName === 'deletable.eth' && x.owner === EMPTY_ADDRESS,
    )
    expect(deletedNames.length).toBe(1)
  })
  it('filters by search string', async () => {
    const result = await getNamesForAddress(publicClient, {
      address: accounts[1],
      pageSize: 1000,
      filter: {
        owner: true,
        registrant: true,
        resolvedAddress: true,
        wrappedOwner: true,
        searchString: 'test123',
      },
    })

    if (!result.length) throw new Error('No names found')
    for (const name of result) {
      expect(name.labelName).toContain('test123')
    }
  })
  it('filters by search string - name', async () => {
    const result = await getNamesForAddress(publicClient, {
      address: accounts[2],
      pageSize: 1000,
      filter: {
        owner: true,
        registrant: true,
        resolvedAddress: true,
        wrappedOwner: true,
        searchString: 'wrapped-with-subnames',
        searchType: 'name',
      },
    })

    if (!result.length) throw new Error('No names found')
    const subnames = result.filter(
      (x) => x.parentName === 'wrapped-with-subnames.eth',
    )
    expect(subnames.length).toBeGreaterThan(0)
  })
})

describe.each([
  {
    orderBy: 'name',
    orderDirection: 'asc',
    compareFn: (a: NameWithRelation, b: NameWithRelation) =>
      (a.name || '').localeCompare(b.name || ''),
  },
  {
    orderBy: 'name',
    orderDirection: 'desc',
    compareFn: (a: NameWithRelation, b: NameWithRelation) =>
      (b.name || '').localeCompare(a.name || ''),
  },
  {
    orderBy: 'labelName',
    orderDirection: 'asc',
    compareFn: (a: NameWithRelation, b: NameWithRelation) => {
      const aLabelName = a.labelName || ''
      const bLabelName = b.labelName || ''
      return aLabelName.localeCompare(bLabelName)
    },
  },
  {
    orderBy: 'labelName',
    orderDirection: 'desc',
    compareFn: (a: NameWithRelation, b: NameWithRelation) => {
      const aLabelName = a.labelName || ''
      const bLabelName = b.labelName || ''
      return bLabelName.localeCompare(aLabelName)
    },
  },
  {
    orderBy: 'expiryDate',
    orderDirection: 'asc',
    compareFn: (a: NameWithRelation, b: NameWithRelation) => {
      const aExpiryDate = a.expiryDate?.value || Infinity
      const bExpiryDate = b.expiryDate?.value || Infinity
      return aExpiryDate - bExpiryDate
    },
  },
  {
    orderBy: 'expiryDate',
    orderDirection: 'desc',
    compareFn: (a: NameWithRelation, b: NameWithRelation) => {
      const aExpiryDate = a.expiryDate?.value || Infinity
      const bExpiryDate = b.expiryDate?.value || Infinity
      return bExpiryDate - aExpiryDate
    },
  },
  {
    orderBy: 'createdAt',
    orderDirection: 'asc',
    compareFn: (a: NameWithRelation, b: NameWithRelation) => {
      const aCreatedAt = a.createdAt.value
      const bCreatedAt = b.createdAt.value
      return aCreatedAt - bCreatedAt
    },
  },
  {
    orderBy: 'createdAt',
    orderDirection: 'desc',
    compareFn: (a: NameWithRelation, b: NameWithRelation) => {
      const aCreatedAt = a.createdAt.value
      const bCreatedAt = b.createdAt.value
      return bCreatedAt - aCreatedAt
    },
  },
])(
  'filters by $orderBy $orderDirection',
  ({ orderBy, orderDirection, compareFn }) => {
    it('is consistent between full result and paginated results', async () => {
      const fullResult = await getNamesForAddress(publicClient, {
        address: accounts[1],
        orderBy: orderBy as any,
        orderDirection: orderDirection as any,
        pageSize: 1000,
      })
      if (!fullResult.length) throw new Error('No names found')
      const paginatedResults = []
      let lastResult: NameWithRelation[] = []
      do {
        const result = await getNamesForAddress(publicClient, {
          address: accounts[1],
          orderBy: orderBy as any,
          orderDirection: orderDirection as any,
          previousPage: lastResult,
          pageSize: 5,
        })
        paginatedResults.push(...result)
        lastResult = result
      } while (lastResult.length)

      expect(paginatedResults.length).toBe(fullResult.length)
      expect(paginatedResults).toStrictEqual(fullResult)
    })
    it('is sorted correctly', async () => {
      const fullResult = await getNamesForAddress(publicClient, {
        address: accounts[1],
        orderBy: orderBy as any,
        orderDirection: orderDirection as any,
        pageSize: 1000,
      })
      if (!fullResult.length) throw new Error('No names found')
      const sortedResult = [...fullResult].sort(compareFn)
      expect(fullResult).toEqual(sortedResult)
    })
  },
)
