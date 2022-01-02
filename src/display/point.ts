export default class Point {
  x: number
  y: number
  x0: number
  y0: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.x0 = x
    this.y0 = y
  }

  duplicate(): Point {
    return new Point(this.x, this.y)
  }

  public static distance(a: Point, b: Point): number {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
  }

  public static fromPolar(radius: number, angle: number): Point {
    return new Point(radius * Math.cos(angle), radius * Math.sin(angle))
  }
}
