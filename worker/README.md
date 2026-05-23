# Cloudflare Worker — `tamjump-contact-api`

このディレクトリには **king2323 を Mission Entry 経由で受け付ける Worker のソース** が入っています。

このドキュメントは **Cycle 2 ローンチ手順書** を兼ねています。
Wed 2026-05-27 23:23 JST に Cycle 2 が開門する前に、この文書のチェックリストを最後まで読んで実行してください。

---

## デプロイ先

| 項目 | 値 |
|---|---|
| Worker 名 | `tamjump-contact-api` |
| URL | `https://tamjump-contact-api.animalb001.workers.dev` |
| 共用先 | tamjump.com(contact)、scsgo.co.jp(contact)、**king2323.tamjump.com(entry+game)** |
| カスタムドメイン予定 | `api.tamjump.com`(未設定) |
| D1 binding | `DB`(`tamjump_contact_db`, UUID `ba5cf621-d8c7-49db-90cd-e1fe8ece8437`) |

## デプロイ手順(ダッシュボード経由)

1. https://dash.cloudflare.com/ → **Workers & Pages** → **`tamjump-contact-api`**
2. 右上 **「Edit code」**
3. エディタ内のコードを **Ctrl+A → Delete** で**完全に空に**
4. このリポジトリの [`worker/index.js`](./index.js) の中身を全コピペ
5. **Deploy** ボタン

⚠️ 既存コードを残したまま貼り付けると `var` 重複宣言で SyntaxError になります。必ず空にしてから貼り付け。

---

## 必要な環境変数(Worker Settings → Variables)

Worker は 13 個の環境変数を読みます。`Plain text` か `Secret` かは Cloudflare ダッシュボード上の表示種別。

### コア(全プロジェクト共通・既設定済)

| 名前 | 種別 | 用途 |
|---|---|---|
| `ADMIN_EMAIL` | Plain | 運営宛通知メール宛先(`info@tamjump.com`) |
| `FROM_EMAIL` | Plain | SES 送信元(SES verified domain のアドレス) |
| `AWS_ACCESS_KEY_ID` | Secret | SES 認証 |
| `AWS_SECRET_ACCESS_KEY` | Secret | SES 認証 |
| `AWS_REGION` | Plain | デフォルト `ap-northeast-1` |
| `ADMIN_TOKEN` | Secret | `/admin/contacts`、`/admin/kings`、`/game/phase2/draw`、`/game/phase3/finalize` の Bearer 認証 |
| `TURNSTILE_SECRET` | Secret(任意) | スパム検証(未設定なら検証スキップ) |

### KINGMAKER 固有(Cycle 2 ローンチで必須)

| 名前 | 種別 | 用途 | Cycle 2 で要設定値 |
|---|---|---|---|
| `CURRENT_CYCLE` | Plain(任意) | `/entry/pay` が D1 に書く `founding_cohort` の番号(指定なければ `GAME_CONFIG.currentCycle` を使用) | `2`(明示推奨)/ 未設定でも OK |
| `SQUARE_ENV` | Plain | `production` or `sandbox`(他は sandbox 扱い) | `production`(本番)/ `sandbox`(検証時) |
| `SQUARE_APPLICATION_ID` | Plain | Square Web Payments SDK の Application ID | Square Developer Dashboard より |
| `SQUARE_LOCATION_ID` | Plain | Square Location ID | Square Dashboard → Locations より |
| `SQUARE_ACCESS_TOKEN` | Secret | Square Payments API の Bearer token | Square Dashboard → Credentials より |

> ✅ **`CURRENT_CYCLE` の取り違え対策(v20260523o 以降)**:
> `/entry/pay` 内の cycle 解決ロジックが `env.CURRENT_CYCLE` を優先しつつ、未設定なら `GAME_CONFIG.currentCycle` にフォールバックします。
> つまり、`worker/index.js` の `GAME_CONFIG.currentCycle = 2` を更新するだけで `CURRENT_CYCLE` 環境変数を忘れても Cycle 2 のエントリは正しく `founding_cohort=2` で保存されます。
> ただし、明示的に環境変数を `CURRENT_CYCLE=2` に設定しておくと、コードを再デプロイせずに別 Cycle に切り替える(運営判断による緊急変更)際に役立ちます。

