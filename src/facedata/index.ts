import { loadFacedataFromJson } from './loader'
import { Face, processFacedata } from '../core/factory'
import facedataHead from './head.json'
import facedataFeatures from './features.json'
import facedataWrinkles from './wrinkles.json'
import facedataEmotions from './emotions.json'
import facedataOverlays from './overlay.json'

export default function loadFacedata(): Face {
  const facedata = loadFacedataFromJson(
    facedataHead,
    facedataFeatures,
    facedataWrinkles,
    facedataEmotions,
    facedataOverlays,
  )

  return processFacedata(facedata)
}
