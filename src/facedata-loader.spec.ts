import { loadFacedataFromJson } from './facedata-loader'

const json: unknown = require('./facedata.json')

describe('facedata-loader', () => {
  it('parses valid Facedata JSON', () => {
    const facedata = loadFacedataFromJson(json)

    expect(facedata.points['m0_s_p0']).toStrictEqual({
      x: 136,
      y: 144,
    })
  })

  it('throws on invalid Facedata JSON', () => {
    expect(() => {
      loadFacedataFromJson({ isThisValidFacedata: false })
    }).toThrow()
  })
})
