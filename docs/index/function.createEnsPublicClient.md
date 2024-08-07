[**@ensdomains/ensjs**](../README.md)

---

> [index](README.md) > createEnsPublicClient

# Function: createEnsPublicClient()

> **createEnsPublicClient**\<`TTransport`, `TChain`\>(`config`): `object`

Creates a ENS Public Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).

## Example

```ts
import { http } from 'viem'
import { mainnet } from 'viem/chains'
import { createEnsPublicClient } from '@ensdomains/ensjs'

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
})
```

## Type parameters

| Parameter                          |
| :--------------------------------- |
| `TTransport` _extends_ `Transport` |
| `TChain` _extends_ `Chain`         |

## Parameters

| Parameter | Type                                                | Description           |
| :-------- | :-------------------------------------------------- | :-------------------- |
| `config`  | `EnsPublicClientConfig`\< `TTransport`, `TChain` \> | EnsPublicClientConfig |

## Returns

An ENS Public Client. EnsPublicClient

### ensBatch

**ensBatch**: \<TBatchFunctions\>(...`parameters`) => `Promise`\< `BatchReturnType`\< `TBatchFunctions` \> \>

Batches multiple read functions into a single call.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import {
  addEnsContracts,
  ensPublicActions,
  getTextRecord,
  getAddressRecord,
} from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.ensBatch(
  getTextRecord.batch({ name: 'ens.eth', key: 'com.twitter' }),
  getAddressRecord.batch({ name: 'ens.eth', coin: 'ETH' }),
)
// ['ensdomains', { id: 60, name: 'ETH', value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7 }]
```

#### Type parameters

| Parameter                                     |
| :-------------------------------------------- |
| `TBatchFunctions` _extends_ `BatchParameters` |

#### Parameters

| Parameter       | Type              |
| :-------------- | :---------------- |
| ...`parameters` | `TBatchFunctions` |

#### Returns

`Promise`\< `BatchReturnType`\< `TBatchFunctions` \> \>

Array of return values from each function

### getAbiRecord

**getAbiRecord**: (`parameters`) => `Promise`\< `GetAbiRecordReturnType` \>

Gets the ABI record for a name

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.getAbiRecord({ name: 'ens.eth' })
// TODO: real example
```

#### Parameters

| Parameter    | Type                | Description            |
| :----------- | :------------------ | :--------------------- |
| `parameters` | `{ name: string; }` | GetAbiRecordParameters |

#### Returns

`Promise`\< `GetAbiRecordReturnType` \>

ABI record for the name, or `null` if not found. GetAbiRecordReturnType

### getAddressRecord

**getAddressRecord**: (`parameters`) => `Promise`\< `GetAddressRecordReturnType` \>

Gets an address record for a name and specified coin

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.getAddressRecord({ name: 'ens.eth', coin: 'ETH' })
// { id: 60, name: 'ETH , value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' }
```

#### Parameters

| Parameter    | Type                           | Description |
| :----------- | :----------------------------- | :---------- | --------------------------------- | ------------- | -------------------------- |
| `parameters` | `{ name: string; coin?: string | number      | undefined; bypassFormat?: boolean | undefined; }` | GetAddressRecordParameters |

#### Returns

`Promise`\< `GetAddressRecordReturnType` \>

Coin value object, or `null` if not found. GetAddressRecordReturnType

### getAvailable

**getAvailable**: (`parameters`) => `Promise`\< `boolean` \>

Gets the availability of a name to register

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.getAvailable({ name: 'ens.eth' })
// false
```

#### Parameters

| Parameter    | Type                     | Description            |
| :----------- | :----------------------- | :--------------------- |
| `parameters` | `GetAvailableParameters` | GetAvailableParameters |

#### Returns

`Promise`\< `boolean` \>

Availability as boolean. GetAvailableReturnType

### getContentHashRecord

**getContentHashRecord**: (`parameters`) => `Promise`\< `GetContentHashRecordReturnType` \>

Gets the content hash record for a name

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.getContentHashRecord({ name: 'ens.eth' })
// { protocolType: 'ipfs', decoded: 'k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw' }
```

#### Parameters

| Parameter    | Type                | Description                    |
| :----------- | :------------------ | :----------------------------- |
| `parameters` | `{ name: string; }` | GetContentHashRecordParameters |

#### Returns

`Promise`\< `GetContentHashRecordReturnType` \>

Content hash object, or `null` if not found. GetContentHashRecordReturnType

### getDecodedName

**getDecodedName**: (`parameters`) => `Promise`\< `GetDecodedNameReturnType` \>

Gets the full name for a name with unknown labels from the subgraph.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensSubgraphActions)
const result = await client.getDecodedName({
  name: '[5cee339e13375638553bdf5a6e36ba80fb9f6a4f0783680884d92b558aa471da].eth',
})
// ens.eth
```

#### Parameters

