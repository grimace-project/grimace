import CubicSpline from './cubic-spline'
import Point from './point'

export default class JoinerSpline extends CubicSpline {
  a: Point
  b: Point
  aFactor = 1.0 / 3.0
  bFactor = 1.0 / 3.0

  constructor(a: Point, c0: Point, c3: Point, b: Point) {
    super(c0, new Point(0, 0), new Point(0, 0), c3)

    this.a = a
    this.b = b
  }

  duplicate(): JoinerSpline {
    return new JoinerSpline(this.a.duplicate(), this.c0.duplicate(), this.c3.duplicate(), this.b.duplicate())
  }

  traceSplineInContext(context: CanvasRenderingContext2D, nonstop: boolean, mirror: boolean, reverse: boolean): void {
    this.evaluate()
    super.traceSplineInContext(context, nonstop, mirror, reverse)
  }

  evaluate(): void {
    const distC0C3 = Point.distance(this.c0, this.c3)

    const fA = (distC0C3 * this.aFactor) / Point.distance(this.c0, this.a)
    const fB = (distC0C3 * this.bFactor) / Point.distance(this.c3, this.b)

    this.c1.x = this.c0.x + (this.c0.x - this.a.x) * fA
    this.c1.y = this.c0.y + (this.c0.y - this.a.y) * fA
    this.c2.x = this.c3.x + (this.c3.x - this.b.x) * fB
    this.c2.y = this.c3.y + (this.c3.y - this.b.y) * fB
  }

  getPointsAsArray(visibleOnly = false): Point[] {
    if (visibleOnly) {
      return [this.c0, this.c1, this.c2, this.c3]
    } else {
      return [this.a, this.c0, this.c1, this.c2, this.c3, this.b]
    }
  }
}
