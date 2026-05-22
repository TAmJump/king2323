# HANDOFF · KINGMAKER 23:23 · Session ⑦ Final → Session ⑧ Start

**作成:** 2026-05-21(木曜)by Claude session ⑦ 最終ターン
**スコープ:** session ⑧ Claude(launch 当日または直前)が最初に読むべきドキュメント
**位置づけ:** `HANDOFF_2026-05-14_session6_complete.md`(canonical bible, 1245 行)+ `HANDOFF_2026-05-18_session7.md`(session 7 中盤の補遺、335 行)に**追加して読む**最終スナップショット
**重要:** このファイルは過去の引き継ぎ書を **置き換えない**。並列して存在する。過去ファイルは歴史記録として永続保存。

---

# § 0. ひとことで言うと

**Cycle 1 launch は 2026-05-20 (水) 23:23 JST に開門済み**(session ⑦ 終了時点で開門済の前提で書く。実際の確認は session ⑧ で)。**Claude 側でできる作業は全て完了**。残る作業はすべて operator 手作業(Cloudflare ダッシュボード操作、Worker 再デプロイ、テスト購入、WAF 設定など)。

session ⑦ で起きた最大の出来事:

1. **entry.html がほぼ全面再構築された**(13 連続 commit、operator のスクリーンショット駆動デバッグ)
2. **新規ページ 2 つ追加**: `how-it-works.html`(ゲーム説明)+ `mypage.html`(Receipt 検索)
3. **PAT ローテーション完了**(旧 PAT revoke 済、新 PAT は carepass と共有運用)
4. **9 言語 i18n 統一が entry.html について完了**(他ページは launch 後の POSTLAUNCH_TODO §2)

---

# § 1. 現在地スナップショット(2026-05-21 木曜 終了時点)

| 項目 | 状態 |
|---|---|
| サイト URL | https://king2323.tamjump.com |
| 最新コミット(コード) | `ea8ef45` (v20260521c) |
| 最新コミット(fx 自動更新) | `8d87d35` (USD/JPY = 158.92 on 2026-05-21) |
| Cycle 1 schedule | **5/20 (水) 23:23 JST 開門 → 5/22 (金) 23:23 JST 受付終了 → 5/23 (土) 23:23 JST The Three 発表** |
| 全 HTML ページ数 | **10**(index, entry, money, verify, rules, risk, app, 404, **how-it-works, mypage**) |
| 全コード言語(i18n 辞書) | **9 言語**(ja / en / ko / es / hi / vi / pt / id / th / fr) |
| 言語ピッカー表示 | **10 言語のみ**(108 言語表示は v20260518n で TIER-1 限定に変更) |
| Worker | `tamjump-contact-api` — `/contact`, `/entry`, **`/entry/lookup`**(21b 追加, **未デプロイ**), `/admin/contacts` |
| D1 | `contacts` テーブル, `project='kingmaker'` で識別 |
| Square Checkout | `bc9p0BET`(¥100 単発、変更なし) |
| PAT 状態 | **§ 6 参照**(rotated 2026-05-21) |

---

# § 2. 本セッション(session ⑦ 終盤、5/18-5/21)で起きたこと、詳細

過去の session 7 引き継ぎ書(`HANDOFF_2026-05-18_session7.md`)は session 7 **中盤までの状況**を記録した document。本 § は **5/18 以降の後半作業 + 5/21 の最終ターン**を端折らずに記録する。

## 2-1. v20260518e: Cycle-1 status bar + 3-phase CTA gating + slate play button

session 5 時代の毎週金曜モデルが `js/main.js` の `getBellState()` にまだ残っていた。三段階 Cycle 1(5/20 → 5/22 → 5/23)用に完全書き換え。state machine は 4 phase を返す:

- `pre_open`: 5/20 23:23 前
- `open`: 5/20 23:23 〜 5/22 23:23(46 時間)
- `pending_three`: 5/22 23:23 〜 5/23 23:23(23 時間)
- `cycle1_complete`: 5/23 23:23 以降

CTA HTML には open 状態以外の 3 つの locked state span を追加(「🔒 Bell opens 5/20 · 23:23 JST」「🔔 Receipt closed · Awaiting The Three」「✦ Cycle 1 complete · Cycle 2 ahead」)。

cycle-bar(ヘッダ直下の sticky な countdown + 3 段階インジケータ)が **初登場**。三つのドットが順次金色脈動する。

ヒーロー ▶ ボタンは **6 回イテレーション後に slate-grey で決着**(赤円盤 → ルビー宝石 → 最終的にマット slate at top:38% inside crown 三角)。

## 2-2. v20260518f: countdown bilingual labels

operator 指摘: 「カウントダウンが英字単頭文字 D/H/M/S だけ」。bilingual span pair を追加して、日本語モードでは Days·日 / Hrs·時 / Min·分 / Sec·秒 表示。

## 2-3. v20260518g: ritual.why 矛盾文修正 + GLOBAL_ROLLOUT.md 新規

`ritual.why.p1` が「Five minutes a week. No more.」で終わっていて三段階モデルと矛盾。`ritual.why.p2` も「金曜開門 / 月曜閉門 / 各国現地時刻同期」と内容自体が矛盾。9 言語全部書き直し。

並行して、operator の戦略議論(10 億同時アクセスの困難 / 各国現地時刻 vs JST / クイズ SNS バラまき対策)を `docs/GLOBAL_ROLLOUT.md` (~250 行)に **草稿として保存**。Cycle 1 launch には影響しない、5/24 以降の議論用。10 セクション構成。

## 2-4. v20260518h: 重なり修正 + session-5 遺物一掃 + sticky cycle-bar

operator のスクリーンショットで 3 つの問題が同時発覚:

**問題 1: CTA が H1 と重なる**
原因: `position: absolute` で opacity 0/1 切替 → ボタン bounding box が `.km-cta-default`(¥100)の短いサイズのまま、長い locked テキストが overflow して H1 と重なって見える。
修正: `display: none / display: inline-flex` 切替に書き換え。アクティブな state だけ flow に乗るので、ボタンが自動でサイズ調整。

**問題 2: カウントダウン「Bell opens in」二重表示**
原因: 静的ラベル「— THE BELL OPENS IN —」+ JS が `#cd-target` に同じ文字列を書いていた。
修正: 上ラベルは phase verb(動的、「Bell opens in / Bell rings in / The Three announced in」等)、下 target は JST 日時(「5/20 · 23:23 JST」)。新規 `formatTargetJst()` ヘルパー追加。

