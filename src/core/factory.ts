import Facedata, {
  FacedataFeature,
  FacedataFeatureSegment,
  FacedataMuscleGroup,
  FacedataPoint,
  FacedataSpline,
  FacedataStrokeStyle,
} from '../facedata'
import Point from '../display/point'
import ISpline from '../display/ispline'
import LinearSpline from '../display/linear-spline'
import QuadraticSpline from '../display/quadratic-spline'
import CubicSpline from '../display/cubic-spline'
import JoinerSpline from '../display/joiner-spline'
import MuscleGroup from '../muscle/muscle-group'
import Muscle from '../muscle/muscle'
import Feature from '../feature/feature'
import FeatureSegment from '../feature/feature-segment'
import IStrokeStyle from '../display/istrokestyle'
import BrushStyle from '../display/brush-style'
import Color from '../util/color'

interface MuscleMap {
  [muscleGroupId: string]: MuscleGroup
}

export interface TBD {
  muscleGroups: MuscleMap
  features: Feature[]
}

export const createPoint = (def: FacedataPoint): Point => {
  return new Point(def.x, def.y)
}

export const createSpline = (def: FacedataSpline): ISpline => {
  const points = def.points.map(createPoint)

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

export const createMuscleGroup = (id: string, def: FacedataMuscleGroup): MuscleGroup => {
  const muscles: { [muscleId: string]: Muscle } = {}

  Object.entries(def.muscles).forEach(([muscleId, defMuscle]) => {
    const spline = createSpline(defMuscle.spline)
    muscles[muscleId] = new Muscle(defMuscle.label, spline, defMuscle.inittension || 0)
  })

  return new MuscleGroup(id, muscles)
}

export const createStrokeStyle = (def: FacedataStrokeStyle): IStrokeStyle | undefined => {
  if (!def) {
    return
  }

  if (def.type === 'brush') {
    const color = new Color(def.color)
    return new BrushStyle(def.startwidth, def.maxwidth, def.endwidth, color, def.alpha)
  }
}

export const createFeatureSegment = (def: FacedataFeatureSegment, muscleMap: MuscleMap): FeatureSegment => {
  const spline = createSpline(def.spline)
  const strokeStyle = createStrokeStyle(def.strokestyle)
  const segment = new FeatureSegment(def.id, def.label, spline, strokeStyle)

  if (def.influences) {
    def.influences.forEach((influence) => {
      const muscle = muscleMap[influence.musclegroup].muscles[influence.muscle]
      segment.addInfluenceToNode(influence.nodenum, muscle, influence.weight)
    })
  }

  return segment
}

export const createFeature = (def: FacedataFeature, muscleMap: MuscleMap): Feature => {
  const segments = def.segments.map((defSegment) => {
    return createFeatureSegment(defSegment, muscleMap)
  })

  return new Feature(def.label, def.filled, def.stroked, def.mirrored, segments)
}

export const processFacedata = (facedata: Facedata): TBD => {
  const muscleGroups: { [muscleGroupId: string]: MuscleGroup } = {}
  Object.entries(facedata.musclegroups).forEach(([muscleGroupId, defMuscleGroup]) => {
    muscleGroups[muscleGroupId] = createMuscleGroup(muscleGroupId, defMuscleGroup)
  })

  const features = facedata.features.map((defFeature) => {
    return createFeature(defFeature, muscleGroups)
  })

  return {
    muscleGroups,
    features,
  }
}
