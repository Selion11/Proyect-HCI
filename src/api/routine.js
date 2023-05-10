import { Api } from "./api.js"

class RoutinesApi {
  static getURL(slug){
    return `${Api.baseURL}/routines${slug ? `/${slug}` : ""}`
  }

  static async getAll(){
    return await Api.get(RoutinesApi.getURL())
  }

  static async get(id){
    return await Api.get(RoutinesApi.getURL(id))
  }

  static async modify(routine){
    return await Api.put(RoutinesApi.getURL(routine.id), routine)
  }

  static async execute(id){
    return await Api.put(RoutinesApi.getURL(`${id}/execute`))
  }

  static async add(routine){
    return await Api.post(RoutinesApi.getURL(), routine)
  }

  static async remove(id){
    return await Api.delete(RoutinesApi.getURL(id))
  }
}

class Routine {
  constructor(name, actions, meta){
    this.name = name
    this.actions = actions
    this.meta = meta
  }
}
class RoutineActions{
  constructor(deviceId, actionName, params, meta){
    this.device = { id: deviceId }
    this.actionName = actionName
    this.params = params
    this.meta = meta
  }
}

class RoutineMeta {
  constructor(){
    return {}
  }
}

export { RoutinesApi, Routine, RoutineActions, RoutineMeta }
