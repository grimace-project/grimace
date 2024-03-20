interface Facedata {
  musclegroups: {
    [muscleGroupId: string]: FacedataMuscleGroup
  }

  features: FacedataFeature[]

  emotions: {
    [emotionId: string]: FacedataEmotion
  }

  overlays?: FacedataOverlay[]
}

interface FacedataPoint {
  x: number
  y: number
}

interface FacedataSpline {
  type: 'line' | 'quadraticbezier' | 'cubicbezier' | 'joiner'
  points: FacedataPoint[]
}

interface FacedataMuscle {
  label: string
  spline: FacedataSpline
  inittension?: number
  weights?: {
    [pointId: string]: number
  }
}

interface FacedataMuscleGroup {
  color: string
  width: number
  alpha: number
  zindex: number
  muscles: {
    [muscleId: string]: FacedataMuscle
  }
}

interface FacedataFeature {
  label: string
  filled: boolean
  stroked: boolean
  mirrored: boolean
  segments: FacedataFeatureSegment[]
  fills?: FacedataFeatureFill[]
}

interface FacedataAlphaMapping {
  sourcemuscle: string
  mapping: FacedataMapping
}

interface FacedataFeatureSegment {
  id: string
  spline: FacedataSpline
  label: string
  alpha?: number
  strokestyle?: FacedataStrokeStyle
  alphamapping?: FacedataAlphaMapping
  influences?: FacedataFeatureSegmentInfluence[]
}

interface FacedataFeatureSegmentInfluence {
  nodenum: number
  muscle: string
  weight: number
}

type FacedataStrokeStyle = FacedataBasicStrokeStyle | FacedataBrushStrokeStyle

interface FacedataBasicStrokeStyle {
  type: 'basic'
  width: number
  color: string
}

interface FacedataBrushStrokeStyle {
  type: 'brush'
  startwidth: number
  maxwidth: number
  endwidth: number
  alpha: number
  color: string
}

interface FacedataEmotion {
  influences: {
    [muscleId: string]: FacedataEmotionInfluence
  }
}

interface FacedataEmotionInfluence {
  priority?: number
  mapping: FacedataMapping
}

interface FacedataMapping {
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

interface FacedataFeatureFillCommand {
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

interface FacedataFeatureFill {
  draw: FacedataFeatureFillCommand[]
  influence?: {
    muscle: string
    weight: number
  }
}

interface FacedataOverlay {
  id: string
  x: number
  y: number
  scale: number
  alpha: number
  data: string
}
