import { ref, onMounted } from "vue"
import { defineStore } from "pinia"
import { Routine, RoutinesApi} from "@/api/routine";

export const UseRoutineStore = defineStore('routine', () => {
  const routines = ref([])
  const mostRecentRoutines = ref([])

  function addToRecent(routineID){
    if(mostRecentRoutines.value.indexOf(routineID) !== -1){
      removeFromRecent(routineID)
    }
    mostRecentRoutines.value.push(routineID)
    if(mostRecentRoutines.value.length > 5){
      mostRecentRoutines.value = mostRecentRoutines.value.slice(-5)
    }
    localStorage.setItem("mostRecentRoutines", JSON.stringify(mostRecentRoutines.value))
  }

  function removeFromRecent(routineID){
    const indexToRemove = mostRecentRoutines.value.indexOf(routineID)
    if(indexToRemove !== -1){
      mostRecentRoutines.value.splice(indexToRemove, 1)
    }
    localStorage.setItem("mostRecentRoutines", JSON.stringify(mostRecentRoutines.value))
  }

  async function getAll(controller = null) {
    let result = await RoutinesApi.getAll(controller);
    result = result.map((routine) => Object.assign(new Routine(), routine))
    routines.value = result
    return result
  }

  async function add(routine) {
    let result = await RoutinesApi.add(routine)
    result = Object.assign(new Routine(), result)
    routines.value.push(result)
    addToRecent(result.id)
    return result
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
    addToRecent(id)
    // result = { "result": boolean }
    return result
  }

  async function remove(id) {
    const result = await RoutinesApi.remove(id)
    if(result){
      routines.value = routines.value.filter( (routine) => routine.id !== id)
    }
    removeFromRecent(id)
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
    await RoutinesApi.execute(id)
    addToRecent(id)
  }

  onMounted( () => {
    mostRecentRoutines.value = JSON.parse(localStorage.getItem("mostRecentRoutines")) || []
  })

  return { getAll, get, add, execute, modify, remove, routines, mostRecentRoutines }
})
