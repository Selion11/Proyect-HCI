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
    await getAll()
    return Object.assign(new Routine(), result)
  }
  async function modify(routine) {
    const result = await RoutinesApi.modify(routine)
    await getAll()

    // result = { "result": [boolean, boolean, ..., boolean] }
    // El orden de los booleanos es el orden de los dispositivos en la rutina
    return result
  }

  async function remove(id) {
    const result = await RoutinesApi.remove(id)
    await getAll()

    // result = { "result": [boolean, boolean, ..., boolean] }
    // El orden de los booleanos es el orden de los dispositivos en la rutina
    return result
  }
  async function get(id) {
    const result = await RoutinesApi.get(id);
    await getAll()
    return Object.assign(new Routine(), result);
  }

  async function execute(id){
    const result = await RoutinesApi.execute(id)
    await getAll()

    // result = { "result": [boolean, boolean, ..., boolean] }
    // El orden de los booleanos es el orden de los dispositivos en la rutina
    return result
  }

  return {getAll, get, add, execute, modify, remove}
})
