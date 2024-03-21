// Image shim for headless test runner compatibility
const imageFromSrc = (src: string): HTMLImageElement => {
  if (typeof Image !== 'undefined') {
    const image = new Image()
    image.src = src
    return image
  }

  return {
    src,
    width: 0,
    height: 0,
  } as HTMLImageElement
}

export default class Overlay {
  id: string
  x: number
  y: number
  scale: number
  alpha: number
  data: string
  image: HTMLImageElement

  constructor(id: string, x: number, y: number, scale: number, alpha: number, data: string) {
    this.id = id
    this.x = x
    this.y = y
    this.scale = scale
    this.alpha = alpha
    this.data = data
    this.image = imageFromSrc(data)
  }

  drawInContext(context: CanvasRenderingContext2D): void {
    const width = this.image.width * this.scale
    const height = this.image.height * this.scale
    context.drawImage(this.image, this.x, this.y, width, height)
    this.image.onload = () => {
      this.drawInContext(context)
    }
  }
}
