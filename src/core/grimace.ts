import MuscleController from '../muscle/muscle-controller'
import EmotionController from '../emotion/emotion-controller'
import FeatureController from '../feature/feature-controller'
import type { EmotionSet, Listener } from '../emotion/emotion-controller'
import scaleCanvas from '../util/scale-canvas'
import loadFacedata from '../facedata/index'

export class Grimace {
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
    this.addResizeListener()
  }

  initCanvas(): void {
    this.canvas = document.createElement('canvas')
    this.container.appendChild(this.canvas)

    const context = this.canvas.getContext('2d')
    if (!context) {
      throw new Error('Could not get canvas context')
    }
    context.lineCap = 'round'
    context.lineJoin = 'round'
    this.context = context
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

  addResizeListener(): void {
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

  setEmotion(emotion: string, value: number): void {
    this.emotionController.setEmotion(emotion, value)
  }

  addListener(listener: Listener): void {
    this.emotionController.addListener(listener)
  }
}
