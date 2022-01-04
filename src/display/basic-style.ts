import Color from '../util/color'
import ISpline from './ispline'

export default class BasicStyle {
  width: number
  strokeColor: Color

  constructor(width = 1.0, strokeColor: Color = Color.Black(), strokeAlpha: number) {
    this.width = width
    this.strokeColor = strokeColor
    this.strokeAlpha = strokeAlpha
  }

  get strokeAlpha(): number {
    return this.strokeColor.a
  }

  set strokeAlpha(alpha: number) {
    this.strokeColor.a = alpha
  }

  drawInContext(
    context: CanvasRenderingContext2D,
    spline: ISpline,
    start: boolean,
    end: boolean,
    mirror: boolean,
  ): void {
    if (start) {
      context.beginPath()
    }
    context.strokeStyle = this.strokeColor.toRgba()
    context.lineWidth = this.width
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.moveTo(spline.getStart().x, spline.getStart().y)
    spline.traceSplineInContext(context, false, mirror, false)
    if (end) {
      context.stroke()
    }
  }
}
