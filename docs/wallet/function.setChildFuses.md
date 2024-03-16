[**@ensdomains/ensjs**](../README.md)

---

> [wallet](README.md) > setChildFuses

# Function: setChildFuses()

> **setChildFuses**\<`TChain`, `TAccount`, `TChainOverride`\>(`wallet`, `parameters`): `Promise`\< `SetChildFusesReturnType` \>

Sets the fuses for a name as the parent.

## Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts } from '@ensdomains/ensjs'
import { setChildFuses } from '@ensdomains/ensjs/wallet'

const wallet = createWalletClient({
  chain: addEnsContracts(mainnet),
  transport: custom(window.ethereum),
})
const hash = await setChildFuses(wallet, {
  name: 'sub.ens.eth',
  fuses: {
    parent: {
      named: ['PARENT_CANNOT_CONTROl'],
    },
  },
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

| Parameter            | Type                     | Description                           |
| :------------------- | :----------------------- | :------------------------------------ |
| `wallet`             | `object`                 | ClientWithAccount                     |
| `parameters`         | `object`                 | SetChildFusesParameters               |
| `parameters.expiry`? | `number` \| `bigint`     | Expiry to set for fuses               |
| `parameters.fuses`   | `EncodeFusesInputObject` | Fuse object or number value to set to |
| `parameters.name`    | `string`                 | Name to set child fuses for           |

## Returns

`Promise`\< `SetChildFusesReturnType` \>

Transaction hash. SetChildFusesReturnType

## Source

[packages/ensjs/src/functions/wallet/setChildFuses.ts:89](https://github.com/ensdomains/ensjs-v3/blob/1b90b888/packages/ensjs/src/functions/wallet/setChildFuses.ts#L89)

---

Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
