import { describe, expect, it } from 'vitest'
import {
  ChildFuseKeys,
  ChildFuses,
  FullParentFuseKeys,
  FullParentFuses,
  FuseRanges,
  ParentFuseKeys,
  ParentFuses,
  UnnamedChildFuses,
  UnnamedParentFuses,
  UserSettableFuseKeys,
  UserSettableFuses,
  decodeFuses,
  encodeFuses,
} from './fuses.js'

describe('correctly exports', () => {
  it('ChildFuses', () => {
    expect(ChildFuses).toMatchInlineSnapshot(`
      {
        "CANNOT_APPROVE": 64n,
        "CANNOT_BURN_FUSES": 2n,
        "CANNOT_CREATE_SUBDOMAIN": 32n,
        "CANNOT_SET_RESOLVER": 8n,
        "CANNOT_SET_TTL": 16n,
        "CANNOT_TRANSFER": 4n,
        "CANNOT_UNWRAP": 1n,
      }
    `)
  })
  it('ChildFuseKeys', () => {
    expect(ChildFuseKeys).toMatchInlineSnapshot(`
      [
        "CANNOT_UNWRAP",
        "CANNOT_BURN_FUSES",
        "CANNOT_TRANSFER",
        "CANNOT_SET_RESOLVER",
        "CANNOT_SET_TTL",
        "CANNOT_CREATE_SUBDOMAIN",
        "CANNOT_APPROVE",
      ]
    `)
  })
  it('ParentFuses', () => {
    expect(ParentFuses).toMatchInlineSnapshot(`
      {
        "CAN_EXTEND_EXPIRY": 262144n,
        "PARENT_CANNOT_CONTROL": 65536n,
      }
    `)
  })
  it('ParentFuseKeys', () => {
    expect(ParentFuseKeys).toMatchInlineSnapshot(`
      [
        "PARENT_CANNOT_CONTROL",
        "CAN_EXTEND_EXPIRY",
      ]
    `)
  })
  it('UserSettableFuses', () => {
    expect(UserSettableFuses).toMatchInlineSnapshot(`
      {
        "CANNOT_APPROVE": 64n,
        "CANNOT_BURN_FUSES": 2n,
        "CANNOT_CREATE_SUBDOMAIN": 32n,
        "CANNOT_SET_RESOLVER": 8n,
        "CANNOT_SET_TTL": 16n,
        "CANNOT_TRANSFER": 4n,
        "CANNOT_UNWRAP": 1n,
        "CAN_EXTEND_EXPIRY": 262144n,
        "PARENT_CANNOT_CONTROL": 65536n,
      }
    `)
  })
  it('UserSettableFuseKeys', () => {
    expect(UserSettableFuseKeys).toMatchInlineSnapshot(`
      [
        "CANNOT_UNWRAP",
        "CANNOT_BURN_FUSES",
        "CANNOT_TRANSFER",
        "CANNOT_SET_RESOLVER",
        "CANNOT_SET_TTL",
        "CANNOT_CREATE_SUBDOMAIN",
        "CANNOT_APPROVE",
        "PARENT_CANNOT_CONTROL",
        "CAN_EXTEND_EXPIRY",
      ]
    `)
  })
  it('FullParentFuses', () => {
    expect(FullParentFuses).toMatchInlineSnapshot(`
      {
        "CAN_EXTEND_EXPIRY": 262144n,
        "IS_DOT_ETH": 131072n,
        "PARENT_CANNOT_CONTROL": 65536n,
      }
    `)
  })
  it('FullParentFuseKeys', () => {
    expect(FullParentFuseKeys).toMatchInlineSnapshot(`
      [
        "PARENT_CANNOT_CONTROL",
        "CAN_EXTEND_EXPIRY",
        "IS_DOT_ETH",
      ]
    `)
  })
  it('UnnamedChildFuses', () => {
    expect(UnnamedChildFuses).toMatchInlineSnapshot(`
      [
        128n,
        256n,
        512n,
        1024n,
        2048n,
        4096n,
        8192n,
        16384n,
        32768n,
      ]
    `)
  })
  it('UnnamedParentFuses', () => {
    expect(UnnamedParentFuses).toMatchInlineSnapshot(`
      [
        524288n,
        1048576n,
        2097152n,
        4194304n,
        8388608n,
        16777216n,
        33554432n,
        67108864n,
        134217728n,
        268435456n,
        536870912n,
        1073741824n,
        2147483648n,
      ]
    `)
  })
  it('FuseRanges', () => {
    expect(FuseRanges).toMatchInlineSnapshot(`
      {
        "CHILD_CONTROLLED_FUSES": 65535n,
        "PARENT_CONTROLLED_FUSES": 4294901760n,
        "USER_SETTABLE_FUSES": 4294836223n,
      }
    `)
  })
})