**問題 3: cycle-bar が見えない**
原因: 100vh のフルスクリーンゴリラ画像の **後** に配置されていた → スクロールしないと見えない。
修正: ゴリラ画像の **前** に DOM 移動 + `position: sticky; top: 60px` で navbar 直下に常駐。背景を半透明 parchment(`rgba(248, 244, 235, 0.92)` + backdrop-filter)に。

**並行 session-5 遺物 8 箇所一掃**:
- index.html H1 の「— this week, only this week —」削除
- index.html meta description × 3:「Every Friday 23:23–23:28...One King is chosen」→「The Bell rings at 23:23 JST. The world chooses The Three」(「One King」も Session 6 の The Three と矛盾、SNS シェアプレビューで致命的)
- ticker.bell_window 9 言語:「Friday 23:23 — 23:28 · 5 minutes」→「The Bell rings at 23:23 JST」
- index.html ticker static fallback × 2
- rules.html L66:「Friday 23:23 JST — Receipt closes. Five-minute window opens」削除
- app.html cd-target「Friday · 23:23 JST」→「Bell rings at 23:23 JST」
- app.html og/twitter description「Every Friday 23:23 JST, the Bell opens for 5 minutes」→「The Bell rings at 23:23 JST」
- app.html voting line「Voting closes Friday · 23:28 JST」→「Voting closes when the Bell rings」

## 2-5. v20260518i: ?preview= visual QA モード

operator が「launch 前に open 画面が見たい」と要望。実際の schedule constants を変えるとリスク大(誤って prod が早く open 状態になる事故)。代わりに **URL クエリで現在状態を spoof** する仕組みを追加。

- `?preview=pre` → pre_open(現在の実状態)
- `?preview=open` → open phase(CTA active、stage 2 金色脈動)
- `?preview=pending` → pending_three(🔔 Receipt closed)
- `?preview=complete` → cycle1_complete(Cycle 2 開門までカウント)

`getBellState()` の最初で `previewPhase()` をチェック、クエリがあれば `fakeStateForPreview(phase)` が返す state object を使う。クエリなしの本物の visitor には影響なし。

## 2-6. v20260518j: entry.html 壊れた CSS + cache buster 取り残し解消

operator スクリーンショット:「Mission エントリーを送信」ボタンが押せない、入力欄が見えない。

原因 (a): `entry.html` L62-70 に開き括弧なしのぶら下がり declaration block。元の rule(L44-61)を閉じた後に宙ぶらりんの properties が並んでいた。CSS パーサーが silently 捨てた結果、`<input>` は browser default の最小サイズ(高さ 1px 程度)に潰れて見えなかった。ボタンは押せていたが、空フォーム送信で validation エラー → エラーボックスも入力欄の下で同じく collapse して見えなかった。

修正 (a): 完全に新しい declaration block に書き直し、`display: block; width: 100%; box-sizing: border-box; min-height: 44px` を保険で強制。

原因 (b、これが大きい): **`i18n.js` と `fx.js` の cache buster が session 5 時代の `?v=20260514d` で全ページ取り残されていた**。session 6/7 ずっと `main.js?v=...` と `main.css?v=...` ばかり bump して、`i18n.js?v=...` と `fx.js?v=...` を完全に放置していた。私(Claude)の責任。session 7 で修正した i18n 辞書(`ritual.why.p1/p2`, `ticker.bell_window`)は**世界中の誰のブラウザにも届いていなかった**。ハードリフレッシュしても URL は同じだから Cloudflare 側もブラウザ側もキャッシュを取り替えなかった。

修正 (b): 全 8 ページの `i18n.js` と `fx.js` cache buster を `?v=20260518i` に統一 bump。

## 2-7. v20260518k: JP モードで entry フォーム消える根本バグ

operator が **3 枚スクリーンショットを並べて送ってきた**(三角測量):
- 日本語選択 → 入力欄消える
- English 選択 → 入力欄見える
- 한국어 選択 → 入力欄見える

= **「JP モードのときだけ発症する CSS rule」**が存在する、と即座に判明。

犯人:`css/main.css` L1171-1172 の session 5 時代のレガシー:

```css
html[data-display-lang="ja"] .entry-page label:not(.jp):not(.lang-ja) {
  display: none;
}
```

意図:「日本語モード時、英語版の `<label class="en">` を消す」(session 5 当時の bilingual パターン)
実害:現在の entry.html は `<label>` を **クラス無しの中立 wrapper** として使い、中の `<span>` で言語切替している。だからクラス無し label が全部マッチして消える → 中の `<input>` も巻き込まれて消える。

修正:「`.en` か `.lang-en` クラスを **明示的に持つ** label だけを消す」に変更。クラス無し label は無事生き残る。ミラー側のルール(L1186-1192)は既に `label.jp` 限定で書かれていたので問題なし。

**学び:operator の三角測量スクリーンショットがなければ、私はこのバグを何時間もかけて探していた**。session ⑧ Claude も同じパターンで助けてもらえると思う。

## 2-8. v20260518L: POSTLAUNCH_TODO.md 新規

operator: 「B 全部 i18n 辞書経由に統一(launch 後治治)」を確認。50 サイト × 9 言語 = 450 行の辞書追加 + ネイティブチェックは launch 前(残り 50 時間)に終わらない。

`docs/POSTLAUNCH_TODO.md` (~200 行) を作成。session ⑧+ が 5/24 から着手する内容:
- § 1: 三方向優先順位(Cycle 1 retro 必須 / i18n 統一 / Cycle 2 prep)
- § 2: i18n 統一の step-by-step(棚卸し → key 命名規則 → 機械的変換 → CSS cleanup → 言語×ページ QA → cache bump)
- § 3: Cycle 2 オープン論点(開門日、解禁地域、決済プロバイダ、Kingdom 命名、THE TRIAL 実装可否)
- § 4: PAT revoke procedure(セッション ⑦ 時点の予定だが、5/21 に operator が前倒し実行 → § 6 参照)
- § 5: launch 後の細部 polish 項目
- § 6: session ⑧ Claude へのメッセージ(「最初の 1 日は休む」)

## 2-9. v20260518m: entry.html 9 言語 i18n 統一

operator: 「今すぐ 9 言語ネイティブ翻訳して」。他ページは POSTLAUNCH_TODO §2 通り launch 後だが、**entry.html だけは launch 前に完成**させた(参加者の決済画面、最重要)。

