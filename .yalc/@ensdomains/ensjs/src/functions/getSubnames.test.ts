import { ENS } from '..'
import setup from '../tests/setup'

let ENSInstance: ENS

beforeAll(async () => {
  ;({ ENSInstance } = await setup())
})

const testProperties = (obj: object, ...properties: string[]) =>
  properties.map((property) => expect(obj).toHaveProperty(property))

describe('getSubnames', () => {
  it.todo('should get the subnames for a name')
  // it('should get the subnames for a name', async () => {
  //   const result = await ENSInstance.getSubnames({
  //     name: 'with-profile.eth',
  //   })
  //   expect(result).toBeTruthy()
  //   if (result) {
  //     console.log(result)
  //     expect(result.length).toBeGreaterThan(0)
  //     testProperties(
  //       result[0],
  //       'id',
  //       'labelName',
  //       'labelhash',
  //       'name',
  //       'isMigrated',
  //       'owner',
  //       'truncatedName',
  //     )
  //   }
  // })
})