
import { useEffect, useState } from "react";
import styles from "./NextBus.module.css";

import {
  WEEKDAY_TIMETABLE,
  WEEKEND_TIMETABLE,
} from "./timetable";

function getNextBus(currentTime: Date) {
  const dayOfWeek = currentTime.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const timetable = isWeekend ? WEEKEND_TIMETABLE : WEEKDAY_TIMETABLE;

  const nowInMinutes =
    currentTime.getHours() * 60 + currentTime.getMinutes();

  const nextBus = timetable.find((bus) => {
    const [hour, minute] = bus.time.split(":").map(Number);
    return hour * 60 + minute >= nowInMinutes;
  });

  if (!nextBus) {
    return {
      ...timetable[0],
      diffMinutes: 0,
      isNextDay: true,
    };
  }

  const [hour, minute] = nextBus.time.split(":").map(Number);
  const busInMinutes = hour * 60 + minute;

  return {
    ...nextBus,
    diffMinutes: busInMinutes - nowInMinutes,
    isNextDay: false,
  };
}

function NextBusInfo() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const nextBusInfo = getNextBus(currentTime);

  return (
    <div className={styles["next-bus-card"]}>
      <div className={styles["next-bus-header"]}>
        <svg
          className={styles["next-bus-icon"]}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4S4 2.5 4 6v10zm3.5 1A1.5 1.5 0 1 1 7.5 14a1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM6 6h12v5H6V6z" />
        </svg>

        <div className={styles["next-bus-heading"]}>
          <h2>次のバス</h2>
          <span>（{nextBusInfo.destination}）</span>
        </div>
      </div>

      <div className={styles["next-bus-body"]}>
        <span className={styles["next-bus-time"]}>
          {nextBusInfo.time}
        </span>
      </div>
    </div>
  );
}

export default NextBusInfo;