実装:
- 16 dictionary-driven elements: title / sub / intro / 6 input labels / agree-row(リンク 3 本入り)/ submit / sending / success(3 要素)/ entry note / 6 footer links
- 24 要素 × 9 言語 = 216 翻訳
- ブランド語彙(KINGMAKER, Bell, Cycle, Mission, Grant, Square, 23:23, JST, Founding Bell, AML, Bell Entry)は全 9 言語で untranslated
- `window.applyContentTranslations` を expose(動的 data-i18n-html 切替後の再 render 用)
- 送信ボタンの「Sending…」「Submit」も辞書経由

**翻訳信頼度の自己評価**(私から正直に):
| 言語 | 信頼度 |
|---|---|
| ja / en | ◎ |
| 仏 / 西 / 葡 | ○ |
| 韓 / 尼 | △ |
| **印 / 越 / 泰** | **△、ネイティブチェック必須** |

## 2-10. v20260518n: 言語ピッカー 10 言語限定 + Mission 文字制限 + ワンタップ再エントリー

operator から 3 件の要望:

**Q1**: 「プルダウンは翻訳される国だけ表示にして。入ってると翻訳できると思っちゃう」
→ ピッカーを TIER 1(10 言語)限定。TIER 2(他 98 言語、辞書登録なし)は非表示。LANGS 配列内のデータはそのまま、表示時に slice(0, 10) するだけ。

**Q2**: 「一度エントリーした場合、次回はワンタッチでエントリー」
→ localStorage で email/mission_name/country/sns を保存。次回プリフィル + CLEAR ボタン。receipt_id と mission_summary は **意図的に保存しない**(Cycle ごとに新規必須)。

**Q3**: 「Mission の内容、20〜50 文字以内とか文字制限掛けないと、読んで選ぶ側が面倒」
→ 当初 20-50 文字で実装(operator 提案)。次の commit で 200-500 に拡大される。リアルタイム文字カウンタ + 3 状態色変化(warn / ok / over)+ クライアント側バリデーション。

## 2-11. v20260518o: ブランド語保護 + ロゴ統一 + Mission 200-500 + receipt 任意

operator スクリーンショット衝撃:
- タブタイトル「**創立の鐘の音 · キングメ...**」
- H1「**建国の鐘エントリー**」

= **Google Translate がブランド語を機械翻訳していた**。

原因: 私が v20260518m で entry.html の `<main class="entry-page notranslate" translate="no">` から `notranslate translate="no"` を外していた。「辞書システムが全 visible string を扱う」という前提だったが、placeholder や header brand mark や Cycle ラベルや `<title>` 等は Google の制御下のままだった。日本語ピッカー選択中なのに、Google がページの `lang='ja'` を検知して自動翻訳を **ja に再翻訳**して、ブランド英語が「建国の鐘」「キングメーカー」に変換された。

修正:
1. `<main>` に `translate="no"` 復活、`<h1>` と header brand-link に `notranslate` 追加。辞書システムは私たちの JS が動かすので Google の translate フラグの影響を受けない。

同時に operator から 3 件の質問:

**Q1**: 「Square 領収書 ID、これが意味分からないんだよね。入力しなきゃダメ?もしくは自動で入力されるようにして」
→ 任意項目化。`required` 削除、placeholder を「例: 2026-05-20 23:25 JST」に。ラベル「Square 決済日時(JST)— 任意、領収書 ID があれば併記」に変更。9 言語全部更新。

**Q2**: 「ミッション名(短く、一行で)選択する場合はこっちで選べばいいのか」
→ 認識正しい、Mission 名 = 一行タイトル、Mission 内容 = 詳細説明。

**Q3**: 「Mission の内容は 200?500? 文字以内とか」
→ 私の推奨は 100-300 字、operator が「200-500 字」を選択。20-50 → 200-500 に拡大。カウンタ「N / 500」、textarea を `min-height: 160px` に拡大、9 言語ラベル更新。

**並行: ロゴ統一**
operator: 「左上の logo は何でゴリラ logo じゃないの?すべてのページ統一されてる?」
監査結果:
| ページ | 状態 |
|---|---|
| index / money / verify | ゴリラ画像 ✓ |
| **entry / rules / risk** | ♛ 絵文字 ✗ |
| app / 404 | (logo なし、意図的) |

entry / rules / risk の 3 ページ header brand-link を 32px ゴリラ画像(`assets/logo-v3-128.png`)に統一。

## 2-12. v20260518p: myth_03_enigma フライヤー差し替え

operator が新しい flyer 画像を upload(`k2323_03_enigma_light.png`、実はファイル名 PNG だが中身 JPEG、1024×1536)。既存 `art/myth_03_enigma.webp` 80 KB を差し替え。

Pillow で 800×1200 WebP quality 85 に変換(他の myth_*.webp と統一)。83 KB。HTML 参照 (`index.html` L2914) はそのまま、新版を自動的に拾う。

差分:
- 旧: 右上「KINGMAKER · 23:23 · 03/04」ヘッダ + 3 例(シーザー / ユークリッド / 9.11)
- 新: ヘッダなし(double-branding 解消)+ アフォリズム「陰謀じゃない。錯覚かもしれない。でも、見つけ始めると止まらなくなる。」のみ

## 2-13. v20260521a: PAT ローテーション記録

**operator: 「github の PAT は更新してるからね。carepass の引き継ぎ書に記載してあるから」**

operator が carepass プロジェクトの引き継ぎ書 (`HANDOVER_v13.md`)とその repo (`carepass-main__7_.zip`) を共有。私は carepass を `/home/claude/carepass-ref/` に展開して構造を把握(`<README.md>` から始まる多数のファイル)。

確認質問: 「kingmaker リポへの push に使う PAT はどれですか?」
回答: 「両リポをカバーする新 PAT (ghp_7PPAq...1rOv) として、kingmaker の古 PAT (ghp_SNxD...oJln) は revoke 済」

→ git remote URL を新 PAT に切替、fetch で動作確認 OK。

**新 PAT の **フル値** (この引き継ぎ書では平文記載、operator 厳命「PAT 等は必ず記載するように」):**

```
ghp_7PPAq●●●●●●●●●●●●●●●●●●●●●●●●●●●●●1rOv
```

**注意**:
- この PAT は **carepass + king2323 両 repo に対する repo scope を持つ共有 PAT**
- 漏洩は両プロジェクトに影響
- 完全値の元出処: `/mnt/user-data/uploads/HANDOVER_v13.md` (carepass 引き継ぎ書) §1

旧 PAT `ghp_SNxDxD●●●●●●●●●●●●●●●●●●●●●●●●●●●●●oJln` は **revoke 済**(operator 確認、2026-05-21)。

`HANDOFF_2026-05-18_session7.md` §6 を更新済。本ファイルが正典。

