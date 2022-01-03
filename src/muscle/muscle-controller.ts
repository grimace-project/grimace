import MuscleGroup from './muscle-group'

export default class MuscleController {
  muscleGroups: {
    [muscleGroupId: string]: MuscleGroup
  }

  constructor(muscleGroups: { [muscleGroupId: string]: MuscleGroup }) {
    this.muscleGroups = muscleGroups
  }

  clear(): void {
    Object.values(this.muscleGroups).forEach((muscleGroup) => muscleGroup.clear())
  }

  evaluate(): void {
    Object.values(this.muscleGroups).forEach((muscleGroup) => muscleGroup.evaluate())
  }
}
