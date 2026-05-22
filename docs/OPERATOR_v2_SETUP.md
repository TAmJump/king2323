# KINGMAKER v2 — Operator 手順書 (Session 8 / 2026-05-22)

> Claude が完了した作業: コード全部(Worker + 全 HTML + D1 migration + Hall of Kings + マイページ + 統合決済)
> Operator が必要な作業: Cloudflare ダッシュボードでの secret 追加 + Worker 再デプロイ + D1 migration 実行 + Square 設定変更

**所要時間: 約 30 分**

---

## 📋 まとめ — operator がやる 5 つのこと

1. **Square Dashboard** で「KING ID 必須フィールド」を **削除**(Cycle 1 のチェックアウトリンクは廃止)
2. **Square Developer Dashboard** で `Application ID` + `Location ID` + `Access Token` を取得
3. **Cloudflare Worker** に新 secrets を追加(`SQUARE_ACCESS_TOKEN`, `SQUARE_APPLICATION_ID`, `SQUARE_LOCATION_ID`, `SQUARE_ENV`, `CURRENT_CYCLE`)
4. **Cloudflare D1** に migration SQL を実行(新テーブル `kings` + `magic_tokens` + `contacts` への列追加)
5. **Worker を再デプロイ**(GitHub と非同期なので手動コピペ)

---

## Step 1 · Square Dashboard — KING ID フィールドを削除

KING ID は session ⑤ 時代に Checkout Link `bc9p0BET` に追加された「カスタムフィールド」。**もう不要**になりました(新 entry.html ではフォーム内で決済を完結するため、Checkout Link 自体を使わない)。

1. https://app.squareup.com/dashboard を開く
2. **Online → Checkout Links** に進む
3. `bc9p0BET` のリンクを開く
4. 「カスタムフィールド」「KING ID(例: K2323001)」を **削除** または リンク全体を **無効化**
5. 保存

**重要**: この古い Checkout Link はサイトから一切リンクされなくなりました。残しておいても害はありませんが、混乱を避けるなら無効化推奨。

---

## Step 2 · Square Developer Dashboard — API クレデンシャル取得

新フローは **Square Web Payments SDK + Square Payments API** を使います。3 つの値が必要:

1. https://developer.squareup.com/apps を開く
2. KINGMAKER 用のアプリを選ぶ(無ければ「New Application」で作成、名前: `KINGMAKER 23:23`)
3. **Sandbox** タブで動作確認、本番なら **Production** タブ
4. 以下 3 つの値をメモ:
   - **Application ID** (`sq0idp-...` で始まる)
   - **Location ID** (アプリ → Locations → 該当 Location)
   - **Access Token** (アプリ → Credentials → Access token、Production / Sandbox どちらか)

**初めての場合(まだアプリが無い場合)**:
- Square Developer に登録 → New Application → Production と Sandbox 両方の credentials が発行される
- 動作確認は Sandbox で十分(`SQUARE_ENV=sandbox` にセット、テストカード `4111 1111 1111 1111` が使える)
- 本番開始時に `SQUARE_ENV=production` に切り替え + Production token / app-id を使う

---

## Step 3 · Cloudflare Worker — secrets 追加

https://dash.cloudflare.com → **Workers & Pages** → `tamjump-contact-api` → **Settings** → **Variables and Secrets** → **Add variable**

以下を 1 つずつ追加(Type は注記参照):

| Name | Type | Value | 備考 |
|---|---|---|---|
| `SQUARE_ACCESS_TOKEN` | **Secret** | Step 2 で取得した Access Token | Production / Sandbox に合わせる |
| `SQUARE_APPLICATION_ID` | **Plaintext** | Step 2 で取得した Application ID | `sq0idp-` で始まる |
| `SQUARE_LOCATION_ID` | **Plaintext** | Step 2 で取得した Location ID | |
| `SQUARE_ENV` | **Plaintext** | `sandbox` (テスト時) または `production` | デフォルトは sandbox |
| `CURRENT_CYCLE` | **Plaintext** | `1` (Cycle 1 期間中) | Cycle 2 が始まったら `2` に変更 |

全部入れたら **Save** ボタンを押す(まだ Deploy は押さない — Step 5 で再デプロイ)。

