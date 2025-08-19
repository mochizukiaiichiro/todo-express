# 概要

Express/Next.js/TypeScriptを用いたWEBアプリケーションの学習のために作成したアプリケーションです。『[ハンズオンNode.js](https://www.oreilly.co.jp/books/9784873119236/)』の[ToDo管理アプリケーション](https://github.com/oreilly-japan/hands-on-nodejs/tree/master/ch05)を元に機能の追加や改善、技術の最新化、モジュール構成の最適化などを行っています。

---

## 「ハンズオンNode.js」からの変更点

- Express 5系 と Next.js 15（App Router）に変更（最新のモジュールをに更新）
- プログラムをJavaScriptからTypeScriptに変換
- Zod によるバリデーションスキーマを追加
- フロントエンドを use client による CSR に修正
- モジュール構成の最適化に合わせたディレクトリ構成の修正

---

## ToDo管理アプリケーションの概要

- ToDo の取得（全件／未完了／完了フィルタ）
- ToDo の追加（入力 → Enter キー送信）
- 完了状態の切り替え（チェックボックス操作）
- ToDo の削除（削除ボタン）

---

## ディレクトリ構成（抜粋）

```text
/src
├ app.ts                  # Express + Next.js 統合エントリポイント
├── app/                # Next.jsページ群（App Router）
├── components/         # UIコンポーネント
├── hooks/              # カスタムフック
├── styles/             # CSS
├── types/              # TypeScript型定義 & Zodスキーマ
└── api/
      ├── routes/       # Expressルート定義
      ├── controllers/  # APIの実装ロジック
      ├── services/     # CRUD処理
      ├── middlewares/  # バリデーション・エラー処理
      └── data/         # ToDo管理アプリケーションのデータ
```

---

## API

| メソッド | パス                     | 概要                               |
| -------- | ------------------------ | ---------------------------------- |
| GET      | /api/todos               | ToDoの取得（クエリで絞り込み可能） |
| POST     | /api/todos               | ToDoの追加                         |
| PUT      | /api/todos/:id/completed | 対象ToDoのcompletedを反転          |
| DELETE   | /api/todos/:id           | 対象ToDoを削除                     |

---

## 使用技術

- バックエンド：Express 5.1 / better-sqlite3
- フロントエンド：Next.js 15 (App Router)
- バリデーション：Zod 4.x
- 言語／型定義：TypeScript 5.8
- 実行環境：tsx

---

## 起動手順

```bash
# 依存インストール
npm install

# 開発サーバー起動（http://localhost:3000）
npm run start

# ファイル監視付き開発（tsxによる自動再起動）
npm run watch

# Typeチェック
npm run check
```
