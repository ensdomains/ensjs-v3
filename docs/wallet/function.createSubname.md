[**@ensdomains/ensjs**](../README.md)

---

> [wallet](README.md) > createSubname

# Function: createSubname()

> **createSubname**\<`TChain`, `TAccount`, `TChainOverride`\>(`wallet`, `parameters`): `Promise`\< `CreateSubnameReturnType` \>

Creates a subname

## Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts } from '@ensdomains/ensjs'
import { createSubname } from '@ensdomains/ensjs/wallet'

const wallet = createWalletClient({
  chain: addEnsContracts(mainnet),
  transport: custom(window.ethereum),
})
const hash = await createSubname(wallet, {
  name: 'sub.ens.eth',
  owner: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
  contract: 'registry',
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

| Parameter    | Type                                                                  | Description             |
| :----------- | :-------------------------------------------------------------------- | :---------------------- |
| `wallet`     | `object`                                                              | ClientWithAccount       |
| `parameters` | `CreateSubnameParameters`\< `TChain`, `TAccount`, `TChainOverride` \> | CreateSubnameParameters |

## Returns

`Promise`\< `CreateSubnameReturnType` \>

Transaction hash. CreateSubnameReturnType

## Source

[packages/ensjs/src/functions/wallet/createSubname.ts:175](https://github.com/ensdomains/ensjs-v3/blob/1b90b888/packages/ensjs/src/functions/wallet/createSubname.ts#L175)

---

Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
