import { connect } from 'react-redux'
import { toggleAddSensorForm, postSensor } from '../actions/SensorActions'
import SensorList from '../components/SensorList'

const mapStateToProps = (state) => {
  return {
    sensors: state.sensors.items,
    temperaturesBySensor: state.temperaturesBySensor,
    addSensorFormVisible: state.sensors.formVisible,
    isAdding: state.sensors.isAdding
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAddSensorForm: () => dispatch(toggleAddSensorForm()),
    postSensor: (sensor) => dispatch(postSensor(sensor))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SensorList)