## 2-14. v20260521b: how-it-works.html + mypage.html 新規(CarePass 比較から生まれた)

operator: 「添付した carepass の仕組みを参考に、kingMaker に足りてない部分結構あると思う。決済回り、マイページ部分など。あとはゲームは?どこでどうやって開催されるのか?全くイメージが付かない。carepass はあくまでも参考だからね。**ごちゃ混ぜにしないでよ!**」

私(Claude)は CarePass を整理して KINGMAKER に欠けているものを切り分けた。**コードは 1 行も持ち込まない方針**を遵守。

### CarePass と KINGMAKER の根本的な違い

| 項目 | CarePass | KINGMAKER |
|---|---|---|
| ビジネスモデル | ¥100/月 定額サブスク | ¥100 単発 Bell Entry |
| ロール | 継続支援者 + 介護施設 + 協力企業 + 運営 (4 ロール) | 参加者 + 運営 (2 ロール) |
| 決済 | Square Subscription (Plan Variation, 月末アンカー) | Square 単発 Checkout Link `bc9p0BET` |
| ログイン | パスワード + magic-link + sessions Cookie | **なし**(チケット番号で識別) |
| ゲーム要素 | なし(継続支援) | **儀式(46 時間ウィンドウ + The Three 抽出)が本体** |
| データ永続性 | 月次レポート、累計支援額、クーポン履歴 | Receipt + Mission の 1 回限り記録 |
| 個人化 | mypage(契約状況/施設/クーポン) | なし(全員が同じ瞬間に同じ画面) |

### CarePass から「考え方として」参考にできた領域

| CarePass | KINGMAKER 取り込み判定 |
|---|---|
| Cloudflare Worker + D1 + Square 統合 | ✓ 既に同等のスタック |
| Square Subscription | ✗ Cycle 1 では不要 |
| mypage 概念 | **△ Receipt 検索ページとして実装**(B 案) |
| admin ダッシュボード | △ 将来検討 |
| クーポン QR | ✗ 不要 |
| 施設ディレクトリ | ✗ 不要 |
| 月次活動報告書 | △ Cycle ごとの The Three 発表で代替 |
| マジックリンクログイン | △ 検討価値あり、Cycle 2+ で |

### operator 質問 3 つへの回答

**Q1「決済回り」**: 現状のままで十分。CarePass のサブスクは継続支援を育てる用途、KM の単発 ¥100 と要件が違う。Cycle 2+ でリピーター文化が定着したら検討。

**Q2「マイページ」**: 検討価値あり。CarePass の 4 ロール + パスワード認証は KM のブランドを壊すが、**ログイン無しの軽量版** (Receipt 番号 + メアドで照合) なら整合する。

**Q3「ゲームはどこでどうやって開催される?」**: これが最重要指摘。Cycle 1 の実体(5/20 23:23 開門 → 46 時間ウィンドウ → 5/22 23:23 受付終了 → 23 時間審査 → 5/23 23:23 The Three 発表)が **どこにも一枚絵で書かれていない**。LAUNCH_RUNBOOK や rules.html や ritual.why モーダルに断片的に書かれているが、参加者目線のフロー図ページが存在しなかった。

operator 選択: **A+B 両方やる**(A=フロー図ページ、B=Receipt 検索 mypage)

### A. how-it-works.html(280 行)実装

- 5 ステップ縦タイムライン(numbered dots、active dot は金色脈動)
  - Step 1: Bell opens (5/20 23:23 JST)
  - Step 2: Mission を出す(46 時間ウィンドウ)
  - Step 3: Bell rings(5/22 23:23 JST)— Public Seed 確定、SHA-256 抽出
  - Step 4: 運営審査(23 時間ウィンドウ)— KYC + AML + Mission 適合性
  - Step 5: The Three(5/23 23:23 JST)— verify.html 公開
- SVG 横スクロールフロー図(5 駅、間に「~46h OPEN WINDOW」「~23h REVIEW」等のラベル)
- 「これは何ではないか」否定形リスト(宝くじでない/投資でない/賭けでない/Bell は資格・お金でない/Grant は賞金でない)
- 閉じ:「選ばれたいなら、誰かを選べ。」+ Back to KINGMAKER ボタン
- 全 9 言語 i18n、ブランド語 untranslated

### B. mypage.html(350 行)実装

- **ログインなし**(KINGMAKER の儀式性を維持)
- 2 入力: email + Receipt 番号(KM-YYYYMMDD-NNNN フォーマット強制)
- POST `/entry/lookup` で Worker に照合リクエスト
- 成功時: result card(ticket / mission_name / country / mission_summary / sns / payment_email / created_at)
- 失敗時: generic 404 メッセージ(「メアド存在オラクル化」防止のため、email 正しい/番号間違いの区別を返さない)
- 「Look up another」ボタンで form に戻る
- `<meta name="robots" content="noindex">`(検索エンジン索引化を拒否)
- 9 言語 i18n

### Worker 変更(`worker/index.js`)

新ルート `POST /entry/lookup` 追加。`handleEntryLookup(request, env, origin)` 関数:
```js
const row = await env.DB.prepare(
  `SELECT ticket_number, name AS mission_name, email AS payment_email,
          category AS country, message AS mission_summary_raw, created_at
     FROM contacts
    WHERE project = 'kingmaker'
      AND email = ?
      AND ticket_number = ?
    LIMIT 1`
).bind(email.trim().toLowerCase(), ticketTrimmed).first();
```

D1 の `contacts` テーブルを再利用(新テーブルなし)。レスポンス整形時に `[Website/SNS] ...` 行を mission_summary から分離して返す。

**重要**: Cloudflare Workers Dashboard は **GitHub repo と自動同期しない**。operator が手動で worker/index.js の全文をコピペして Deploy する必要がある(LAUNCH_RUNBOOK §2 に詳細手順)。

### CarePass から **持ち込まなかった**もの(明示)

operator 厳命「ごちゃ混ぜにしないで」を守るため:
- Subscription model
- PBKDF2 password / sessions / magic-link login
- 4-role accounts table architecture
- Coupon system
- Facility / partner directory
- admin / facility-dashboard / partner-dashboard ページ
- Cron Triggers
- mobile-nav inject script

これらは CarePass の問題への CarePass の解。KM のコードに 1 行も入れていない。

## 2-15. v20260521c: session 7 final polish

session 7 最終仕上げ:

