import ISpline from '../display/ispline'
import IStrokeStyle from '../display/istrokestyle'
import Muscle from '../muscle/muscle'
import FeatureNode from './feature-node'

interface AlphaMapping {
  muscle: Muscle
  mapping: (x: number) => number
}

export default class FeatureSegment {
  id: string
  spline: ISpline
  label: string
  strokeStyle?: IStrokeStyle
  alphaMapping?: AlphaMapping
  nodes: FeatureNode[]

  constructor(id: string, label: string, spline: ISpline, strokeStyle?: IStrokeStyle) {
    this.id = id
    this.label = label
    this.spline = spline
    this.strokeStyle = strokeStyle

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
    _fill: boolean,
    mirror: boolean,
    start: boolean,
    end: boolean,
  ): void {
    if (stroke && this.strokeStyle) {
      this.strokeStyle.drawInContext(context, this.spline, start, end, mirror)
    }
  }

  evaluate(): boolean {
    let hasChanged = this.nodes.reduce((hasChanged, node) => {
      const nodeHasChanged = node.evaluate()
      return hasChanged || nodeHasChanged
    }, false)

    if (this.alphaMapping) {
      const alpha = this.alphaMapping.muscle.tension
      if (this.strokeStyle && this.strokeStyle.strokeAlpha !== alpha) {
        this.strokeStyle.strokeAlpha = alpha
        hasChanged = true
      }
    }

    return hasChanged
  }
}
