/* eslint-disable @typescript-eslint/naming-convention */
import type { RequestListener } from 'http'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
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
import { addEnsContracts } from '../../index.js'
import { createHttpServer } from '../../test/createHttpServer.js'
import { createHandlerResponse } from '../../test/dns.js'
import getDnsOffchainData from './getDnsOffchainData.js'

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

const mainnetPublicClient = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http('https://mainnet.gateway.tenderly.co/4imxc4hQfRjxrVB2kWKvTo'),
})

it('returns offchain data', async () => {
  createHandlerResponse(handler, {
    Status: 0,
    AD: true,
    Answer: [
      {
        name: 'example.com',
        type: 16,
        TTL: 0,
        data: '"ENS1 0x238A8F792dFA6033814B18618aD4100654aeef01"',
      },
      {
        name: 'example.com',
        type: 46,
        TTL: 0,
        data: 'TXT ALGORITHM 2',
      },
    ],
  })

  await expect(
    getDnsOffchainData(mainnetPublicClient, {
      name: 'example.com',
      endpoint: serverUrl,
    }),
  ).resolves.toMatchInlineSnapshot(`
    {
      "extraData": null,
      "resolverAddress": "0x238A8F792dFA6033814B18618aD4100654aeef01",
    }
  `)
})

it('returns offchain data with extra data as address', async () => {
  createHandlerResponse(handler, {
    Status: 0,
    AD: true,
    Answer: [
      {
        name: 'example.com',
        type: 16,
        TTL: 0,
        data: '"ENS1 0x238A8F792dFA6033814B18618aD4100654aeef01 0x8e8Db5CcEF88cca9d624701Db544989C996E3216"',
      },
      {
        name: 'example.com',
        type: 46,
        TTL: 0,
        data: 'TXT ALGORITHM 2',
      },
    ],
  })

  await expect(
    getDnsOffchainData(mainnetPublicClient, {
      name: 'example.com',
      endpoint: serverUrl,
    }),
  ).resolves.toMatchInlineSnapshot(`
    {
      "extraData": "0x8e8Db5CcEF88cca9d624701Db544989C996E3216",
      "resolverAddress": "0x238A8F792dFA6033814B18618aD4100654aeef01",
    }
  `)
})

it('returns offchain data with extra data as text', async () => {
  createHandlerResponse(handler, {
    Status: 0,
    AD: true,
    Answer: [
      {
        name: 'example.com',
        type: 16,
        TTL: 0,
        data: '"ENS1 0x238A8F792dFA6033814B18618aD4100654aeef01 hello world"',
      },
      {
        name: 'example.com',
        type: 46,
        TTL: 0,
        data: 'TXT ALGORITHM 2',
      },
    ],
  })

  await expect(
    getDnsOffchainData(mainnetPublicClient, {
      name: 'example.com',
      endpoint: serverUrl,
    }),
  ).resolves.toMatchInlineSnapshot(`
    {
      "extraData": "hello world",
      "resolverAddress": "0x238A8F792dFA6033814B18618aD4100654aeef01",
    }
  `)
})

it('returns offchain data from ens name', async () => {
  createHandlerResponse(handler, {
    Status: 0,
    AD: true,
    Answer: [
      {
        name: 'example.com',
        type: 16,
        TTL: 0,
        data: '"ENS1 dnsname.ens.eth"',
      },
      {
        name: 'example.com',
        type: 46,
        TTL: 0,
        data: 'TXT ALGORITHM 2',
      },
    ],
  })

  await expect(
    getDnsOffchainData(mainnetPublicClient, {
      name: 'example.com',
      endpoint: serverUrl,
    }),
  ).resolves.toMatchInlineSnapshot(`
    {
      "extraData": null,
      "resolverAddress": "0x238A8F792dFA6033814B18618aD4100654aeef01",
    }
  `)
})

