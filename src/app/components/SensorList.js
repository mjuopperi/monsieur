import React from 'react'
import Sensor from './Sensor'
import AddSensor from './AddSensor'
import styles from '../style/components/SensorList.scss'

export const SensorList = ({ sensors, temperaturesBySensor, addSensorFormVisible,
                             isAdding, toggleAddSensorForm, postSensor }) => {
  return (
    <div className={styles.sensors}>
      <ul>
        {sensors.map(({name, id}) =>
          <Sensor
            key={id}
            name = {name}
            id = {id}
            temperatures = {temperaturesBySensor[id]}
          />
        )}
      </ul>
      <AddSensor
        formVisible={addSensorFormVisible}
        isAdding={isAdding}
        toggleAddSensorForm={toggleAddSensorForm}
        postSensor={postSensor}
      />
    </div>
  )
}

SensorList.propTypes = {
  sensors: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  })),
  temperaturesBySensor: React.PropTypes.object,
  addSensorFormVisible: React.PropTypes.bool.isRequired,
  isAdding: React.PropTypes.bool.isRequired,
  toggleAddSensorForm: React.PropTypes.func.isRequired,
  postSensor: React.PropTypes.func.isRequired
}

export default SensorList
