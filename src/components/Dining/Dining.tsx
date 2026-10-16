import { useEffect, useMemo, useState } from "react";
import styles from "./Dining.module.css";
import { fetchDiningCongestion, type CongestionStatus } from "../../api/api";

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
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setError(error instanceof Error ? error.message : "食堂情報を取得できませんでした");
      } finally {
        setLoading(false);
      }
    }

    void loadDiningCongestion();

    return () => controller.abort();
  }, []);

  const level = data?.level ?? null;
  const fillPercent = level === null ? 0 : Math.round((level / 9) * 100);
  const levelText = useMemo(() => {
    if (!data) {
      return "情報を取得中です";
    }

    if (data.stale) {
      return data.level === null ? "更新が止まっています" : `レベル ${data.level} / 9 · 古いデータです`;
    }

    if (data.level === null) {
      return "基準値準備中です";
    }

    return `レベル ${data.level} / 9`;
  }, [data]);

  const updatedAt = useMemo(() => {
    if (!data?.windowStart) {
      return "更新時刻は未取得です";
    }

    const date = new Date(data.windowStart);

    if (Number.isNaN(date.getTime())) {
      return `窓: ${data.windowStart}`;
    }

    return `窓: ${date.toLocaleString("ja-JP")}`;
  }, [data?.windowStart]);

  const isBusy = level !== null && level >= 7;

  return (
    <section className={styles.dining}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Campus Dining</p>
          <h2>食堂の混雑度</h2>
        </div>
        <span className={styles.status}>{loading ? "更新中" : error ? "取得失敗" : "表示中"}</span>
      </div>

      <div className={styles.summary}>
        <div className={styles.rateBlock}>
          <span className={styles.rateValue}>{loading ? "--" : level === null ? "--" : level}</span>
          <span className={styles.rateLabel}>{levelText}</span>
        </div>

        <div className={styles.progressArea} aria-hidden="true">
          <div className={styles.progressTrack}>
            <div
              className={`${styles.progressFill} ${isBusy ? styles.busy : styles.normal}`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
          <div className={styles.scale}>
            <span>空いている</span>
            <span>混雑</span>
          </div>
        </div>
      </div>

      {error ? (
        <p className={styles.message}>{error}</p>
      ) : (
        <div className={styles.meta}>
          <div>
            <span className={styles.metaLabel}>対象</span>
            <strong className={styles.metaValue}>{loading ? "読み込み中" : "学内食堂 (cafeteria)"}</strong>
          </div>
          <div>
            <span className={styles.metaLabel}>取得窓</span>
            <strong className={styles.metaValue}>{loading ? "--" : updatedAt}</strong>
          </div>
          <div>
            <span className={styles.metaLabel}>検出端末数</span>
            <strong className={styles.metaValue}>{loading ? "--" : data?.uniqueDeviceCount ?? 0}</strong>
          </div>
          <div>
            <span className={styles.metaLabel}>状態</span>
            <strong className={styles.metaValue}>{loading ? "読み込み中" : levelText}</strong>
          </div>
        </div>
      )}
    </section>
  );
}

export default Dining;
