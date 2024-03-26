import { createPublicClient, http } from 'viem'
import { goerli, mainnet } from 'viem/chains'
import { describe, expect, it, vi } from 'vitest'
import { addEnsContracts } from '../../contracts/addEnsContracts.js'
import { ccipRequest } from '../../utils/ccipRequest.js'
import batch from './batch.js'
import getAddressRecord from './getAddressRecord.js'
import getRecords from './getRecords.js'
import getText from './getTextRecord.js'

vi.setConfig({
  testTimeout: 30000,
})

const goerliPublicClient = createPublicClient({
  chain: addEnsContracts(goerli),
  transport: http('https://goerli.gateway.tenderly.co/4imxc4hQfRjxrVB2kWKvTo'),
})

const mainnetPublicClient = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http('https://mainnet.gateway.tenderly.co/4imxc4hQfRjxrVB2kWKvTo'),
})

describe('CCIP', () => {
  describe('getRecords', () => {
    it('should return records from a ccip-read name', async () => {
      const result = await getRecords(goerliPublicClient, {
        name: '1.offchainexample.eth',
        texts: ['email', 'description'],
        contentHash: true,
        coins: ['ltc', '60'],
      })
      expect(result).toMatchInlineSnapshot(`
        {
          "coins": [
            {
              "id": 2,
              "name": "ltc",
              "value": "MQMcJhpWHYVeQArcZR3sBgyPZxxRtnH441",
            },
            {
              "id": 60,
              "name": "eth",
              "value": "0x41563129cDbbD0c5D3e1c86cf9563926b243834d",
            },
          ],
          "contentHash": {
            "decoded": "bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y",
            "protocolType": "ipfs",
          },
          "resolverAddress": "0xEE28bdfBB91dE63bfBDA454082Bb1850f7804B09",
          "texts": [
            {
              "key": "email",
              "value": "nick@ens.domains",
            },
            {
              "key": "description",
              "value": "hello offchainresolver wildcard record",
            },
          ],
        }
      `)
    })
    it('should return records from a ccip-read name with custom ccipRequest', async () => {
      const goerliWithEns = addEnsContracts(goerli)
      const goerliPublicClientWithCustomCcipRequest = createPublicClient({
        chain: goerliWithEns,
        transport: http(
          'https://goerli.gateway.tenderly.co/4imxc4hQfRjxrVB2kWKvTo',
        ),
        ccipRead: {
          request: ccipRequest(goerliWithEns),
        },
      })
      const result = await getRecords(goerliPublicClientWithCustomCcipRequest, {
        name: '1.offchainexample.eth',
        texts: ['email', 'description'],
        contentHash: true,
        coins: ['ltc', '60'],
      })
      expect(result).toMatchInlineSnapshot(`
        {
          "coins": [
            {
              "id": 2,
              "name": "ltc",
              "value": "MQMcJhpWHYVeQArcZR3sBgyPZxxRtnH441",
            },
            {
              "id": 60,
              "name": "eth",
              "value": "0x41563129cDbbD0c5D3e1c86cf9563926b243834d",
            },
          ],
          "contentHash": {
            "decoded": "bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y",
            "protocolType": "ipfs",
          },
          "resolverAddress": "0xEE28bdfBB91dE63bfBDA454082Bb1850f7804B09",
          "texts": [
            {
              "key": "email",
              "value": "nick@ens.domains",
            },
            {
              "key": "description",
              "value": "hello offchainresolver wildcard record",
            },
          ],
        }
      `)
    })
    it('should return records from a ccip-read name with incompliant resolver', async () => {
      const result = await getRecords(mainnetPublicClient, {
        name: 'alisha.beam.eco',
        texts: ['email', 'description'],
        contentHash: true,
        coins: ['ltc', '60'],
      })
      expect(result).toMatchInlineSnapshot(`
        {
          "coins": [
            {
              "id": 60,
              "name": "eth",
              "value": "0x3A8C8D374AD15fE43E6239F6C694bff9Ee4CBbbf",
            },
          ],
          "contentHash": null,
          "resolverAddress": "0x244fE34a508E16E12A221332f63E3a741C759D76",
          "texts": [],
        }
      `)
    })
  })
  describe('batch', () => {
    it('allows batch ccip', async () => {
      const result = await batch(
        goerliPublicClient,
        getAddressRecord.batch({ name: '1.offchainexample.eth' }),
        getAddressRecord.batch({ name: '1.offchainexample.eth', coin: 'ltc' }),
        getText.batch({ name: '1.offchainexample.eth', key: 'email' }),
      )
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "id": 60,
            "name": "eth",
            "value": "0x41563129cDbbD0c5D3e1c86cf9563926b243834d",
          },
          {
            "id": 2,
            "name": "ltc",
            "value": "MQMcJhpWHYVeQArcZR3sBgyPZxxRtnH441",
          },
          "nick@ens.domains",
        ]
      `)
    })
    it('allows nested batch ccip', async () => {
      const result = await batch(
        goerliPublicClient,
        batch.batch(getAddressRecord.batch({ name: '1.offchainexample.eth' })),
      )
      expect(result).toMatchInlineSnapshot(`
        [
          [
            {
              "id": 60,
              "name": "eth",
              "value": "0x41563129cDbbD0c5D3e1c86cf9563926b243834d",
            },
          ],
        ]
      `)
    })
  })
})
