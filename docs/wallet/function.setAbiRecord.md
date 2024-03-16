[**@ensdomains/ensjs**](../README.md)

---

> [wallet](README.md) > setAbiRecord

# Function: setAbiRecord()

> **setAbiRecord**\<`TChain`, `TAccount`, `TChainOverride`\>(`wallet`, `parameters`): `Promise`\< `SetAbiRecordReturnType` \>

Sets the ABI for a name on a resolver.

## Example

```ts
import abi from './abi.json'
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts } from '@ensdomains/ensjs'
import { encodeAbi } from '@ensdomains/ensjs/utils'
import { setAbiRecord } from '@ensdomains/ensjs/wallet'

const wallet = createWalletClient({
  chain: addEnsContracts(mainnet),
  transport: custom(window.ethereum),
})

const encodedAbi = await encodeAbi({ encodeAs: 'json', abi })
const hash = await setAbiRecord(wallet, {
  name: 'ens.eth',
  encodedAbi,
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

| Parameter                    | Type                   | Description                    |
| :--------------------------- | :--------------------- | :----------------------------- |
| `wallet`                     | `object`               | ClientWithAccount              |
| `parameters`                 | `object`               | SetAbiRecordParameters         |
| `parameters.encodedAbi`      | `null` \| `EncodedAbi` | Encoded ABI data to set        |
| `parameters.name`            | `string`               | Name to set ABI for            |
| `parameters.resolverAddress` | \`0x$\{string}\`       | Resolver address to set ABI on |

## Returns

`Promise`\< `SetAbiRecordReturnType` \>

Transaction hash. SetAbiRecordReturnType

## Source

[packages/ensjs/src/functions/wallet/setAbiRecord.ts:87](https://github.com/ensdomains/ensjs-v3/blob/1b90b888/packages/ensjs/src/functions/wallet/setAbiRecord.ts#L87)

---

Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
