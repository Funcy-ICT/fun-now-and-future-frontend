import jmaTelops from './jmaTelops.json'
import { getIconsFromJmaFileName } from './JMAWeatherIcon_FontAwesome'

type ShowWeatherIconProps = {
  code: string
}

const telops = jmaTelops as unknown as Record<string, string[]>

export default function ShowWeatherIcon({ code }: ShowWeatherIconProps) {
  const weathercodeFound = telops[code];
  if (!weathercodeFound) {
    return null;
  }

  const nowTime = new Date();
  const picturecode =
    nowTime.getHours() < 18 && nowTime.getHours() > 9
      ? weathercodeFound[0]
      : weathercodeFound[1];

  const { before: BeforeIcon, after: AfterIcon } =
    getIconsFromJmaFileName(picturecode);

  return (
    <span className="weather-icons">
      {BeforeIcon && <BeforeIcon className="weather-icon" aria-hidden="true" />}
      {AfterIcon && <AfterIcon className="weather-icon" aria-hidden="true" />}
    </span>
  )
}
