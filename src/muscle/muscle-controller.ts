import MuscleGroup from './muscle-group'

// const ChangeEvent = new CustomEvent('musclechange')

export default class MuscleController {
  muscleGroups: {
    [muscleGroupId: string]: MuscleGroup
  }
  listeners: ((event: CustomEvent) => unknown)[] = []

  constructor(muscleGroups: { [muscleGroupId: string]: MuscleGroup }) {
    this.muscleGroups = muscleGroups
  }

  addChangeEventListener(callback: (event: CustomEvent) => unknown): void {
    this.listeners.push(callback)
  }

  clear(): void {
    Object.values(this.muscleGroups).forEach((muscleGroup) => muscleGroup.clear())
  }

  evaluate(): void {
    Object.values(this.muscleGroups).forEach((muscleGroup) => muscleGroup.evaluate())
  }
}
