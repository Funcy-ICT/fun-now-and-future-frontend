import styles from "./Bus.module.css";

function Bus() {
  return (
    <section className={styles.bus}>
      <h2>バス時刻表</h2>
      <ul>
        <li>8:00発 学園前行き</li>
        <li>8:30発 駅前行き</li>
      </ul>
    </section>
  );
}

export default Bus;
