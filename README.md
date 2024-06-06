# Grimace

Grimace is a TypeScript library which display emotions through facial expressions. The face is drawn in a comic style and optimised to clearly express emotions. It uses a model of 6 basic emotions which can be mixed freely to achieve more complex emotions.

Grimace was started as a university project in 2008 and [originally developed in Flash / Actionscript 3](https://github.com/grimace-project/as3). It was later redeveloped as a native iPhone / iPad app. This TypeScript implementation is the third incarnation. The facial expressions are based on a chapter from [Scott McCloud's book "Making Comics"](https://www.scottmccloud.com/2-print/3-mc/index.html), who also provided helpful feedback during initial development.

Grimace found use in the education of persons with autism to help them better understand the facial expressions of others. It has also served as reference to artists when drawing facial expressions.

## Diversity note

Grimace displays a white, male face. This reflects the bias of the authors when they were university students back in 2008. The link between emotions and facial expressions is complex but there is strong evidence that many of these links are universal across cultures (cf [Paul Ekman's research](https://www.paulekman.com/resources/universal-facial-expressions/)). Grimace should therefore offer diverse options for the face. I decided to reimplement Grimace in TypeScript to make it available to the public once more but I haven't been able to provide alternative faces. If you'd like to collaborate on making Grimace more diverse, please get in touch.

## Getting started

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Grimace demo</title>
    <style>
      #grimace-container {
        width: 400px;
        height: 400px;
      }
    </style>
  </head>
  <body>
    <div id="grimace-container"></div>
    <script src="https://unpkg.com/grimace"></script>
    <script>
      const container = document.getElementById('grimace-container')
      const grimace = new Grimace(container)

      // set new set of emotions
      grimace.setEmotionSet({
        surprise: 0.75,
        joy: 0.75,
      })

      // display random emotion
      grimace.setRandomEmotionSet()

      // set "joy" to 50% with a transition period of 300 ms
      grimace.setEmotion('joy', 0.5, 0.3)

      // add a callback
      grimace.addListener(listener: Listener)
    </script>
  </body>
</html>
```

```ts
import Grimace from 'grimace'

// Instantiate Grimace with a reference to a DOM element.
// The face will scale to fill the available space so make sure that the container element has a size.
// It will start with a neutral expression.
const grimace = new Grimace(domContainerElement)
```
