import { describe, expect, it } from 'vitest'

import loadFacedata from '.'

describe('facedata-loader', () => {
  it('parses valid Facedata JSON', () => {
    const facedata = loadFacedata()
    const m0 = facedata.muscleGroups.feature.m0

    expect(m0.label).toBe('m00')
    expect(m0.initTension).toBe(0)
  })
})
