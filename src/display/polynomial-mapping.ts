import Mapping from './mapping'

export default class PolynomialMapping implements Mapping {
  x0: number
  exponents: number[]

  constructor(x0: number, exponents: number[]) {
    this.x0 = x0
    this.exponents = exponents
  }

  y(x: number): number {
    x -= this.x0

    return this.exponents.reduce((y, exponent, power) => {
      return y + exponent * Math.pow(x, power)
    }, 0.0)
  }
}
