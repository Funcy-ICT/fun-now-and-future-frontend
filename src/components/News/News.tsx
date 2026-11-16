import styles from "./News.module.css";
import { useEffect, useState } from "react";
import { getNews, type NewsAsset } from "../../api/api";

function News() {
  const [news, setNews] = useState<NewsAsset[]>([]);

  useEffect(() => {
    getNews()
      .then((response) => {
        setNews(response.assets);
      })
      .catch((error) => {
        console.error("ニュースの取得に失敗しました", error);
      });
  }, []);

  return (
    <section className={styles.news}>
      <h2>ニュース</h2>
      <ul>
        {news.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>

            {item.media.contentType.startsWith("image/") && (
              <img
                src={item.media.url}
                alt={item.title}
                width="300"
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default News;