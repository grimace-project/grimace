import AbstractSpline from './abstract-spline'
import Point from './point'

export default class CubicSpline extends AbstractSpline {
  c0: Point
  c1: Point
  c2: Point
  c3: Point

  constructor(c0: Point, c1: Point, c2: Point, c3: Point) {
    super()

    this.c0 = c0
    this.c1 = c1
    this.c2 = c2
    this.c3 = c3
  }

  traceSplineInContext(context: CanvasRenderingContext2D, nonstop: boolean, mirror: boolean, reverse: boolean): void {
    let x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number

    if (reverse) {
      x0 = this.c3.x
      y0 = this.c3.y
      x1 = this.c2.x
      y1 = this.c2.y
      x2 = this.c1.x
      y2 = this.c1.y
      x3 = this.c0.x
      y3 = this.c0.y
    } else {
      x0 = this.c0.x
      y0 = this.c0.y
      x1 = this.c1.x
      y1 = this.c1.y
      x2 = this.c2.x
      y2 = this.c2.y
      x3 = this.c3.x
      y3 = this.c3.y
    }

    if (mirror) {
      x0 *= -1
      x1 *= -1
      x2 *= -1
      x3 *= -1
    }

    console.log(x0, x1, x2, x3)

    if (nonstop) {
      context.lineTo(x0, y0)
    } else {
      context.moveTo(x0, y0)
    }

    context.bezierCurveTo(x1, y1, x2, y2, x3, y3)
  }

  getPoint(t: number, mirror: boolean): Point {
    const omt = 1.0 - t
    const t2 = t * t
    const t3 = t2 * t
    const omt2 = omt * omt
    const omt3 = omt2 * omt

    let x = this.c0.x * omt3 + this.c1.x * 3 * omt2 * t + this.c2.x * 3 * omt * t2 + this.c3.x * t3
    const y = this.c0.y * omt3 + this.c1.y * 3 * omt2 * t + this.c2.y * 3 * omt * t2 + this.c3.y * t3

    if (mirror) {
      x *= -1
    }

    return new Point(x, y)
  }
}
