import { ENSArgs } from '..'
import { parseInputType } from '../utils/validation'

type ProfileOptions = {
  contentHash?: boolean
  texts?: boolean | string[]
  coinTypes?: boolean | string[]
}

export default async function (
  { getProfile }: ENSArgs<'getProfile'>,
  name: string,
  options?: ProfileOptions,
) {
  const inputType = parseInputType(name)

  if (inputType.type !== 'name' && inputType.type !== 'label') {
    throw new Error('Input must be an ENS name')
  }

  return await getProfile(name, options)
}
