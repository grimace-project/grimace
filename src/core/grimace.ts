import MuscleController from '../muscle/muscle-controller'
import EmotionController from '../emotion/emotion-controller'
import FeatureController from '../feature/feature-controller'
import scaleCanvas from '../util/scale-canvas'
import loadFacedata from '../facedata/index'

export class Grimace {
  el: HTMLElement
  emotions: EmotionSet

  container: HTMLElement
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  muscleController: MuscleController
  emotionController: EmotionController
  featureController: FeatureController

  constructor(container: HTMLElement) {
    this.container = container
    this.initCanvas()
    this.initGrimace()
    this.addListeners()
  }

  initCanvas(): void {
    this.canvas = document.createElement('canvas')
    this.container.appendChild(this.canvas)

    this.context = this.canvas.getContext('2d')
    this.context.lineCap = 'round'
    this.context.lineJoin = 'round'
    this.resizeCanvas()
  }

  initGrimace(): void {
    const { emotions, features, muscleGroups, overlays } = loadFacedata()

    this.muscleController = new MuscleController(muscleGroups)
    this.muscleController.listeners.push(() => this.renderFeatures())

    this.featureController = new FeatureController(features, overlays)

    this.emotionController = new EmotionController(emotions, this.muscleController)
    this.renderFeatures(true)
  }

  renderFeatures(force = false): any {
    const hasChanged = this.featureController.evaluate()
    if (hasChanged || force) {
      this.featureController.drawInContext(this.context)
    }
  }

  addListeners(): void {
    window.addEventListener('resize', () => this.onWindowResize())
  }

  onWindowResize(): void {
    this.resizeCanvas()
    this.renderFeatures(true)
  }

  resizeCanvas(): void {
    this.canvas.width = 0
    this.canvas.height = 0
    this.canvas.style.width = ''
    this.canvas.style.height = ''
    this.canvas.width = this.container.clientWidth
    this.canvas.height = this.container.clientHeight
    scaleCanvas(this.canvas, this.context, this.canvas.width, this.canvas.height)
  }

  setEmotionSet(emotionSet: EmotionSet): void {
    this.emotionController.setEmotionSet(emotionSet)
  }

  setRandomEmotionSet(): void {
    this.emotionController.setRandomEmotionSet()
  }
}
