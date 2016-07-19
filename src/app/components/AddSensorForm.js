import React from 'react'
import styles from '../style/components/AddSensorForm.scss'

const submitForm = (e, postSensor, name, id) => {
  e.preventDefault()
  if (!name.value.trim() || !id.value.trim()) return
  postSensor({
    name: name.value,
    id: id.value
  })
}

const canSubmit = (isAdding) => !isAdding

export const AddSensor = ({ isAdding, toggleAddSensorForm, postSensor }) => {
  let name, id

  return (
    <div className={styles.addSensorForm}>
      <form onSubmit={(e) => submitForm(e, postSensor, name, id)}>
        <div className={styles.info}>
          <div className={styles.inputContainer}>
            <input ref={node => {name = node}} type='text' id='sensor-name' name='name' placeholder='Living Room' />
            <label htmlFor='sensor-name'>Sensor name:</label>
          </div>
          <div className={styles.inputContainer}>
            <input ref={node => {id = node}} type='text' id='sensor-id' name='id' placeholder='28-03146244b6fa' />
            <label htmlFor='sensor-id'>Sensor id:</label>
          </div>
        </div>
        <div className={styles.buttons}>
          <button type='button' className={styles.cancel} onClick={toggleAddSensorForm}><span>Cancel</span></button>
          <button type='submit' className={styles.save} disabled={!canSubmit(isAdding)}><span>Save</span></button>
        </div>
      </form>
    </div>
  )
}

AddSensor.propTypes = {
  toggleAddSensorForm: React.PropTypes.func.isRequired,
  postSensor: React.PropTypes.func.isRequired
}

export default AddSensor
