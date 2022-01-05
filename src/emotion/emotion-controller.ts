import MuscleController from '../muscle/muscle-controller'
import Emotion from './emotion'
import { EmotionSet } from '../core'

export default class EmotionController {
  emotions: {
    [emotionId: string]: Emotion
  }
  muscleController: MuscleController

  constructor(emotions: { [emotionId: string]: Emotion }, muscleController: MuscleController) {
    this.emotions = emotions
    this.muscleController = muscleController

    this.evaluate()
  }

  evaluate(): void {
    this.muscleController.clear()

    Object.values(this.emotions).forEach((emotion) => {
      emotion.evaluate()
    })

    this.muscleController.evaluate()
  }

  setEmotionSet(emotionSet: EmotionSet): void {
    Object.entries(emotionSet).forEach(([emotionId, value]) => {
      this.emotions[emotionId].value = value
    })

    this.evaluate()
  }
}
