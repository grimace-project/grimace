import Color from '../util/color'
import ISpline from './ispline'
import Point from './point'

const DT = 0.01

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

  duplicate(): ISpline {
    throw 'AbstractSpline cannot be instantiated'
  }

  getEnd(): Point {
    throw 'AbstractSpline cannot be instantiated'
  }

  getPoint(_t: number, _mirror = false): Point {
    throw 'AbstractSpline cannot be instantiated'
  }

  getPointsAsArray(_visibleOnly = false): Point[] {
    throw 'AbstractSpline cannot be instantiated'
  }

  getNormalAngle(t: number): number {
    return this.getSlopeAngle(t) + Math.PI / 2
  }

  getSlopeAngle(t: number): number {
    const pLeft = this.getPoint(t - DT)
    const pRight = this.getPoint(t + DT)

    const dx = pRight.x - pLeft.x
    const dy = pRight.y - pLeft.y

    let angle = Math.atan(dy / dx)

    // arctan problem:
    // http://hyperphysics.phy-astr.gsu.edu/hbase/ttrig.html#c3
    if (dx < 0) {
      // quadrants II & III
      angle += Math.PI
    } else if (dx >= 0 && dy < 0) {
      // quadrant IV
      angle += 2.0 * Math.PI
    }

    return angle
  }

  getStart(): Point {
    throw 'AbstractSpline cannot be instantiated'
  }
}
