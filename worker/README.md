# Cloudflare Worker — `tamjump-contact-api`

このディレクトリには **king2323 を Mission Entry 経由で受け付ける Worker のソース** が入っています。

## デプロイ先

| 項目 | 値 |
|---|---|
| Worker 名 | `tamjump-contact-api` |
| URL | `https://tamjump-contact-api.animalb001.workers.dev` |
| 共用先 | tamjump.com(contact)、scsgo.co.jp(contact)、**king2323.tamjump.com(entry)** |
| カスタムドメイン予定 | `api.tamjump.com`(未設定) |

## エンドポイント

| Method | Path | プロジェクト | 用途 |
|---|---|---|---|
| POST | `/contact` | tamjump / scsgo | コーポレート問い合わせフォーム |
| POST | `/entry` | kingmaker | **KINGMAKER 23:23 Mission Entry** |
| GET | `/admin/contacts?project=...` | 全 | 管理用一覧(要 Bearer token) |
| OPTIONS | * | 全 | CORS preflight |

## デプロイ手順(ダッシュボード経由)

1. https://dash.cloudflare.com/ → **Workers & Pages** → **`tamjump-contact-api`**
2. 右上 **「Edit code」**
3. エディタ内のコードを **Ctrl+A → Delete** で**完全に空に**
4. このリポジトリの [`worker/index.js`](./index.js) の中身を全コピペ
5. **Deploy** ボタン

⚠️ 既存コードを残したまま貼り付けると `var` 重複宣言で SyntaxError になります。必ず空にしてから貼り付け。

## 必要な環境変数(Worker Settings → Variables)

| 名前 | 種別 | 用途 |
|---|---|---|
| `ADMIN_EMAIL` | Plain | 運営宛通知メアド(`info@tamjump.com`) |
| `FROM_EMAIL` | Plain | SES 送信元メアド(SES verified domain) |
| `AWS_ACCESS_KEY_ID` | Secret | SES 認証 |
| `AWS_SECRET_ACCESS_KEY` | Secret | SES 認証 |
| `AWS_REGION` | Plain | デフォルト `ap-northeast-1` |
| `ADMIN_TOKEN` | Secret | `/admin/contacts` の Bearer 認証 |
| `TURNSTILE_SECRET` | Secret(任意) | スパム検証(未設定なら検証スキップ) |

既存(tamjump / scsgo 用)の Worker に既に設定済みのものをそのまま流用します。新規追加不要。

## D1 データベース

- バインディング名:`DB`
- テーブル:`contacts`(全プロジェクト共用)
- KingMaker 識別:`project = 'kingmaker'`
- カラムマッピング(Mission Entry → contacts):
  - `name` ← mission_name
  - `email` ← payment_email
  - `phone` ← receipt_id
  - `category` ← country
  - `message` ← mission_summary + `\n\n[Website/SNS] sns`

## 受付番号

| プロジェクト | プレフィックス | 例 |
|---|---|---|
| tamjump | `TAMJ-` | `TAMJ-20260514-0001` |
| scsgo | `SCS-` | `SCS-20260514-0001` |
| kingmaker | `KM-` | `KM-20260515-0001` |

## 動作確認(curl)

```bash
curl -X POST https://tamjump-contact-api.animalb001.workers.dev/entry \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://king2323.tamjump.com' \
  -d '{
    "payment_email":"test@example.com",
    "receipt_id":"TEST-001",
    "mission_name":"Sanity test",
    "country":"Japan",
    "mission_summary":"Pre-launch test",
    "agree_rules":true
  }'
```

期待値:
```json
{"success":true,"message":"Mission Entry を受け付けました / Mission Entry received","ticketNumber":"KM-..."}
```

## ⚠️ ソース・オブ・トゥルース

この `worker/index.js` は **デプロイ先と乖離する可能性**があります(誰かが Cloudflare ダッシュボードから直接編集すると、リポジトリは古いまま)。
編集が必要になったら、必ず **このファイルを更新 → push → Cloudflare に貼り付け**の順で進めること。
