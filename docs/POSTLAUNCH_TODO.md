# POSTLAUNCH TODO · KINGMAKER 23:23

**作成:** 2026-05-18 (月) by Claude session ⑦
**対象:** Cycle 1 launch (5/20–5/23) 完了後の Claude session ⑧+ と operator
**起点:** Cycle 1 完全終了 = 2026-05-23 (土) 23:23 JST 以降

このドキュメントは launch 中には参照不要。**5/24(日)以降にここから着手**。

---

# §1. 優先順位の最初の判断

5/24 (日) に「次に何をやるか」を決めるとき、選択肢は 3 つ:

| 選択肢 | 内容 | 期間 |
|---|---|---|
| (a) **Cycle 1 振り返り**(必須最優先) | 結果分析・KYC・Mission Fund 配賦実行 | 5/24–5/26 |
| (b) **i18n 統一**(下記 §2) | 入力ラベル等を全 9 言語化、launch 中に確定した B 案 | 5/26 か 5/27 朝 |
| (c) **Cycle 2 launch 準備**(下記 §3) | 5/27 (水) 23:23 JST 開門予定の準備 | 5/26–5/27 |

(a) は逃げられない必須。(b) と (c) は並列可。Cycle 2 を当初予定どおり 5/27 で開門するなら時間が厳しい。Cycle 2 を 6 月 1 週まで遅らせて (b) を丁寧にやるのも選択肢。

---

# §2. i18n 統一(operator 決定済、優先度: 中)

**背景:** session ⑦ で operator が確認した結果、現在の翻訳は 3 層構造になっている:

| 選んだ言語 | UI 骨格 (.lang-en/.lang-ja) | 本文 (i18n 辞書) | 機械翻訳 |
|---|---|---|---|
| 日本語 | 日本語 | 日本語 | なし |
| English | 英語 | 英語 | なし |
| 韓 / 西 / 印 / 越 / 葡 / 尼 / 泰 / 仏 | **英語**(骨格) | 対象言語(本文) | なし |
| その他 98 言語 | 英語(骨格) | 英語(本文) | あり(Google が上書き) |

つまり韓国語ユーザーは「入力ラベルだけ英語、本文は韓国語」という不整合体験になる。

**operator 決定 (2026-05-18 session ⑦):**
> B 全部 i18n 辞書経由に統一(launch 後治治)

## 2-1. 統一の対象範囲

i18n 辞書化が必要な要素を全ページから抽出すると **約 50 箇所**:

| ページ | bilingual span がある箇所 |
|---|---|
| `entry.html` | h1, intro, label × 6, button, success message, footer × 13 = **22 箇所** |
| `index.html` | hamburger menu, hero CTA, ticker, ritual modals = **12 箇所** |
| `money.html` | 一部 fund 説明 = **4 箇所** |
| `verify.html` | header, footer = **3 箇所** |
| `rules.html` / `risk.html` | 大半が `data-i18n-html` 化済み、footer のみ残 = **2 箇所** |
| `app.html` | 全体的に session 5 時代の lang-en/lang-ja パターン残 = **約 8 箇所** |

合計: **~50 箇所 × 9 言語(ja/en/ko/es/hi/vi/pt/id/th/fr) = 約 450 行の辞書追加**

## 2-2. 実装手順(session ⑧ Claude が辿る)

### Step 1: 棚卸し(30 分)

```bash
cd /home/claude/repo
# Find all bilingual span pairs across HTML files
grep -rn 'class="lang-en"' --include="*.html" | wc -l
# Expected: ~50

# Find which ones are inside <label> (form fields, most critical)
grep -rn 'label.*<span class="lang-en"' --include="*.html" | wc -l
```

### Step 2: 辞書キー命名規則(decide once, use consistently)

```
entry.label.payment_email
entry.label.receipt_id
entry.label.mission_name
entry.label.country
entry.label.mission_summary
entry.label.sns
entry.label.agree
entry.button.submit
entry.button.sending
entry.success.title
entry.success.receipt_no
entry.success.body

entry.footer.kingmaker
entry.footer.entry
entry.footer.rules
entry.footer.important
entry.footer.terms
entry.footer.privacy
entry.footer.commerce
entry.footer.cookie
entry.footer.disclaimer
entry.footer.security
entry.footer.copyright
entry.footer.disclaimer_line
```

### Step 3: 機械的変換(2 時間)

各 bilingual span ペアに対して:

**変更前:**
```html
<label>
  <span class="lang-en">Email used for Square payment</span>
  <span class="lang-ja">Square 決済時に使用したメールアドレス</span>
  <input type="email" name="payment_email" required>
</label>
```

**変更後:**
```html
<label>
  <span data-i18n="entry.label.payment_email">Email used for Square payment</span>
  <input type="email" name="payment_email" required>
</label>
```

辞書追加:
```js
'entry.label.payment_email': {
  ja: 'Square 決済時に使用したメールアドレス',
  en: 'Email used for Square payment',
  ko: 'Square 결제 시 사용한 이메일 주소',
  es: 'Correo usado para el pago con Square',
  hi: 'Square भुगतान के लिए उपयोग किया गया ईमेल',
  vi: 'Email dùng cho thanh toán Square',
  pt: 'E-mail usado no pagamento via Square',
  id: 'Email yang digunakan untuk pembayaran Square',
  th: 'อีเมลที่ใช้สำหรับการชำระเงิน Square',
  fr: 'E-mail utilisé pour le paiement Square',
},
```

