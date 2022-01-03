import Mapping from './mapping'

export default class GaussMapping implements Mapping {
  a: number
  b: number
  c: number

  constructor(mean: number, variance: number, value: number) {
    this.c = Math.sqrt(variance)
    this.b = mean
    this.a = value / (this.c * Math.sqrt(2.0 * Math.PI))
  }

  y(x: number): number {
    const { a, b, c } = this

    return a * Math.exp(-Math.pow(x - b, 2) / (2 * c * c))
  }
}
