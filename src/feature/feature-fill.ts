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
        if (command.thickness !== undefined) {
          context.lineWidth = command.thickness
        }
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
        if (command.radius !== undefined && command.x !== undefined && command.y !== undefined) {
          context.ellipse(command.x, command.y, command.radius, command.radius, 0, 0, 2 * Math.PI)
        }
        break
      case 'drawEllipse':
        if (
          command.x !== undefined &&
          command.y !== undefined &&
          command.width !== undefined &&
          command.height !== undefined
        ) {
          context.ellipse(
            command.x + command.width / 2.0,
            command.y + command.height / 2.0,
            command.width / 2.0,
            command.height / 2.0,
            0,
            0,
            2 * Math.PI,
          )
        }
        break
      case 'drawRect':
        if (
          command.x !== undefined &&
          command.y !== undefined &&
          command.width !== undefined &&
          command.height !== undefined
        ) {
          context.rect(command.x, command.y, command.width, command.height)
        }
        break
      case 'moveTo':
        if (command.x !== undefined || command.y !== undefined) {
          context.moveTo(command.x as number, command.y as number)
        }
        break
      case 'lineTo':
        if (command.x !== undefined || command.y !== undefined) {
          context.lineTo(command.x as number, command.y as number)
        }
        break
      case 'curveTo':
        if (
          command.controlX !== undefined ||
          command.controlY !== undefined ||
          command.anchorX !== undefined ||
          command.anchorY !== undefined
        ) {
          context.quadraticCurveTo(
            command.controlX as number,
            command.controlY as number,
            command.anchorX as number,
            command.anchorY as number,
          )
        }
        break
    }
  }

  evaluate(): void {
    this.pivot.evaluate()
  }
}
