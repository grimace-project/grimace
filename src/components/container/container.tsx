import { h, Component, Fragment, Listen, Prop } from '@stencil/core'

import { EmotionSet } from '../../core'
import { SliderChangedEvent } from '../slider/slider'

@Component({
  tag: 'grimace-container',
  styleUrl: 'container.scss',
  shadow: true,
})
export class GrimaceContainer {
  @Prop({ mutable: true }) emotionSet: EmotionSet

  @Listen('sliderValueChanged')
  sliderValueChangedHandler(event: CustomEvent<SliderChangedEvent>): void {
    this.updateEmotionSet(event.detail.name, event.detail.value)
  }

  updateEmotionSet(name: string, value: number): void {
    this.emotionSet = {
      [name]: value,
    }
  }

  randomize(): void {
    console.log('randomize')
  }

  render() {
    return (
      <>
        <grimace-canvas emotions={this.emotionSet}></grimace-canvas>
        <div class="controls">
          <grimace-slider name="joy" label="Joy"></grimace-slider>
          <grimace-slider name="surprise" label="Surprise"></grimace-slider>
          <grimace-slider name="fear" label="Fear"></grimace-slider>
          <grimace-slider name="sadness" label="Sadness"></grimace-slider>
          <grimace-slider name="disgust" label="Disgust"></grimace-slider>
          <grimace-slider name="anger" label="Anger"></grimace-slider>
          <button onClick={() => this.randomize()}>Randomize</button>
        </div>
      </>
    )
  }
}
