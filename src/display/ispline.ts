import Point from './point'

export default interface ISpline {
  mirrored: boolean

  drawStrokeInContext(context: CanvasRenderingContext2D): void
  drawStrokeInContext(context: CanvasRenderingContext2D, start: boolean): void
  drawStrokeInContext(context: CanvasRenderingContext2D, start: boolean, end: boolean): void
  drawStrokeInContext(context: CanvasRenderingContext2D, start: boolean, end: boolean, mirror: boolean): void
  drawFillInContext(context: CanvasRenderingContext2D, start: boolean, end: boolean, mirror: boolean): void
  duplicate(): ISpline
  getNormalAngle(t: number): number
  getPoint(t: number): Point
  getPoint(t: number, mirror: boolean): Point
  getPointsAsArray(): Point[]
  getPointsAsArray(visibleOnly: boolean): Point[]
  getSlopeAngle(t: number): number
  getStart(): Point
  getEnd(): Point
  traceSplineInContext(context: CanvasRenderingContext2D, nonstop: boolean, mirror: boolean, reverse: boolean): void
}
