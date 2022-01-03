import Muscle from './muscle'

export default class MuscleGroup {
  id: string
  muscles: {
    [muscleId: string]: Muscle
  }

  constructor(id: string, muscles: { [muscleId: string]: Muscle }) {
    this.id = id
    this.muscles = muscles
  }

  clear(): void {
    Object.values(this.muscles).forEach((muscle) => muscle.clear())
  }

  evaluate(): void {
    Object.values(this.muscles).forEach((muscle) => muscle.evaluate())
  }
}
