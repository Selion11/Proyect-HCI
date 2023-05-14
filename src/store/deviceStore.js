// Utilities
import { ref, onMounted } from "vue";
import { defineStore } from 'pinia'
import { DevicesApi, Device, Log } from '@/api/device'
import {de} from "vuetify/locale";

// Every store goes here, it can be divided by device type and a general store for
// grouping available products of the API
export const useDeviceStore = defineStore('devices', () =>{
  // State - ref
  const devices = ref([])
  const events = ref([])
  const mostRecentDevices = ref([])
  let oldestIdx = 0


  async function addRecent(deviceID){
    mostRecentDevices[oldestIdx] = get(deviceID)
    if(oldestIdx === 4){
      oldestIdx = 0
    }else
      oldestIdx += 1
  }

  async function removeFromRecent(deviceID){
    let i = 0
    while(i < 5){
      if(mostRecentDevices[i] === deviceID){
        let j = i
        for(j;j < 4;j++){
          mostRecentDevices[j] = mostRecentDevices[j+1]
        }
        mostRecentDevices[4] = null
        i = 5
      }
      i += 1
    }
  }

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
    return result
  }

  async function get(id) {
    const result = await DevicesApi.get(id);
    return Object.assign(new Device(), result)
  }

  async function add(device) {
    let result = await DevicesApi.add(device)
    result = Object.assign(new Device(), result)
    devices.value.push(result)
    return result
  }
  async function modify(id, device) {
    let result = await DevicesApi.modify(id, device)
    result = Object.assign(new Device(), result)
    devices.value.map( (device) => device["id"] === result.id ? result : device)
    return result
  }

  async function execute(id, actionName, parameters) {
    // result = { "result": boolean }
    const result = await DevicesApi.execute(id, actionName, parameters)
    if(result) {
      const toUpdate = await get(id)
      devices.value.map((device) => device["id"] === toUpdate.id ? toUpdate : device)
    }
    return result
  }

  async function getLog(id, limit, offset){
    let result = await DevicesApi.getLog(id, limit, offset)
    await getAll()
    result = result.map((log) => Object.assign(new Log(), log))
    return result
  }

  async function getLogs(limit, offset){
    let result = await DevicesApi.getLogs(limit, offset)
    await getAll()
    result = result.map((log) => Object.assign(new Log(), log))
    return result
  }

  function getAllEvents(){
    return DevicesApi.getAllEvents()
  }

  function getDeviceEvents(id){
    return DevicesApi.getDeviceEvents(id)
  }

  async function getState(id){
    return await DevicesApi.getState(id)
  }

  async function remove(id) {
    const result = await DevicesApi.remove(id)
    // result = { "result": boolean }
    if(result){
      devices.valiue = devices.value.filter( (device) => device["id"] !== id)
    }
    return result
  }

  function updateState(id, state){
    devices.value.map((device) => {
      if(device["id"] === id){
        device.state = state
      }
    })
  }

  onMounted( () => {
    setInterval(getAll, 10000)
  })

  return { getAll, getAllByType, get, add, execute, modify, getLog, getLogs, getAllEvents, getDeviceEvents, getState, remove, devices, events }
})
