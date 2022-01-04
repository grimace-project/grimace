import Facedata, {
  FacedataAlphaMapping,
  FacedataEmotion,
  FacedataFeature,
  FacedataFeatureSegment,
  FacedataMapping,
  FacedataMuscleGroup,
  FacedataOverlay,
  FacedataPoint,
  FacedataSpline,
  FacedataStrokeStyle,
} from '../facedata'
import BasicStyle from '../display/basic-style'
import BrushStyle from '../display/brush-style'
import Color from '../util/color'
import CubicSpline from '../display/cubic-spline'
import Emotion, { EmotionInfluence } from '../emotion/emotion'
import Feature from '../feature/feature'
import FeatureSegment, { AlphaMapping } from '../feature/feature-segment'
import ISpline from '../display/ispline'
import IStrokeStyle from '../display/istrokestyle'
import JoinerSpline from '../display/joiner-spline'
import LinearSpline from '../display/linear-spline'
import Mapping from '../display/mapping'
import Muscle from '../muscle/muscle'
import MuscleGroup from '../muscle/muscle-group'
import Point from '../display/point'
import QuadraticSpline from '../display/quadratic-spline'
import GaussMapping from '../display/gauss-mapping'
import PolynomialMapping from '../display/polynomial-mapping'
import SineMapping from '../display/sine-mapping'
import FeatureFill from '../feature/feature-fill'
import Overlay from './overlay'

interface MuscleMap {
  [muscleId: string]: Muscle
}

interface MuscleGroupMap {
  [muscleGroupId: string]: MuscleGroup
}

interface EmotionMap {
  [emotionId: string]: Emotion
}

export interface TBD {
  muscleGroups: MuscleGroupMap
  features: Feature[]
  emotions: EmotionMap
  overlays: Overlay[]
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

  const color = new Color(def.color)
  if (def.type === 'brush') {
    return new BrushStyle(def.startwidth, def.maxwidth, def.endwidth, color, def.alpha)
  } else if (def.type === 'basic') {
    return new BasicStyle(def.width, color, 1.0)
  }
}

export const createAlphaMapping = (def: FacedataAlphaMapping, muscleMap: MuscleMap): AlphaMapping => {
  if (!def) {
    return
  }

  return {
    sourcemuscle: muscleMap[def.sourcemuscle],
    mapping: createMapping(def.mapping),
  }
}

export const createFeatureSegment = (def: FacedataFeatureSegment, muscleMap: MuscleMap): FeatureSegment => {
  const spline = createSpline(def.spline)
  const strokeStyle = createStrokeStyle(def.strokestyle)
  const alphaMapping = createAlphaMapping(def.alphamapping, muscleMap)
  const segment = new FeatureSegment(def.id, def.label, spline, strokeStyle, alphaMapping)

  if (def.influences) {
    def.influences.forEach((influence) => {
      const muscle = muscleMap[influence.muscle]
      segment.addInfluenceToNode(influence.nodenum, muscle, influence.weight)
    })
  }

  return segment
}

export const createFeature = (def: FacedataFeature, muscleMap: MuscleMap): Feature => {
  const segments = def.segments.map((defSegment) => {
    return createFeatureSegment(defSegment, muscleMap)
  })

  let fills: FeatureFill[]
  if (def.fills) {
    fills = def.fills.map((defFill) => {
      let influence: {
        muscle: Muscle
        weight: number
      }
      if (defFill.influence) {
        influence = {
          muscle: muscleMap[defFill.influence.muscle],
          weight: defFill.influence.weight,
        }
      }
      return new FeatureFill(defFill.draw, influence)
    })
  }

  return new Feature(def.label, def.filled, def.stroked, def.mirrored, segments, fills)
}

export const createMapping = (def: FacedataMapping): Mapping => {
  if (def.type === 'gauss') {
    return new GaussMapping(def.mean, def.variance, def.value)
  } else if (def.type === 'polynomial') {
    return new PolynomialMapping(def.x0, def.exponents)
  } else if (def.type === 'sine') {
    return new SineMapping(def.x0, def.x1, def.y0, def.y1)
  }
}

export const createEmotion = (label: string, def: FacedataEmotion, muscleMap: MuscleMap): Emotion => {
  const influences: EmotionInfluence[] = Object.entries(def.influences)
    .map(([muscleId, defInfluence]) => {
      const muscle = muscleMap[muscleId]

      if (!muscle) {
        return
      }

      return {
        muscle,
        mapping: createMapping(defInfluence.mapping),
        priority: defInfluence.priority || 1.0,
      }
    })
    .filter((x) => Boolean(x))

  return new Emotion(label, influences)
}

export const createOverlay = (def: FacedataOverlay): Overlay => {
  return new Overlay(def.id, def.x, def.y, def.scale, def.alpha, def.data)
}

export const processFacedata = (facedata: Facedata): TBD => {
  const muscleMap: { [muscleId: string]: Muscle } = {}
  const muscleGroups: MuscleGroupMap = {}
  Object.entries(facedata.musclegroups).forEach(([muscleGroupId, defMuscleGroup]) => {
    const muscleGroup = createMuscleGroup(muscleGroupId, defMuscleGroup)
    Object.assign(muscleMap, muscleGroup.muscles)
    muscleGroups[muscleGroupId] = muscleGroup
  })

  const features = facedata.features.map((defFeature) => {
    return createFeature(defFeature, muscleMap)
  })

  const emotions: { [emotionId: string]: Emotion } = {}
  Object.entries(facedata.emotions).forEach(([emotionId, defEmotion]) => {
    emotions[emotionId] = createEmotion(emotionId, defEmotion, muscleMap)
  })

  const overlays = facedata.overlays.map(createOverlay)

  return {
    muscleGroups,
    features,
    emotions,
    overlays,
  }
}
