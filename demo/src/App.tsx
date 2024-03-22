import { useEffect, useRef, useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import './App.css'
import Grimace, { EmotionSet } from '../../src'

type EmotionSliderProps = {
  emotion: string
  label: string
  onChange: (value: number) => void
  value: number | undefined
}

function EmotionSlider(props: EmotionSliderProps) {
  const sliderValue = 100 * (props.value || 0)
  return (
    <div className="slider-wrapper">
      <Slider
        onChange={(value) => {
          if (typeof value === 'number') {
            props.onChange(value / 100)
          }
        }}
        className="slider"
        value={sliderValue}
      />
      {props.label}
    </div>
  )
}

function App() {
  const containerRef = useRef(null)
  const grimaceRef = useRef(null)
  const [joy, setJoy] = useState<number>()
  const [surprise, setSurprise] = useState<number>()
  const [fear, setFear] = useState<number>()
  const [sadness, setSadness] = useState<number>()
  const [disgust, setDisgust] = useState<number>()
  const [anger, setAnger] = useState<number>()

  const handleEmotionChange = (emotions: EmotionSet) => {
    setJoy(emotions.joy)
    setSurprise(emotions.surprise)
    setFear(emotions.fear)
    setSadness(emotions.sadness)
    setDisgust(emotions.disgust)
    setAnger(emotions.anger)

    Object.entries(emotions).reduce((res, [id, value]) => {
      if (value > 0) {
        res[id] = value
      }
      return res
    }, {} as { [key: string]: number })
  }

  useEffect(() => {
    if (!grimaceRef.current) {
      const grimace = new Grimace(containerRef.current)
      grimace.addListener(handleEmotionChange)
      grimaceRef.current = grimace
    }
  }, [])

  const handleRandomizeClick = () => {
    if (grimaceRef.current) {
      ;(grimaceRef.current as Grimace).setRandomEmotionSet()
    }
  }

  const handleChange = (emotion: string, value: number) => {
    if (grimaceRef.current) {
      grimaceRef.current.setEmotion(emotion, value)
    }
  }

  return (
    <>
      <div className="container" ref={containerRef}></div>
      <div className="controls">
        <div className="slider-container">
          <EmotionSlider
            emotion="joy"
            label="Joy"
            value={joy}
            onChange={(value) => {
              handleChange('joy', value)
            }}
          />
          <EmotionSlider
            emotion="surprise"
            label="Surprise"
            value={surprise}
            onChange={(value) => {
              handleChange('surprise', value)
            }}
          />
          <EmotionSlider
            emotion="fear"
            label="Fear"
            value={fear}
            onChange={(value) => {
              handleChange('fear', value)
            }}
          />
          <EmotionSlider
            emotion="sadness"
            label="Sadness"
            value={sadness}
            onChange={(value) => {
              handleChange('sadness', value)
            }}
          />
          <EmotionSlider
            emotion="disgust"
            label="Disgust"
            value={disgust}
            onChange={(value) => {
              handleChange('disgust', value)
            }}
          />
          <EmotionSlider
            emotion="anger"
            label="Anger"
            value={anger}
            onChange={(value) => {
              handleChange('anger', value)
            }}
          />
          <button className="randomize" onClick={handleRandomizeClick}>
            Randomize
          </button>
        </div>
      </div>
    </>
  )
}

export default App
