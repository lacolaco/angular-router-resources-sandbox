# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 目的

Angular v22.2 で実装された Router Resources を解説するブログ記事のサンプルコードとなるデモアプリである。コードは記事に引用される前提で書く。Router Resources の振る舞いを示すことに集中し、説明に関係しない抽象化や機能は足さない。

Router Resources の API は新しく、学習データにない可能性がある。API の形や挙動は推測せず、`node_modules/@angular/router` の型定義か公式ドキュメント (angular-cli MCP の `search_documentation`) で確かめてから書く。

## コマンド

パッケージマネージャは npm (`package-lock.json`)。

- 開発サーバー: `npm start` (`ng serve`、http://localhost:4200/)
- ビルド: `npm run build` (既定は production 構成)
- テスト: `npm test` (Vitest + jsdom、`@angular/build:unit-test`)
  - 1 回だけ実行: `npx ng test --watch=false`
  - 特定ファイル: `npx ng test --watch=false --include src/app/app.spec.ts`
  - テスト名で絞り込み: `npx ng test --watch=false --filter '^App'`
- 整形: `npx prettier --write <path>` (`.prettierrc`: printWidth 100、シングルクォート、HTML は angular パーサー)

lint は未設定である。

## 構成

Angular CLI v22.2.1 の初期生成直後の状態で、standalone コンポーネントのみを使い NgModule はない。

- `src/main.ts` が `bootstrapApplication(App, appConfig)` で起動する。
- `src/app/app.config.ts` の `provideRouter(routes)` がルーター設定の入口である。ルーターの機能 (`with*` 関数) を追加するときはここに渡す。
- `src/app/app.routes.ts` のルート定義は空である。
- `src/app/app.html` は CLI のプレースホルダーで、`<router-outlet />` 以外は置き換えてよい。置き換えたら `src/app/app.spec.ts` の `h1` を検証するテストも合わせて直す。
