import { SignedSet } from '@ensdomains/dnsprovejs'
import { toBytes } from 'viem'
import { expect, it, vi } from 'vitest'
import { publicClient } from '../../test/addTestContracts.js'
import getDnsImportData, { type RrSetWithSig } from './getDnsImportData.js'

vi.setConfig({
  testTimeout: 10000,
})

const decodeProofs = (proofs: RrSetWithSig[]) =>
  proofs.map((proof) =>
    SignedSet.fromWire(
      Buffer.from(toBytes(proof.rrset)),
      Buffer.from(toBytes(proof.sig)),
    ),
  )

it('returns all rrsets', async () => {
  const result = await getDnsImportData(publicClient, {
    name: 'taytems.xyz',
  })
  expect(result.length).toBeGreaterThan(0)
  const decodedProofs = decodeProofs(result)
  const rootProofs = decodedProofs.filter((x) => x.signature.name === '.')
  const tldProofs = decodedProofs.filter((x) => x.signature.name === 'xyz')
  const twoLDProofs = decodedProofs.filter(
    (x) => x.signature.name === 'taytems.xyz',
  )
  const threeLDProofs = decodedProofs.filter(
    (x) => x.signature.name === '_ens.taytems.xyz',
  )
  expect(rootProofs.length).toBeGreaterThan(0)
  expect(tldProofs.length).toBeGreaterThan(0)
  expect(twoLDProofs.length).toBeGreaterThan(0)
  expect(threeLDProofs.length).toBeGreaterThan(0)
})
