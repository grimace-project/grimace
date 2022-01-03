import MuscleController from '../muscle/muscle-controller'
import Emotion from './emotion'

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

  setEmotionSet(emotionSet: { [emotionId: string]: number }): void {
    Object.entries(emotionSet).forEach(([emotionId, value]) => {
      this.emotions[emotionId].value = value
    })

    this.evaluate()
  }
}
