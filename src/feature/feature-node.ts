import Point from '../display/point'
import Muscle from '../muscle/muscle'

interface FeatureNodeInfluence {
  muscle: Muscle
  weight: number
}

export default class FeatureNode {
  point: Point
  point0: Point
  influences: FeatureNodeInfluence[] = []
  weightSum = 0.0

  constructor(point: Point) {
    this.point = point
    this.point0 = point.duplicate()
  }

  addInfluence(muscle: Muscle, weight: number): void {
    this.influences.push({ muscle, weight })
    this.weightSum += weight
  }

  evaluate(): boolean {
    if (this.weightSum === 0.0) {
      return false
    }

    const point = this.point0.duplicate()

    this.influences.forEach(({ muscle, weight }) => {
      const muscleOffset = muscle.offset()
      point.x += weight * muscleOffset.x
      point.y += weight * muscleOffset.y
    })

    if (this.point.x !== point.x || this.point.y != point.y) {
      this.point.x = point.x
      this.point.y = point.y
      return true
    }

    return false
  }
}
