// Utilities
import {ref} from "vue";
import { defineStore } from 'pinia'
import { DevicesApi, Device, Log, Event} from '@/api/device'
import { SpeakerState } from '@/api/speaker'
import { ACState } from "@/api/ac"
import { FaucetState } from "@/api/faucet"
import { LampState } from "@/api/lamp"
import { RefrigeratorState } from "@/api/refrigerator"

// Every store goes here, it can be divided by device type and a general store for
// grouping available products of the API
export const useDeviceStore = defineStore('devices', () =>{
  // State - ref
  const devices = ref([])

  async function getAll(controller = null) {
    let result = await DevicesApi.getAll(controller);
    result = result.map((device) => Object.assign(new Device(), device))
    devices.value = result
    return result
  }

  async function getAllByType(deviceTypeId) {
    let result = await DevicesApi.getAllByType(deviceTypeId);
    result.map((device) => Object.assign(new Device(), device))
    await getAll()
    await getAllEvents()
    return result
  }

  async function get(id) {
    const result = await DevicesApi.get(id);
    await getAll()
    await getAllEvents()
    return Object.assign(new Device(), result)
  }

  async function add(device) {
    const result = await DevicesApi.add(device)
    await getAll()
    await getAllEvents()
    return Object.assign(new Device(), device)
  }
  async function modify(device) {
    const result = await DevicesApi.modify(device)
    await getAll()
    await getAllEvents()

    // result = { "result": [boolean, boolean, ..., boolean] }
    // El orden de los booleanos es el orden de los dispositivos en la rutina
    return result
  }

  async function execute(id, actionName, parameters) {
    const result = await DevicesApi.execute(id, actionName, parameters)
    await getAll()
    await getAllEvents()

    // result = { "result": [boolean, boolean, ..., boolean] }
    // El orden de los booleanos es el orden de los dispositivos en la rutina
    return result
  }

  async function getLog(id, limit, offset){
    let result = await DevicesApi.getLog(id, limit, offset)
    await getAll()
    await getAllEvents()
    result = result.map((log) => Object.assign(new Log(), log))
    return result
  }

  async function getLogs(limit, offset){
    let result = await DevicesApi.getLogs(limit, offset)
    await getAll()
    await getAllEvents()
    result = result.map((log) => Object.assign(new Log(), log))
    return result
  }

  async function getAllEvents(){
    let result = await DevicesApi.getAllEvents()
    result = result.map((event) => Object.assign(new Event(), event))
    return result
  }

  async function getEvent(id){
    const result = await DevicesApi.getEvent(id)
    await getAll()
    await getAllEvents()
    return Object.assign(new Event(), result)
  }

  async function getState(id){
    const result = await DevicesApi.getState(id)
    let aux = await DevicesApi.get(id)
    await getAll()
    await getAllEvents()
    aux = Object.assign(new Device(), aux)
    switch(aux.type.name){
      case "speaker": return Object.assign(new SpeakerState(), result)
      case "ac": return Object.assign(new ACState(), result)
      case "lamp": return Object.assign(new LampState(), result)
      case "faucet": return Object.assign(new FaucetState(), result)
      case "refrigerator": return Object.assing(new RefrigeratorState(), result)
    }
  }

  async function remove(id) {
    const result = await DevicesApi.remove(id)
    await getAll()
    await getAllEvents()

    // result = { "result": [boolean, boolean, ..., boolean] }
    // El orden de los booleanos es el orden de los dispositivos en la rutina
    return result
  }

  return {getAll, get, add, execute, modify, remove}
})
