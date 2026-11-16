import styles from './Weather.module.css'
import CallTheJmaApi from './CallTheJmaApi'

export default function Weather() {
  return (
    <>
      <div className={styles.square3}>
        {/* <p>天気</p> */}
        <CallTheJmaApi />
      </div>
    </>
  )
}
