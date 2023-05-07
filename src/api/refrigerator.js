class RefrigeratorState {
  constructor(freezerTemperature, temperature, mode){
    this.freezerTemperature = freezerTemperature
    this.temperature = temperature
    this.mode = mode
  }
}

class RefrigeratorMeta {
  constructor(){
    return {}
  }
}

export { RefrigeratorState, RefrigeratorMeta }
