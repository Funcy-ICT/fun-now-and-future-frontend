import { hc, type InferResponseType } from "hono/client";
// バックエンドのルートの型。バックエンドのReleaseにあるパッケージを読む
import type { AppType } from "@fnaf/api-types";

// Vite の proxy でバックエンドへ送るので、相対パスにする
const client = hc<AppType>("/");

// バックエンドの /getCongestion が返す、食堂の混雑度情報の型
export type CongestionStatus = InferResponseType<typeof client.getCongestion.$get, 200>["data"];

// 食堂の混雑度を取得する対象の location
export const DINGING_LOCATION = "cafeteria";

/*  バックエンドから食堂の混雑度を取得する
    HTTP エラーはそのまま呼び出し元へ伝える
    signal が指定されている場合は、fetch に渡す
*/
export async function fetchDiningCongestion(signal?: AbortSignal): Promise<CongestionStatus> {
	const response = await client.getCongestion.$get(
		{ query: { location: DINGING_LOCATION } },
		{ init: { signal } },
	);

	if (!response.ok) {
		throw new Error(`食堂の混雑度を取得できませんでした: ${response.status}`);
	}

	const json = await response.json();
	return json.data;
}

// バックエンドの /signage/assets が返す、広報アセットの型
export type NewsAsset = InferResponseType<typeof client.signage.assets.$get, 200>["assets"][number];

/*  バックエンドからニュース（広報アセット）の一覧を取得する
    /signage/assets は x-api-key が要るので、VITE_SIGNAGE_API_KEY を付ける
*/
export async function getNews(): Promise<{ assets: NewsAsset[] }> {
	const response = await client.signage.assets.$get(undefined, {
		headers: { "x-api-key": import.meta.env.VITE_SIGNAGE_API_KEY },
	});

	if (!response.ok) {
		throw new Error("ニュースの取得に失敗しました");
	}

	return response.json();
}
