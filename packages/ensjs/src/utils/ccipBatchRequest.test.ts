import type { RequestListener } from 'http'
import { expect, it, vi } from 'vitest'
import { createHttpServer } from '../test/createHttpServer.js'
import { ccipBatchRequest } from './ccipBatchRequest.js'

it('returns array of responses', async () => {
  const handler = vi
    .fn<Parameters<RequestListener>, ReturnType<RequestListener>>()
    .mockImplementation((_, res) => {
      res.writeHead(200, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      })
      res.end(JSON.stringify({ data: '0xdeadbeef' }))
    })
  const { close, url } = await createHttpServer(handler)
  const items = [
    ['0x8464135c8F25Da09e49BC8782676a84730C318bC', [url], '0xdeadbeef01'],
    ['0x8464135c8F25Da09e49BC8782676a84730C318bC', [url], '0xdeadbeef02'],
    ['0x8464135c8F25Da09e49BC8782676a84730C318bC', [url], '0xdeadbeef03'],
  ] as const
  const result = await ccipBatchRequest(items)
  expect(handler).toHaveBeenCalledTimes(3)
  expect(result).toMatchInlineSnapshot(`
    [
      [
        false,
        false,
        false,
      ],
      [
        "0xdeadbeef",
        "0xdeadbeef",
        "0xdeadbeef",
      ],
    ]
  `)
  await close()
})
it('removes duplicate requests', async () => {
  const handler = vi
    .fn<Parameters<RequestListener>, ReturnType<RequestListener>>()
    .mockImplementation((_, res) => {
      res.writeHead(200, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      })
      res.end(JSON.stringify({ data: '0xdeadbeef' }))
    })
  const { close, url } = await createHttpServer(handler)
  const items = [
    ['0x8464135c8F25Da09e49BC8782676a84730C318bC', [url], '0xdeadbeef'],
    ['0x8464135c8F25Da09e49BC8782676a84730C318bC', [url], '0xdeadbeef'],
    ['0x8464135c8F25Da09e49BC8782676a84730C318bC', [url], '0xdeadbeef'],
  ] as const
  const result = await ccipBatchRequest(items)
  expect(handler).toHaveBeenCalledTimes(1)
  expect(result).toMatchInlineSnapshot(`
    [
      [
        false,
        false,
        false,
      ],
      [
        "0xdeadbeef",
        "0xdeadbeef",
        "0xdeadbeef",
      ],
    ]
  `)
  await close()
})
it('handles and correctly returns HttpRequestError', async () => {
  const handler = vi
    .fn<Parameters<RequestListener>, ReturnType<RequestListener>>()
    .mockImplementation((_, res) => {
      res.writeHead(404)
      res.end()
    })
  const { close, url } = await createHttpServer(handler)
  const items = [
    ['0x8464135c8F25Da09e49BC8782676a84730C318bC', [url], '0xdeadbeef'],
  ] as const
  const result = await ccipBatchRequest(items)
  expect(result).toMatchInlineSnapshot(`
    [
      [
        true,
      ],
      [
        "0xca7a4e750000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000194000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000094e6f7420466f756e640000000000000000000000000000000000000000000000",
      ],
    ]
  `)
  await close()
})
it('handles and correctly returns misc. error', async () => {
  const handler = vi
    .fn<Parameters<RequestListener>, ReturnType<RequestListener>>()
    .mockImplementation((_, res) => {
      res.writeHead(200, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      })
      res.end('invalid json')
    })
  const { close, url } = await createHttpServer(handler)
  const items = [
    ['0x8464135c8F25Da09e49BC8782676a84730C318bC', [url], '0xdeadbeef'],
  ] as const
  const result = await ccipBatchRequest(items)
  expect(result).toMatchInlineSnapshot(`
    [
      [
        true,
      ],
      [
        "0xca7a4e7500000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001f400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000028556e657870656374656420746f6b656e206920696e204a534f4e20617420706f736974696f6e2030000000000000000000000000000000000000000000000000",
      ],
    ]
  `)
  await close()
})
