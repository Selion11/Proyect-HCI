import { ref } from "vue"
import { defineStore } from "pinia"
import { Routine, RoutinesApi} from "@/api/routine";

export const UseRoutineStore = defineStore('routine', () => {
  const routines = ref([])

  async function getAll(controller = null) {
    let result = await RoutinesApi.getAll(controller);
    result = result.map((routine) => Object.assign(new Routine(), routine))
    routines.value = result
    return result
  }

  async function add(routine) {
    const result = await RoutinesApi.add(routine)
    routines.value.push(result)
    return Object.assign(new Routine(), result)
  }
  async function modify(id, newName, newActions) {
    // newActions = [{action1}, {action2}, ..., {actionN}] -> newActions.length > 0
    // actioni = {device: { id: deviceId }, actionName: newAction, params: [param1, param2, ..., paramN], meta: {}}
    const modified = {
      name: newName,
      actions: newActions,
      meta: {}
    }
    const result = await RoutinesApi.modify(id, modified)
    if(result){
      routines.value.map( (routine) => routine.id === id ? routine : new Routine(newName, newActions, {}))
    }
    // result = { "result": boolean }
    return result
  }

  async function remove(id) {
    const result = await RoutinesApi.remove(id)
    if(result){
      routines.value = routines.value.filter( (routine) => routine.id !== id)
    }
    // result = { "result": boolean }
    return result
  }
  async function get(id) {
    const result = routines.value.filter( (routine) => routine.id === id)[0]
    return Object.assign(new Routine(), result);
  }

  async function execute(id){
    // result = { "result": [boolean, boolean, ..., boolean] }
    // El orden de los booleanos es el orden de los dispositivos en la rutina
    return await RoutinesApi.execute(id)
  }

  return { getAll, get, add, execute, modify, remove, routines }
})
