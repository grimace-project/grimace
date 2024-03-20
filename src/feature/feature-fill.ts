import Point from '../display/point'
import Muscle from '../muscle/muscle'
import Color from '../util/color'
import FeatureNode from './feature-node'

export default class FeatureFill {
  commands: FacedataFeatureFillCommand[]
  pivot: FeatureNode

  constructor(commands: FacedataFeatureFillCommand[], influence: { muscle: Muscle; weight: number }) {
    this.pivot = new FeatureNode(new Point(0.0, 0.0))
    this.commands = commands

    if (influence) {
      this.pivot.addInfluence(influence.muscle, influence.weight)
    }
  }

  drawInContext(context: CanvasRenderingContext2D): void {
    context.translate(this.pivot.point.x, this.pivot.point.y)

    this.commands.forEach((command) => {
      this.drawCommandInContext(command, context)
    })

    context.translate(-this.pivot.point.x, -this.pivot.point.y)
  }

  drawCommandInContext(command: FacedataFeatureFillCommand, context: CanvasRenderingContext2D): void {
    const name = command.command
    switch (name) {
      case 'lineStyle':
        context.lineWidth = command.thickness
        context.strokeStyle = new Color(command.color).toHex()
        break
      case 'beginFill':
        context.fillStyle = new Color(command.color).toHex()
        context.beginPath()
        break
      case 'endFill':
        context.fill()
        break
      case 'drawCircle':
        context.ellipse(command.x, command.y, command.radius, command.radius, 0, 0, 2 * Math.PI)
        break
      case 'drawEllipse':
        context.ellipse(
          command.x + command.width / 2.0,
          command.y + command.height / 2.0,
          command.width / 2.0,
          command.height / 2.0,
          0,
          0,
          2 * Math.PI,
        )
        break
      case 'drawRect':
        context.rect(command.x, command.y, command.width, command.height)
        break
      case 'moveTo':
        context.moveTo(command.x, command.y)
        break
      case 'lineTo':
        context.lineTo(command.x, command.y)
        break
      case 'curveTo':
        context.quadraticCurveTo(command.controlX, command.controlY, command.anchorX, command.anchorY)
        break
    }
  }

  evaluate(): void {
    this.pivot.evaluate()
  }
}
