import { hc, type InferRequestType, type InferResponseType } from "hono/client";
// バックエンドのルートの型。バックエンドのReleaseにあるパッケージを読む
import type { AppType } from "@fnaf/api-types";

// 投稿画面はFirebase Hostingに置き、viteのproxyは使えないので、appのurlへ直接送る
const client = hc<AppType>(import.meta.env.VITE_API_BASE_URL);

// /pr-assetsは、auth0のアクセストークンをAuthorizationヘッダーで送る
const authHeaders = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

// POST /pr-assets に送る本文(multipart)の型
export type PrAssetSubmitForm = InferRequestType<typeof client["pr-assets"]["$post"]>["form"];

// POST /pr-assets が返す、受け付けた投稿の型
export type PrAssetSubmitResult = InferResponseType<typeof client["pr-assets"]["$post"], 201>;

// GET /pr-assets/mine が返す、自分の投稿の型
export type MyPrAsset = InferResponseType<typeof client["pr-assets"]["mine"]["$get"], 200>["assets"][number];

// POST /pr-assets/{id}/withdraw が返す型
export type WithdrawPrAssetResult = InferResponseType<typeof client["pr-assets"][":id"]["withdraw"]["$post"], 200>;

/*  広報アセットを投稿する
    投稿は審査待ちで入り、承認されるまでサイネージには出ない
*/
export async function submitPrAsset(form: PrAssetSubmitForm, token: string): Promise<PrAssetSubmitResult> {
	const response = await client["pr-assets"].$post({ form }, authHeaders(token));

	if (response.status !== 201) {
		throw new Error(`投稿できませんでした: ${response.status}`);
	}

	return response.json();
}

/*  自分の投稿の一覧を取得する(新しい順)
    審査の状態と、却下の理由が入る
*/
export async function getMyPrAssets(token: string): Promise<MyPrAsset[]> {
	const response = await client["pr-assets"].mine.$get(undefined, authHeaders(token));

	if (!response.ok) {
		throw new Error(`自分の投稿を取得できませんでした: ${response.status}`);
	}

	const json = await response.json();
	return json.assets;
}

/*  自分の投稿を取り下げる
    却下済みか取り下げ済みのときは409、自分の投稿に無いときは404になる
*/
export async function withdrawPrAsset(id: string, token: string): Promise<WithdrawPrAssetResult> {
	const response = await client["pr-assets"][":id"].withdraw.$post({ param: { id } }, authHeaders(token));

	if (!response.ok) {
		throw new Error(`取り下げられませんでした: ${response.status}`);
	}

	return response.json();
}