- **LAUNCH_RUNBOOK §2 大幅更新**: Worker 再デプロイ手順を Cloudflare ダッシュボードでの click-by-click で書き直し(GitHub と非同期だから手動コピペが必須)。新 `/entry/lookup` の curl 検証手順追加。
- **sitemap.xml**: how-it-works.html(priority 0.9)+ entry.html(priority 0.8)追加。mypage.html は意図的に除外(noindex)。
- **rules / risk / entry フッター統合**: 3 ページとも nav-primary に How It Works + Entry + My Receipt + Rules + Important Notices を統一表示。bilingual span パターンを辞書フックに置換(footer.howitworks_link / entry_link / mypage_link / rules_link / risk_link)。
- **index.html ヒーロー**: CTA 下に控えめなテキストリンク「→ どう動くのか, 見る · See how it works」。Mono フォント、11px、金色アンダーライン、ホバーで濃化。
- **mypage.html ?preview=open モード**: Worker 再デプロイなしでも UI が見られるよう、fake entry を synthesize する preview mode 追加。index.html の ?preview= モードと同じパターン。
- **HANDOFF_session7 §2 拡張**: 2-5/6/7 の 3 subsection を追加して 5/18-21 の作業全てを記録。§5 operator ブロッカー表に mypage.html 検証行追加、Worker 再デプロイは「必須」昇格。
- **CHANGES.md バックフィル**: v20260518d 〜 v20260521b の 16 commits 分英語 changelog 追記。

---

# § 3. 全機能ステータス(2026-05-21 終了時点)

| 機能 | 状態 |
|---|---|
| Bell Entry フォーム(entry.html) | ✓ 9 言語、200-500 字、ローカルストレージ再エントリー、preview モード |
| Mission Entry → Worker → D1 → SES 通知 | ✓ session 6 で実装、変更なし |
| Square 単発決済 `bc9p0BET` | ✓ 設定済(Square Dashboard 側) |
| verify.html The Three 抽出ロジック | ✓ session 6 で実装、変更なし |
| coin ritual モーダル | ✓ session 6 で実装、変更なし |
| Cycle 1 三段階タイマー + UI | ✓ v20260518e/f で実装 |
| カウントダウン bilingual | ✓ v20260518f |
| ?preview= モード(index.html + mypage.html) | ✓ v20260518i / v20260521c |
| **how-it-works.html(ゲーム説明)** | **✓ v20260521b 新規** |
| **mypage.html(Receipt 検索)** | **✓ v20260521b 新規。Worker 再デプロイで初動** |
| **Worker /entry/lookup ルート** | **✓ コード書済、デプロイ待ち** |
| 9 言語 i18n(entry.html) | ✓ v20260518m |
| 9 言語 i18n(how-it-works.html, mypage.html) | ✓ v20260521b |
| 9 言語 i18n(index.html, money.html 等の他ページ) | △ launch 後対応(POSTLAUNCH_TODO §2) |
| 言語ピッカー 10 言語表示 | ✓ v20260518n |
| ブランド語保護(KINGMAKER, Bell, Mission, Grant, Square 等) | ✓ v20260518o で復旧 |
| ロゴ統一(全可視ページでゴリラ画像) | ✓ v20260518o |
| THE TRIAL(3 問突破) | ✗ Cycle 2+ 機能(rules.html L90-92 で法務カバー済) |
| Standing / Streak / Crown Flame / Eternal / Oracle | ✗ Cycle 2+ |
| Royal Duty / Royal Proof / Mission Report | ✗ Cycle 2+ |
| **King 確定メカニズム** | ⚠️ Cycle 1 では曖昧表現で運用(operator 決定済、session 6 §28) |
| Receipt 検索の bilingual confirmation email | △ session ⑧ 以降検討 |
| 運営 admin ダッシュボード(D1 Web UI) | △ Cycle 2 launch までに(POSTLAUNCH_TODO §3) |

---

# § 4. リポ内ドキュメント完全マップ(2026-05-21 終了時点)

| パス | 役割 | 行数 | 更新最終 |
|---|---|---|---|
| `HANDOFF_2026-05-14_session6_complete.md` | **canonical 引き継ぎ書**(session 6 全体記録、project bible) | 1245 | session 6 |
| `HANDOFF_2026-05-18_session7.md` | session 7 中盤の補遺(2-5/6/7 で 5/21 まで延伸) | 381 | v20260521c |
| **`HANDOFF_2026-05-21_session7-final.md`** | **本ファイル**(session 7 完了スナップショット、session ⑧ 入口) | (この値) | **v20260521c+ ★** |
| `LAUNCH_RUNBOOK.md` | session 7 全面リライト、11 operator ブロッカー、Worker 再デプロイ手順 | 600+ | v20260521c |
| `docs/SNS_LAUNCH_KIT.md` | SNS 投稿テンプレ集(JA/EN + 8 言語予告) | 830 | session 7 中盤 |
| `docs/GLOBAL_ROLLOUT.md` | 世界展開戦略の議論スナップショット(草稿) | 226 | session 7 中盤 |
| `docs/POSTLAUNCH_TODO.md` | Cycle 1 後 TODO(i18n統一・Cycle 2準備・PAT revoke) | 234 | session 7 中盤 |
| `docs/archived/LAUNCH_RUNBOOK_session5_5-15.md` | 旧版 session 5 ランブック | - | アーカイブ |
| `CHANGES.md` | 全 commit 履歴の英語 changelog | 648 | v20260521c でバックフィル |
| `WAF_SEO_BYPASS.md` | Cloudflare WAF expression メモ | - | session 6 |
| `worker/README.md` | Worker の構造説明 | - | session 6 |
| `worker/index.js` | Cloudflare Worker source(`/contact`, `/entry`, **`/entry/lookup`**, `/admin/contacts`) | 605 | v20260521b |
| `sitemap.xml` | SEO サイトマップ(how-it-works + entry 追加、mypage 除外) | 65 | v20260521c |

session ⑧ Claude が読む順序:

1. **本ファイル**(`HANDOFF_2026-05-21_session7-final.md`)を最初から最後まで
2. `HANDOFF_2026-05-18_session7.md` を補完情報として
3. `HANDOFF_2026-05-14_session6_complete.md` の必要な § だけ参照(全文 1245 行は重い)
4. `LAUNCH_RUNBOOK.md` で operator 残ブロッカーを確認
5. `docs/POSTLAUNCH_TODO.md` で 5/24 以降の予定を確認

---

# § 5. operator 残ブロッカー(完全リスト、2026-05-21 終了時点)

これらは **operator しか実行できない**。Claude からは不可能。各項目に LAUNCH_RUNBOOK の参照 § を併記。

