import { Api } from "./api.js"

// Falta implementar GET /devices/logs/limit/{limit}/offset/{offset
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
    return await Api.get(DevicesApi.getURL(`deviceType/${deviceTypeId}`))
  }

  // Retrieve a specific device
  static async get(id){
    return await Api.get(DevicesApi.getURL(id))
  }

  // Retrieve events for all devices
  static async getAllEvents(){
    return await Api.get(DevicesApi.getURL(`/events`))
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
  static async add(device){
    return await Api.post(DevicesApi.getURL(), device)
  }

  // Updates an existing device
  static async modify(device){
    return await Api.put(DevicesApi.getURL(device.id), device)
  }

  // Executes action in a specific device
  static async execute(id, actionName, params){
    return await Api.put(DevicesApi.getURL(`${id}/${actionName}`), parameters)
  }

  // Delete an existing device
  static async remove(id){
    return await Api.delete(DevicesApi.getURL(id))
  }
}

class Type {
  constructor(id, name, powerUsage){
    if(id){
      this.id = id
    }
    this.name = name
    this.powerUsage = powerUsage
  }
}

class Device {
  constructor(id, name, type, state, meta) {
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
    this.name
    this.args
  }
}

export { DevicesApi, Type, Device, Log, Event }
