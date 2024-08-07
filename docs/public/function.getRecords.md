[**@ensdomains/ensjs**](../README.md)

---

> [public](README.md) > getRecords

# Function: getRecords()

> **getRecords**\<`TParams`\>(`client`, `parameters`): `Promise`\< `GetRecordsReturnType`\< `TParams` \> \>

Gets arbitrary records for a name

## Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts } from '@ensdomains/ensjs'
import { getRecords } from '@ensdomains/ensjs/public'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
})
const result = await getRecords(client, {
  name: 'ens.eth',
  texts: ['com.twitter', 'com.github'],
  coins: ['ETH'],
  contentHash: true,
})
// { texts: [{ key: 'com.twitter', value: 'ensdomains' }, { key: 'com.github', value: 'ensdomains' }], coins: [{ id: 60, name: 'ETH', value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' }], contentHash: { protocolType: 'ipns', decoded: 'k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw' } }
```

## Type parameters

| Parameter                                  |
| :----------------------------------------- |
| `TParams` _extends_ `GetRecordsParameters` |

## Parameters

| Parameter    | Type            | Description          |
| :----------- | :-------------- | :------------------- |
| `client`     | `ClientWithEns` | ClientWithEns        |
| `parameters` | `TParams`       | GetRecordsParameters |

## Returns

`Promise`\< `GetRecordsReturnType`\< `TParams` \> \>

Records data object. GetRecordsReturnType

## Source

[packages/ensjs/src/functions/public/getRecords.ts:376](https://github.com/ensdomains/ensjs-v3/blob/1b90b888/packages/ensjs/src/functions/public/getRecords.ts#L376)

---

Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
