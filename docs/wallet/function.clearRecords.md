[**@ensdomains/ensjs**](../README.md)

---

> [wallet](README.md) > clearRecords

# Function: clearRecords()

> **clearRecords**\<`TChain`, `TAccount`, `TChainOverride`\>(`wallet`, `parameters`): `Promise`\< `ClearRecordsReturnType` \>

Clears the records for a name on a resolver.

## Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts } from '@ensdomains/ensjs'
import { clearRecords } from '@ensdomains/ensjs/wallet'

const wallet = createWalletClient({
  chain: addEnsContracts(mainnet),
  transport: custom(window.ethereum),
})
const hash = await clearRecords(wallet, {
  name: 'ens.eth',
  resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
})
// 0x...
```

## Type parameters

| Parameter                                                | Default        |
| :------------------------------------------------------- | :------------- |
| `TChain` _extends_ `ChainWithEns`                        | -              |
| `TAccount` _extends_ `undefined` \| `Account`            | -              |
| `TChainOverride` _extends_ `undefined` \| `ChainWithEns` | `ChainWithEns` |

## Parameters

| Parameter                    | Type             | Description                   |
| :--------------------------- | :--------------- | :---------------------------- |
| `wallet`                     | `object`         | ClientWithAccount             |
| `parameters`                 | `object`         | ClearRecordsParameters        |
| `parameters.name`            | `string`         | The name to clear records for |
| `parameters.resolverAddress` | \`0x$\{string}\` | The resolver address to use   |

## Returns

`Promise`\< `ClearRecordsReturnType` \>

Transaction hash. ClearRecordsReturnType

## Source

[packages/ensjs/src/functions/wallet/clearRecords.ts:72](https://github.com/ensdomains/ensjs-v3/blob/1b90b888/packages/ensjs/src/functions/wallet/clearRecords.ts#L72)

---

Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
