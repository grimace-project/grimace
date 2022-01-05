import { h, Component, Prop, Event, EventEmitter } from '@stencil/core'

export interface SliderChangedEvent {
  name: string
  value: number
}

@Component({
  tag: 'grimace-slider',
  styleUrl: 'slider.scss',
})
export class SliderComponent {
  @Prop() name: string
  @Prop() label: string
  @Prop({ mutable: true }) value: number

  @Event() sliderValueChanged: EventEmitter<SliderChangedEvent>

  valueChangedHandler(event: any): void {
    this.sliderValueChanged.emit({
      name: this.name,
      value: event.target.value / 1000,
    })
  }

  componentWillLoad() {
    this.value = 0
  }

  render() {
    return (
      <div class="slider-container">
        <span>{this.label}</span>
        <input
          type="range"
          min={0}
          max={1000}
          value={this.value}
          class="slider"
          onInput={(event) => this.valueChangedHandler(event)}
        ></input>
      </div>
    )
  }
}
