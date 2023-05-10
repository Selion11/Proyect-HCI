class ACState {
  constructor(status, temperature, mode, verticalSwing, horizontalSwing, fanSpeed){
    this.status = status
    this.temperature = temperature
    this.mode = mode
    this.verticalSwing = verticalSwing
    this.horizontalSwing = horizontalSwing
    this.fanSpeed = fanSpeed
  }
}

class ACMeta {
  constructor(){
    return {}
  }
}

export { ACState, ACMeta }