### D1 binding

| 名前 | バインディング種別 |
|---|---|
| `DB` | D1 database → `tamjump_contact_db`(UUID `ba5cf621-d8c7-49db-90cd-e1fe8ece8437`) |

`contacts` テーブル(全プロジェクト共用)に `project='kingmaker'` で書き込みます。

---

## エンドポイント一覧

### Mission Entry(決済 + 申込)

| Method | Path | 用途 | 認証 |
|---|---|---|---|
| GET | `/entry/config` | フロントエンドが Square SDK 初期化用の `applicationId` / `locationId` / `environment` を取得 | なし |
| POST | `/entry/pay` | **本番フロー**: Square card token + Mission データを受け取り → Square 決済 ¥100 → D1 保存 → 自動返信メール | Turnstile(任意) |
| POST | `/entry` | レガシー2ステップフロー(受付番号を手入力する旧 UX)。entry.html は使用していない | Turnstile(任意) |
| POST | `/entry/lookup` | 受付済みエントリのチケット番号で照合(My Page の代替フロー) | なし |

### My Page / 認証

| Method | Path | 用途 |
|---|---|---|
| POST | `/mypage/magic` | 入力メアドへマジックリンクを送信 |
| GET | `/mypage/me` | トークンでログイン後のユーザー情報取得 |
| POST | `/mypage/setup-password` | 直接ログイン用パスワード設定 |
| POST | `/mypage/login` | メアド+パスワードでログイン |

### Game(Bell ライフサイクル)

| Method | Path | 用途 |
|---|---|---|
| GET | `/game/bell-status` | 現在の Bell phase(`pre_bell`/`phase1`/`phase2`/`phase3`/`post_bell`/`dormant`) |
| POST | `/game/quiz/start` | Phase 1 開始: 3 問のクイズセットを返す |
| POST | `/game/quiz/answer` | 個別問の解答を送信 |
| GET | `/game/quiz/result` | 自分のクイズ結果取得 |
| POST | `/game/phase2/draw` | SHA-256 ドロー実行(cron か admin 手動) |
| GET | `/game/phase2/result` | Phase 2 の The Three 結果取得 |
| POST | `/game/vote` | Phase 3 投票 |
| GET | `/game/vote/results` | Phase 3 投票途中経過 |
| POST | `/game/phase3/finalize` | Phase 3 締切後の確定 |
| GET | `/game/mission-fund` | Mission Fund 累計取得(全 Cycle 通算) |

### Hall of Kings

| Method | Path | 用途 |
|---|---|---|
| GET | `/kings/list` | 公開済みの King 一覧 |
| POST/PATCH | `/admin/kings` | King レコードの作成・更新(`Authorization: Bearer ${ADMIN_TOKEN}` 必須) |

### 管理

| Method | Path | 用途 |
|---|---|---|
| GET | `/admin/contacts?project=kingmaker` | エントリ一覧(`Authorization: Bearer ${ADMIN_TOKEN}`) |

`/game/phase2/draw` および `/game/phase3/finalize` も Bearer 認証(同じ `ADMIN_TOKEN`)。これらは `/game/*` 名前空間にあるため、admin 専用ではなく cron からも呼べる。

---

## ⚠️ ソース・オブ・トゥルース

この `worker/index.js` は **デプロイ先と乖離する可能性**があります(誰かが Cloudflare ダッシュボードから直接編集すると、リポジトリは古いまま)。
編集が必要になったら、必ず **このファイルを更新 → push → Cloudflare に貼り付け**の順で進めること。

---

## Cycle 2 ローンチ チェックリスト

