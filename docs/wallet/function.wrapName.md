[**@ensdomains/ensjs**](../README.md)

---

> [wallet](README.md) > wrapName

# Function: wrapName()

> **wrapName**\<`TName`, `TChain`, `TAccount`, `TChainOverride`\>(`wallet`, `parameters`): `Promise`\< `WrapNameReturnType` \>

Wraps a name.

## Example

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts } from '@ensdomains/ensjs'
import { wrapName } from '@ensdomains/ensjs/wallet'

const wallet = createWalletClient({
  chain: addEnsContracts(mainnet),
  transport: custom(window.ethereum),
})
const hash = await wrapName(wallet, {
  name: 'ens.eth',
  newOwnerAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
})
// 0x...
```

## Type parameters

| Parameter                                                | Default        |
| :------------------------------------------------------- | :------------- |
| `TName` _extends_ `string`                               | -              |
| `TChain` _extends_ `ChainWithEns`                        | -              |
| `TAccount` _extends_ `undefined` \| `Account`            | -              |
| `TChainOverride` _extends_ `undefined` \| `ChainWithEns` | `ChainWithEns` |

## Parameters

| Parameter                     | Type                                                                                       | Description                         |
| :---------------------------- | :----------------------------------------------------------------------------------------- | :---------------------------------- |
| `wallet`                      | `object`                                                                                   | ClientWithAccount                   |
| `parameters`                  | `object`                                                                                   | WrapNameParameters                  |
| `parameters.fuses`?           | `GetNameType`\< `TName` \> _extends_ `"eth-2ld"` ? `EncodeChildFusesInputObject` : `never` | Fuses to set on wrap (eth-2ld only) |
| `parameters.name`             | `TName`                                                                                    | The name to wrap                    |
| `parameters.newOwnerAddress`  | \`0x$\{string}\`                                                                           | The recipient of the wrapped name   |
| `parameters.resolverAddress`? | \`0x$\{string}\`                                                                           | The resolver address to set on wrap |

## Returns

`Promise`\< `WrapNameReturnType` \>

Transaction hash. WrapNameReturnType

## Source

[packages/ensjs/src/functions/wallet/wrapName.ts:157](https://github.com/ensdomains/ensjs-v3/blob/1b90b888/packages/ensjs/src/functions/wallet/wrapName.ts#L157)

---

Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
