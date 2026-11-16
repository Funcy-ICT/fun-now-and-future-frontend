import styles from "./News.module.css";
import { useEffect, useState } from "react";
import { IconEdit, IconSpeakerphone } from "@tabler/icons-react";
import { getNews, type NewsAsset } from "../../api/api";

const FETCH_INTERVAL_MS = 5 * 60 * 1000;
const SLIDE_INTERVAL_MS = 10 * 1000;

function TopicMedia({ item }: { item: NewsAsset }) {
  const { url, contentType } = item.media;
  if (contentType.startsWith("image/")) {
    return <img className={styles.media} src={url} alt={item.title} />;
  }
  if (contentType.startsWith("video/")) {
    return <video className={styles.media} src={url} autoPlay muted loop playsInline />;
  }
  return null;
}

function News() {
  const [news, setNews] = useState<NewsAsset[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchNews = () => {
      getNews()
        .then((response) => {
          setNews(response.assets);
        })
        .catch((error) => {
          console.error("ニュースの取得に失敗しました", error);
        });
    };

    fetchNews();
    const intervalId = setInterval(fetchNews, FETCH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (news.length <= 1) return;
    const intervalId = setInterval(() => {
      setIndex((i) => (i + 1) % news.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [news.length]);

  const current = news.length > 0 ? news[index % news.length] : null;

  return (
    <div className={styles.news}>
      <section className={styles.topics}>
        <h2 className={styles.heading}>
          <IconSpeakerphone className={styles.headingIcon} stroke={2.4} aria-hidden="true" />
          学内トピックス
        </h2>

        {current ? (
          <article key={current.id} className={styles.topic}>
            <div className={styles.topicText}>
              {current.tag && <span className={styles.tag}>{current.tag}</span>}
              <h3 className={styles.topicTitle}>{current.title}</h3>
              <p className={styles.topicDescription}>{current.description}</p>
            </div>
            <div className={styles.topicMedia}>
              <TopicMedia item={current} />
            </div>
          </article>
        ) : (
          <p className={styles.empty}>現在お知らせはありません</p>
        )}
      </section>

      <section className={styles.recruit}>
        <div className={styles.recruitText}>
          <h2 className={styles.heading}>
            <IconEdit className={styles.headingIcon} stroke={2.4} aria-hidden="true" />
            ニュースを募集しています！
          </h2>
          <p className={styles.recruitBody}>
            サークル・イベント・プロジェクトなどの
            <br />
            情報を投稿しよう！
          </p>
        </div>
        {/* 投稿フォームのURLが決まったらQRコード画像に差し替える */}
        <div className={styles.qr} aria-hidden="true">
          QR
        </div>
      </section>
    </div>
  );
}

export default News;
