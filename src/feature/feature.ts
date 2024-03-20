import FeatureFill from './feature-fill'
import FeatureSegment from './feature-segment'

export default class Feature {
  label: string
  filled: boolean
  stroked: boolean
  mirrored: boolean
  segments: FeatureSegment[]
  fills?: FeatureFill[]

  constructor(
    label: string,
    filled: boolean,
    stroked: boolean,
    mirrored: boolean,
    segments: FeatureSegment[],
    fills?: FeatureFill[],
  ) {
    this.label = label
    this.filled = filled
    this.stroked = stroked
    this.mirrored = mirrored
    this.segments = segments
    this.fills = fills
  }

  drawInContext(context: CanvasRenderingContext2D): void {
    this.drawFillInContext(context)
    this.drawStrokeInContext(context)
  }

  drawFillInContext(context: CanvasRenderingContext2D): void {
    if (!this.fills) {
      return
    }

    context.save()
    context.beginPath()
    const lastIndex = this.segments.length - 1

    this.segments.forEach((segment, index) => {
      segment.drawInContext(context, false, true, false, index === 0, index === lastIndex)
    })

    if (this.mirrored) {
      this.segments.forEach((segment, index) => {
        segment.drawInContext(context, false, true, true, index === 0, index === lastIndex)
      })
    }

    context.clip()

    this.fills.forEach((fill) => {
      fill.drawInContext(context)
    })

    context.restore()
  }

  drawStrokeInContext(context: CanvasRenderingContext2D): void {
    context.save()

    const lastIndex = this.segments.length - 1

    context.lineCap = 'round'

    this.segments.forEach((segment, index) => {
      segment.drawInContext(context, true, false, false, index === 0, index === lastIndex)
    })

    if (this.mirrored) {
      this.segments.forEach((segment, index) => {
        segment.drawInContext(context, true, false, true, index === 0, index === lastIndex)
      })
    }
    context.restore()
  }

  evaluate(): boolean {
    let hasChanged = false
    this.segments.forEach((segment) => {
      const segmentHasChanged = segment.evaluate()
      hasChanged = hasChanged || segmentHasChanged
    })

    if (this.fills) {
      this.fills.forEach((featureFill) => {
        featureFill.evaluate()
      })
    }

    return hasChanged
  }
}