| Parameter    | Type                       | Description              |
| :----------- | :------------------------- | :----------------------- |
| `parameters` | `GetDecodedNameParameters` | GetDecodedNameParameters |

#### Returns

`Promise`\< `GetDecodedNameReturnType` \>

Full name, or null if name was could not be filled. GetDecodedNameReturnType

### getExpiry

**getExpiry**: (`parameters`) => `Promise`\< `GetExpiryReturnType` \>

Gets the expiry for a name

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.getExpiry({ name: 'ens.eth' })
// { expiry: { date: Date, value: 1913933217n }, gracePeriod: 7776000, status: 'active' }
```

#### Parameters

| Parameter    | Type                                       | Description   |
| :----------- | :----------------------------------------- | :------------ | ------------------- |
| `parameters` | `{ name: string; contract?: ContractOption | undefined; }` | GetExpiryParameters |

#### Returns

`Promise`\< `GetExpiryReturnType` \>

Expiry object, or `null` if no expiry. GetExpiryReturnType

### getName

**getName**: (`parameters`) => `Promise`\< `GetNameReturnType` \>

Gets the primary name for an address

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.getName({
  address: '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5',
})
// { name: 'nick.eth', match: true, reverseResolverAddress: '0xa2c122be93b0074270ebee7f6b7292c7deb45047', resolverAddress: '0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41' }
```

#### Parameters

| Parameter    | Type                | Description       |
| :----------- | :------------------ | :---------------- |
| `parameters` | `GetNameParameters` | GetNameParameters |

#### Returns

`Promise`\< `GetNameReturnType` \>

Name data object, or `null` if no primary name is set. GetNameReturnType

### getNameHistory

**getNameHistory**: (`parameters`) => `Promise`\< `GetNameHistoryReturnType` \>

Gets the history of a name from the subgraph.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensSubgraphActions)
const result = await client.getNameHistory({ name: 'ens.eth' })
```

#### Parameters

| Parameter    | Type                       | Description              |
| :----------- | :------------------------- | :----------------------- |
| `parameters` | `GetNameHistoryParameters` | GetNameHistoryParameters |

#### Returns

`Promise`\< `GetNameHistoryReturnType` \>

History object, or null if name could not be found. GetNameHistoryReturnType

### getNamesForAddress

**getNamesForAddress**: (`parameters`) => `Promise`\< `GetNamesForAddressReturnType` \>

Gets the names for an address from the subgraph.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensSubgraphActions)
const result = await client.getNamesForAddress({
  address: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
})
```

#### Parameters

| Parameter    | Type                           | Description                  |
| :----------- | :----------------------------- | :--------------------------- |
| `parameters` | `GetNamesForAddressParameters` | GetNamesForAddressParameters |

#### Returns

`Promise`\< `GetNamesForAddressReturnType` \>

Name array. GetNamesForAddressReturnType

### getOwner

**getOwner**: (`parameters`) => `Promise`\< `GetOwnerReturnType` \>

Gets the owner(s) of a name.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.getOwner({ name: 'ens.eth' })
// { owner: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9', registrant: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9', ownershipLevel: 'registrar }
```

#### Parameters

| Parameter    | Type                 | Description        |
| :----------- | :------------------- | :----------------- |
| `parameters` | `GetOwnerParameters` | GetOwnerParameters |

#### Returns

`Promise`\< `GetOwnerReturnType` \>

Owner data object, or `null` if no owners exist. GetOwnerReturnType

### getPrice

**getPrice**: (`parameters`) => `Promise`\< `GetPriceReturnType` \>

Gets the price of a name, or array of names, for a given duration.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.getPrice({ nameOrNames: 'ens.eth' })
// { base: 352828971668930335n, premium: 0n }
```

#### Parameters

| Parameter    | Type                 | Description        |
| :----------- | :------------------- | :----------------- |
| `parameters` | `GetPriceParameters` | GetPriceParameters |

#### Returns

`Promise`\< `GetPriceReturnType` \>

Price data object. GetPriceReturnType

### getRecords

