import styles from "./News.module.css";

function News() {
  return (
    <section className={styles.news}>
      <h2>ニュース</h2>
      <ul>
        <li>サンプルニュース1</li>
        <li>サンプルニュース2</li>
      </ul>
    </section>
  );
}

export default News;
