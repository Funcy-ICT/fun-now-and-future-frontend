const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 混雑度データの型
export type Congestion = {
  location: string;
  windowStart: string;
  uniqueDeviceCount: number;
  level: number | null;
  stale: boolean;
};

// 最新の混雑度を取得
export async function getCongestion(
  location: string
): Promise<{ status: "success"; data: Congestion }> {
  const params = new URLSearchParams({ location });

  const response = await fetch(
    `${API_BASE_URL}/getCongestion?${params}`
  );

  if (!response.ok) {
    throw new Error("混雑度の取得に失敗しました");
  }

  return response.json();
}

// 混雑度の履歴を取得
export async function getCongestionHistory(
  location: string
): Promise<{
  status: "success";
  count: number;
  data: Omit<Congestion, "stale">[];
}> {
  const params = new URLSearchParams({ location });

  const response = await fetch(
    `${API_BASE_URL}/getCongestionHistory?${params}`
  );

  if (!response.ok) {
    throw new Error("履歴の取得に失敗しました");
  }

  return response.json();
}

// 広報アセットの型
export type NewsAsset = {
  id: string;
  tag: string;
  title: string;
  description: string;
  media: {
    url: string;
    contentType: string;
  };
  publishUntil: string | null;
};

// ニュース（広報アセット）一覧を取得
export async function getNews(): Promise<{
  assets: NewsAsset[];
}> {
  const response = await fetch(
    `${API_BASE_URL}/signage/assets`,
    {
      headers: {
        "x-api-key": import.meta.env.VITE_SIGNAGE_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error("ニュースの取得に失敗しました");
  }

  return response.json();
}