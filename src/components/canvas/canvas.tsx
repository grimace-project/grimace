import { h, Fragment, Component, State, Prop, Element } from '@stencil/core'

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

// import { createStore } from '@stencil/store'

// const { state, onChange } = createStore({
//   clicks: 0,
//   seconds: 0,
//   squaredClicks: 0,
// })

// onChange('clicks', (value) => {
//   state.squaredClicks = value ** 2
// })

// export default state

// features consist of segments
// segments are defined by splines
// splines are defined by points
// some points have muscleweights?
// emotions influence muscle tensions via mappings
// multiple emotion influences are normalised via priority value
// muscles are defined by splines

@Component({
  tag: 'grimace-canvas',
  styleUrl: 'canvas.scss',
  shadow: true,
})
export class GrimaceCanvas {
  @Element() el: HTMLElement

  @State() drawing: boolean

  @Prop() color: string
  @Prop() width: number
  @Prop() isServer: boolean

  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  componentDidLoad() {
    if (this.isServer) {
      return
    }

    this.canvas = this.el.shadowRoot.querySelector('canvas')
    this.context = this.canvas.getContext('2d')

    // setup canvas
    this.canvas.height = window.innerHeight
    this.canvas.width = window.innerWidth

    this.context.lineCap = 'round'
    this.context.lineJoin = 'round'

    scaleCanvas(this.canvas, this.context, this.canvas.width, this.canvas.height)

    this.renderCanvas()
    const facedata = loadFacedataFromJson(
      facedataHead,
      facedataFeatures,
      facedataWrinkles,
      facedataEmotions,
      facedataOverlays,
    )

    const { emotions, features, muscleGroups, overlays } = processFacedata(facedata)

    const muscleController = new MuscleController(muscleGroups)

    const emotionController = new EmotionController(emotions, muscleController)

    emotionController.setEmotionSet({
      anger: 1,
    })

    Object.values(features).forEach((feature) => {
      feature.evaluate()
      feature.drawInContext(this.context)
    })

    overlays.forEach((overlay) => {
      overlay.drawInContext(this.context)
    })
  }

  renderCanvas(): any {
    // requestAnimationFrame(() => this.renderCanvas())
  }

  clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  render() {
    return (
      <>
        <canvas></canvas>
        <div id="clearDiv">
          <button onClick={() => this.clear()}>Clear</button>
        </div>
      </>
    )
  }
}
