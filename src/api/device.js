import { Api } from "./api.js"

class DevicesApi {
  static getURL(slug){
    return `${Api.baseURL}/devices${slug ? `/${slug}` : ""}`
  }

  // Retrieve all devices
  static async getAll(){
    return await Api.get(DevicesApi.getURL())
  }

  // Retrieve devices from specific device type
  static async getAllByType(deviceTypeId){
    return await Api.get(DevicesApi.getURL(`devicetypes/${deviceTypeId}`))
  }

  // Retrieve a specific device
  static async get(id){
    return await Api.get(DevicesApi.getURL(id))
  }

  // Retrieve events for all devices
  static async getAllEvents(){
    return await Api.get(DevicesApi.getURL(`events`))
  }

  // Retrieve logs for all devices
  static async getLogs(limit, offset){
    return await Api.get(DevicesApi.getURL(`logs/limit/${limit}/offset/${offset}`))
  }

  // Retrieve events for a specific device
  static async getEvent(id){
    return await Api.get(DevicesApi.getURL(`${id}/events`))
  }

  // Retrieve state of a specific device
  static async getState(id){
    return await Api.get(DevicesApi.getURL(`${id}/state`))
  }

  // Retrieve logs for a specific device
  static async getLog(id, limit, offset){
    return await Api.get(DevicesApi.getURL(`${id}/logs/limit/${limit}/offset/${offset}`))
  }

  // Creates a new device
  static async add(device) {
    return await Api.post(DevicesApi.getURL(), device)
  }

  // Updates an existing device
  static async modify(id, device){
    return await Api.put(DevicesApi.getURL(id), device)
  }

  // Executes action in a specific device
  static async execute(id, actionName, params){
    return await Api.put(DevicesApi.getURL(`${id}/${actionName}`), params)
  }

  // Delete an existing device
  static async remove(id){
    return await Api.delete(DevicesApi.getURL(id))
  }
}

class Device {
  constructor(id="", name= "", type= {}, state= {}, meta= {}) {
    this.id = id
    this.name = name
    this.type = type
    this.state = state
    this.meta = meta
  }

  toString() {
    return JSON.stringify(this, null, 2);
  }
}

class Log{
  constructor(timestamp, deviceId, action, params, result){
    this.timestamp = timestamp
    this.deviceId = deviceId
    this.action = action
    this.params = params
    this.result = result
  }
}

class Event{
  constructor(name, args){
    this.name = name
    this.args = args
  }
}

export { DevicesApi, Device, Log, Event }
