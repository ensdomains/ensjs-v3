import { expect, it } from 'vitest'
import { MAX_DATE_INT } from './consts.js'
import { makeSafeSecondsDate } from './makeSafeSecondsDate.js'

it('makes date from seconds', () => {
  expect(makeSafeSecondsDate(21000)).toEqual(new Date(21000000))
})
it('makes date from seconds with big int', () => {
  expect(makeSafeSecondsDate(21000n)).toEqual(new Date(21000000))
})
it('makes date from seconds with big int larger than max date int', () => {
  expect(makeSafeSecondsDate(MAX_DATE_INT + 28930402)).toEqual(
    new Date(MAX_DATE_INT),
  )
})
