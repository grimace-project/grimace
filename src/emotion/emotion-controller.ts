import MuscleController from '../muscle/muscle-controller'
import Emotion from './emotion'
import { EmotionSet } from '../core'

function randomElement<T>(items: Array<T>): T {
  return items[Math.floor(Math.random() * items.length)]
}

function randomMinMax(min = 0.0, max = 1.0): number {
  return Math.random() * (max - min) + min
}

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

  setRandomEmotionSet(): void {
    const emotionIds = Object.keys(this.emotions)

    const emotionSet: EmotionSet = {}

    const emotionId1 = randomElement(emotionIds)
    emotionSet[emotionId1] = randomMinMax(0.2, 1.0)

    if (Math.random() > 0.33) {
      let emotionId2: string = randomElement(emotionIds)
      while (emotionId2 === emotionId1) {
        emotionId2 = randomElement(emotionIds)
      }

      emotionSet[emotionId2] = randomMinMax(0.2, 1.0)
    }

    this.setEmotionSet(emotionSet)
  }
}
