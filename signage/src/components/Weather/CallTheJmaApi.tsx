import { useState, useEffect } from 'react';
import ShowWeatherIcon from './ShowWeatherIcon'

type JmaForecast = {
  timeSeries: {
    areas: {
      weatherCodes: string[]
    }[]
  }[]
}[]

export default function CallTheJmaApi() {
    const [weatherCode, setWeatherCode] = useState<string | null>(null);

    useEffect(() => {
        const parse_api = (a: JmaForecast) => {
            const today_weatherCode = a[0].timeSeries[0].areas[0].weatherCodes[0];
            setWeatherCode(today_weatherCode);
        }

        const getapi = async () => {
            try {
                const response = await fetch('https://www.jma.go.jp/bosai/forecast/data/forecast/017000.json');
                const data = await response.json();
                parse_api(data);
            } catch {
                setWeatherCode(null);
            }
        }

        getapi();
        const intervalId = setInterval(() => {
            getapi();
        }, 60000);
        return () => clearInterval(intervalId);
    }, [])

    return (
        <>
        {weatherCode && <ShowWeatherIcon code={weatherCode} />}
        </>
    )
}
