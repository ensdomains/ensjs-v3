import type { RequestListener } from 'http'
import { encodeFunctionData, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'
import { expect, it, vi } from 'vitest'
import { getChainContractAddress } from '../contracts/getChainContractAddress.js'
import { addEnsContracts } from '../index.js'
import { createHttpServer } from '../test/createHttpServer.js'
import { ccipRequest } from './ccipRequest.js'

const handler = vi
  .fn<Parameters<RequestListener>, ReturnType<RequestListener>>()
  .mockImplementation((_, res) => {
    res.writeHead(200, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    })
    res.end(JSON.stringify({ data: '0xdeadbeef' }))
  })

it('uses viemCcipRequest for standard request', async () => {
  const { close, url } = await createHttpServer(handler)
  const chain = addEnsContracts(mainnet)
  const result = await ccipRequest(chain)({
    sender: '0x8464135c8F25Da09e49BC8782676a84730C318bC',
    urls: [url],
    data: '0xdeadbeef',
  })
  expect(handler).toHaveBeenCalled()
  expect(result).toEqual('0xdeadbeef')
  await close()
})
it('uses viemCcipRequest for universalresolver request that is not matching signature', async () => {
  const { close, url } = await createHttpServer(handler)
  const chain = addEnsContracts(mainnet)
  const result = await ccipRequest(chain)({
    sender: getChainContractAddress({
      client: { chain },
      contract: 'ensUniversalResolver',
    }),
    urls: [url],
    data: '0xdeadbeef',
  })
  expect(handler).toHaveBeenCalled()
  expect(result).toEqual('0xdeadbeef')
  await close()
})
it('uses ccipBatchRequest for universalresolver request that is matching signature', async () => {
  const abi = parseAbi([
    'function query((address,string[],bytes)[]) returns (bool[],bytes[])',
  ])
  const { close, url } = await createHttpServer(handler)
  const chain = addEnsContracts(mainnet)
  const data = encodeFunctionData({
    abi,
    args: [
      [['0x8464135c8F25Da09e49BC8782676a84730C318bC', [url], '0xdeadbeef']],
    ],
  })
  const result = await ccipRequest(chain)({
    sender: getChainContractAddress({
      client: { chain },
      contract: 'ensUniversalResolver',
    }),
    urls: ['https://example.com'],
    data,
  })
  expect(handler).toHaveBeenCalled()
  expect(result).toMatchInlineSnapshot(
    `"0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000004deadbeef00000000000000000000000000000000000000000000000000000000"`,
  )
  await close()
})
