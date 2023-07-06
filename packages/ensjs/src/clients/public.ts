import {
  createClient,
  type Chain,
  type Client,
  type ClientConfig,
  type Transport,
} from 'viem'
import { addEnsContracts } from '../contracts/addEnsContracts.js'
import type { ChainWithEns } from '../contracts/consts.js'
import type { Prettify } from '../types.js'
import { ensPublicActions, type EnsPublicActions } from './decorators/public.js'
import {
  ensSubgraphActions,
  type EnsSubgraphActions,
} from './decorators/subgraph.js'

export type EnsPublicClientConfig<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
> = Pick<
  ClientConfig<TTransport, TChain>,
  'batch' | 'key' | 'name' | 'pollingInterval' | 'transport'
> & {
  chain: Exclude<ClientConfig<TTransport, TChain>['chain'], undefined>
}

export type EnsPublicClient<
  TTransport extends Transport = Transport,
  TChain extends ChainWithEns = ChainWithEns,
> = Prettify<
  Client<
    TTransport,
    TChain,
    undefined,
    undefined,
    EnsPublicActions & EnsSubgraphActions
  >
>

/**
 * Creates a ENS Public Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
 *
 * @param config - {@link EnsPublicClientConfig}
 * @returns An ENS Public Client. {@link EnsPublicClient}
 *
 * @example
 * import { http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEnsPublicClient } from '@ensdomains/ensjs'
 *
 * const client = createEnsPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 */
export const createEnsPublicClient = <
  TTransport extends Transport,
  TChain extends Chain,
>({
  batch,
  chain,
  key = 'ensPublic',
  name = 'ENS Public Client',
  transport,
  pollingInterval,
}: EnsPublicClientConfig<TTransport, TChain>): EnsPublicClient<
  TTransport,
  ChainWithEns<TChain>
> => {
  return createClient({
    batch,
    chain: addEnsContracts(chain),
    key,
    name,
    pollingInterval,
    transport,
    type: 'ensPublicClient',
  })
    .extend(ensPublicActions)
    .extend(ensSubgraphActions)
}
