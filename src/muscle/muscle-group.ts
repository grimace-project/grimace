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
}
