import { connect } from 'react-redux'
import SensorList from '../components/SensorList'

const mapStateToProps = (state) => {
  return {
    sensors: state.sensors.items,
    temperaturesBySensor: state.temperaturesBySensor
  }
}

export default connect(mapStateToProps)(SensorList)
