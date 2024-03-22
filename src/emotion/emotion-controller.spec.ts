import { beforeEach, describe, expect, it } from 'vitest'

import EmotionController from './emotion-controller'
import Emotion from './emotion'
import MuscleController from '../muscle/muscle-controller'

describe('EmotionController', () => {
  let emotionController: EmotionController
  beforeEach(() => {
    const emotions = {
      one: new Emotion('one', []),
      two: new Emotion('two', []),
      three: new Emotion('three', []),
      four: new Emotion('four', []),
    }
    emotionController = new EmotionController(emotions, new MuscleController({}))
  })

  describe('setEmotion', () => {
    it('sets first emotion', () => {
      emotionController.setEmotion('one', 0.5)
      expect(emotionController.getEmotionSet()).toStrictEqual({ one: 0.5, two: 0, three: 0, four: 0 })
    })

    it('sets second emotion', () => {
      emotionController.setEmotion('one', 0.5)
      emotionController.setEmotion('two', 1.0)
      expect(emotionController.getEmotionSet()).toStrictEqual({ one: 0.5, two: 1.0, three: 0, four: 0 })
    })

    it('zeroes other emotions except the one set earliest', () => {
      emotionController.setEmotion('one', 0.5)
      emotionController.setEmotion('two', 1.0)
      expect(emotionController.getEmotionSet()).toStrictEqual({ one: 0.5, two: 1.0, three: 0, four: 0 })

      emotionController.setEmotion('three', 1.0)
      expect(emotionController.getEmotionSet()).toStrictEqual({ one: 0.5, two: 0, three: 1.0, four: 0 })

      emotionController.setEmotion('one', 0.0)
      emotionController.setEmotion('two', 1.0)
      expect(emotionController.getEmotionSet()).toStrictEqual({ one: 0.0, two: 1.0, three: 1.0, four: 0 })

      emotionController.setEmotion('four', 1.0)
      expect(emotionController.getEmotionSet()).toStrictEqual({ one: 0.0, two: 0, three: 1.0, four: 1.0 })
    })
  })
})