it('returns first offchain data from multiple', async () => {
  createHandlerResponse(handler, {
    Status: 0,
    AD: true,
    Answer: [
      {
        name: 'example.com',
        type: 16,
        TTL: 0,
        data: '"ENS1 0x238A8F792dFA6033814B18618aD4100654aeef01"',
      },
      {
        name: 'example.com',
        type: 16,
        TTL: 0,
        data: '"ENS1 0x8e8Db5CcEF88cca9d624701Db544989C996E3216"',
      },
      {
        name: 'example.com',
        type: 46,
        TTL: 0,
        data: 'TXT ALGORITHM 2',
      },
    ],
  })

  await expect(
    getDnsOffchainData(mainnetPublicClient, {
      name: 'example.com',
      endpoint: serverUrl,
    }),
  ).resolves.toMatchInlineSnapshot(`
    {
      "extraData": null,
      "resolverAddress": "0x238A8F792dFA6033814B18618aD4100654aeef01",
    }
  `)
})

it('returns first valid offchain data when multiple invalid', async () => {
  createHandlerResponse(handler, {
    Status: 0,
    AD: true,
    Answer: [
      {
        name: 'example.com',
        type: 16,
        TTL: 0,
        data: '"ENS1 0x238A8F7"',
      },
      {
        name: 'example.com',
        type: 16,
        TTL: 0,
        data: '"ENS1 randomnonsense"',
      },
      {
        name: 'example.com',
        type: 16,
        TTL: 0,
        data: '"ENS1 0x238A8F792dFA6033814B18618aD4100654aeef01"',
      },
      {
        name: 'example.com',
        type: 46,
        TTL: 0,
        data: 'TXT ALGORITHM 2',
      },
    ],
  })

  await expect(
    getDnsOffchainData(mainnetPublicClient, {
      name: 'example.com',
      endpoint: serverUrl,
    }),
  ).resolves.toMatchInlineSnapshot(`
    {
      "extraData": null,
      "resolverAddress": "0x238A8F792dFA6033814B18618aD4100654aeef01",
    }
  `)
})

it('allows subname input', async () => {
  createHandlerResponse(handler, {
    Status: 0,
    AD: true,
    Answer: [
      {
        name: 'sub.example.com',
        type: 16,
        TTL: 0,
        data: '"ENS1 0x238A8F792dFA6033814B18618aD4100654aeef01"',
      },
      {
        name: 'sub.example.com',
        type: 46,
        TTL: 0,
        data: 'TXT ALGORITHM 3',
      },
    ],
  })

  await expect(
    getDnsOffchainData(mainnetPublicClient, {
      name: 'sub.example.com',
      endpoint: serverUrl,
    }),
  ).resolves.toMatchInlineSnapshot(`
    {
      "extraData": null,
      "resolverAddress": "0x238A8F792dFA6033814B18618aD4100654aeef01",
    }
  `)
})

