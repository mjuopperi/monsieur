import fetch from 'isomorphic-fetch'
import moment from 'moment'

export const REQUEST_TEMPERATURES = 'REQUEST_TEMPERATURES'
export const RECEIVE_TEMPERATURES = 'RECEIVE_TEMPERATURES'

export const requestTemperatures = sensorId => {
  return {
    type: REQUEST_TEMPERATURES,
    sensorId
  }
}

export const receiveTemperatures = (sensorId, json) => {
  return {
    type: RECEIVE_TEMPERATURES,
    sensorId,
    temperatures: json.temperatures,
    receivedAt: Date.now()
  }
}

const fetchTemperatures = sensorId => {
  const end = moment()
  const start = moment(end).subtract(6, 'hours')
  return dispatch => {
    dispatch(requestTemperatures(sensorId))
    return fetch(`/api/temperatures/${sensorId}/${start}-${end}`)
      .then(response => response.json())
      .then(json => dispatch(receiveTemperatures(sensorId, json)))
  }
}

const shouldFetchTemperatures = (state, sensorId) => {
  const temperatures = state.temperaturesBySensor[sensorId]
  if (!temperatures) return true
  else return !temperatures.isFetching
}

export const fetchTemperaturesIfNeeded = sensorId => {
  return (dispatch, getState) => {
    if (shouldFetchTemperatures(getState(), sensorId)) {
      return dispatch(fetchTemperatures(sensorId))
    } else {
      return Promise.resolve()
    }
  }
}
