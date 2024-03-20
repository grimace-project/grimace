import merge from 'ts-deepmerge'

// import validate from './facedata.d.validator'

export const loadFacedataFromJson = (...parts: any[]): Facedata => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const merged = merge(...parts)
  return merged as Facedata
  // try {
  //   return validate(merged)
  // } catch (e) {
  //   e.message = e.message.replace(/, /g, '\n')
  //   throw e
  // }
}
