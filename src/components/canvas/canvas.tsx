import { h, Component, Listen, Prop, Element, Watch } from '@stencil/core'

import loadFacedata from '../../facedata/index'
import scaleCanvas from '../../util/scale-canvas'
import MuscleController from '../../muscle/muscle-controller'
import EmotionController from '../../emotion/emotion-controller'
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

    const { emotions, features, muscleGroups, overlays } = loadFacedata()

    this.muscleController = new MuscleController(muscleGroups)
    this.muscleController.listeners.push(() => this.renderFeatures())

    this.featureController = new FeatureController(features, overlays)

    this.emotionController = new EmotionController(emotions, this.muscleController)
    this.renderFeatures(true)
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
    this.canvas.width = this.el.clientWidth
    this.canvas.height = this.el.clientHeight
    scaleCanvas(this.canvas, this.context, this.canvas.width, this.canvas.height)
  }

  @Listen('grimace:setEmotionSet', { target: 'window' })
  onSetEmotionSet(event: CustomEvent<EmotionSet>): void {
    this.onEmotionSetChanged(event.detail)
  }

  @Listen('grimace:setRandomEmotionSet', { target: 'window' })
  onSetRandomEmotionSet(): void {
    this.emotionController.setRandomEmotionSet()
  }

  @Watch('emotions')
  onEmotionSetChanged(emotionSet: EmotionSet): void {
    this.emotionController.setEmotionSet(emotionSet)
  }

  setEmotion(name: string, value: number): void {
    console.log('set emotion', name, value)
  }

  render() {
    return <canvas></canvas>
  }
}
