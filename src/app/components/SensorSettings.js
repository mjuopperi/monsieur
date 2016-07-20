import React from 'react'
import Icon from './Icon'
import styles from '../style/components/SensorSettings.scss'

const Button = ({text, icon, className, onClick}) => (
  <button type='button' className={className} onClick={onClick}>
    <span>{text}</span>
    <Icon name={icon}/>
  </button>
)

const Controls = ({editing, toggleEditing, deleteSensor}) => {
  if (editing) {
    return (
      <div>
        <Button text='Delete' icon='delete' className={styles.delete} onClick={() => deleteSensor()}/>
        <Button text='Close' icon='close' className={styles.close} onClick={() => toggleEditing()}/>
      </div>
    )
  } else {
    return <Button text='Edit' icon='edit' className={styles.edit} onClick={() => toggleEditing()}/>
  }
}

class SensorSettings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {editing: false}
  }
  toggleEditing() {this.setState({editing: !this.state.editing})}
  render() {
    return (
      <div className={styles.settings}>
        <Controls
          editing={this.state.editing}
          toggleEditing={this.toggleEditing.bind(this)}
          deleteSensor={this.props.deleteSensor}
        />
      </div>
    )
  }
}

SensorSettings.propTypes = {
  deleteSensor: React.PropTypes.func.isRequired
}

export default SensorSettings
