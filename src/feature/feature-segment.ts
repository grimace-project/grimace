import ISpline from '../display/ispline'
import IStrokeStyle from '../display/istrokestyle'
import Mapping from '../display/mapping'
import Muscle from '../muscle/muscle'
import FeatureNode from './feature-node'

export interface AlphaMapping {
  sourcemuscle: Muscle
  mapping: Mapping
}

export default class FeatureSegment {
  id: string
  spline: ISpline
  label: string
  strokeStyle?: IStrokeStyle
  alphaMapping?: AlphaMapping
  nodes: FeatureNode[]

  constructor(id: string, label: string, spline: ISpline, strokeStyle?: IStrokeStyle, alphaMapping?: AlphaMapping) {
    this.id = id
    this.label = label
    this.spline = spline
    this.strokeStyle = strokeStyle
    this.alphaMapping = alphaMapping

    this.nodes = spline.getPointsAsArray().map((point) => {
      return new FeatureNode(point)
    })
  }

  addInfluenceToNode(nodeNum: number, muscle: Muscle, weight: number): void {
    this.nodes[nodeNum].addInfluence(muscle, weight)
  }

  drawInContext(
    context: CanvasRenderingContext2D,
    stroke: boolean,
    fill: boolean,
    mirror: boolean,
    start: boolean,
    end: boolean,
  ): void {
    if (stroke && this.strokeStyle) {
      this.strokeStyle.drawInContext(context, this.spline, start, end, mirror)
    }

    if (fill) {
      this.spline.drawFillInContext(context, start, end, mirror)
    }
  }

  evaluate(): boolean {
    let hasChanged = this.nodes.reduce((hasChanged, node) => {
      const nodeHasChanged = node.evaluate()
      return hasChanged || nodeHasChanged
    }, false)

    if (this.alphaMapping) {
      const alpha = this.alphaMapping.sourcemuscle.tension
      if (this.strokeStyle && this.strokeStyle.strokeAlpha !== alpha) {
        this.strokeStyle.strokeAlpha = alpha
        hasChanged = true
      }
    }

    return hasChanged
  }
}
