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
