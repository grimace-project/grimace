import merge from 'ts-deepmerge'

import Facedata from './facedata'
import validate from './facedata.d.validator'

export const loadFacedataFromJson = (...parts: unknown[]): Facedata => {
  const merged = merge(...parts)
  try {
    return validate(merged)
  } catch (e) {
    e.message = e.message.replace(/, /g, '\n')
    throw e
  }
}
