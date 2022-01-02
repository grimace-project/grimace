import { loadFacedataFromJson } from './facedata-loader'

const json: unknown = require('./facedata.json')

describe('facedata-loader', () => {
  it('parses valid Facedata JSON', () => {
    const facedata = loadFacedataFromJson(json)

    expect(facedata.musclegroups['feature'].muscles['m0']).toStrictEqual({
      label: 'm00',
      spline: {
        points: [
          {
            x: 136,
            y: 144,
          },
          {
            x: 140,
            y: 52,
          },
        ],
        type: 'line',
      },
    })
  })

  it('throws on invalid Facedata JSON', () => {
    expect(() => {
      loadFacedataFromJson({ isThisValidFacedata: false })
    }).toThrow()
  })
})
