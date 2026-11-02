import styles from "./Bus.module.css";
import { useEffect, useState } from "react";
import { IconUsersGroup } from "@tabler/icons-react";
import { getCongestion, type CongestionStatus } from "../../api/api";

// TODO: バックエンドで定義されているバス停のlocation IDに合わせる
const LOCATION = "bus";
const FETCH_INTERVAL_MS = 60 * 1000;
const PERSON_COUNT = 10;
const MAX_LEVEL = 5;

const LEVEL_LABELS: Record<number, string> = {
  1: "空いています",
  2: "やや空き",
  3: "やや混雑",
  4: "混雑",
  5: "大変混雑",
};

function Person({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 20 36" fill="currentColor">
      <circle cx="10" cy="5" r="4.5" />
      <rect x="3" y="11" width="14" height="13" rx="4" />
      <rect x="4.5" y="20" width="4.5" height="16" rx="1.5" />
      <rect x="11" y="20" width="4.5" height="16" rx="1.5" />
    </svg>
  );
}

function Bus() {
  const [congestion, setCongestion] = useState<CongestionStatus | null>(null);

  useEffect(() => {
    const fetchCongestion = () => {
      getCongestion(LOCATION)
        .then((response) => setCongestion(response.data))
        .catch((error) => {
          console.error("バス停の混雑度の取得に失敗しました", error);
          setCongestion(null);
        });
    };

    fetchCongestion();
    const intervalId = setInterval(fetchCongestion, FETCH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const level = congestion?.level ?? null;
  const filled = level === null ? 0 : Math.round((level / MAX_LEVEL) * PERSON_COUNT);

  return (
    <section className={styles.bus}>
      <h2 className={styles.heading}>
        <IconUsersGroup className={styles.headingIcon} stroke={2.4} aria-hidden="true" />
        バス停の混雑状況
      </h2>

      <div className={styles.body}>
        <div className={styles.people} aria-hidden="true">
          {Array.from({ length: PERSON_COUNT }, (_, i) => (
            <Person
              key={i}
              className={i < filled ? styles.personActive : styles.person}
            />
          ))}
        </div>

        <div className={styles.status}>
          {level === null ? (
            <p className={styles.unavailable}>データを取得できません</p>
          ) : (
            <>
              <p className={styles.label}>{LEVEL_LABELS[level] ?? "—"}</p>
              <p className={styles.count}>現在{congestion?.uniqueDeviceCount}人待ち</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Bus;
