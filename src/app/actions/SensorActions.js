import fetch from 'isomorphic-fetch'
import { post, del } from '../util'

export const TOGGLE_ADD_SENSOR_FORM = 'TOGGLE_ADD_SENSOR_FORM'
export const ADD_SENSOR = 'ADD_SENSOR'
export const SENSOR_ADDED = 'SENSOR_ADDED'
export const REMOVE_SENSOR = 'REMOVE_SENSOR'
export const SENSOR_REMOVED = 'SENSOR_REMOVED'
export const REQUEST_SENSORS = 'REQUEST_SENSORS'
export const RECEIVE_SENSORS = 'RECEIVE_SENSORS'

export const toggleAddSensorForm = () => {
  return {
    type: TOGGLE_ADD_SENSOR_FORM
  }
}

export const addSensor = (sensor) => {
  return {
    sensor: sensor,
    type: ADD_SENSOR
  }
}

export const sensorAdded = (sensor) => {
  return {
    sensor: sensor,
    type: SENSOR_ADDED
  }
}

export const removeSensor = (sensorId) => {
  return {
    sensorId: sensorId,
    type: REMOVE_SENSOR
  }
}

export const sensorRemoved = (sensorId) => {
  return {
    sensorId: sensorId,
    type: SENSOR_REMOVED
  }
}

export const requestSensors = () => {
  return {
    type: REQUEST_SENSORS
  }
}

export const receiveSensors = (json) => {
  return {
    type: RECEIVE_SENSORS,
    sensors: json.sensors,
    receivedAt: Date.now()
  }
}

export const postSensor = (sensor) => {
  return dispatch => {
    dispatch(addSensor(sensor))
    return post('/api/sensors', sensor)
      .then(response => response.json())
      .then(json => dispatch(sensorAdded(json)))
  }
}

export const deleteSensor = (sensorId) => {
  return dispatch => {
    dispatch(removeSensor(sensorId))
    return del(`/api/sensors/${sensorId}`)
      .then(() => dispatch(sensorRemoved(sensorId)))
  }
}

export const fetchSensors = () => {
  return dispatch => {
    dispatch(requestSensors())
    return fetch('/api/sensors')
      .then(response => response.json())
      .then(json => dispatch(receiveSensors(json)))
  }
}

const shouldFetchSensors = (state) => {
  const sensors = state.sensors
  return sensors && !sensors.isFetching
}

export const fetchSensorsIfNeeded = () => {
  return (dispatch, getState) => {
    if (shouldFetchSensors(getState())) {
      return dispatch(fetchSensors())
    } else {
      return Promise.resolve()
    }
  }
}
