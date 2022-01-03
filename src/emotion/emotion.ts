import Mapping from '../display/mapping'
import Muscle from '../muscle/muscle'

export interface EmotionInfluence {
  muscle: Muscle
  mapping: Mapping
  priority: number
}

export default class Emotion {
  label: string
  influences: EmotionInfluence[]
  value = 0.0

  constructor(label: string, influences: EmotionInfluence[]) {
    this.label = label
    this.influences = influences
  }

  evaluate(): void {
    if (this.value === 0.0) {
      return
    }

    this.influences.forEach((influence) => {
      const tension = influence.mapping.y(this.value)

      influence.muscle.addTension({ emotionValue: this.value * influence.priority, tension })
    })
  }
}
