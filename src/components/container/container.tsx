import { h, Component } from '@stencil/core'

@Component({
  tag: 'paint-container',
  styleUrl: 'container.scss',
  shadow: true,
})
export class PaintContainer {
  render() {
    return <grimace-canvas></grimace-canvas>
  }
}
