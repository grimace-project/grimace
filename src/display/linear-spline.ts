import AbstractSpline from './abstract-spline'
import Point from './point'

export default class LinearSpline extends AbstractSpline {
  p0: Point
  p1: Point

  constructor(p0: Point, p1: Point) {
    super()

    this.p0 = p0
    this.p1 = p1
  }

  traceSplineInContext(context: CanvasRenderingContext2D, nonstop: boolean, mirror: boolean, reverse: boolean): void {
    let x0: number, y0: number, x1: number, y1: number

    if (reverse) {
      x0 = this.p1.x
      y0 = this.p1.y
      x1 = this.p0.x
      y1 = this.p0.y
    } else {
      x0 = this.p0.x
      y0 = this.p0.y
      x1 = this.p1.x
      y1 = this.p1.y
    }

    if (mirror) {
      x0 *= -1
      x1 *= -1
    }

    if (nonstop) {
      context.lineTo(x0, y0)
    } else {
      context.moveTo(x0, y0)
    }

    context.lineTo(x1, y1)
  }

  getPoint(t: number, mirror: boolean): Point {
    let x = this.p0.x + t * (this.p1.x - this.p0.x)
    const y = this.p0.y + t * (this.p1.y - this.p0.y)

    if (mirror) {
      x *= -1
    }

    return new Point(x, y)
  }
}
