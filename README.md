# 📝 todo-express

Node.js、Express、TypeScript の勉強のためのプロジェクトです。
ハンズオンNode.jsの5章を参考に作成しています。

---

## 🚀 Features

-  TypeScript による型安全な API 実装
-  Zod によるスキーマ定義＆バリデーションミドルウェア
-  クエリで `completed=true|false` によるフィルタリング取得
-  POST による TODO 追加機能（ID自動採番）
-  バリデーションエラーハンドリングミドルウェア

---

## 📁 ディレクトリ構成

└─src/
    ├──server/ # Express サーバー定義 
    ├──middlewares/
    ├──types/  # 型定義と Zod スキーマ

---

## 📦 使用技術

- [Express 5.1](https://expressjs.com/)
- [Zod 4.x](https://zod.dev/)
- TypeScript 5.8
- tsx 実行環境

---

## ▶️ 起動手順

```bash
# 依存インストール
npm install

# サーバー起動
npm run start

# アクセス (既定ポート)
http://localhost:3000/

📘 API仕様
GET /
全件取得。

例: GET http://localhost:3000/

GET /?completed=true|false
completed 状態でフィルター取得。

例: GET http://localhost:3000/?completed=false

POST /
新しい TODO を追加。Zod によるバリデーション付き。

Body (application/json):

json
{
  "title": "買い物に行く"
}
Response:

json
{
  "id": 3,
  "title": "買い物に行く",
  "completed": false
}

👤 開発者向け
Typeチェックのみ
bash
npm run check
開発ウォッチ
bash
npm run watch