Wed 2026-05-27 23:23 JST の Bell 開門までに完了させること。

### 1. 環境変数(Worker Settings → Variables)

- [ ] `CURRENT_CYCLE` = `2`(任意・推奨。未設定でも `GAME_CONFIG.currentCycle` でフォールバック)
- [ ] `SQUARE_ENV` = `production`
- [ ] `SQUARE_APPLICATION_ID` 設定済み
- [ ] `SQUARE_LOCATION_ID` 設定済み
- [ ] `SQUARE_ACCESS_TOKEN` 設定済み(Secret 種別)
- [ ] 既設のコア環境変数(`ADMIN_EMAIL`, `FROM_EMAIL`, AWS, `ADMIN_TOKEN`)が変わっていないこと

設定後、ダッシュボードの「Save and deploy」を必ず押す(押さないと既存リクエストが古い値で処理される)。

### 2. Worker のソース同期

```bash
git log -1 worker/index.js
```
で最新コミットを確認し、その内容が Cloudflare ダッシュボード上のコードと一致していることを比較(README 上部の Edit code 手順)。
特に確認すべき行:
- L1480 `currentCycle: 2`
- L1481 `bellRingsAtIso: "2026-05-29T14:23:00Z"`
- L1508 `dormancyThreshold: 1000`

### 3. ヘルスチェック

```bash
# bell-status — phase が pre_bell で、cycle=2 が返ること
curl https://tamjump-contact-api.animalb001.workers.dev/game/bell-status

# entry/config — environment が production であること
curl https://tamjump-contact-api.animalb001.workers.dev/entry/config
```

期待値:
```json
// /game/bell-status (Wed 5/27 開門前)
{ "phase": "pre_bell", "cycle": 2, "secondsUntilBell": <large positive>, ... }

// /entry/config
{ "applicationId": "<app id>", "locationId": "<loc id>", "environment": "production" }
```

### 4. 決済スモークテスト(本番カードを使わない方法)

`SQUARE_ENV=sandbox` で別 Worker(または同 Worker を一時的にサンドボックスに切替)にデプロイして、Square Sandbox テストカード `4111 1111 1111 1111` で `/entry/pay` を一周させる。

```bash
# (1) entry.html を king2323.tamjump.com 上で開く
# (2) 開発者ツールで Network タブを開く
# (3) Mission を入力、テストカードを入力、送信
# (4) /entry/pay のレスポンスが {"success":true,"ticketNumber":"KM-2026MMDD-NNNN",...} になること
# (5) 受信メールが届くこと(Mission Entry を受け付けました)
# (6) D1 を直接覗いて contacts テーブルに新規行が入っていること、founding_cohort=2 になっていること
```

D1 直接確認:
```bash
# Cloudflare ダッシュボード → D1 → tamjump_contact_db → Console
SELECT id, ticket_number, name, email, founding_cohort, paid, square_payment_id, created_at
FROM contacts
WHERE project = 'kingmaker'
ORDER BY id DESC
LIMIT 5;
```

スモークテストが終わったら必ず `SQUARE_ENV=production` に戻して再デプロイ。

### 5. Cron トリガー確認

Bell が鳴った後の Phase 3 確定処理(Fri 5/29 23:30 JST 想定)は Cloudflare Cron Trigger で自動発火させる。

> **✅ v20260523r 以降:** worker に `scheduled(event, env, ctx)` ハンドラを実装済み。これにより **Cloudflare ダッシュボード上で Workers の Cron Triggers を設定すれば、Phase 3 自動確定が動く**。
>
> ハンドラの動作:
> - Phase 2 が未ドローなら警告ログを出して何もしない。
> - 既に確定済みなら何もしない(冪等)。
> - Phase 2 がドロー済みで Phase 3 未確定なら、投票を集計し King を確定する。
>
> **Phase 2 の SHA-256 ドローは自動化されていない**(市場データ入力が必要なため、後述)。

#### Cron Trigger 設定

