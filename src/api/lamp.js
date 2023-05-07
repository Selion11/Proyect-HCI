class LampState {
  constructor(status, color, brightness){
    this.status = status
    this.color = color
    this.brightness = brightness
  }
}

class LampMeta {
  constructor(){
    return {}
  }
}

export { LampState, LampMeta }
