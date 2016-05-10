import React from 'react'
import Header from './Header'
import ActiveSensorList from '../containers/ActiveSensorList'
import styles from '../style/components/App.scss'

const App = () => {
  return (
    <div className={styles.root}>
      <Header />
      <ActiveSensorList />
    </div>
  )
}

export default App