Cloudflare ダッシュボード → Workers & Pages → `tamjump-contact-api` → Triggers → Cron Triggers → Add Cron Trigger:

- スケジュール: `30 14 * * 5` (毎週金曜 14:30 UTC = 23:30 JST、Bell 終了の 2 分後)

このハンドラは何回叩いても安全(冪等)なので、cron 頻度を上げてもよい。週次でなく、Cycle 2 のためだけに `30 14 29 5 *` といったワンショット指定でもよい。

ログ確認:
```
wrangler tail tamjump-contact-api
```
で `[scheduled]` プレフィックスのログを観察。Phase 2 が drawn でない場合は警告のみ。drawn かつ未確定なら finalize → kingId をログ。

#### Phase 2 SHA-256 ドロー(別途必要)

Phase 2 は cron で自動化できない。市場データ入力(`btcHash` + `nikkeiClose` + `sp500Close`)が必要で、これは**人手で Bell 直前の Bitcoin ブロックハッシュと当日の市場終値を集めてから**初めて検証可能になるため。

- **エンドポイントは `/game/phase2/draw`(`/admin/game/...` は存在しない)。**
- **認証は `Authorization: Bearer ${ADMIN_TOKEN}`(`X-Admin-Token` ではない)。**
- **v20260523p 以降、ドロー実行には公開シード入力が必須:** `btcHash`(Bell 直前の Bitcoin ブロックハッシュ)、`nikkeiClose`(Bell 当日の Nikkei 225 終値 — Bell の 8 時間前に確定済み)、`sp500Close`(**前日 Thursday** の S&P 500 終値 — その日の S&P close は Bell 後の Sat 06:00 JST にしか出ないため)。3 つすべて欠けると `400 { error: "Public seed inputs required..." }` が返る。テスト時のみ `allowSyntheticSeed: true` でバイパス可。

実行例(本番):

```bash
curl -X POST https://tamjump-contact-api.animalb001.workers.dev/game/phase2/draw \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "cycle": 2,
    "btcHash": "<5/29 23:23 JST 直前の Bitcoin ブロックハッシュ>",
    "nikkeiClose": "<5/29 の Nikkei 225 終値、例: 38500.42>",
    "sp500Close": "<前日(Thursday)の S&P 500 終値、例: 5847.91>"
  }'
```

実行例(ドライラン / テスト用、本番では使わない):

```bash
curl -X POST https://tamjump-contact-api.animalb001.workers.dev/game/phase2/draw \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"cycle": 2, "allowSyntheticSeed": true}'
```

#### 補助スクリプト: `scripts/phase2-auto-draw.js`

v20260523s で追加。運営の手元 PC で実行する helper script。BTC ブロックハッシュ + Nikkei + S&P を自動取得して `/game/phase2/draw` を叩く。Bell 当日に curl で手動入力するより早く、間違いも減る。

**Cloudflare Worker 上ではなく必ず手元で動かすこと。** Worker からは blockstream.info / mempool.space / Yahoo Finance への egress allowlist が無いため動かない。手元 PC なら制約なく動く。

実行(Bell 当日 23:24 JST 頃):

```bash
ADMIN_TOKEN=kingmaker-admin-tiger-2026 \
  node scripts/phase2-auto-draw.js --cycle 2
```

オプション:
- `--cycle N`: cycle 上書き(無ければ worker の GAME_CONFIG.currentCycle が使われる)
- `--dry-run`: 取得した market data を表示するが POST しない
- `--yes` / `-y`: 確認プロンプトをスキップ

データソース:
- BTC: blockstream.info(失敗時は mempool.space に fallback)
- Nikkei 225: Yahoo Finance `^N225`
- S&P 500: Yahoo Finance `^GSPC`(自動的に**前日 Thursday** の close を返す — 当日 Friday の close は Bell 後にしか出ないため)

