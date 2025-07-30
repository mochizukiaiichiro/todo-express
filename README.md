# 概要

Express、Node.js、TypeScript の勉強のために作成したアプリケーションです。 『[ハンズオンNode.js](https://www.oreilly.co.jp/books/9784873119236/)』の第5章・第6章のToDo管理アプリケーションを参考にしながら、 機能追加や構成の改善などを行っています。

---
## 「ハンズオンNode.js」からの修正内容

- Express 5系 と Next.js 15（App Router）に変更（最新のモジュールに更新）
- プログラムをJavaScriptからTypeScriptに変換
- Zod によるバリデーションスキーマを追加
- フロントエンドを use client による CSR に修正
- Express 側のディレクトリ構成を明確化（責務分離）

---
## アプリ機能

- ToDo の取得（全件／未完了／完了フィルタ）
- ToDo の追加（入力 → Enter キー送信）
- 完了状態の切り替え（チェックボックス操作）
- ToDo の削除（削除ボタン）

---
## ディレクトリ構成（抜粋）

.
├── app/                 # Next.js App Router ページ群
├── components/          # UIコンポーネント（Todos.tsx）
├── api/
│   ├── controllers/     # APIの実装ロジック
│   ├── routes/          # Express ルーティング
│   ├── middlewares/     # バリデーション・エラー処理
│   └── data/            # ToDo配列・ID最大値取得
├── types/               # TypeScript 型定義 & Zodスキーマ
└── app.ts               # Express + Next.js 統合エントリポイント

---
## API

| メソッド | パス                        | 概要                                     |
|----------|-----------------------------|------------------------------------------|
| GET      | /api/todos                  | ToDo一覧の取得（クエリにより絞り込み可能） |
| POST     | /api/todos                  | ToDoを追加（title必須）                   |
| PUT      | /api/todos/:id/completed    | 対象ToDoの completed 状態を反転          |
| DELETE   | /api/todos/:id              | 対象ToDoを削除                             |

---
## 使用技術

- Express 5.1
- Next.js 15 (App Router)
- Zod 4.x
- TypeScript 5.8
- tsx 実行環境

---
## ▶️ 起動手順

```bash
# 依存インストール
npm install

# サーバー起動
npm run start

# 開発ウォッチ
npm run watch

# Typeチェックのみ
npm run check

# アクセス (既定ポート)
http://localhost:3000/