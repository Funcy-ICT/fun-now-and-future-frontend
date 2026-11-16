import { hc, type InferResponseType } from "hono/client";
// バックエンドのルートの型。バックエンドのReleaseにあるパッケージを読む
import type { AppType } from "@fnaf/api-types";

// VITE_API_BASE_URL がないときは、Vite の proxy でバックエンドへ送るので、相対パスにする
const client = hc<AppType>(import.meta.env.VITE_API_BASE_URL ?? "/");

// バックエンドの /getCongestion が返す、正常応答の全体の型
type CongestionResponse = InferResponseType<typeof client.getCongestion.$get, 200>;

// バックエンドの /getCongestion が返す、混雑度情報の型
export type CongestionStatus = CongestionResponse["data"];

// 食堂の混雑度を取得する対象の location
export const DINGING_LOCATION = "cafeteria";

/*  バックエンドから食堂の混雑度を取得する
    HTTP エラーはそのまま呼び出し元へ伝える
    signal が指定されている場合は、fetch に渡す
*/
export async function fetchDiningCongestion(signal?: AbortSignal): Promise<CongestionStatus> {
	const json = await getCongestion(DINGING_LOCATION, signal);
	return json.data;
}

/*  任意の location の混雑度を取得する
    HTTP エラーのときは、ステータスコードを付けてエラーにする
*/
export async function getCongestion(location: string, signal?: AbortSignal): Promise<CongestionResponse> {
	const response = await client.getCongestion.$get({ query: { location } }, { init: { signal } });

	if (!response.ok) {
		throw new Error(`混雑度を取得できませんでした: ${response.status}`);
	}

	return response.json();
}

// バックエンドの /signage/assets が返す、レスポンス全体の型
type NewsResponse = InferResponseType<typeof client.signage.assets.$get, 200>;

// バックエンドの /signage/assets が返す、広報アセットの型
export type NewsAsset = NewsResponse["assets"][number];

/*  バックエンドからニュース（広報アセット）の一覧を取得する
    /signage/assets は x-api-key が要るので、VITE_SIGNAGE_API_KEY を付ける
*/
export async function getNews(): Promise<NewsResponse> {
	const response = await client.signage.assets.$get(undefined, {
		headers: { "x-api-key": import.meta.env.VITE_SIGNAGE_API_KEY },
	});

	if (!response.ok) {
		throw new Error("ニュースの取得に失敗しました");
	}

	return response.json();
}
