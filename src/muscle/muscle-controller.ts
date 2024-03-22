import Muscle from './muscle'
import PolynomialMapping from '../display/polynomial-mapping'

const fadeMapping = new PolynomialMapping(1.0, [1.0, 0, -1.0])

interface MuscleGroup {
  [muscleId: string]: Muscle
}

export default class MuscleController {
  muscleGroups: {
    [muscleGroupId: string]: MuscleGroup
  }
  muscles: {
    [muscleId: string]: Muscle
  }
  listeners: ((event: CustomEvent) => unknown)[] = []

  constructor(muscleGroups: { [muscleGroupId: string]: MuscleGroup }) {
    this.muscles = {}
    this.muscleGroups = muscleGroups
    Object.values(muscleGroups).forEach((muscleGroup) => {
      Object.entries(muscleGroup).forEach(([muscleId, muscle]) => {
        this.muscles[muscleId] = muscle
      })
    })
  }

  addChangeEventListener(callback: (event: CustomEvent) => unknown): void {
    this.listeners.push(callback)
  }

  clear(): void {
    Object.values(this.muscles).forEach((muscle) => muscle.clear())
  }

  saveTensions(): void {
    Object.values(this.muscles).forEach((muscle) => muscle.saveTension())
  }

  evaluate(): void {
    Object.values(this.muscles).forEach((muscle) => muscle.evaluate())
  }

  announceChange(): void {
    this.listeners.forEach((listener) => listener(new CustomEvent('musclechange')))
  }

  fade(duration?: number, beginTime?: number): void {
    if (!duration) {
      Object.values(this.muscles).forEach((muscle) => {
        muscle.interpolate(1.0)
      })

      this.announceChange()

      return
    }

    if (!beginTime) {
      beginTime = Date.now()
    }
    const t = Math.min(1.0, (Date.now() - beginTime) / duration)

    Object.values(this.muscles).forEach((muscle) => {
      const tWeighted = fadeMapping.y(t)
      muscle.interpolate(tWeighted)
    })

    this.announceChange()

    if (t < 1.0) {
      window.requestAnimationFrame(() => {
        this.fade(duration, beginTime)
      })
    }
  }
}
