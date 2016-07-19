import { TOGGLE_ADD_SENSOR_FORM, ADD_SENSOR, SENSOR_ADDED,
         REQUEST_SENSORS, RECEIVE_SENSORS } from '../actions/SensorActions'

const sensors = (state = {
  formVisible: false,
  isAdding: false,
  isFetching: false,
  items: []
}, action) => {
  switch (action.type) {
  case TOGGLE_ADD_SENSOR_FORM:
    return Object.assign({}, state, {
      formVisible: !state.formVisible
    })
  case ADD_SENSOR:
    return Object.assign({}, state, {
      isAdding: true
    })
  case SENSOR_ADDED:
    return Object.assign({}, state, {
      items: state.items.concat(action.sensor),
      isAdding: false,
      formVisible: false
    })
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
