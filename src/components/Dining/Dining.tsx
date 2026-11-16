import { useEffect, useMemo, useState } from "react";
import styles from "./Dining.module.css";
import { fetchDiningCongestion, type CongestionStatus } from "../../api/api";
import calmImage from "../../assets/calm.png";
import moderateImage from "../../assets/moderate.png";
import crowdedImage from "../../assets/crowded.png";
import diningIconImage from "../../assets/dining_icon.png";

function Dining() {
  const [data, setData] = useState<CongestionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDiningCongestion() {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchDiningCongestion(controller.signal);
        setData(result);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(err instanceof Error ? err.message : "食堂情報を取得できませんでした");
      } finally {
        setLoading(false);
      }
    }

    void loadDiningCongestion();

    return () => controller.abort();
  }, []);

  const statusInfo = useMemo(() => {
    if (loading) {
      return {
        status: "読み込み中",
        waitTime: "待ち時間を確認中",
        tone: "loading",
      };
    }

    if (error) {
      return {
        status: "取得失敗",
        waitTime: "しばらくしてから再試行",
        tone: "busy",
      };
    }

    if (!data) {
      return {
        status: "情報なし",
        waitTime: "--",
        tone: "loading",
      };
    }

    if (data.level === null) {
      return {
        status: "基準値準備中",
        waitTime: "待ち時間は未定",
        tone: "loading",
      };
    }

    if (data.level <= 3) {
      return {
        status: "空いています",
        waitTime: "待ち時間0〜3分",
        tone: "empty",
      };
    }

    if (data.level <= 6) {
      return {
        status: "やや混雑",
        waitTime: "待ち時間3〜8分",
        tone: "moderate",
      };
    }

    return {
      status: "混雑しています",
      waitTime: "待ち時間8分以上",
      tone: "busy",
    };
  }, [data, error, loading]);

  const imageSrc =
    statusInfo.tone === "empty"
      ? calmImage
      : statusInfo.tone === "moderate"
        ? moderateImage
        : crowdedImage;

  return (
    <section className={styles.diningCard} aria-label="食堂の混雑状況">
      <div className={styles.headerRow}>
        <img className={styles.titleIcon} src={diningIconImage} alt="食堂アイコン" aria-hidden="true" />
        <h2>食堂の混雑状況</h2>
      </div>

      <div className={styles.contentRow}>
        <div className={`${styles.faceCard} ${styles[statusInfo.tone]}`} aria-hidden="true">
          <img className={styles.statusImage} src={imageSrc} alt={statusInfo.status} />
        </div>

        <div className={styles.textBlock}>
          <p className={styles.status}>{statusInfo.status}</p>
          <p className={styles.waitTime}>{statusInfo.waitTime}</p>
        </div>
      </div>
    </section>
  );
}

export default Dining;