| # | 作業 | 所要 | デッドライン | 詳細 |
|---|---|---|---|---|
| 1 | **Worker 再デプロイ**(`/entry/lookup` 含む、mypage.html を動かすために必須) | 7 分 | 5/22 (Bell rings) まで | `LAUNCH_RUNBOOK §2.1` |
| 2 | curl で `/entry/lookup` 動作確認(404 が返る) | 1 分 | 同上 | `LAUNCH_RUNBOOK §2.2 (b)` |
| 3 | curl で `/entry` 動作確認(success が返る) | 1 分 | 同上 | `LAUNCH_RUNBOOK §2.2 (a)` |
| 4 | Cloudflare Cache Purge | 1 分 | 各更新後毎回 | `LAUNCH_RUNBOOK §3` |
| 5 | スケジュール変更目視確認(全ページが三段階モデル) | 5 分 | 5/22 まで | `LAUNCH_RUNBOOK §4` |
| 6 | Cloudflare WAF 設定 deploy | 5 分 | 5/22 22:00(Bell rings 前)| `LAUNCH_RUNBOOK §5`、WAF_SEO_BYPASS.md |
| 7 | Square Link `bc9p0BET` 動作確認 | 5 分 | 5/22 まで | `LAUNCH_RUNBOOK §6` |
| 8 | ¥100 テスト購入(本物の Bell Entry → Mission フォーム → メール受信まで) | 15 分 | 5/22 まで | `LAUNCH_RUNBOOK §7` |
| 9 | **mypage.html 動作確認**(テスト購入の Receipt で `/entry/lookup` 経由 lookup 成功するか) | 5 分 | 5/22 まで | 本ドキュメント § 2-14 |
| 10 | 全ページ目視(desktop)— how-it-works + mypage 含む | 20 分 | 5/22 まで | `LAUNCH_RUNBOOK §8` |
| 11 | 全ページ目視(mobile)— how-it-works + mypage 含む | 20 分 | 5/22 まで | `LAUNCH_RUNBOOK §9` |
| 12 | Twitter Card Validator で全ページ OGP 確認 | 10 分 | 5/22 まで | `LAUNCH_RUNBOOK §10` |
| 13 | Google Search Console で sitemap.xml 登録 | 5 分 | 5/23 以降可 | `LAUNCH_RUNBOOK §11` |
| 14 | テスト Entry `KM-20260514-0001` を D1 から削除 | 3 分 | 5/22 開門前 | `LAUNCH_RUNBOOK §12` |
| 15 | **TIER-1 8 言語ネイティブチェック**(印/越/泰は必須レベル) | 待ち | 推奨 5/22 まで | `SNS_LAUNCH_KIT.md §5-ter` |
| 16 | SNS 投稿(5/22 Bell rings + 5/23 The Three 発表のタイミング) | 10 分 | 各時刻 | `SNS_LAUNCH_KIT.md §1-5` |

合計: **約 2-3 時間**。

5/20 23:23 はすでに過ぎている前提なので、最優先は **Worker 再デプロイ** と **mypage.html 動作確認**(mypage は launch 後の参加者からの最大の問い合わせ源になる可能性大)。

---

# § 6. PAT 完全状態(operator 厳命「PAT 等は必ず記載するように」遵守)

## 6-0. なぜ伏字なのか(技術的制約の説明)

operator は「PAT 等は必ず記載するように」と指示した。この指示は **session ⑧ Claude が完全値を辿れるようにする**という意図と解釈する。ただし **GitHub の secret-scanning が PAT 完全値の commit を自動ブロックする**(本ファイルを最初 push しようとして拒否された、commit `c5576591`)。

そのため本ファイルでは:
- 識別可能な **prefix + 末尾 4 桁** を残す(誰でも「これはあの PAT」と特定できる)
- 完全値は **本リポ外の参照先**(後述)から取得する手順を明示

これにより:
- operator の意図(session ⑧ Claude が PAT を確実に取れる)を満たす
- GitHub の secret-scanning ブロックを回避できる
- 万一本リポが第三者に閲覧されても、PAT 平文露出にならない

完全値の元出処は **`/mnt/user-data/uploads/HANDOVER_v13.md`(carepass プロジェクトの引き継ぎ書) § 1**。session ⑧ 開始時に operator がこのファイルを共有してくれる前提。共有してくれない場合は operator に直接問い合わせる(`§ 7-3` パターン外)。

## 6-1. 現役 PAT(2026-05-21 以降)

```
ghp_7PPAq●●●●●●●●●●●●●●●●●●●●●●●●●●●●●1rOv
```

**用途**: KINGMAKER (`TAmJump/king2323`) と CarePass の両 repo に対する push/pull
**Scope**: repo(両 repo の admin 権限)
**発行**: 2026-05-21 operator が GitHub Settings → Developer settings → Personal access tokens で発行
**完全値の元出処**: `/mnt/user-data/uploads/HANDOVER_v13.md` § 1(carepass プロジェクトの引き継ぎ書)
**現在のリスク**: **carepass + king2323 両方に repo scope を持つ共有 PAT**。漏洩は両プロジェクトに影響

## 6-2. revoke 済 PAT(歴史記録)

```
ghp_SNxDxD●●●●●●●●●●●●●●●●●●●●●●●●●●●●●oJln
```

- 使用期間: session 6 〜 session 7 全体(5/14 〜 5/21)
- 使用回数: 約 30 回(jewel iterations 6 + docs 多数 + entry.html 連続修正 + 新ページ追加)
- session 6 で漏洩(チャット平文に貼付)
- 当初の方針: 「launch 後に revoke」(session 7 前半)
- 実際の運用: **2026-05-21 に operator が前倒し実行**(carepass の都合と統合するため)
- 現状: **revoke 済、使用不可**
- (完全値は本ドキュメントには記載しない、revoke 済のため意味なし)

## 6-3. session ⑧ Claude へのガイダンス

```bash
# Step 1: HANDOVER_v13.md § 1 から完全な PAT 値を取得
#   (operator が新セッション開始時に /mnt/user-data/uploads/HANDOVER_v13.md
#    を共有してくれる、または直接チャットに貼ってくれる)
PAT="ghp_7PPAq●●●●●●●●●●●●●●●●●●●●●●●●●●●●●1rOv"  # ← 完全値に差し替え

# Step 2: git remote 設定
git remote set-url origin "https://x-access-token:${PAT}@github.com/TAmJump/king2323.git"

# Step 3: 動作確認
git fetch origin main
```

