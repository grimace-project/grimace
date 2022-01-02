import ISpline from '../display/ispline'
import Point from '../display/point'

type MuscleTension = {
  tension: number
  emotionValue: number
}

export default class Muscle {
  label: string
  spline: ISpline
  tension: number
  initTension: number
  private rawTensions: MuscleTension[]

  constructor(label: string, spline: ISpline, initTension: number) {
    this.label = label
    this.spline = spline
    this.initTension = initTension
  }

  addTension(muscleTension: MuscleTension): void {
    this.rawTensions.push(muscleTension)
  }

  evaluate(): void {
    let tension = this.initTension

    const valueSum = this.rawTensions.reduce((sum, value) => {
      return sum + value.emotionValue
    }, 0.0)

    if (valueSum !== 0.0) {
      const extraTension = this.rawTensions.reduce((sum, value) => {
        return sum + (value.tension * value.emotionValue) / valueSum
      }, 0.0)
      tension += extraTension
    }

    this.tension = tension
  }

  offset(): Point {
    const currentPoint = this.spline.getPoint(this.tension)
    const initPoint = this.spline.getPoint(this.initTension)

    return new Point(currentPoint.x - initPoint.x, currentPoint.y - initPoint.y)
  }

  clear(): void {
    this.rawTensions = []
    this.tension = this.initTension
  }
}
