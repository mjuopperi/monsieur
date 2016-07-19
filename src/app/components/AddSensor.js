import React from 'react'
import Icon from './Icon'
import AddSensorForm from './AddSensorForm'
import styles from '../style/components/AddSensor.scss'

const content = (formVisible, isAdding, toggleAddSensorForm, postSensor) => {
  if (formVisible) return (
    <AddSensorForm
      isAdding={isAdding}
      toggleAddSensorForm={toggleAddSensorForm}
      postSensor={postSensor}
    />
  )
  else return (
    <button className={styles.addSensor} onClick={toggleAddSensorForm}>
      <Icon name='thermometer'/>
      <span>Add Sensor</span>
    </button>
  )
}

export const AddSensor = ({ formVisible, isAdding, toggleAddSensorForm, postSensor }) => {
  return (
    <div className={styles.addSensor}>
      {content(formVisible, isAdding, toggleAddSensorForm, postSensor)}
    </div>
  )
}

AddSensor.propTypes = {
  formVisible: React.PropTypes.bool.isRequired,
  isAdding: React.PropTypes.bool.isRequired,
  toggleAddSensorForm: React.PropTypes.func.isRequired,
  postSensor: React.PropTypes.func.isRequired
}

export default AddSensor
