import {
  encodeFunctionData,
  type Account,
  type Address,
  type Hash,
  type SendTransactionParameters,
  type Transport,
} from 'viem'
import { parseAccount } from 'viem/utils'
import type { ChainWithEns, WalletWithEns } from '../../contracts/consts.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import {
  reverseRegistrarSetNameForAddrSnippet,
  reverseRegistrarSetNameSnippet,
} from '../../contracts/reverseRegistrar.js'
import type {
  Prettify,
  SimpleTransactionRequest,
  WriteTransactionParameters,
} from '../../types.js'

type BaseSetPrimaryNameDataParameters = {
  /** The name to set as primary */
  name: string
  /** The address to set the primary name for */
  address?: Address
  /** The resolver address to use */
  resolverAddress?: Address
}

type SelfSetPrimaryNameDataParameters = {
  address?: never
  resolverAddress?: never
}

type OtherSetPrimaryNameDataParameters = {
  address: Address
  resolverAddress?: Address
}

export type SetPrimaryNameDataParameters = BaseSetPrimaryNameDataParameters &
  (SelfSetPrimaryNameDataParameters | OtherSetPrimaryNameDataParameters)

export type SetPrimaryNameDataReturnType = SimpleTransactionRequest

export type SetPrimaryNameParameters<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined,
> = Prettify<
  SetPrimaryNameDataParameters &
    WriteTransactionParameters<TChain, TAccount, TChainOverride>
>

export type SetPrimaryNameReturnType = Hash

export const makeFunctionData = <
  TChain extends ChainWithEns,
  TAccount extends Account,
>(
  wallet: WalletWithEns<Transport, TChain, TAccount>,
  {
    name,
    address,
    resolverAddress = getChainContractAddress({
      client: wallet,
      contract: 'ensPublicResolver',
    }),
  }: SetPrimaryNameDataParameters,
): SetPrimaryNameDataReturnType => {
  const reverseRegistrarAddress = getChainContractAddress({
    client: wallet,
    contract: 'ensReverseRegistrar',
  })
  if (address) {
    return {
      to: reverseRegistrarAddress,
      data: encodeFunctionData({
        abi: reverseRegistrarSetNameForAddrSnippet,
        functionName: 'setNameForAddr',
        args: [
          address,
          wallet.account.address,
          resolverAddress ||
            getChainContractAddress({
              client: wallet,
              contract: 'ensPublicResolver',
            }),
          name,
        ],
      }),
    }
  }

  return {
    to: reverseRegistrarAddress,
    data: encodeFunctionData({
      abi: reverseRegistrarSetNameSnippet,
      functionName: 'setName',
      args: [name],
    }),
  }
}

/**
 * Sets a primary name for an address.
 * @param wallet - {@link WalletWithEns}
 * @param parameters - {@link SetPrimaryNameParameters}
 * @returns Transaction hash. {@link SetPrimaryNameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts, setPrimaryName } from '@ensdomains/ensjs'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setPrimaryName(wallet, {
 *   name: 'ens.eth',
 * })
 * // 0x...
 */
async function setPrimaryName<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined = ChainWithEns,
>(
  wallet: WalletWithEns<Transport, TChain, TAccount>,
  {
    name,
    address,
    resolverAddress,
    ...txArgs
  }: SetPrimaryNameParameters<TChain, TAccount, TChainOverride>,
): Promise<SetPrimaryNameReturnType> {
  const data = makeFunctionData(
    {
      ...wallet,
      account: parseAccount((txArgs.account || wallet.account)!),
    } as WalletWithEns<Transport, TChain, Account>,
    { name, address, resolverAddress } as SetPrimaryNameDataParameters,
  )
  const writeArgs = {
    ...data,
    ...txArgs,
  } as SendTransactionParameters<TChain, TAccount, TChainOverride>
  return wallet.sendTransaction(writeArgs)
}

setPrimaryName.makeFunctionData = makeFunctionData

export default setPrimaryName