it('throws error when name type is .eth', async () => {
  await expect(
    getDnsOffchainData(mainnetPublicClient, {
      name: 'example.eth',
      endpoint: serverUrl,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [UnsupportedNameTypeError: Unsupported name type: eth-2ld

    - Supported name types: other-2ld, other-subname

    Version: @ensdomains/ensjs@1.0.0-mock.0]
  `)
})

describe('DnsResponseStatus is not NOERROR', () => {
  beforeEach(() => {
    createHandlerResponse(handler, {
      Status: 3, // NXDOMAIN
      AD: true,
    })
  })

  it('strict: throws error', async () => {
    await expect(
      getDnsOffchainData(mainnetPublicClient, {
        name: 'example.com',
        endpoint: serverUrl,
        strict: true,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [DnsResponseStatusError: DNS query failed with status: NXDOMAIN

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })

  it('not strict: returns null', async () => {
    await expect(
      getDnsOffchainData(mainnetPublicClient, {
        name: 'example.com',
        endpoint: serverUrl,
        strict: false,
      }),
    ).resolves.toBeNull()
  })
})

describe('AD is false', () => {
  beforeEach(() => {
    createHandlerResponse(handler, {
      Status: 0,
      AD: false,
    })
  })

  it('strict: throws error', async () => {
    await expect(
      getDnsOffchainData(mainnetPublicClient, {
        name: 'example.com',
        endpoint: serverUrl,
        strict: true,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [DnsDnssecVerificationFailedError: DNSSEC verification failed

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })

  it('not strict: returns null', async () => {
    await expect(
      getDnsOffchainData(mainnetPublicClient, {
        name: 'example.com',
        endpoint: serverUrl,
        strict: false,
      }),
    ).resolves.toBeNull()
  })
})

describe('no TXT records', () => {
  beforeEach(() => {
    createHandlerResponse(handler, {
      Status: 0,
      AD: true,
    })
  })

  it('strict: throws error', async () => {
    await expect(
      getDnsOffchainData(mainnetPublicClient, {
        name: 'example.com',
        endpoint: serverUrl,
        strict: true,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [DnsNoTxtRecordError: No TXT record found

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })

  it('not strict: returns null', async () => {
    await expect(
      getDnsOffchainData(mainnetPublicClient, {
        name: 'example.com',
        endpoint: serverUrl,
        strict: false,
      }),
    ).resolves.toBeNull()
  })
})

describe('wildcard expansion', () => {
  beforeEach(() => {
    createHandlerResponse(handler, {
      Status: 0,
      AD: true,
      Answer: [
        {
          name: 'example.com',
          type: 16,
          TTL: 0,
          data: '"ENS1 0x238A8F792dFA6033814B18618aD4100654aeef01"',
        },
        {
          name: 'example.com',
          type: 46,
          TTL: 0,
          data: 'TXT ALGORITHM 1',
        },
      ],
    })
  })

  it('strict: throws error', async () => {
    await expect(
      getDnsOffchainData(mainnetPublicClient, {
        name: 'example.com',
        endpoint: serverUrl,
        strict: true,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [DnsDnssecWildcardExpansionError: DNSSEC wildcard expansion not supported

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })
  it('not strict: returns null', async () => {
    await expect(
      getDnsOffchainData(mainnetPublicClient, {
        name: 'example.com',
        endpoint: serverUrl,
        strict: false,
      }),
    ).resolves.toBeNull()
  })
})

describe('only invalid records', () => {
  beforeEach(() => {
    createHandlerResponse(handler, {
      Status: 0,
      AD: true,
      Answer: [
        {
          name: 'example.com',
          type: 16,
          TTL: 0,
          data: '"ENS1 0x238A8F7"',
        },
        {
          name: 'example.com',
          type: 16,
          TTL: 0,
          data: '"ENS1 randomnonsense"',
        },
        {
          name: 'example.com',
          type: 46,
          TTL: 0,
          data: 'TXT ALGORITHM 2',
        },
      ],
    })
  })

  it('strict: throws error', async () => {
    await expect(
      getDnsOffchainData(mainnetPublicClient, {
        name: 'example.com',
        endpoint: serverUrl,
        strict: true,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [DnsInvalidTxtRecordError: Invalid TXT record: ENS1 0x238A8F7

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })

  it('not strict: returns null', async () => {
    await expect(
      getDnsOffchainData(mainnetPublicClient, {
        name: 'example.com',
        endpoint: serverUrl,
        strict: false,
      }),
    ).resolves.toBeNull()
  })
})

describe('no eligible invalid records', () => {
  beforeEach(() => {
    createHandlerResponse(handler, {
      Status: 0,
      AD: true,
      Answer: [
        {
          name: 'example.com',
          type: 16,
          TTL: 0,
          data: '"foo bar"',
        },
        {
          name: 'example.com',
          type: 16,
          TTL: 0,
          data: '"random"',
        },
        {
          name: 'example.com',
          type: 46,
          TTL: 0,
          data: 'TXT ALGORITHM 2',
        },
      ],
    })
  })

  it('strict: throws error', async () => {
    await expect(
      getDnsOffchainData(mainnetPublicClient, {
        name: 'example.com',
        endpoint: serverUrl,
        strict: true,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [DnsNoTxtRecordError: No TXT record found

      Version: @ensdomains/ensjs@1.0.0-mock.0]
    `)
  })

  it('not strict: returns null', async () => {
    await expect(
      getDnsOffchainData(mainnetPublicClient, {
        name: 'example.com',
        endpoint: serverUrl,
        strict: false,
      }),
    ).resolves.toBeNull()
  })
})

it('real test', async () => {
  const offchainData = await getDnsOffchainData(mainnetPublicClient, {
    name: 'ethleaderboard.xyz',
    strict: true,
  })
  expect(offchainData).toMatchInlineSnapshot(`
    {
      "extraData": "0xD0AeA65bb96b823cb30724ee0a6B7588c77dE486",
      "resolverAddress": "0x238A8F792dFA6033814B18618aD4100654aeef01",
    }
  `)
})
