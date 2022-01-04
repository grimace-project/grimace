import Color from '../util/color'
import ISpline from './ispline'
import Point from './point'

export default class BrushStyle {
  startWidth: number
  maxWidth: number
  endWidth: number
  strokeColor: Color

  constructor(
    startWidth = 1.0,
    maxWidth = 2.0,
    endWidth = 1.0,
    strokeColor: Color = Color.Black(),
    strokeAlpha: number,
  ) {
    this.startWidth = startWidth
    this.maxWidth = maxWidth
    this.endWidth = endWidth
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
    _start: boolean,
    _end: boolean,
    mirror: boolean,
  ): void {
    const splineUpper = spline.duplicate()
    const splineLower = spline.duplicate()

    const pointsUpper = splineUpper.getPointsAsArray(true)
    const pointsLower = splineLower.getPointsAsArray(true)

    const tDist = 1.0 / (pointsLower.length - 1)
    let t = -tDist

    pointsLower.forEach((_p, index) => {
      let width: number
      if (index === 0) {
        width = this.startWidth
      } else if (index === pointsLower.length - 1) {
        width = this.endWidth
      } else {
        width = this.maxWidth
      }

      t += tDist
      const angle = spline.getNormalAngle(t)

      const dist = Point.fromPolar(width, angle)
      pointsLower[index].x += dist.x
      pointsLower[index].y += dist.y
      pointsUpper[index].x -= dist.x
      pointsUpper[index].y -= dist.y
    })

    const sign = mirror ? -1 : 1

    const startLowerX = splineLower.getStart().x * sign
    const startLowerY = splineLower.getStart().y
    const endUpperX = splineUpper.getEnd().x * sign
    const endUpperY = splineUpper.getEnd().y

    const startSplineX = spline.getStart().x * sign
    const startSplineY = spline.getStart().y
    const endSplineX = spline.getEnd().x * sign
    const endSplineY = spline.getEnd().y

    context.beginPath()

    context.fillStyle = this.strokeColor.toHex()

    context.moveTo(startSplineX, startSplineY)
    context.lineTo(startLowerX, startLowerY)
    splineLower.traceSplineInContext(context, true, mirror, false)
    context.lineTo(endSplineX, endSplineY)

    context.lineTo(endUpperX, endUpperY)
    splineUpper.traceSplineInContext(context, true, mirror, true)
    context.lineTo(startSplineX, startSplineY)

    context.closePath()
    context.fill()

    context.moveTo(endSplineX, endSplineY)
  }
}