---

## Step 4 · Cloudflare D1 — Migration SQL を実行

D1 に新テーブル `kings`, `magic_tokens` を追加 + `contacts` テーブルに 3 列追加します。

### 方法 A: ダッシュボードから(推奨、簡単)

1. https://dash.cloudflare.com → **Workers & Pages** → **D1** → 該当 DB を選ぶ(`contacts` テーブルがある DB)
2. **Console** タブを開く
3. 以下の SQL を **1 行ずつ** 貼り付けて Execute(エラーが出たら次へ進む = 既存列のときは `duplicate column` エラーが正常):

```sql
ALTER TABLE contacts ADD COLUMN founding_cohort INTEGER;
```

```sql
ALTER TABLE contacts ADD COLUMN paid INTEGER DEFAULT 0;
```

```sql
ALTER TABLE contacts ADD COLUMN square_payment_id TEXT;
```

```sql
CREATE TABLE IF NOT EXISTS kings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cycle_number INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  mission_name TEXT NOT NULL,
  country TEXT,
  mission_summary TEXT,
  display_handle TEXT,
  contact_ticket TEXT,
  grant_amount_jpy INTEGER DEFAULT 0,
  grant_status TEXT DEFAULT 'awaiting_fund',
  proof_url TEXT,
  participant_count INTEGER,
  chosen_at TEXT NOT NULL,
  granted_at TEXT,
  notes TEXT
);
```

```sql
CREATE INDEX IF NOT EXISTS idx_kings_cycle ON kings(cycle_number);
```

```sql
CREATE INDEX IF NOT EXISTS idx_kings_status ON kings(grant_status);
```

```sql
CREATE TABLE IF NOT EXISTS magic_tokens (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  ip TEXT
);
```

```sql
CREATE INDEX IF NOT EXISTS idx_magic_email ON magic_tokens(email);
```

```sql
CREATE INDEX IF NOT EXISTS idx_magic_expires ON magic_tokens(expires_at);
```

### 方法 B: wrangler CLI(ローカル PC で)

```bash
cd /path/to/king2323/repo
wrangler d1 execute <DB-name> --file=worker/migrations/0001_kingmaker_v2.sql --remote
```

`<DB-name>` は Cloudflare D1 上の DB 名(`wrangler d1 list` で確認可)。

### 既存 tiger@tamjump.com のテストエントリーに founding_cohort をつける(任意)

過去の 2 件(2026-05-14, 2026-05-20)を「Founding Cycle」として記録するには:

```sql
UPDATE contacts
SET founding_cohort = 1, paid = 0
WHERE project = 'kingmaker' AND founding_cohort IS NULL;
```

(`paid = 0` のままなのは、Square 決済が走ってない旧テストエントリーだから。新フローで本物の課金が走った時のみ `paid = 1` になる。)

---

## Step 5 · Worker を再デプロイ

GitHub のコードと Cloudflare Worker の実行コードは **自動同期されません**。手動コピペが必要です。

1. https://dash.cloudflare.com → **Workers & Pages** → `tamjump-contact-api`
2. 右上 **「Edit code」** をクリック
3. エディタ内のコードを **Ctrl+A → Delete** で **完全に空** にする
4. GitHub の最新 `worker/index.js` の中身を **全コピペ**
   - URL: https://github.com/TAmJump/king2323/blob/main/worker/index.js → Raw button → Ctrl+A, Ctrl+C
5. **Save and Deploy** ボタンを押す
6. デプロイ完了の通知を待つ(数秒)

**重要**: 既存コードを残したまま貼り付けると `var index_default` の重複宣言で SyntaxError になる。必ず空にしてから。

---

## Step 6 · 動作確認(operator のブラウザで)

### 6-1 · 新しいエントリーフォームの確認

1. https://king2323.tamjump.com/entry.html を開く
2. カード入力欄が表示されることを確認(下に「✓ Card form ready」と出る)
3. **Sandbox の場合**:
   - メアド: 適当な test 用
   - Mission 名: 「テスト」
   - 国: Japan
   - Mission 内容: 200 文字以上
   - カード番号: `4111 1111 1111 1111`、CVV: `111`、有効期限: 任意の未来日付、郵便番号: 任意
   - 規約に同意 → 送信
