import styles from "./Dining.module.css";
import { useEffect, useState } from "react";
import {
  IconMoodEmpty,
  IconMoodSad,
  IconMoodSmile,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import { getCongestion, type Congestion } from "../../api/api";

// TODO: バックエンドで定義されている食堂のlocation IDに合わせる
const LOCATION = "dining";
const FETCH_INTERVAL_MS = 60 * 1000;

const LEVEL_DISPLAY: Record<number, { label: string; waitTime: string }> = {
  1: { label: "空いています", waitTime: "0~3分" },
  2: { label: "やや空き", waitTime: "3~5分" },
  3: { label: "やや混雑", waitTime: "5~10分" },
  4: { label: "混雑", waitTime: "10~15分" },
  5: { label: "大変混雑", waitTime: "15分以上" },
};

function Mood({ level }: { level: number }) {
  const props = { className: styles.mood, stroke: 2, "aria-hidden": true };
  if (level <= 2) return <IconMoodSmile {...props} />;
  if (level === 3) return <IconMoodEmpty {...props} />;
  return <IconMoodSad {...props} />;
}

function Dining() {
  const [congestion, setCongestion] = useState<Congestion | null>(null);

  useEffect(() => {
    const fetchCongestion = () => {
      getCongestion(LOCATION)
        .then((response) => setCongestion(response.data))
        .catch((error) => {
          console.error("食堂の混雑度の取得に失敗しました", error);
          setCongestion(null);
        });
    };

    fetchCongestion();
    const intervalId = setInterval(fetchCongestion, FETCH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const level = congestion?.level ?? null;
  const display = level === null ? undefined : LEVEL_DISPLAY[level];

  return (
    <section className={styles.dining}>
      <h2 className={styles.heading}>
        <IconToolsKitchen2 className={styles.headingIcon} stroke={2.4} aria-hidden="true" />
        食堂の混雑状況
      </h2>

      <div className={styles.body}>
        {level !== null && display ? (
          <>
            <Mood level={level} />
            <div className={styles.status}>
              <p className={styles.label}>{display.label}</p>
              <p className={styles.waitTime}>待ち時間{display.waitTime}</p>
            </div>
          </>
        ) : (
          <p className={styles.unavailable}>データを取得できません</p>
        )}
      </div>
    </section>
  );
}

export default Dining;
