export interface Facedata {
  points: {
    [pointId: string]: Point
  }

  splines: {
    [splineId: string]: Spline
  }

  muscles: {
    [muscleId: string]: Muscle
  }

  musclegroups: {
    [muscleGroupId: string]: MuscleGroup
  }

  features: Feature[]

  emotions: {
    [emotionId: string]: Emotion
  }
}

export interface Point {
  x: number
  y: number
  muscleweights?: {
    [muscleId: string]: number
  }
}

export interface Spline {
  type: 'line' | 'quadraticbezier' | 'cubicbezier'
  points: string[]
}

export interface Muscle {
  group: 'feature'
  label: string
  spline: string
}

export interface MuscleGroup {
  color: string
  width: number
  alpha: number
  zindex: number
}

export interface Feature {
  label: string
  stroked: boolean
  mirrored: boolean
  segments: FeatureSegment[]
}

export interface FeatureSegment {
  id: string
  spline: string
  label: string
  alpha?: number
  strokestyle: StrokeStyle
}

type StrokeStyle = BasicStrokeStyle | BrushStrokeStyle

export interface BasicStrokeStyle {
  type: 'basic'
  width: number
  color: string
}

export interface BrushStrokeStyle {
  type: 'brush'
  startwidth: number
  maxwidth: number
  endwidth: number
  alpha: number
  color: string
}

export interface Emotion {
  influences: {
    [muscleId: string]: EmotionInfluence
  }
}

export interface EmotionInfluence {
  priority?: number
  mapping: Mapping
}

export interface Mapping {
  type: 'gauss' | 'polynomial' | 'sine'

  // GaussMapping properties
  mean?: number
  variance?: number
  value?: number

  // PolynomialMapping properties
  x0?: number
  exponents?: number[]

  // SineMapping properties
  // x0: number
  x1?: number
  y0?: number
  y1?: number
}
