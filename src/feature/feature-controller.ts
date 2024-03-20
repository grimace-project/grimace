import Overlay from '../core/overlay'
import Feature from './feature'

export default class FeatureController {
  features: Feature[]
  overlays: Overlay[]

  constructor(features: Feature[], overlays?: Overlay[]) {
    this.features = features
    this.overlays = overlays || []
  }

  drawInContext(context: CanvasRenderingContext2D): void {
    this.features.forEach((feature) => {
      feature.drawInContext(context)
    })

    this.overlays.forEach((overlay) => {
      overlay.drawInContext(context)
    })
  }

  evaluate(): boolean {
    const hasChanged = this.features.reduce((hasChanged, feature) => {
      const featureHasChanged = feature.evaluate()
      return hasChanged || featureHasChanged
    }, false)

    return hasChanged
  }
}
