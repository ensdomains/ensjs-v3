[**@ensdomains/ensjs**](../README.md)

---

> [wallet](README.md) > registerName

# Function: registerName()

> **registerName**\<`TChain`, `TAccount`, `TChainOverride`\>(`wallet`, `parameters`): `Promise`\< `RegisterNameReturnType` \>

Registers a name on ENS

## Example

```ts
import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts } from '@ensdomains/ensjs'
import { getPrice } from '@ensdomains/ensjs/public'
import { randomSecret } from '@ensdomains/ensjs/utils'
import { commitName, registerName } from '@ensdomains/ensjs/wallet'

const mainnetWithEns = addEnsContracts(mainnet)
const client = createPublicClient({
  chain: mainnetWithEns,
  transport: http(),
})
const wallet = createWalletClient({
  chain: mainnetWithEns,
  transport: custom(window.ethereum),
})
const secret = randomSecret()
const params = {
  name: 'example.eth',
  owner: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
  duration: 31536000, // 1 year
  secret,
}

const commitmentHash = await commitName(wallet, params)
await client.waitForTransactionReceipt({ hash: commitmentHash }) // wait for commitment to finalise
await new Promise((resolve) => setTimeout(resolve, 60 * 1_000)) // wait for commitment to be valid

const { base, premium } = await getPrice(client, {
  nameOrNames: params.name,
  duration: params.duration,
})
const value = ((base + premium) * 110n) / 100n // add 10% to the price for buffer
const hash = await registerName(wallet, { ...params, value })
// 0x...
```

## Type parameters

| Parameter                                                | Default        |
| :------------------------------------------------------- | :------------- |
| `TChain` _extends_ `ChainWithEns`                        | -              |
| `TAccount` _extends_ `undefined` \| `Account`            | -              |
| `TChainOverride` _extends_ `undefined` \| `ChainWithEns` | `ChainWithEns` |

## Parameters

| Parameter                     | Type                          | Description                                                             |
| :---------------------------- | :---------------------------- | :---------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------ | -------------------------- | ------------- | -------------------------------- |
| `wallet`                      | `object`                      | ClientWithAccount                                                       |
| `parameters`                  | `object`                      | RegisterNameParameters                                                  |
| `parameters.duration`         | `number`                      | Duration of registration                                                |
| `parameters.fuses`?           | `EncodeChildFusesInputObject` | Fuses to set upon registration                                          |
| `parameters.name`             | `string`                      | Name to register                                                        |
| `parameters.owner`            | \`0x$\{string}\`              | Address to set owner to                                                 |
| `parameters.records`?         | `{ clearRecords?: boolean     | undefined; contentHash?: string                                         | undefined; texts?: Omit<EncodeSetTextParameters, "namehash">[] | undefined; coins?: Omit<...>[] | undefined; abi?: Omit<...> | undefined; }` | Records to set upon registration |
| `parameters.resolverAddress`? | \`0x$\{string}\`              | Custom resolver address, defaults to current public resolver deployment |
| `parameters.reverseRecord`?   | `boolean`                     | Sets primary name upon registration                                     |
| `parameters.secret`           | \`0x$\{string}\`              | Random 32 bytes to use for registration                                 |
| `parameters.value`            | `bigint`                      | Value of registration                                                   |

## Returns

`Promise`\< `RegisterNameReturnType` \>

Transaction hash. RegisterNameReturnType

## Source

[packages/ensjs/src/functions/wallet/registerName.ts:116](https://github.com/ensdomains/ensjs-v3/blob/1b90b888/packages/ensjs/src/functions/wallet/registerName.ts#L116)

---

Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
