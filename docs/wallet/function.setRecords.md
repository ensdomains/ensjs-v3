[**@ensdomains/ensjs**](../README.md)

---

> [wallet](README.md) > setRecords

# Function: setRecords()

> **setRecords**\<`TChain`, `TAccount`, `TChainOverride`\>(`wallet`, `parameters`): `Promise`\< `SetRecordsReturnType` \>

Sets multiple records for a name on a resolver.

## Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts } from '@ensdomains/ensjs'
import { setRecords } from '@ensdomains/ensjs/wallet'

const wallet = createWalletClient({
  chain: addEnsContracts(mainnet),
  transport: custom(window.ethereum),
})
const hash = await setRecords(wallet, {
  name: 'ens.eth',
  coins: [
    {
      coin: 'ETH',
      value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
    },
  ],
  texts: [{ key: 'foo', value: 'bar' }],
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

| Parameter                    | Type                                                  | Description                            |
| :--------------------------- | :---------------------------------------------------- | :------------------------------------- |
| `wallet`                     | `object`                                              | ClientWithAccount                      |
| `parameters`                 | `object`                                              | SetRecordsParameters                   |
| `parameters.abi`?            | `Omit`\< `EncodeSetAbiParameters`, `"namehash"` \>    | ABI value                              |
| `parameters.clearRecords`?   | `boolean`                                             | Clears all current records             |
| `parameters.coins`?          | `Omit`\< `EncodeSetAddrParameters`, `"namehash"` \>[] | Array of coin records                  |
| `parameters.contentHash`?    | `string`                                              | ContentHash value                      |
| `parameters.name`            | `string`                                              | The name to set records for            |
| `parameters.resolverAddress` | \`0x$\{string}\`                                      | The resolver address to set records on |
| `parameters.texts`?          | `Omit`\< `EncodeSetTextParameters`, `"namehash"` \>[] | Array of text records                  |

## Returns

`Promise`\< `SetRecordsReturnType` \>

Transaction hash. SetRecordsReturnType

## Source

[packages/ensjs/src/functions/wallet/setRecords.ts:99](https://github.com/ensdomains/ensjs-v3/blob/1b90b888/packages/ensjs/src/functions/wallet/setRecords.ts#L99)

---

Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
