// https://gist.github.com/EvAlex/ad0e43f4087e2e813a8f4cd872b433b8
export const RGB_COLOR_REGEX = /\((\d+),\s*(\d+),\s*(\d+)(,\s*(\d*.\d*))?\)/

export default class Color {
  public r: number
  public g: number
  public b: number
  public a: number

  constructor()
  constructor(colorStr?: string)
  constructor(r?: string | number, g?: number, b?: number)
  constructor(r?: string | number, g?: number, b?: number, a?: number) {
    if (typeof r === 'string') {
      r = r.trim()
      if (r.indexOf('#') === 0) {
        r = r.substr(r.indexOf('#') + 1)
        this.r = parseInt(r.substr(0, 2), 16)
        this.g = parseInt(r.substr(2, 2), 16)
        this.b = parseInt(r.substr(4, 2), 16)
      } else if (r.indexOf('rgb') === 0) {
        const res = RGB_COLOR_REGEX.exec(r)
        this.r = parseInt(res[1], 10)
        this.g = parseInt(res[2], 10)
        this.b = parseInt(res[3], 10)
        this.a = res[5] ? parseFloat(res[5]) : 1
      }
    } else {
      this.r = r
      this.g = g
      this.b = b
      this.a = a || 1
    }
  }

  toHex(): string {
    return '#' + this.r.toString(16) + this.g.toString(16) + this.b.toString(16)
  }

  toRgb(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`
  }

  toRgba(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
  }
}
