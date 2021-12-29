import Color from '../util/color'
import Point from './point'

export default interface ISpline {
  fillColor: Color
  lineColor: Color
  lineWidth: number
  lineMinWidth: number
  lineMaxWidth: number
  mirrored: boolean

  drawStrokeInContext(context: CanvasRenderingContext2D): void
  drawStrokeInContext(context: CanvasRenderingContext2D, start: boolean): void
  drawStrokeInContext(context: CanvasRenderingContext2D, start: boolean, end: boolean): void
  drawStrokeInContext(context: CanvasRenderingContext2D, start: boolean, end: boolean, mirror: boolean): void
  drawFillInContext(context: CanvasRenderingContext2D, start: boolean, end: boolean, mirror: boolean): void
  getPoint(t: number, mirror: boolean): Point
  traceSplineInContext(context: CanvasRenderingContext2D, nonstop: boolean, mirror: boolean, reverse: boolean): void
}
