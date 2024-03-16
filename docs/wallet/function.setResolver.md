[**@ensdomains/ensjs**](../README.md)

---

> [wallet](README.md) > setResolver

# Function: setResolver()

> **setResolver**\<`TChain`, `TAccount`, `TChainOverride`\>(`wallet`, `parameters`): `Promise`\< `SetResolverReturnType` \>

Sets a resolver for a name.

## Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts } from '@ensdomains/ensjs'
import { setResolver } from '@ensdomains/ensjs/wallet'

const wallet = createWalletClient({
  chain: addEnsContracts(mainnet),
  transport: custom(window.ethereum),
})
const hash = await setResolver(wallet, {
  name: 'ens.eth',
  contract: 'registry',
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

| Parameter                    | Type                            | Description                 |
| :--------------------------- | :------------------------------ | :-------------------------- |
| `wallet`                     | `object`                        | ClientWithAccount           |
| `parameters`                 | `object`                        | SetResolverParameters       |
| `parameters.contract`        | `"nameWrapper"` \| `"registry"` | Contract to set resolver on |
| `parameters.name`            | `string`                        | Name to set resolver for    |
| `parameters.resolverAddress` | \`0x$\{string}\`                | Resolver address to set     |

## Returns

`Promise`\< `SetResolverReturnType` \>

Transaction hash. SetResolverReturnType

## Source

[packages/ensjs/src/functions/wallet/setResolver.ts:103](https://github.com/ensdomains/ensjs-v3/blob/1b90b888/packages/ensjs/src/functions/wallet/setResolver.ts#L103)

---

Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
