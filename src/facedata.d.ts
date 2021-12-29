export default interface Facedata {
  points: {
    [pointId: string]: FacedataPoint
  }

  splines: {
    [splineId: string]: FacedataSpline
  }

  muscles: {
    [muscleId: string]: FacedataMuscle
  }

  musclegroups: {
    [muscleGroupId: string]: FacedataMuscleGroup
  }

  features: FacedataFeature[]

  emotions: {
    [emotionId: string]: FacedataEmotion
  }
}

export interface FacedataPoint {
  x: number
  y: number
  muscleweights?: {
    [muscleId: string]: number
  }
}

export interface FacedataSpline {
  type: 'line' | 'quadraticbezier' | 'cubicbezier'
  points: string[]
}

export interface FacedataMuscle {
  group: 'feature'
  label: string
  spline: string
}

export interface FacedataMuscleGroup {
  color: string
  width: number
  alpha: number
  zindex: number
}

export interface FacedataFeature {
  label: string
  stroked: boolean
  mirrored: boolean
  segments: FacedataFeatureSegment[]
}

export interface FacedataFeatureSegment {
  id: string
  spline: string
  label: string
  alpha?: number
  strokestyle: FacedataStrokeStyle
}

type FacedataStrokeStyle = FacedataBasicStrokeStyle | FacedataBrushStrokeStyle

export interface FacedataBasicStrokeStyle {
  type: 'basic'
  width: number
  color: string
}

export interface FacedataBrushStrokeStyle {
  type: 'brush'
  startwidth: number
  maxwidth: number
  endwidth: number
  alpha: number
  color: string
}

export interface FacedataEmotion {
  influences: {
    [muscleId: string]: FacedataEmotionInfluence
  }
}

export interface FacedataEmotionInfluence {
  priority?: number
  mapping: FacedataMapping
}

export interface FacedataMapping {
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
