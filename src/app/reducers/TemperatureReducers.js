import { REQUEST_TEMPERATURES, RECEIVE_TEMPERATURES } from '../actions/TemperatureActions'

const temperatures = (state = {
  isFetching: false,
  items: []
}, action) => {
  switch (action.type) {
  case REQUEST_TEMPERATURES:
    return Object.assign({}, state, {
      isFetching: true
    })
  case RECEIVE_TEMPERATURES:
    return Object.assign({}, state, {
      isFetching: false,
      items: action.temperatures,
      latest: action.temperatures[action.temperatures.length - 1],
      lastUpdated: action.receivedAt
    })
  default:
    return state
  }
}

const temperaturesBySensor = (state = {}, action) => {
  switch (action.type) {
  case REQUEST_TEMPERATURES:
  case RECEIVE_TEMPERATURES:
    return Object.assign({}, state, {
      [action.sensorId]: temperatures(state[action.sensorId], action)
    })
  default:
    return state
  }
}

export default temperaturesBySensor