describe('encodeFuses', () => {
  describe('child restriction', () => {
    it('encodes named fuses', () => {
      expect(
        encodeFuses({
          restriction: 'child',
          input: { named: ['CANNOT_UNWRAP', 'CANNOT_BURN_FUSES'] },
        }),
      ).toBe(3)
    })
    it('encodes unnamed fuses', () => {
      expect(
        encodeFuses({
          restriction: 'child',
          input: { unnamed: [128n, 256n] },
        }),
      ).toBe(384)
    })
    it('encodes named and unnamed fuses', () => {
      expect(
        encodeFuses({
          restriction: 'child',
          input: {
            named: ['CANNOT_UNWRAP', 'CANNOT_BURN_FUSES'],
            unnamed: [128n, 256n],
          },
        }),
      ).toBe(387)
    })
    it('validates number input', () => {
      expect(
        encodeFuses({
          restriction: 'child',
          input: { number: 3n },
        }),
      ).toBe(3)
    })
    it('does not allow specifying parent fuses in object', () => {
      expect(() =>
        encodeFuses({
          restriction: 'child',
          input: { parent: { named: ['CAN_EXTEND_EXPIRY'] } } as any,
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [FusesRestrictionNotAllowed: Restriction not allowed

        - Fuse value: [object Object]

        Details: Fuse restriction cannot be used when fuse category is specified

        Version: @ensdomains/ensjs@1.0.0-mock.0]
      `)
    })
    it('does not allow named/unnamed and number input', () => {
      expect(() =>
        encodeFuses({
          restriction: 'child',
          input: { named: ['CANNOT_UNWRAP'], number: 1 } as any,
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [FusesInvalidFuseObjectError: Invalid fuse value

        - Fuse value: [object Object]

        Details: Cannot specify both a fuse number and named/unnamed fuses.

        Version: @ensdomains/ensjs@1.0.0-mock.0]
      `)
    })
    it('does not allow setting invalid named fuse', () => {
      expect(() =>
        encodeFuses({
          restriction: 'child',
          input: { named: ['CANNOT_WRAP'] as any },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [FusesInvalidNamedFuseError: CANNOT_WRAP is not a valid named fuse

        Version: @ensdomains/ensjs@1.0.0-mock.0]
      `)
    })
    it('does not allow setting invalid unnamed fuse', () => {
      expect(() =>
        encodeFuses({
          restriction: 'child',
          input: { unnamed: [129n as any] },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [FusesInvalidUnnamedFuseError: 129 is not a valid unnamed fuse

        - If you are trying to set a named fuse, use the named property

        Version: @ensdomains/ensjs@1.0.0-mock.0]
      `)
    })
    describe('number input', () => {
      it('does not allow setting fuse larger than child range', () => {
        expect(() =>
          encodeFuses({ restriction: 'child', input: { number: 65536n } }),
        ).toThrowErrorMatchingInlineSnapshot(`
          [FusesOutOfRangeError: Fuse value out of range

          - Fuse value: 65536
          - Allowed range: 0-65535

          Details: Cannot specify a fuse value to set that is outside of the child's control.

          Version: @ensdomains/ensjs@1.0.0-mock.0]
        `)
      })
      it('does not allow setting fuse larger than uint32 range', () => {
        expect(() =>
          encodeFuses({
            restriction: 'child',
            input: { number: 2n ** 32n + 1n },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          [FusesOutOfRangeError: Fuse value out of range

          - Fuse value: 4294967297
          - Allowed range: 0-4294967296

          Details: Fuse number must be limited to uint32, the supplied value was too high

          Version: @ensdomains/ensjs@1.0.0-mock.0]
        `)
      })
      it('does not allow setting fuse smaller than uint32 range', () => {
        expect(() =>
          encodeFuses({ restriction: 'child', input: { number: -1n } }),
        ).toThrowErrorMatchingInlineSnapshot(`
          [FusesOutOfRangeError: Fuse value out of range

          - Fuse value: -1
          - Allowed range: 0-4294967296

          Details: Fuse number must be limited to uint32, the supplied value was too low

          Version: @ensdomains/ensjs@1.0.0-mock.0]
        `)
      })
    })
  })
  describe('parent restriction', () => {
    it('encodes named fuses', () => {
      expect(
        encodeFuses({
          restriction: 'parent',
          input: { named: ['PARENT_CANNOT_CONTROL', 'CAN_EXTEND_EXPIRY'] },
        }),
      ).toBe(0x50000)
    })
    it('encodes unnamed fuses', () => {
      expect(
        encodeFuses({
          restriction: 'parent',
          input: { unnamed: [0x80000n, 0x100000n] },
        }),
      ).toBe(0x180000)
    })
    it('encodes named and unnamed fuses', () => {
      expect(
        encodeFuses({
          restriction: 'parent',
          input: {
            named: ['PARENT_CANNOT_CONTROL', 'CAN_EXTEND_EXPIRY'],
            unnamed: [0x80000n, 0x100000n],
          },
        }),
      ).toBe(0x1d0000)
    })
    it('validates number input', () => {
      expect(
        encodeFuses({
          restriction: 'parent',
          input: { number: 0x50000n },
        }),
      ).toBe(0x50000)
    })
    it('does not allow specifying child fuses in object', () => {
      expect(() =>
        encodeFuses({
          restriction: 'parent',
          input: { child: { named: ['CANNOT_UNWRAP'] } } as any,
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [FusesRestrictionNotAllowed: Restriction not allowed

        - Fuse value: [object Object]

        Details: Fuse restriction cannot be used when fuse category is specified

        Version: @ensdomains/ensjs@1.0.0-mock.0]
      `)
    })
    it('does not allow named/unnamed and number input', () => {
      expect(() =>
        encodeFuses({
          restriction: 'parent',
          input: { named: ['PARENT_CANNOT_CONTROL'], number: 0x10000n } as any,
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [FusesInvalidFuseObjectError: Invalid fuse value

        - Fuse value: [object Object]

        Details: Cannot specify both a fuse number and named/unnamed fuses.

        Version: @ensdomains/ensjs@1.0.0-mock.0]
      `)
    })
    it('does not allow setting invalid named fuse', () => {
      expect(() =>
        encodeFuses({
          restriction: 'parent',
          input: { named: ['PARENT_CAN_CONTROL'] as any },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [FusesInvalidNamedFuseError: PARENT_CAN_CONTROL is not a valid named fuse

        Version: @ensdomains/ensjs@1.0.0-mock.0]
      `)
    })
    it('does not allow setting invalid unnamed fuse', () => {
      expect(() =>
        encodeFuses({
          restriction: 'parent',
          input: { unnamed: [1n as any] },
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [FusesInvalidUnnamedFuseError: 1 is not a valid unnamed fuse

        - If you are trying to set a named fuse, use the named property

        Version: @ensdomains/ensjs@1.0.0-mock.0]
      `)
    })
    describe('number input', () => {
      it('does not allow setting fuse smaller than parent range', () => {
        expect(() =>
          encodeFuses({ restriction: 'parent', input: { number: 65535n } }),
        ).toThrowErrorMatchingInlineSnapshot(`
          [FusesOutOfRangeError: Fuse value out of range

          - Fuse value: 65535
          - Allowed range: 65536-4294967296

          Details: Cannot specify a fuse value to set that is outside of the parent's control.

          Version: @ensdomains/ensjs@1.0.0-mock.0]
        `)
      })
      it('does not allow setting larger than uint32 range', () => {
        expect(() =>
          encodeFuses({
            restriction: 'parent',
            input: { number: 2n ** 32n + 1n },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          [FusesOutOfRangeError: Fuse value out of range

          - Fuse value: 4294967297
          - Allowed range: 0-4294967296

          Details: Fuse number must be limited to uint32, the supplied value was too high

          Version: @ensdomains/ensjs@1.0.0-mock.0]
        `)
      })
      it('does not allow setting smaller than uint32 range', () => {
        expect(() =>
          encodeFuses({
            restriction: 'parent',
            input: { number: -1n },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          [FusesOutOfRangeError: Fuse value out of range

          - Fuse value: -1
          - Allowed range: 0-4294967296

          Details: Fuse number must be limited to uint32, the supplied value was too low

          Version: @ensdomains/ensjs@1.0.0-mock.0]
        `)
      })
      it('does not allow setting non user-settable fuse', () => {
        expect(() =>
          encodeFuses({
            restriction: 'parent',
            input: { number: 0xfffdffffn },
          }),
        ).toThrowErrorMatchingInlineSnapshot(`
          [FusesOutOfRangeError: Fuse value out of range

          - Fuse value: 4294836223
          - Allowed range: 65536-4294967296

          Details: Cannot specify a fuse value to set that is outside of the parent's control.

          Version: @ensdomains/ensjs@1.0.0-mock.0]
        `)
      })
    })
  })
  describe('no restriction', () => {
    it('encodes parent fuses', () => {
      expect(
        encodeFuses({
          input: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL', 'CAN_EXTEND_EXPIRY'],
            },
          },
        }),
      ).toBe(0x50000)
    })
    it('encodes child fuses', () => {
      expect(
        encodeFuses({
          input: {
            child: {
              named: ['CANNOT_UNWRAP', 'CANNOT_BURN_FUSES'],
            },
          },
        }),
      ).toBe(3)
    })
    it('encodes parent and child fuses', () => {
      expect(
        encodeFuses({
          input: {
            parent: {
              named: ['PARENT_CANNOT_CONTROL', 'CAN_EXTEND_EXPIRY'],
            },
            child: {
              named: ['CANNOT_UNWRAP', 'CANNOT_BURN_FUSES'],
            },
          },
        }),
      ).toBe(0x50003)
    })
    it('validates number input', () => {
      expect(
        encodeFuses({
          input: { number: 0x50000n },
        }),
      ).toBe(0x50000)
    })
    it('does not allow named/unnamed and number input for parent', () => {
      expect(() =>
        encodeFuses({
          input: {
            number: 0x50000n,
            parent: ['PARENT_CANNOT_CONTROL'],
          } as any,
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [FusesInvalidFuseObjectError: Invalid fuse value

        - Fuse value: [object Object]

        Details: Cannot specify both a fuse number and named/unnamed fuses.

        Version: @ensdomains/ensjs@1.0.0-mock.0]
      `)
    })
    it('does not allow named/unnamed and number input for child', () => {
      expect(() =>
        encodeFuses({
          input: {
            number: 3n,
            child: ['CANNOT_UNWRAP'],
          } as any,
        }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [FusesInvalidFuseObjectError: Invalid fuse value

        - Fuse value: [object Object]

        Details: Cannot specify both a fuse number and named/unnamed fuses.

        Version: @ensdomains/ensjs@1.0.0-mock.0]
      `)
    })
    describe('number input', () => {
      it('does not allow setting larger than uint32 range', () => {
        expect(() => encodeFuses({ input: { number: 2n ** 32n + 1n } }))
          .toThrowErrorMatchingInlineSnapshot(`
            [FusesOutOfRangeError: Fuse value out of range

            - Fuse value: 4294967297
            - Allowed range: 0-4294967296

            Details: Fuse number must be limited to uint32, the supplied value was too high

            Version: @ensdomains/ensjs@1.0.0-mock.0]
          `)
      })
      it('does not allow setting smaller than uint32 range', () => {
        expect(() => encodeFuses({ input: { number: -1n } }))
          .toThrowErrorMatchingInlineSnapshot(`
            [FusesOutOfRangeError: Fuse value out of range

            - Fuse value: -1
            - Allowed range: 0-4294967296

            Details: Fuse number must be limited to uint32, the supplied value was too low

            Version: @ensdomains/ensjs@1.0.0-mock.0]
          `)
      })
      it('does not allow setting non user-settable fuse', () => {
        expect(() => encodeFuses({ input: { number: 0xffffffffn } }))
          .toThrowErrorMatchingInlineSnapshot(`
            [FusesOutOfRangeError: Fuse value out of range

            - Fuse value: 4294967295
            - Allowed range: 0-4294967296

            Details: Fuse number must be limited to user settable fuses, the supplied value was not

            Version: @ensdomains/ensjs@1.0.0-mock.0]
          `)
      })
    })
  })
})

describe('decodeFuses', () => {
  it('decodes parent fuses', () => {
    expect(decodeFuses(0x50000)).toMatchInlineSnapshot(`
      {
        "child": {
          "CANNOT_APPROVE": false,
          "CANNOT_BURN_FUSES": false,
          "CANNOT_CREATE_SUBDOMAIN": false,
          "CANNOT_SET_RESOLVER": false,
          "CANNOT_SET_TTL": false,
          "CANNOT_TRANSFER": false,
          "CANNOT_UNWRAP": false,
          "CAN_DO_EVERYTHING": true,
          "unnamed": {
            "0x100": false,
            "0x1000": false,
            "0x200": false,
            "0x2000": false,
            "0x400": false,
            "0x4000": false,
            "0x80": false,
            "0x800": false,
            "0x8000": false,
          },
        },
        "parent": {
          "CAN_EXTEND_EXPIRY": true,
          "IS_DOT_ETH": false,
          "PARENT_CANNOT_CONTROL": true,
          "unnamed": {
            "0x100000": false,
            "0x1000000": false,
            "0x200000": false,
            "0x400000": false,
            "0x80000": false,
            "0x800000": false,
          },
        },
      }
    `)
  })
  it('decodes child fuses', () => {
    expect(decodeFuses(3)).toMatchInlineSnapshot(`
      {
        "child": {
          "CANNOT_APPROVE": false,
          "CANNOT_BURN_FUSES": true,
          "CANNOT_CREATE_SUBDOMAIN": false,
          "CANNOT_SET_RESOLVER": false,
          "CANNOT_SET_TTL": false,
          "CANNOT_TRANSFER": false,
          "CANNOT_UNWRAP": true,
          "CAN_DO_EVERYTHING": false,
          "unnamed": {
            "0x100": false,
            "0x1000": false,
            "0x200": false,
            "0x2000": false,
            "0x400": false,
            "0x4000": false,
            "0x80": false,
            "0x800": false,
            "0x8000": false,
          },
        },
        "parent": {
          "CAN_EXTEND_EXPIRY": false,
          "IS_DOT_ETH": false,
          "PARENT_CANNOT_CONTROL": false,
          "unnamed": {
            "0x100000": false,
            "0x1000000": false,
            "0x200000": false,
            "0x400000": false,
            "0x80000": false,
            "0x800000": false,
          },
        },
      }
    `)
  })
  it('decodes unnamed fuses', () => {
    expect(decodeFuses(32769)).toMatchInlineSnapshot(`
    {
      "child": {
        "CANNOT_APPROVE": false,
        "CANNOT_BURN_FUSES": false,
        "CANNOT_CREATE_SUBDOMAIN": false,
        "CANNOT_SET_RESOLVER": false,
        "CANNOT_SET_TTL": false,
        "CANNOT_TRANSFER": false,
        "CANNOT_UNWRAP": true,
        "CAN_DO_EVERYTHING": false,
        "unnamed": {
          "0x100": false,
          "0x1000": false,
          "0x200": false,
          "0x2000": false,
          "0x400": false,
          "0x4000": false,
          "0x80": false,
          "0x800": false,
          "0x8000": true,
        },
      },
      "parent": {
        "CAN_EXTEND_EXPIRY": false,
        "IS_DOT_ETH": false,
        "PARENT_CANNOT_CONTROL": false,
        "unnamed": {
          "0x100000": false,
          "0x1000000": false,
          "0x200000": false,
          "0x400000": false,
          "0x80000": false,
          "0x800000": false,
        },
      },
    }
  `)
  })
  it('decodes CAN_DO_EVERYTHING as false when fuses are set', () => {
    expect(decodeFuses(1)).toEqual(
      expect.objectContaining({
        child: expect.objectContaining({
          CAN_DO_EVERYTHING: false,
        }),
      }),
    )
  })
  it('decodes CAN_DO_EVERYTHING as true when no fuses are set', () => {
    expect(decodeFuses(0)).toEqual(
      expect.objectContaining({
        child: expect.objectContaining({
          CAN_DO_EVERYTHING: true,
        }),
      }),
    )
  })
})