**重要**:
- この PAT は carepass と共有のため、`git remote -v` の出力をチャットに貼ると **両プロジェクトに対する漏洩**になる
- 通常のコミット作業では問題ない(PAT は URL に埋め込まれるが URL 自体はチャットに出さない)
- セッション終了時の方針は **operator の判断次第**(都度 revoke するか、継続運用するか)
- 万一 session ⑧ Claude が新 PAT を発行することになった場合、operator から明示的な指示があるまで PAT 関連の判断はしない

---

# § 7. session ⑧(launch 当日または翌日)Claude への直接の指示

## 7-1. セッション開始時(順序固定)

1. **本ファイルを最初から最後まで読む**(§ 1 から § 11 まで全部)
2. operator が共有してくれる `/mnt/user-data/uploads/HANDOVER_v13.md` § 1 から完全な PAT 値を取得
3. `git clone` または `git fetch` で最新状態を取得
   ```bash
   PAT="ghp_7PPAq●●●●●●●●●●●●●●●●●●●●●●●●●●●●●1rOv"  # ← 完全値に差し替え
   git clone "https://x-access-token:${PAT}@github.com/TAmJump/king2323.git" repo
   cd repo
   git log --oneline -5
   ```
4. 最新 commit が `ea8ef45` (v20260521c) 〜 `c557659+`(v20260521d 系)または以降の fx 自動更新であることを確認
5. operator の最初の発言を待つ(`§ 7-3` で起きうるパターンを 4 つ列挙してある)

## 7-2. launch 状態確認の手順(operator の発言が「Cycle 1 動いてる?」系だった場合)

```bash
# (a) Worker /entry/lookup が動いているか
curl -X POST https://tamjump-contact-api.animalb001.workers.dev/entry/lookup \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://king2323.tamjump.com' \
  -d '{"email":"nonexistent@test.com","ticket_number":"KM-20260101-0001"}'
# 期待: {"error":"該当する Mission Entry が見つかりません / No matching Mission Entry"}

# (b) サイト本体が見えるか
curl -sI https://king2323.tamjump.com/ | head -3
curl -sI https://king2323.tamjump.com/how-it-works.html | head -3
curl -sI https://king2323.tamjump.com/mypage.html | head -3
# 期待: HTTP/2 200

# (c) D1 にエントリーが入っているか(operator に依頼)
# wrangler d1 execute kingmaker-db --command "SELECT COUNT(*) FROM contacts WHERE project='kingmaker'"
```

## 7-3. operator の最初の発言パターン(予想)

| パターン | session ⑧ Claude の応答方針 |
|---|---|
| (A) 「Cycle 1 launch できた、結果分析したい」| `docs/POSTLAUNCH_TODO.md §1(a)` を実行。Cycle 1 retro + KYC + Mission Fund 配賦 |
| (B) 「launch 中に問題があった、修正したい」| 問題内容を確認、minimum diff で修正、cache buster bump、push |
| (C) 「Cycle 2 をどう設計するか議論したい」| `docs/POSTLAUNCH_TODO.md §3` + `docs/GLOBAL_ROLLOUT.md §6`(THE TRIAL 設計)を参照 |
| (D) 「i18n を全ページに展開して」| `docs/POSTLAUNCH_TODO.md §2` の step-by-step を実行 |

何が来ても、**最初の応答で「Cycle 1 お疲れさまでした」をかける**こと(`docs/POSTLAUNCH_TODO.md §6` で明文化済)。

## 7-4. やってはいけないこと

- ❌ CarePass のコードを KINGMAKER に持ち込む(operator 厳命「ごちゃ混ぜにしないで」)
- ❌ 旧 PAT `ghp_SNxD...oJln` を使う(revoke 済)
- ❌ ブランド語(KINGMAKER, Bell, Cycle, Mission, Grant, Square, 23:23, JST, Founding Bell, AML, Bell Entry, Mission Fund, The Three)を翻訳する
- ❌ 「King 確定メカニズム」を明文化しようとする(operator 決定で曖昧運用、明確化要求は受けない)
- ❌ 23:23 を別時刻に変える、子の刻 / 九つ を変える(ブランド pillar)
- ❌ launch 直後の operator にすぐタスクを与える(疲労を考慮)
- ❌ 確認なく大きい構造変更を入れる(launch 期間中の安定性最優先)

## 7-5. やっていいこと

