import { Hex } from 'viem'
import { ClientWithEns } from '../../contracts/addContracts'
import { Prettify, SimpleTransactionRequest } from '../../types'
import { generateFunction } from '../../utils/generateFunction'
import _getAbi, {
  InternalGetAbiParameters,
  InternalGetAbiReturnType,
} from './_getABI'
import universalWrapper from './universalWrapper'

type GetAbiParameters = Prettify<InternalGetAbiParameters>

type GetAbiReturnType = Prettify<InternalGetAbiReturnType>

const encode = (
  client: ClientWithEns,
  { name }: GetAbiParameters,
): SimpleTransactionRequest => {
  const prData = _getAbi.encode(client, { name })
  return universalWrapper.encode(client, { name, data: prData.data })
}

const decode = async (
  client: ClientWithEns,
  data: Hex,
): Promise<GetAbiReturnType> => {
  const urData = await universalWrapper.decode(client, data)
  if (!urData) return null
  return _getAbi.decode(client, urData.data)
}

const getAbi = generateFunction({ encode, decode })

export default getAbi