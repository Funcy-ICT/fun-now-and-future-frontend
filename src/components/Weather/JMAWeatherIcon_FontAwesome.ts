/*----------------------------------------------------------------
- JMAの天気アイコンとTabler Iconsの関係性を定義
- JMAの利用規約に抵触しないため，ディスプレイにJMAの天気アイコンを使用しない
----------------------------------------------------------------*/

import type { ComponentType, SVGProps } from 'react'
import {
  IconCloud,
  IconCloudRain,
  IconCloudSnow,
  IconMoon,
  IconQuestionMark,
  IconSnowflake,
  IconSun,
  IconWind,
} from '@tabler/icons-react'

type JmaIcon = ComponentType<SVGProps<SVGSVGElement>>

type JmaIconMapping = {
  before: JmaIcon
  after: JmaIcon | null
}

// JMA画像ファイル名 -> { before, after }
export const JMA_IMAGE_TO_ICON: Record<string, JmaIconMapping> = {
  // 晴系
  '100.svg': { before: IconSun, after: null },
  '101.svg': { before: IconSun, after: IconCloud },
  '102.svg': { before: IconCloudRain, after: null },
  '104.svg': { before: IconSun, after: IconSnowflake },
  '110.svg': { before: IconSun, after: IconCloud },
  '112.svg': { before: IconSun, after: IconCloudRain },
  '115.svg': { before: IconSun, after: IconSnowflake },

  // 曇系
  '200.svg': { before: IconCloud, after: null },
  '201.svg': { before: IconCloud, after: IconSun },
  '202.svg': { before: IconCloudRain, after: null },
  '204.svg': { before: IconCloudSnow, after: null },
  '210.svg': { before: IconCloud, after: IconSun },
  '212.svg': { before: IconCloud, after: IconCloudRain },
  '215.svg': { before: IconCloud, after: IconSnowflake },

  // 雨系
  '300.svg': { before: IconCloudRain, after: null },
  '301.svg': { before: IconCloudRain, after: null },
  '302.svg': { before: IconCloudRain, after: null },
  '303.svg': { before: IconCloudSnow, after: null },
  '308.svg': { before: IconWind, after: null },
  '311.svg': { before: IconCloudRain, after: IconSun },
  '313.svg': { before: IconCloudRain, after: IconCloud },
  '314.svg': { before: IconCloudRain, after: IconSnowflake },

  // 雪系
  '400.svg': { before: IconSnowflake, after: null },
  '401.svg': { before: IconCloudSnow, after: null },
  '402.svg': { before: IconSnowflake, after: null },
  '403.svg': { before: IconCloudSnow, after: null },
  '406.svg': { before: IconWind, after: null },
  '411.svg': { before: IconSnowflake, after: IconSun },
  '413.svg': { before: IconSnowflake, after: IconCloud },
  '414.svg': { before: IconSnowflake, after: IconCloudRain },

  // 夜間系
  '500.svg': { before: IconMoon, after: null },
  '501.svg': { before: IconMoon, after: IconCloud },
  '502.svg': { before: IconCloudRain, after: null },
  '504.svg': { before: IconMoon, after: IconSnowflake },
  '510.svg': { before: IconMoon, after: IconCloud },
  '512.svg': { before: IconMoon, after: IconCloudRain },
  '515.svg': { before: IconMoon, after: IconSnowflake },
  '601.svg': { before: IconCloud, after: IconMoon },
  '610.svg': { before: IconCloud, after: IconMoon },
  '701.svg': { before: IconCloudRain, after: null },
  '711.svg': { before: IconCloudRain, after: IconMoon },
  '801.svg': { before: IconCloudSnow, after: null },
  '811.svg': { before: IconSnowflake, after: IconMoon },
}

/**
 * JMAのアイコンファイル名から、表示用アイコンを取得する
 * 例: "112.svg"
 */
export function getIconsFromJmaFileName(fileName: string): JmaIconMapping {
  return JMA_IMAGE_TO_ICON[fileName] ?? { before: IconQuestionMark, after: null }
}
