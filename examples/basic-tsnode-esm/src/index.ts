import { createEnsPublicClient } from '@ensdomains/ensjs'
import { getAddressRecord, getTextRecord } from '@ensdomains/ensjs/public'
import { http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http('https://web3.euc.li/v1/mainnet'),
})

const main = async () => {
  const records = await client.getSubgraphRecords({ name: 'ens.eth' })
  const recordData = await client.getRecords({
    name: 'ens.eth',
    records: {
      abi: true,
      contentHash: true,
      ...(records || {}),
    },
  })
  console.log(recordData)

  const batchData = await client.ensBatch(
    getTextRecord.batch({ name: 'ens.eth', key: 'com.twitter' }),
    getAddressRecord.batch({ name: 'ens.eth', coin: 'ETH' }),
  )
  console.log(batchData)
}

main()
