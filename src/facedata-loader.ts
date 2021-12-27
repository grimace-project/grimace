import { Facedata } from './facedata'
import validate from './facedata.d.validator'

export const loadFacedataFromJson = (json: unknown): Facedata => {
  try {
    return validate(json)
  } catch (e) {
    e.message = e.message.replace(/, /g, '\n')
    throw e
  }
}