途中で 1 つでも fetch に失敗すると即座に abort し、運営に curl での手動 fallback を促す(`worker/README.md §5` の curl 例)。実行中は標準出力で各ステップの状態を表示するため、何が原因で失敗したか即座に分かる。

実装上 Node.js 18+ の組み込み fetch を使うため、運営 PC に Node 18 以降がインストール済みであること。確認:

```bash
node --version  # v18.0.0 以上であること
```

#### Bell 当日の運営フロー

1. **23:23 JST** Bell 鳴る → Phase 1 自動開始(クイズ 2 分間)
2. **23:25 JST** Phase 1 終了 → Phase 2 wait → 運営は market data を集める
3. **23:25-23:26 JST** 運営が `/game/phase2/draw` を叩く(推奨:`scripts/phase2-auto-draw.js`、手動なら curl 例上記)
4. **23:25:30 JST** Phase 3 投票開始(2.5 分間)
5. **23:28 JST** Phase 3 投票終了
6. **23:30 JST** Cron Trigger 自動発火 → `runPhase3Finalize` → King 確定

ステップ 3 が遅れると Phase 3 投票画面に The Three が表示されないので、運営は market data を **23:23 より前に手元に揃えておく**こと。それぞれの根拠時刻:

- **Bitcoin ブロックハッシュ**: 23:23 JST の直前ブロック(あるいは Bell ringing と同時刻にできるだけ近いブロック)。[mempool.space](https://mempool.space/) などから 1 分以内に取れる。Bitcoin は約 10 分おきに新ブロックを生成するため、いつでも入手可能。
- **Nikkei 225 終値**: 同じ Friday の終値(Nikkei は 15:00 JST に閉場、つまり Bell の 8 時間前に既に確定している)。
- **S&P 500 終値**: 直近の Thursday の close を使う(S&P は 16:00 NY 時間に閉場、つまり Fri 21:00 UTC = Sat 06:00 JST に確定する。Bell の時点ではまだ Friday の close は出ていない。地理的な時差により、土日に持ち込む S&P 500 close は前日 Thursday の値となる)。

### 6. 当日のモニタリング

Bell が鳴る Fri 5/29 23:23 JST の前後 10 分は以下を並走でモニタ:

- `wrangler tail tamjump-contact-api` で Worker ログ
- Cloudflare ダッシュボード → D1 → Console で `SELECT count(*) FROM contacts WHERE founding_cohort=2 AND paid=1` を 1 分おきにリロードして参加者数を監視
- `dormancyThreshold = 1000` に達していなければ Cycle 2 は `dormant` 状態になり、Mission Fund に繰越される(これは仕様)

---

## 受付番号

| プロジェクト | プレフィックス | 例 |
|---|---|---|
| tamjump | `TAMJ-` | `TAMJ-20260514-0001` |
| scsgo | `SCS-` | `SCS-20260514-0001` |
| kingmaker | `KM-` | `KM-20260515-0001` |

連番は日付ごとにリセット。`generateTicketNumber()` は当日の同 prefix の最大シーケンス + 1 を取り、その値を 0 詰め 4 桁で返す。

---

## D1 contacts テーブル(KINGMAKER カラムマッピング)

| カラム | KINGMAKER での意味 |
|---|---|
| `project` | 常に `'kingmaker'` |
| `name` | mission_name |
| `email` | payment_email(小文字化済み) |
| `phone` | legacy: receipt_id / 新フロー: `null` |
| `category` | country |
| `message` | mission_summary(必要なら `\n\n[Website/SNS] <sns>` 追記) |
| `ticket_number` | `KM-YYYYMMDD-NNNN` |
| `founding_cohort` | `env.CURRENT_CYCLE` の値(Cycle 番号) |
| `paid` | `/entry/pay` 経由なら `1`, レガシー `/entry` は `null` |
| `square_payment_id` | Square Payments API の `payment.id` |
| `ip` | `CF-Connecting-IP` |
| `created_at` | 自動(DEFAULT CURRENT_TIMESTAMP) |
