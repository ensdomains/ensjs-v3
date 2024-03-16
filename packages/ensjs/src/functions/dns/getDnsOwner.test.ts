/* eslint-disable @typescript-eslint/naming-convention */
import type { RequestListener } from 'http'
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from 'vitest'
import { createHttpServer } from '../../test/createHttpServer.js'
import getDnsOwner from './getDnsOwner.js'

vi.setConfig({
  testTimeout: 10000,
})

const handler: MockedFunction<RequestListener> = vi.fn()
let closeServer: () => Promise<unknown>
let serverUrl: `http://${string}` = 'http://'

beforeAll(async () => {
  const { close, url } = await createHttpServer(handler)
  closeServer = close
  serverUrl = url
})

afterAll(async () => {
  await closeServer()
})

beforeEach(() => {
  handler.mockReset()
})

it('returns valid address from valid domain and record', async () => {
  let name
  let type
  handler.mockImplementation((req, res) => {
    const url = new URL(req.url!, `http://${req.headers.host!}`)
    name = url.searchParams.get('name')
    type = url.searchParams.get('type')

    res.writeHead(200, { 'Content-Type': 'application/dns-json' })
    res.end(
      JSON.stringify({
        Status: 0,
        AD: true,
        Answer: [
          {
            name: '_ens.example.com',
            type: 16,
            TTL: 0,
            data: '"a=0x8e8Db5CcEF88cca9d624701Db544989C996E3216"',
          },
        ],
      }),
    )
    res.destroy()
  })

  const result = await getDnsOwner({ name: 'example.com', endpoint: serverUrl })
  expect(handler).toHaveBeenCalled()
  expect(name).toBe('_ens.example.com.')
  expect(type).toBe('TXT')
  expect(result).toEqual('0x8e8Db5CcEF88cca9d624701Db544989C996E3216')
})

it('throws error when .eth', async () => {
  await expect(getDnsOwner({ name: 'example.eth' })).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    [UnsupportedNameTypeError: Unsupported name type: eth-2ld

    - Supported name types: other-2ld

    Version: @ensdomains/ensjs@1.0.0-mock.0]
  `)
})
it('throws error when >2ld', async () => {
  await expect(getDnsOwner({ name: 'subdomain.example.com' })).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    [UnsupportedNameTypeError: Unsupported name type: other-subname

    - Supported name types: other-2ld

    Version: @ensdomains/ensjs@1.0.0-mock.0]
  `)
})
describe('DnsResponseStatus is not NOERROR', () => {
  beforeEach(() => {
    handler.mockImplementation((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/dns-json' })
      res.end(
        JSON.stringify({
          Status: 3, // NXDOMAIN
          AD: true,
        }),
      )
      res.destroy()
    })
  })
  it('strict: throws error', async () => {
    await expect(
      getDnsOwner({ name: 'example.com', endpoint: serverUrl, strict: true }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [DnsResponseStatusError: DNS query failed with status: NXDOMAIN

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })
  it('not strict: returns null', async () => {
    await expect(
      getDnsOwner({
        name: 'example.com',
        endpoint: serverUrl,
        strict: false,
      }),
    ).resolves.toBeNull()
  })
})
describe('AD is false', () => {
  beforeEach(() => {
    handler.mockImplementation((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/dns-json' })
      res.end(
        JSON.stringify({
          Status: 0,
          AD: false,
        }),
      )
      res.destroy()
    })
  })
  it('strict: throws error', async () => {
    await expect(
      getDnsOwner({ name: 'example.com', endpoint: serverUrl, strict: true }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [DnsDnssecVerificationFailedError: DNSSEC verification failed

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })
  it('not strict: returns null', async () => {
    await expect(
      getDnsOwner({ name: 'example.com', endpoint: serverUrl, strict: false }),
    ).resolves.toBeNull()
  })
})

describe('no TXT record', () => {
  beforeEach(() => {
    handler.mockImplementation((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/dns-json' })
      res.end(
        JSON.stringify({
          Status: 0,
          AD: true,
          Answer: [],
        }),
      )
      res.destroy()
    })
  })
  it('strict: throws error', async () => {
    await expect(
      getDnsOwner({ name: 'example.com', endpoint: serverUrl, strict: true }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [DnsNoTxtRecordError: No TXT record found

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })
  it('not strict: returns null', async () => {
    await expect(
      getDnsOwner({ name: 'example.com', endpoint: serverUrl, strict: false }),
    ).resolves.toBeNull()
  })
})

describe('TXT record is not formatted correctly', () => {
  beforeEach(() => {
    handler.mockImplementation((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/dns-json' })
      res.end(
        JSON.stringify({
          Status: 0,
          AD: true,
          Answer: [
            {
              name: '_ens.example.com',
              type: 16,
              TTL: 0,
              data: '"0x8e8Db5CcEF88cca9d624701Db544989C996E3216"',
            },
          ],
        }),
      )
      res.destroy()
    })
  })
  it('strict: throws error', async () => {
    await expect(
      getDnsOwner({ name: 'example.com', endpoint: serverUrl, strict: true }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [DnsInvalidTxtRecordError: Invalid TXT record: 0x8e8Db5CcEF88cca9d624701Db544989C996E3216

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })
  it('not strict: returns null', async () => {
    await expect(
      getDnsOwner({ name: 'example.com', endpoint: serverUrl, strict: false }),
    ).resolves.toBeNull()
  })
})

describe('address is not checksummed', () => {
  beforeEach(() => {
    handler.mockImplementation((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/dns-json' })
      res.end(
        JSON.stringify({
          Status: 0,
          AD: true,
          Answer: [
            {
              name: '_ens.example.com',
              type: 16,
              TTL: 0,
              data: '"a=0x8e8db5ccef88cca9d624701db544989c996e3216"',
            },
          ],
        }),
      )
      res.destroy()
    })
  })
  it('strict: throws error', async () => {
    await expect(
      getDnsOwner({ name: 'example.com', endpoint: serverUrl, strict: true }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [DnsInvalidAddressChecksumError: Invalid address checksum: 0x8e8db5ccef88cca9d624701db544989c996e3216

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })
  it('not strict: returns null', async () => {
    await expect(
      getDnsOwner({ name: 'example.com', endpoint: serverUrl, strict: false }),
    ).resolves.toBeNull()
  })
})

it('real test', async () => {
  const result = await getDnsOwner({
    name: 'taytems.xyz',
  })
  expect(result).toEqual('0x8e8Db5CcEF88cca9d624701Db544989C996E3216')
})
