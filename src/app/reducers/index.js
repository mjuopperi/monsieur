import { combineReducers } from 'redux'
import sensors from './SensorReducers'
import temperaturesBySensor from './TemperatureReducers'

const rootReducer = combineReducers({
  sensors,
  temperaturesBySensor
})

export default rootReducer
