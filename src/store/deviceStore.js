// Utilities
import { ref, onMounted, watchEffect } from "vue";
import { defineStore } from 'pinia'
import { DevicesApi, Device, Log } from '@/api/device'

// Every store goes here, it can be divided by device type and a general store for
// grouping available products of the API
export const useDeviceStore = defineStore('devices', () =>{
  // State - ref
  const devices = ref([])
  const mostRecentDevices = ref([])


  function addRecent(deviceID){
    if(mostRecentDevices.value.indexOf(deviceID) !== -1){
      removeFromRecent(deviceID)
    }
    mostRecentDevices.value.push(deviceID)
    if(mostRecentDevices.value.length > 5){
      mostRecentDevices.value = mostRecentDevices.value.slice(-5)
    }
    localStorage.setItem("mostRecentDevices", JSON.stringify(mostRecentDevices.value))
  }

  function removeFromRecent(deviceID){
    const result = []
    mostRecentDevices.value.forEach( (id) => {
      if(id !== deviceID){
        result.push(id)
      }
    })
    mostRecentDevices.value = result
    localStorage.setItem("mostRecentDevices", JSON.stringify(mostRecentDevices.value))
  }

  async function getAll(controller = null) {
    let result = await DevicesApi.getAll(controller);
    result = result.map((device) => Object.assign(new Device(), device))
    devices.value = result
    return result
  }

  async function getAllByType(deviceTypeId) {
    let result = await DevicesApi.getAllByType(deviceTypeId)
    await getAll()
    result.map((device) => Object.assign(new Device(), device))
    return result
  }

  async function get(id) {
    let result = await DevicesApi.get(id)
    result = Object.assign(new Device(), result)
    devices.value.map( (device) => device["id"] === result.id ? result : device)
    return result
  }

  async function add(device) {
    let result = await DevicesApi.add(device)
    result = Object.assign(new Device(), result)
    devices.value.push(result)
    addRecent(result.id)
    return result
  }
  async function modify(id, device) {
    let result = await DevicesApi.modify(id, device)
    result = Object.assign(new Device(), result)
    devices.value.map( (device) => device["id"] === result.id ? result : device)
    addRecent(result.id)
    return result
  }

  async function execute(id, actionName, parameters) {
    // result = { "result": boolean }
    const result = await DevicesApi.execute(id, actionName, parameters)
    if(result) {
      const toUpdate = await get(id)
      devices.value.map((device) => device["id"] === toUpdate.id ? toUpdate : device)
      addRecent(id)
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
      removeFromRecent(id)
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

  onMounted( async () => {
    await getAll()
    setInterval(getAll, 15000)
    mostRecentDevices.value = JSON.parse(localStorage.getItem("mostRecentDevices")) || []
  })

  return { getAll, getAllByType, get, add, execute, modify, getLog, getLogs, getAllEvents, getDeviceEvents, getState, remove, devices, updateState, mostRecentDevices }
})
