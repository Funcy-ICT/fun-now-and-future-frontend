// バックエンドの /getCongestion が返す、食堂の混雑度情報の型
export type CongestionStatus = {
	location: string;
	windowStart: string;
	uniqueDeviceCount: number;
	level: number | null;
	stale: boolean;
};

// 正常応答のときだけ必要な、レスポンス全体の形
type CongestionResponse = {
	status: "success";
	data: CongestionStatus;
};

// 食堂の混雑度を取得する対象の location
export const DINGING_LOCATION = "cafeteria";

/*  バックエンドから食堂の混雑度を取得する
    HTTP エラーはそのまま呼び出し元へ伝える
    バックエンドが返す JSON の status が success 以外のときは、message を優先してエラーにする
    signal が指定されている場合は、fetch に渡す
*/
export async function fetchDiningCongestion(signal?: AbortSignal): Promise<CongestionStatus> {
	const response = await fetch(`/getCongestion?location=${encodeURIComponent(DINGING_LOCATION)}`, { signal });

	if (!response.ok) {
		throw new Error(`食堂の混雑度を取得できませんでした: ${response.status}`);
	}

	const json = (await response.json()) as CongestionResponse | { status: "error"; message?: string };

	if (json.status !== "success") {
		throw new Error(json.message ?? "食堂の混雑度を取得できませんでした");
	}

	return json.data;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 任意の location の混雑度を取得
export async function getCongestion(location: string): Promise<CongestionResponse> {
	const params = new URLSearchParams({ location });
	const response = await fetch(`${API_BASE_URL}/getCongestion?${params}`);

	if (!response.ok) {
		throw new Error("混雑度の取得に失敗しました");
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
export async function getNews(): Promise<{ assets: NewsAsset[] }> {
	const response = await fetch(`${API_BASE_URL}/signage/assets`, {
		headers: {
			"x-api-key": import.meta.env.VITE_SIGNAGE_API_KEY,
		},
	});

	if (!response.ok) {
		throw new Error("ニュースの取得に失敗しました");
	}

	return response.json();
}
