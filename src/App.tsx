import Weather from "./components/Weather/Weather";
import News from "./components/News/News";
import Bus from "./components/Bus/Businfo";
import Dining from "./components/Dining/Dining";

function App() {
  return (
    <main>
      <Weather />
      <News />
      <Bus />
      <Dining />
    </main>
  );
}

export default App;