**getRecords**: (`parameters`) => `Promise`\< \{`resolverAddress`: \`0x$\{string}\`;} \>

Gets arbitrary records for a name

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.getRecords({
  name: 'ens.eth',
  texts: ['com.twitter', 'com.github'],
  coins: ['ETH'],
  contentHash: true,
})
// { texts: [{ key: 'com.twitter', value: 'ensdomains' }, { key: 'com.github', value: 'ensdomains' }], coins: [{ id: 60, name: 'ETH', value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' }], contentHash: { protocolType: 'ipns', decoded: 'k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw' } }
```

#### Parameters

| Parameter    | Type                   | Description          |
| :----------- | :--------------------- | :------------------- |
| `parameters` | `GetRecordsParameters` | GetRecordsParameters |

#### Returns

`Promise`\< \{`resolverAddress`: \`0x$\{string}\`;} \>

Records data object. GetRecordsReturnType

### getResolver

**getResolver**: (`parameters`) => `Promise`\< `GetResolverReturnType` \>

Gets the resolver address for a name.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.getResolver({ name: 'ens.eth' })
// 0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41
```

#### Parameters

| Parameter    | Type                    | Description           |
| :----------- | :---------------------- | :-------------------- |
| `parameters` | `GetResolverParameters` | GetResolverParameters |

#### Returns

`Promise`\< `GetResolverReturnType` \>

Resolver address, or null if none is found. GetResolverReturnType

### getSubgraphRecords

**getSubgraphRecords**: (`parameters`) => `Promise`\< `GetSubgraphRecordsReturnType` \>

Gets the records for a name from the subgraph

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensSubgraphActions)
const result = await client.getSubgraphRecords({ name: 'ens.eth' })
// {
//   isMigrated: true,
//   createdAt: { date: 2019-08-26T05:09:01.000Z, value: 1566796141000 },
//   texts: [ 'snapshot', 'url', 'avatar', 'com.twitter', 'com.github' ],
//   coins: [ '60' ]
// }
```

#### Parameters

| Parameter    | Type                           | Description                  |
| :----------- | :----------------------------- | :--------------------------- |
| `parameters` | `GetSubgraphRecordsParameters` | GetSubgraphRecordsParameters |

#### Returns

`Promise`\< `GetSubgraphRecordsReturnType` \>

Record object, or null if name was not found. GetSubgraphRecordsReturnType

### getSubgraphRegistrant

**getSubgraphRegistrant**: (`parameters`) => `Promise`\< `GetSubgraphRegistrantReturnType` \>

Gets the name registrant from the subgraph.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensSubgraphActions)
const result = await client.getSubgraphRegistrant({ name: 'ens.eth' })
// 0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9
```

#### Parameters

| Parameter    | Type                              | Description                     |
| :----------- | :-------------------------------- | :------------------------------ |
| `parameters` | `GetSubgraphRegistrantParameters` | GetSubgraphRegistrantParameters |

#### Returns

`Promise`\< `GetSubgraphRegistrantReturnType` \>

Registrant address, or null if name was not found. GetSubgraphRegistrantReturnType

### getSubnames

**getSubnames**: (`parameters`) => `Promise`\< `GetSubnamesReturnType` \>

Gets the subnames for a name from the subgraph.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensSubgraphActions)
const result = await client.getSubnames({ name: 'ens.eth' })
```

#### Parameters

| Parameter    | Type                    | Description           |
| :----------- | :---------------------- | :-------------------- |
| `parameters` | `GetSubnamesParameters` | GetSubnamesParameters |

#### Returns

`Promise`\< `GetSubnamesReturnType` \>

Subname array. GetSubnamesReturnType

### getTextRecord

**getTextRecord**: (`parameters`) => `Promise`\< `GetTextRecordReturnType` \>

Gets a text record for a name.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.getTextRecord({
  name: 'ens.eth',
  key: 'com.twitter',
})
// ensdomains
```

#### Parameters

| Parameter    | Type                             | Description             |
| :----------- | :------------------------------- | :---------------------- |
| `parameters` | `{ name: string; key: string; }` | GetTextRecordParameters |

#### Returns

`Promise`\< `GetTextRecordReturnType` \>

Text record string, or null if none is found. GetTextRecordReturnType

### getWrapperData

**getWrapperData**: (`parameters`) => `Promise`\< `GetWrapperDataReturnType` \>

Gets the wrapper data for a name.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.getWrapperData({ name: 'ilikelasagna.eth' })
```

#### Parameters

| Parameter    | Type                       | Description              |
| :----------- | :------------------------- | :----------------------- |
| `parameters` | `GetWrapperDataParameters` | GetWrapperDataParameters |

#### Returns

`Promise`\< `GetWrapperDataReturnType` \>

Wrapper data object, or null if name is not wrapped. GetWrapperDataReturnType

### getWrapperName

**getWrapperName**: (`parameters`) => `Promise`\< `GetWrapperNameReturnType` \>

Gets the full name for a name with unknown labels from the NameWrapper.

#### Example

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'

const client = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http(),
}).extend(ensPublicActions)
const result = await client.getWrapperName({
  name: '[4ca938ec1b323ca71c4fb47a712abb68cce1cabf39ea4d6789e42fbc1f95459b].eth',
})
// wrapped.eth
```

#### Parameters

| Parameter    | Type                       | Description              |
| :----------- | :------------------------- | :----------------------- |
| `parameters` | `GetWrapperNameParameters` | GetWrapperNameParameters |

#### Returns

`Promise`\< `GetWrapperNameReturnType` \>

Full name, or null if name was not found. GetWrapperNameReturnType

## Source

[packages/ensjs/src/clients/public.ts:56](https://github.com/ensdomains/ensjs-v3/blob/1b90b888/packages/ensjs/src/clients/public.ts#L56)

---

Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