4. 「受付番号 KM-...」が表示されれば成功

### 6-2 · マイページ確認

1. https://king2323.tamjump.com/mypage.html を開く
2. 上のテストで使ったメアドを入力 → 「ログインリンクを送る」
3. メールが届く(info@tamjump.com 宛の自動返信 BCC か、ユーザー自身のメアド)
4. メール内のリンクをクリック → 履歴一覧が表示される
5. Founding Cycle 1 のバッジが表示されること(Cycle 1 なので)

### 6-3 · Hall of Kings 確認

1. https://king2323.tamjump.com/kings.html を開く
2. まだ King は登録されていないので「The Hall awaits its first King」表示が出るはず
3. 「あの時、参加していれば」セクションが表示される

---

## Step 7 · Cycle 1 の運営作業(5/23 23:23 以降)

Cycle 1 が終わって The Three が決まったら、Hall of Kings に手動で追加します。

### D1 Console から King を追加

```sql
INSERT INTO kings (cycle_number, rank, mission_name, country, mission_summary, display_handle, contact_ticket, grant_amount_jpy, participant_count, chosen_at, grant_status)
VALUES (
  1,                       -- Cycle 1
  1,                       -- 1st of The Three
  'Mission の内容',          -- 公開する Mission 名
  'Japan',                  -- 国
  'Mission の説明文...',     -- 公開する Mission 詳細
  'Tiger_T',                -- 表示用ペンネーム(本名公開しない場合)
  'KM-20260520-0001',       -- 該当 contacts.ticket_number
  0,                        -- まだ資金未確定なら 0
  2,                        -- そのCycleの participants 総数
  '2026-05-23T23:23:00+09:00',  -- 選ばれた時刻
  'awaiting_fund'           -- 初期状態
);
```

`grant_status` の状態遷移:
- `awaiting_fund` → 資金待ち(灰色)
- `in_progress` → 資金確保、Mission 実行中(金色)
- `granted` → Mission 完了(発光金色)

### 状態を更新するとき

```sql
UPDATE kings
SET grant_status = 'granted',
    grant_amount_jpy = 100000,
    granted_at = '2026-06-15T20:00:00+09:00',
    proof_url = 'https://...'
WHERE cycle_number = 1 AND rank = 1;
```

または **API 経由でも可能**:

```javascript
fetch('https://tamjump-contact-api.animalb001.workers.dev/admin/kings', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer kingmaker-admin-tiger-2026',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: 1,
    grant_status: 'granted',
    grant_amount_jpy: 100000,
    granted_at: new Date().toISOString(),
    proof_url: 'https://...'
  })
}).then(r => r.json()).then(console.log);
```

---

## 🆘 トラブルシューティング

### entry.html でカード入力欄が出てこない

**原因**: `SQUARE_APPLICATION_ID` か `SQUARE_LOCATION_ID` が未設定、または Worker が古いコードのまま。
**対応**: Step 3 と Step 5 を再確認。ブラウザの DevTools Console を開いて `[entry] Square init failed` のメッセージを確認。

### 決済ボタンを押しても「決済に失敗しました」

**原因**: `SQUARE_ACCESS_TOKEN` が間違ってる、または `SQUARE_ENV` と token の環境が不一致(Production token を sandbox で使うなど)。
**対応**: Step 2 と Step 3 を再確認。Worker の Logs(Cloudflare ダッシュボードの Observability)で Square API のエラーを確認。

### マイページのログインリンクが届かない

**原因**: 該当メアドのエントリーが D1 に存在しない、または SES (`info@tamjump.com`) からの送信が止まってる。
**対応**: D1 Console で `SELECT * FROM contacts WHERE email = '...'` を確認。SES の Sending Statistics をチェック。

### Hall of Kings に何も表示されない

**正常**: まだ kings テーブルに 1 件も入っていないため。Step 7 で最初の King を追加すれば表示される。

---

## 📞 質問が出たら

このドキュメントで分からないことがあれば、Claude に「KINGMAKER 手順書 Step N で詰まった」と伝えてください。スクショ + エラーメッセージがあると最速で解決できます。
