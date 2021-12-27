export namespace Grimace {
  interface Facedata {
    points: {
      [pointId: string]: Point
    }

    splines: {
      [splineId: string]: Spline
    }

    muscles: {
      [muscleId: string]: Muscle
    }

    muscleGroups: {
      [muscleGroupId: string]: MuscleGroup
    }

    features: Feature[]

    emotions: {
      [emotionId: string]: Emotion
    }
  }

  interface Point {
    x: number
    y: number
    muscleweights?: {
      [muscleId: string]: number
    }
  }

  interface Spline {
    type: 'line' | 'quadraticbezier' | 'cubicbezier'
    points: string[]
  }

  interface Muscle {
    group: 'feature'
    label: string
    spline: string
  }

  interface MuscleGroup {
    color: string
    width: number
    alpha: number
    zindex: number
  }

  interface Feature {
    label: string
    stroked: boolean
    mirrored: boolean
    segments: FeatureSegment[]
  }

  interface FeatureSegment {
    id: string
    spline: string
    label: string
    alpha?: number
    strokestyle: StrokeStyle
  }

  type StrokeStyle = BasicStrokeStyle | BrushStrokeStyle

  interface BasicStrokeStyle {
    type: 'basic'
    width: number
    color: string
  }

  interface BrushStrokeStyle {
    type: 'brush'
    startwidth: number
    maxwidth: number
    endwidth: number
    alpha: number
    color: string
  }

  interface Emotion {
    influences: {
      [muscleId: string]: EmotionInfluence
    }
  }

  interface EmotionInfluence {
    priority: number
    mapping: Mapping
  }

  type Mapping = GaussMapping | PolynomialMapping | SineMapping

  interface GaussMapping {
    type: 'gauss'
    mean: number
    variance: number
    value: number
  }

  interface PolynomialMapping {
    type: 'polynomial'
    x0: number
    exponents: number[]
  }

  interface SineMapping {
    x0: number
    x1: number
    y0: number
    y1: number
  }
}
