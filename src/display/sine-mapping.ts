import Mapping from './mapping'

export default class SineMapping implements Mapping {
  x0: number
  x1: number
  y0: number
  y1: number

  constructor(x0: number, x1: number, y0: number, y1: number) {
    this.x0 = x0
    this.x1 = x1
    this.y0 = y0
    this.y1 = y1
  }

  y(x: number): number {
    const { x0, x1, y0, y1 } = this

    if (x <= x0) {
      return y0
    } else if (x >= x1) {
      return y1
    }

    x -= x0

    return (0.5 * Math.sin(Math.PI * (x / (x1 - x0) + 1.5)) + 0.5) * (y1 - y0) + y0;
  }
}