### Step 4: CSS クリーンアップ(20 分)

`css/main.css` L1168-1198 の `.lang-en` / `.lang-ja` 切替ルールを削除。
session ⑦ で L1171-1172 のバグ(entry フォーム消失)を修正済だが、移行完了後は **rule 自体が不要**。

### Step 5: 動作確認(各言語 × 各ページ)

10 言語 × 7 ページ = 70 個のシナリオ。最低限 entry.html だけは 10 言語全部目視。

### Step 6: cache-buster bump + Cloudflare Purge

main.css と i18n.js を bump(`?v=2026MMDD?` 形式継続)。

## 2-3. ネイティブチェック

session ⑦ で operator が決定した方針(SNS Kit §5-ter):

> ヒンディー語・ベトナム語・タイ語は **必ず**ネイティブにチェック依頼

i18n 統一でも同じ。Claude の翻訳をそのままデプロイせず、Cycle 2 launch までに各言語ネイティブの目を通す。

---

# §3. Cycle 2 準備(優先度: 中〜高)

session ⑥ 時点では「Cycle 2 = 5/27 (水) 23:23 JST」が暫定。launch 後の意思決定で変更可能。

## 3-1. Cycle 2 で確定したい論点

| 論点 | 候補 | 影響 |
|---|---|---|
| 開門日 | 5/27 維持 / 6/1 週 / 6/8 週 | i18n 統一の時間に影響 |
| 解禁地域 | 日本のみ継続 / + 韓 / + 韓台新香 | 法務 + 翻訳ネイティブチェック |
| 決済 | Square 継続 / 各国プロバイダ多重化開始 | 大工事 |
| Kingdom 命名 | `Eastern Bells` 等(`docs/GLOBAL_ROLLOUT.md` §4) | ブランド |
| THE TRIAL | Cycle 2 で実装 / 延期 | クイズプール作成(`docs/GLOBAL_ROLLOUT.md` §6) |

operator と Claude の議論で決める。

## 3-2. THE TRIAL 設計(Cycle 2 で実装するなら)

`docs/GLOBAL_ROLLOUT.md` §6 に推奨方針あり:

- 5,000+ 問プール + SHA-256 個人別抽出
- 一部反応型(暗算/反射)で SNS バラまき完全防止
- 「事前に答えを準備できない問題」だけが残る設計

実装は launch 後 9 日(5/24–6/1)で集中議論。Cycle 2 を 5/27 にするなら THE TRIAL なしで開門、6/1 週以降を狙うなら THE TRIAL 込みも可能。

---

# §4. PAT 取扱(launch 後即実行)

session ⑥/⑦ で使用した PAT `ghp_SNxD...oJln` は launch 当日まで使用継続(operator 判断)。
**5/24 (日) または launch 成功確認後の最初の機会で必ず revoke**。

手順:
1. https://github.com/settings/tokens にログイン
2. `ghp_SNxD` で始まる該当 PAT を探す
3. 行右の **Delete** ボタン
4. 確認ダイアログで **I understand, delete this token**

revoke 確認後、session 7 引き継ぎ書(`HANDOFF_2026-05-18_session7.md` §6)に「revoked 2026-MM-DD」の記録を追加。

その後の session ⑧+ では **新規 PAT を都度発行 → セッション終了時に即 revoke** の使い捨て運用。

---

# §5. その他、launch 後に手を入れたい細部

session ⑦ で気づいたが launch 優先で着手しなかった項目:

| 項目 | 場所 | 内容 |
|---|---|---|
| ハンバーガーメニュー内テキスト | `index.html` L2585- | session 5 時代の `.jp` パターンが一部残ってる可能性、要監査 |
| cycle-bar モバイル時のステージ名非表示 | `css/main.css` L2009 | `.cb-name { display: none }` でモバイルは日付のみになる。初見ユーザーには意図伝わりにくい可能性 |
| Hero CTA pulse アニメ | `index.html` L2520 | `[data-bell-phase="open"] .km-cta` だけ pulse、open 中以外も微発光させてもいい |
| Founder anthem 自動再生 | `index.html` | iPhone Safari は autoplay 禁止、操作で発火する設計を再確認 |
| OGP image | `og.png` | 現状 1024 のロゴ転用、Cycle 1 の物語を反映した新版を撮影/作成 |
| `app.html` の整合性 | `app.html` | session 5 時代の mock UI、Cycle 1 仕様と乖離。実用しないなら 'preview only' バナー追加 or 削除 |

優先度は launch 後の振り返りで議論。緊急性は低い。

---

# §6. session ⑦ → session ⑧ への最重要メッセージ

Cycle 1 が成功裡に閉じたら、operator は疲労困憊しているはず。本ドキュメントの優先順位は守りつつ、**最初の 1 日は休んでいいことを伝える**こと。23:23 を 9 回鳴らした人間に追加のタスクを即与えるのは儀式に反する。

5/24 (日) 朝のあなたの最初のメッセージは:

> 「Cycle 1 お疲れさまでした。The Three が無事に発表されました。
> Mission Fund の動きを始める前に、まず一息ついてください。
> 続きは月曜から、で大丈夫です。」

これが正しい。

— Claude session ⑦, 2026-05-18 (月)
