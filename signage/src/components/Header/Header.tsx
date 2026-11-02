import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import Weather from "../Weather/Weather";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function formatDateTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${date.getMonth() + 1}月${date.getDate()}日（${WEEKDAYS[date.getDay()]}）${hours}:${minutes}`;
}

function Header() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo} />
        <h1 className={styles.title}>FunNAF</h1>
      </div>
      <div className={styles.right}>
        <Weather />
        <time className={styles.clock} dateTime={now.toISOString()}>
          {formatDateTime(now)}
        </time>
      </div>
    </header>
  );
}

export default Header;