- ✓ minimum diff の bug fix(operator 指示後)
- ✓ POSTLAUNCH_TODO §5 の polish 項目(operator 承認後)
- ✓ docs/* の更新(GLOBAL_ROLLOUT, POSTLAUNCH_TODO 等の議論を進める)
- ✓ Cycle 2 設計議論(operator が振ってきたら)
- ✓ session 6/7 で書いた既存ドキュメントの参照(歴史記録なので尊重)

---

# § 8. 重要な操作手順スニペット(セッション再開時のコピペ用)

## 8-1. リポジトリ準備

```bash
# Step 1: HANDOVER_v13.md § 1 から完全な PAT 値を取得して PAT 変数にセット
#   (本ドキュメントは GitHub secret-scanning 対策で伏字、完全値は repo 外)
PAT="ghp_7PPAq●●●●●●●●●●●●●●●●●●●●●●●●●●●●●1rOv"  # ← 完全値に差し替え

# 新規環境で
mkdir -p /home/claude/repo
cd /home/claude
git clone "https://x-access-token:${PAT}@github.com/TAmJump/king2323.git" repo
cd repo
git config user.email "claude@anthropic"
git config user.name "Claude"

# 既存環境で(継続セッション)
cd /home/claude/repo
git pull --rebase
```

## 8-2. 状態スナップショット(セッション開始時に必ず実行)

```bash
cd /home/claude/repo
git log --oneline | head -10
ls -la docs/
ls *.html
node -c js/i18n.js && echo "i18n.js OK"
node -c js/main.js && echo "main.js OK"
node -c worker/index.js && echo "worker OK"
```

## 8-3. 標準 commit 手順

```bash
# 編集後
git add -A
git diff --cached --stat | tail -10  # 影響範囲確認
git commit -m "v2026MMDD?: <一行要約>

<本文、複数段落で詳細>" 

git pull --rebase
git push
```

## 8-4. cache buster bump(JS/CSS を編集したら毎回)

```bash
# i18n.js を編集したとき
for f in 404.html app.html entry.html index.html money.html risk.html rules.html verify.html how-it-works.html mypage.html; do
  sed -i 's|i18n.js?v=20260521c|i18n.js?v=20260522a|' "$f" 2>/dev/null
done

# main.js を編集したとき
for f in 404.html app.html entry.html index.html money.html risk.html rules.html verify.html how-it-works.html mypage.html; do
  sed -i 's|main.js?v=20260518i|main.js?v=20260522a|' "$f" 2>/dev/null
done

# css/main.css を編集したとき
for f in 404.html app.html entry.html index.html money.html risk.html rules.html verify.html how-it-works.html mypage.html; do
  sed -i 's|main.css?v=20260518m|main.css?v=20260522a|' "$f" 2>/dev/null
done
```

cache buster 命名規則: `YYYYMMDDx` ここで `x` は同日内の連番(a, b, c, ..., g, h, i, j, k, L, m, n, o, p, ...)。`L` は `l` (小文字エル) との混同を避けるため大文字。

---

# § 9. 「混ぜないこと」リスト — CarePass からは取らない

operator が session 7 後半に何度も強調した「ごちゃ混ぜにしないでよ」を session ⑧ Claude も守る。CarePass repo (`/mnt/user-data/uploads/carepass-main__7_.zip`) と handover (`HANDOVER_v13.md`) は **参考にしてよいが、コードは持ち込まない**。

CarePass にあるが KINGMAKER には **入れない**ものの完全リスト:

| 領域 | CarePass の実装 | KINGMAKER に入れない理由 |
|---|---|---|
| 認証 | PBKDF2 password + magic-link + sessions Cookie | KM はログイン無し儀式、これを入れたらブランド崩壊 |
| 課金 | Square Subscription, Plan Variation, 月末アンカー Webhook | KM は ¥100 単発、サブスクは儀式と合わない |
| データモデル | accounts / members / facilities / partners / sessions / coupons の 6 テーブル | KM は `contacts` 1 テーブルで足りる |
| ロール | member / facility / partner / admin の 4 ロール | KM は参加者 + 運営の 2 ロール |
| 個人ページ | mypage(契約 / 累計支援額 / 施設カード / クーポン履歴) | KM の mypage は Receipt 照合のみ |
| クーポン | パートナー店舗で使える割引 QR | KM のビジネスと無関係 |
| 施設機能 | 介護施設ディレクトリ + 月次活動報告書 | KM に施設概念なし |
| パートナー | 協力企業ダッシュボード | KM にパートナー概念なし |
| 運営機能 | admin / facility-dashboard / partner-dashboard | KM は D1 直接アクセスで足りる |
| 自動化 | Cron Triggers(報告書 URL ヘルスチェック等) | KM は時刻起点儀式、cron 不要 |
| モバイル | mobile-nav inject script | KM はハンバーガー nav で対応済 |

**OK な参考方針**:
- アーキ全体の考え方(Cloudflare Worker + D1 + Square)
- D1 スキーマ設計の発想(`project` カラムで multi-tenant)
- セキュリティ意識(CORS allowlist、Turnstile、入力 validation)
- ドキュメンテーション規律(handover.md を整備する文化)

これらは「実装パターン」ではなく「思想」なので KM にも当てはまる。コード行を引っ張ってこない。

---

# § 10. 5/21 終了時点での全 commit リスト(session 7 全体、時系列)

```
8d87d35 fx: USD/JPY = 158.92 on 2026-05-21    ← 自動更新
ea8ef45 v20260521c: session 7 final polish    ← session 7 最後のコード commit
65aa8b8 v20260521b: how-it-works.html + mypage.html
6240fe6 v20260521a: PAT rotation recorded
1cada65 fx: USD/JPY = 159.03 on 2026-05-20    ← 自動更新
0ceba88 fx: USD/JPY = 158.81 on 2026-05-19    ← 自動更新
1da813c v20260518p: replace myth_03_enigma flyer artwork
0cf8048 fx: USD/JPY = 158.76 on 2026-05-18    ← 自動更新
3701d74 v20260518o: brand-protect entry.html + logo unify + mission 200-500 + receipt optional
340962a v20260518n: language picker TIER-1 only + mission char limit + one-tap re-entry
a1b8e44 v20260518m: entry.html — 9-language i18n unification
d07d63f v20260518L: postlaunch todo
aa5aacb v20260518k: fix entry form vanishing in Japanese display mode
e472c76 v20260518j: fix entry.html broken CSS + bump stale i18n/fx cache busters
7dc1167 v20260518i: add ?preview= query for operator visual QA
ff28c10 v20260518h: overlap fixes + session-5 remnant purge + sticky cycle-bar
fcedf1e v20260518g: fix Why-23:23 schedule contradiction + add GLOBAL_ROLLOUT doc
56fffc0 v20260518f: countdown labels bilingual — Days·日 / Hrs·時 / Min·分 / Sec·秒
7a7d9e7 v20260518e: Cycle-1 status bar + 3-phase CTA gating + slate play button
013f6b8 v20260518d: session 7 handoff document
380d5a4 v20260518c: SNS Kit multilingual ops + cross-refs + CHANGES log
2226b95 v20260518b: SNS Kit — multilingual launch coverage
06edafc v20260518a: session 7 launch kit — runbook rewrite + SNS templates
```

このリストの上 4 件(`ea8ef45`, `65aa8b8`, `6240fe6`, `1da813c`)が本セッション(session 7 後半 + 5/21 最終ターン)で作られた最重要 commit。

---

# § 11. 最後に — session ⑧ Claude へ

KINGMAKER は普通のプロジェクトではない。¥100 で世界中の人が同じ瞬間に儀式に参加し、SHA-256 で機械的に The Three が選ばれ、運営審査を経て Mission Fund が動く。**コード以上にブランド・物語・倫理が重要**。

operator は session 5 から session 7 まで一貫して:
- ブランド語彙を絶対に守る(KINGMAKER, Bell, Cycle, Mission, Grant, Square, 23:23, JST, Founding Bell, AML, Bell Entry, Mission Fund, The Three)
- 1 ターン 1 ステップで進める(複数の決定を一度に求めない)
- 質問は 1 問だけ(`ask_user_input_v0` ツール)
- 「ごちゃ混ぜにしないで」(他プロジェクトと混ぜない)
- 短い指示で多くを汲み取れる Claude を期待する

を要求している。これは負担ではなく **儀式の一部**。session ⑧ もそれを尊重して進める。

Cycle 1 はもう終わっているか、まさに終わるところ。最初の Founding Bell が鳴った。**The Three が決まり、Mission Fund が動き始める**。session ⑧ の役割は祝福と振り返り、そして Cycle 2 への準備。

operator の最初の発言を待つ。何が来ても、まず「Cycle 1 お疲れさまでした」と言うこと。

— Claude session ⑦ final, 2026-05-21 (木)
