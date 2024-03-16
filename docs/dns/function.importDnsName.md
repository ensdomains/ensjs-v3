[**@ensdomains/ensjs**](../README.md)

---

> [dns](README.md) > importDnsName

# Function: importDnsName()

> **importDnsName**\<`TChain`, `TAccount`, `TChainOverride`\>(`wallet`, `parameters`): `Promise`\< `ImportDnsNameReturnType` \>

Creates a transaction to import a DNS name to ENS.

## Example

```ts
import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts } from '@ensdomains/ensjs'
import { getDnsImportData, importDnsName } from '@ensdomains/ensjs/dns'

const mainnetWithEns = addEnsContracts(mainnet)
const client = createPublicClient({
  chain: mainnetWithEns,
  transport: http(),
})
const wallet = createWalletClient({
  chain: mainnetWithEns,
  transport: custom(window.ethereum),
})
const dnsImportData = await getDnsImportData(client, {
  name: 'example.com',
})
const hash = await importDnsName(wallet, {
  name: 'example.com',
  dnsImportData,
})
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
| `parameters` | `ImportDnsNameParameters`\< `TChain`, `TAccount`, `TChainOverride` \> | ImportDnsNameParameters |

## Returns

`Promise`\< `ImportDnsNameReturnType` \>

A transaction hash. ImportDnsNameReturnType

## Source

[packages/ensjs/src/functions/dns/importDnsName.ts:152](https://github.com/ensdomains/ensjs-v3/blob/1b90b888/packages/ensjs/src/functions/dns/importDnsName.ts#L152)

---

Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
