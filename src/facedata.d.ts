export default interface Facedata {
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
}

export interface FacedataSpline {
  type: 'line' | 'quadraticbezier' | 'cubicbezier' | 'joiner'
  points: FacedataPoint[]
}

export interface FacedataMuscle {
  label: string
  spline: FacedataSpline
  inittension?: number
  weights?: {
    [pointId: string]: number
  }
}

export interface FacedataMuscleGroup {
  color: string
  width: number
  alpha: number
  zindex: number
  muscles: {
    [muscleId: string]: FacedataMuscle
  }
}

export interface FacedataFeature {
  label: string
  filled: boolean
  stroked: boolean
  mirrored: boolean
  segments: FacedataFeatureSegment[]
  fills?: FacedataFeatureFill[]
}

export interface FacedataFeatureSegment {
  id: string
  spline: FacedataSpline
  label: string
  alpha?: number
  strokestyle?: FacedataStrokeStyle
  influences?: FacedataFeatureSegmentInfluence[]
}

export interface FacedataFeatureSegmentInfluence {
  nodenum: number
  muscle: string
  weight: number
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

export interface FacedataFeatureFillCommand {
  command:
    | 'beginFill'
    | 'curveTo'
    | 'drawCircle'
    | 'drawEllipse'
    | 'drawRect'
    | 'endFill'
    | 'lineStyle'
    | 'lineTo'
    | 'moveTo'
  alpha?: number
  anchorX?: number
  anchorY?: number
  color?: string
  controlX?: number
  controlY?: number
  height?: number
  radius?: number
  thickness?: number
  width?: number
  x?: number
  y?: number
}

export interface FacedataFeatureFill {
  draw: FacedataFeatureFillCommand[]
  influence?: {
    muscle: string
    weight: number
  }
}
