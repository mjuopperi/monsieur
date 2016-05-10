import React from 'react'
import styles from '../style/components/Spinner.scss'

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.r1}></div>
      <div className={styles.r2}></div>
      <div className={styles.r3}></div>
      <div className={styles.r4}></div>
      <div className={styles.r5}></div>
    </div>
  )
}

export default Spinner
