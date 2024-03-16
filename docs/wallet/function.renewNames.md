[**@ensdomains/ensjs**](../README.md)

---

> [wallet](README.md) > renewNames

# Function: renewNames()

> **renewNames**\<`TChain`, `TAccount`, `TChainOverride`\>(`wallet`, `parameters`): `Promise`\< `RenewNamesReturnType` \>

Renews a name or names for a specified duration.

## Example

```ts
import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts } from '@ensdomains/ensjs'
import { getPrice } from '@ensdomains/ensjs/public'
import { renewNames } from '@ensdomains/ensjs/wallet'

const mainnetWithEns = addEnsContracts(mainnet)
const client = createPublicClient({
  chain: mainnetWithEns,
  transport: http(),
})
const wallet = createWalletClient({
  chain: mainnetWithEns,
  transport: custom(window.ethereum),
})

const duration = 31536000 // 1 year
const { base, premium } = await getPrice(wallet, {
  nameOrNames: 'example.eth',
  duration,
})
const value = ((base + premium) * 110n) / 100n // add 10% to the price for buffer
const hash = await renewNames(wallet, {
  nameOrNames: 'example.eth',
  duration,
  value,
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

| Parameter                | Type                   | Description                   |
| :----------------------- | :--------------------- | :---------------------------- |
| `wallet`                 | `object`               | ClientWithAccount             |
| `parameters`             | `object`               | RenewNamesParameters          |
| `parameters.duration`    | `number` \| `bigint`   | Duration to renew name(s) for |
| `parameters.nameOrNames` | `string` \| `string`[] | Name or names to renew        |
| `parameters.value`       | `bigint`               | Value of all renewals         |

## Returns

`Promise`\< `RenewNamesReturnType` \>

Transaction hash. RenewNamesReturnType

## Source

[packages/ensjs/src/functions/wallet/renewNames.ts:129](https://github.com/ensdomains/ensjs-v3/blob/1b90b888/packages/ensjs/src/functions/wallet/renewNames.ts#L129)

---

Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
