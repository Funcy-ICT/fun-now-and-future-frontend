/// <reference types="vite/client" />

// import.meta.envに型を付ける。名前を打ち間違えたら、型エラーにする
interface ImportMetaEnv {
	// appのurl。ローカルではhttp://localhost:8080
	readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
