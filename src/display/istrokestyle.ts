import ISpline from './ispline'

export default interface IStrokeStyle {
  strokeAlpha: number

  drawInContext(context: CanvasRenderingContext2D, spline: ISpline, start: boolean, end: boolean, mirror: boolean): void
}
