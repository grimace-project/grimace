import { h, Component, Listen, Prop, Element, Watch } from '@stencil/core'

import { EmotionSet } from '../../core'
import { loadFacedataFromJson } from '../../facedata-loader'
import { processFacedata } from '../../core/factory'
import scaleCanvas from '../../util/scale-canvas'
import MuscleController from '../../muscle/muscle-controller'
import EmotionController from '../../emotion/emotion-controller'
import facedataHead from '../../facedata/head.json'
import facedataFeatures from '../../facedata/features.json'
import facedataWrinkles from '../../facedata/wrinkles.json'
import facedataEmotions from '../../facedata/emotions.json'
import facedataOverlays from '../../facedata/overlay.json'
import FeatureController from '../../feature/feature-controller'

@Component({
  tag: 'grimace-canvas',
  styleUrl: 'canvas.scss',
  shadow: true,
})
export class GrimaceCanvas {
  @Element() el: HTMLElement

  @Prop() emotions: EmotionSet
  @Prop() isServer: boolean

  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  muscleController: MuscleController
  emotionController: EmotionController
  featureController: FeatureController

  componentDidLoad() {
    if (this.isServer) {
      return
    }

    this.canvas = this.el.shadowRoot.querySelector('canvas')
    this.context = this.canvas.getContext('2d')
    this.context.lineCap = 'round'
    this.context.lineJoin = 'round'

    this.resizeCanvas()

    const facedata = loadFacedataFromJson(
      facedataHead,
      facedataFeatures,
      facedataWrinkles,
      facedataEmotions,
      facedataOverlays,
    )

    const { emotions, features, muscleGroups, overlays } = processFacedata(facedata)

    this.muscleController = new MuscleController(muscleGroups)

    this.featureController = new FeatureController(features, overlays)

    this.emotionController = new EmotionController(emotions, this.muscleController)
    this.featureController.drawInContext(this.context)
  }

  renderFeatures(force = false): any {
    // requestAnimationFrame(() => this.renderCanvas())
    const hasChanged = this.featureController.evaluate()
    if (hasChanged || force) {
      this.featureController.drawInContext(this.context)
    }
  }

  @Listen('resize', { target: 'window' })
  onWindowResize(): void {
    this.resizeCanvas()
    this.renderFeatures(true)
  }

  resizeCanvas(): void {
    this.canvas.width = 0
    this.canvas.height = 0
    this.canvas.style.width = ''
    this.canvas.style.height = ''
    console.log(this.el.clientWidth)
    this.canvas.width = this.el.clientWidth
    this.canvas.height = this.el.clientHeight
    scaleCanvas(this.canvas, this.context, this.canvas.width, this.canvas.height)
  }

  @Watch('emotions')
  onEmotionSetChanged(emotionSet: EmotionSet): void {
    this.emotionController.setEmotionSet(emotionSet)
    this.renderFeatures()
  }

  render() {
    return <canvas></canvas>
  }
}
