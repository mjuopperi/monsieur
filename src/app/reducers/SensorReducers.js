import { REQUEST_SENSORS, RECEIVE_SENSORS } from '../actions/SensorActions'

const sensors = (state = {
  isFetching: false,
  items: []
}, action) => {
  switch (action.type) {
  case REQUEST_SENSORS:
    return Object.assign({}, state, {
      isFetching: true
    })
  case RECEIVE_SENSORS:
    return Object.assign({}, state, {
      isFetching: false,
      items: action.sensors,
      lastUpdated: action.receivedAt
    })
  default:
    return state
  }
}

export default sensors
