import MuscleController from '../muscle/muscle-controller'
import Emotion from '../emotion/emotion'

function randomElement<T>(items: Array<T>): T {
  return items[Math.floor(Math.random() * items.length)]
}

function randomMinMax(min = 0.0, max = 1.0): number {
  return Math.random() * (max - min) + min
}

export type EmotionSet = {
  anger?: number
  disgust?: number
  fear?: number
  joy?: number
  sadness?: number
  surprise?: number
  [emotionId: string]: number | undefined
}

export type EmotionMap = {
  [emotionId: string]: Emotion
}

export type Listener = (emotions: EmotionSet) => void

export default class EmotionController {
  emotions: EmotionMap
  muscleController: MuscleController
  listeners: Array<Listener>
  baseEmotion?: Emotion

  constructor(emotions: EmotionMap, muscleController: MuscleController) {
    this.emotions = emotions
    this.muscleController = muscleController
    this.listeners = []
    this.evaluate()
  }

  evaluate(): void {
    this.muscleController.clear()

    Object.values(this.emotions).forEach((emotion) => {
      emotion.evaluate()
    })

    this.notifyListeners()

    this.muscleController.evaluate()
  }

  setEmotionSet(emotionSet: EmotionSet, duration = 0.0): void {
    this.muscleController.saveTensions()

    Object.values(this.emotions).forEach((emotion) => {
      emotion.value = 0.0
    })
    Object.entries(emotionSet).forEach(([emotionId, value]) => {
      this.emotions[emotionId].value = value || 0
    })

    this.evaluate()

    this.muscleController.fade(duration)
  }

  setRandomEmotionSet(duration = 300): void {
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

    this.setEmotionSet(emotionSet, duration)
  }

  setEmotion(emotionId: string, value: number, duration = 0.0): void {
    const emotion = this.emotions[emotionId]
    if (!emotion) {
      throw `Unknown emotion ${emotionId}`
    }

    this.muscleController.saveTensions()

    if (!this.baseEmotion) {
      this.baseEmotion = emotion
      emotion.value = value
    } else if (this.baseEmotion === emotion) {
      emotion.value = value
      if (value === 0) {
        // find new base emotion
        this.baseEmotion = Object.values(this.emotions).reduce((baseEmotion, emotion) => {
          if (!baseEmotion || emotion.value > baseEmotion.value) {
            return emotion
          }
          return baseEmotion
        }, undefined as Emotion | undefined)
      }
    } else {
      Object.values(this.emotions).forEach((e) => {
        if (e === this.baseEmotion) {
          return
        }
        if (e === emotion) {
          e.value = value
        } else {
          e.value = 0
        }
      })
    }

    this.evaluate()

    this.muscleController.fade(duration)
  }

  getEmotionSet(): EmotionSet {
    return Object.entries(this.emotions).reduce((emotionSet, [key, emotion]) => {
      emotionSet[key] = emotion.value
      return emotionSet
    }, {} as EmotionSet)
  }

  addListener(listener: Listener): void {
    this.listeners.push(listener)
  }

  notifyListeners(): void {
    const emotionSet = this.getEmotionSet()
    this.listeners.forEach((listener) => [listener(emotionSet)])
  }
}
