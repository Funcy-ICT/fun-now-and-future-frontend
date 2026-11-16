import { hc, type InferResponseType } from "hono/client";
import type { AppType } from "@fnaf/api-types";

// Vite の proxy でバックエンドへ送るので、相対パスにする
const client = hc<AppType>("/");

// バックエンドの /getCongestion が返す、食堂の混雑度情報の型
export type CongestionStatus = InferResponseType<typeof client.getCongestion.$get, 200>["data"];

// 混雑度を取得する対象の location
export const CAFETERIA_LOCATION = "cafeteria";
export const BUS_STOP_LOCATION = "bus_stop";

// 指定した location の混雑度をバックエンドから取得する
// HTTP エラーはそのまま呼び出し元へ伝える
// バックエンドが返す JSON の status が success 以外のときは、message を優先してエラーにする
// signal が指定されている場合は、fetch に渡す
export async function fetchCongestion(location: string, signal?: AbortSignal): Promise<CongestionStatus> {
	const response = await fetch(`/getCongestion?location=${encodeURIComponent(location)}`, { signal });

	if (!response.ok) {
		throw new Error(`混雑度を取得できませんでした: ${response.status}`);
	}

	const json = (await response.json()) as
		| { status: "success"; data: CongestionStatus }
		| { status: "error"; message?: string };

	if (json.status !== "success") {
		throw new Error(json.message ?? "混雑度を取得できませんでした");
	}

	return json.data;
}

// 食堂用の取得関数
export function fetchDiningCongestion(signal?: AbortSignal): Promise<CongestionStatus> {
	return fetchCongestion(CAFETERIA_LOCATION, signal);
}

// バス停用の取得関数
export function fetchBusCongestion(signal?: AbortSignal): Promise<CongestionStatus> {
	return fetchCongestion(BUS_STOP_LOCATION, signal);
}

// --- 広報アセット関連 ---
// バックエンドの GET /signage/assets の返す型を最低限表現する
export type PrAssetMediaDto = {
	url: string;
	contentType: string;
};

export type PrAssetDto = {
	id: string;
	tag: string;
	title: string;
	description: string;
	media: PrAssetMediaDto;
	publishUntil: string | null;
};

type SignageAssetsResponse = {
	assets: PrAssetDto[];
};

/*
	サイネージ向けの掲載アセット一覧を取得する。
	- `apiKey` を渡すと `x-api-key` ヘッダーを付与する（サイネージ向けは API キー必須）
	- レスポンスが 200 以外なら例外を投げる
*/
export async function fetchSignageAssets(apiKey?: string, signal?: AbortSignal): Promise<PrAssetDto[]> {
	const headers: Record<string, string> = {};
	if (apiKey) headers["x-api-key"] = apiKey;

	const response = await fetch(`/signage/assets`, { method: "GET", headers, signal });
	if (!response.ok) {
		if (response.status === 401) throw new Error("APIキーが必要です（401 Unauthorized）");
		throw new Error(`広報アセットの取得に失敗しました: ${response.status}`);
	}

	const json = (await response.json()) as SignageAssetsResponse | { status?: string; message?: string };
	if (!("assets" in json)) {
		throw new Error((json && (json as any).message) ?? "広報アセットの取得に失敗しました");
	}

	return (json as SignageAssetsResponse).assets;
}

// バックエンドの /signage/assets が返す、広報アセットの型
export type NewsAsset = InferResponseType<typeof client.signage.assets.$get, 200>["assets"][number];

/*
	バックエンドからニュース（広報アセット）の一覧を取得する
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
