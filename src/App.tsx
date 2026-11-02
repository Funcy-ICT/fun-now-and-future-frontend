import styles from "./App.module.css";
import Header from "./components/Header/Header";
import News from "./components/News/News";
import Bus from "./components/Bus/Bus";
import Dining from "./components/Dining/Dining";

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <News />
        <div className={styles.side}>
          <Bus />
          <Dining />
        </div>
      </main>
    </div>
  );
}

export default App;
