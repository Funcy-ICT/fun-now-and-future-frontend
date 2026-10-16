import styles from "./Weather.module.css";

function Weather() {
  return (
    <section className={styles.weather}>
      <h2>天気</h2>
      <p>東京: 晴れ 22°C</p>
    </section>
  );
}

export default Weather;
