import Facedata, { FacedataPoint, FacedataSpline } from '../facedata'
import Point from '../display/point'
import ISpline from '../display/ispline'
import LinearSpline from '../display/linear-spline'
import QuadraticSpline from '../display/quadratic-spline'
import CubicSpline from '../display/cubic-spline'
import JoinerSpline from '../display/joiner-spline'

interface PointMap {
  [pointId: string]: Point
}

interface SplineMap {
  [splineId: string]: ISpline
}

export interface TBD {
  points: PointMap

  splines: SplineMap
}

export const createPoint = (def: FacedataPoint): Point => {
  return new Point(def.x, def.y)
}

export const createSpline = (def: FacedataSpline, pointMap: PointMap): ISpline => {
  const points = def.points.map((pointId: string) => {
    const point = pointMap[pointId]

    if (!point) {
      throw `Unknown point reference ${pointId}`
    }

    return point
  })

  const type = def.type
  if (type === 'line') {
    return new LinearSpline(points[0], points[1])
  } else if (type === 'quadraticbezier') {
    return new QuadraticSpline(points[0], points[1], points[2])
  } else if (type === 'cubicbezier') {
    return new CubicSpline(points[0], points[1], points[2], points[3])
  } else if (type === 'joiner') {
    return new JoinerSpline(points[0], points[1], points[2], points[3])
  }
}

export const processFacedata = (facedata: Facedata): TBD => {
  const points: PointMap = {}
  Object.entries(facedata.points).forEach(([pointId, pointDef]) => {
    points[pointId] = createPoint(pointDef)
  })

  const splines: SplineMap = {}
  Object.entries(facedata.splines).forEach(([splineId, splineDef]) => {
    splines[splineId] = createSpline(splineDef, points)
  })

  return {
    points,
    splines,
  }
}
