import AbstractSpline from './abstract-spline'
import Point from './point'

export default class QuadraticSpline extends AbstractSpline {
  aPt1: Point
  cPt: Point
  aPt2: Point

  constructor(aPt1: Point, cPt: Point, aPt2: Point) {
    super()

    this.aPt1 = aPt1
    this.cPt = cPt
    this.aPt2 = aPt2
  }

  traceSplineInContext(context: CanvasRenderingContext2D, nonstop: boolean, mirror: boolean, reverse: boolean): void {
    let x0: number, y0: number, x2: number, y2: number

    let x1 = this.cPt.x
    const y1 = this.cPt.y

    if (reverse) {
      x0 = this.aPt2.x
      y0 = this.aPt2.y
      x2 = this.aPt1.x
      y2 = this.aPt1.y
    } else {
      x0 = this.aPt1.x
      y0 = this.aPt1.y
      x2 = this.aPt2.x
      y2 = this.aPt2.y
    }

    if (mirror) {
      x0 *= -1
      x1 *= -1
      x2 *= -1
    }

    if (nonstop) {
      context.lineTo(x0, y0)
    } else {
      context.moveTo(x0, y0)
    }

    context.quadraticCurveTo(x1, y1, x2, y2)
  }

  getPoint(t: number, mirror: boolean): Point {
    const omt = 1.0 - t

    let x = this.aPt1.x * omt * omt + this.cPt.x * 2 * t * omt + this.aPt2.x * t * t
    const y = this.aPt1.y * omt * omt + this.cPt.y * 2 * t * omt + this.aPt2.y * t * t

    if (mirror) {
      x *= -1
    }

    return new Point(x, y)
  }
}
