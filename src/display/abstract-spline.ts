import Color from '../util/color'
import ISpline from './ispline'
import Point from './point'

export default abstract class AbstractSpline implements ISpline {
  fillColor: Color = new Color('#777777')
  lineColor: Color = new Color('#333333')
  lineWidth = 2.0
  lineMinWidth = 1.0
  lineMaxWidth = 4.0
  mirrored = false

  traceSplineInContext(
    _context: CanvasRenderingContext2D,
    _nonstop: boolean,
    _mirror: boolean,
    _reverse: boolean,
  ): void {
    throw 'AbstractSpline cannot be instantiated'
  }

  drawStrokeInContext(context: CanvasRenderingContext2D, start = false, _end = false, mirror = false): void {
    context.beginPath()
    context.strokeStyle = this.lineColor.toRgba()
    context.lineWidth = this.lineWidth
    this.traceSplineInContext(context, !start, mirror, false)
    context.stroke()
  }

  drawFillInContext(context: CanvasRenderingContext2D, start: boolean, _end: boolean, mirror: boolean): void {
    this.traceSplineInContext(context, !start, mirror, false)
  }

  getPoint(_t: number, _mirror: boolean): Point {
    throw 'AbstractSpline cannot be instantiated'
  }
}
