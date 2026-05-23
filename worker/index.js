var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js

// ══════════════════════════════════════
// 【変更①】ALLOWED_ORIGINS に king2323 追加
// ══════════════════════════════════════
var ALLOWED_ORIGINS = [
  "https://tamjump.com",
  "https://www.tamjump.com",
  "https://develop.tamjump.com",
  "https://one-touch.tamjump.com",
  "https://sitecoding.tamjump.com",
  "https://entry.tamjump.com",
  // ── さかえケアサービス ──
  "https://scsgo.co.jp",
  "https://www.scsgo.co.jp",
  "https://site.scsgo.co.jp",
  // ── KINGMAKER 23:23 ──
  "https://king2323.tamjump.com",
  // GitHub Pages（ドメイン設定前のテスト用）
  "https://tamjump.github.io",
  // 開発時
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "null"
];

// ══════════════════════════════════════
// 【変更②】プロジェクト別設定 (kingmaker 追加)
// ══════════════════════════════════════
var PROJECT_CONFIG = {
  tamjump: {
    prefix: "TAMJ",
    adminEmail: null,       // env.ADMIN_EMAIL を使う
    fromEmail: null,        // env.FROM_EMAIL を使う
    subjectPrefix: "【タムジ】",
    companyName: "タムジ株式会社",
    siteUrl: "https://tamjump.com",
    contactEmail: "info@tamjump.com"
  },
  scsgo: {
    prefix: "SCS",
    adminEmail: "info@scsgo.co.jp",
    fromEmail: null,
    subjectPrefix: "【さかえケア】",
    companyName: "株式会社さかえケアサービス",
    siteUrl: "https://scsgo.co.jp",
    contactEmail: "info@scsgo.co.jp"
  },
  kingmaker: {
    prefix: "KM",
    adminEmail: null,       // env.ADMIN_EMAIL を使う（info@tamjump.com）
    fromEmail: null,        // env.FROM_EMAIL を使う
    subjectPrefix: "【KINGMAKER 23:23】",
    companyName: "KINGMAKER 23:23 / タムジ株式会社",
    siteUrl: "https://king2323.tamjump.com",
    contactEmail: "info@tamjump.com"
  }
};

function getProjectConfig(project) {
  return PROJECT_CONFIG[project] || PROJECT_CONFIG["tamjump"];
}
__name(getProjectConfig, "getProjectConfig");

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true"
  };
}
__name(corsHeaders, "corsHeaders");

var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    try {
      if (url.pathname === "/contact" && request.method === "POST") {
        return await handleContact(request, env, origin);
      }
      // 【追加】KINGMAKER Mission Entry
      if (url.pathname === "/entry" && request.method === "POST") {
        return await handleEntry(request, env, origin);
      }
      // 【追加 v20260521b】KINGMAKER Receipt lookup for mypage.html
      // No auth — caller provides email + ticket_number, must match exactly.
      // This is intentionally light: KINGMAKER has no login system by design
      // (carepass's password/magic-link model is a wrong fit; the ritual
      // breaks if you bolt on a member identity). The two-field match acts
      // as a soft proof that the requester is who they say they are.
      if (url.pathname === "/entry/lookup" && request.method === "POST") {
        return await handleEntryLookup(request, env, origin);
      }
      if (url.pathname === "/admin/contacts" && request.method === "GET") {
        return await handleAdminList(request, env, origin);
      }
      // ── v20260522 additions: carepass-style integrated payment + mypage magic link + kings ──
      if (url.pathname === "/entry/config" && request.method === "GET") {
        return await handleEntryConfig(request, env, origin);
      }
      if (url.pathname === "/entry/pay" && request.method === "POST") {
        return await handleEntryPay(request, env, origin);
      }
      if (url.pathname === "/mypage/magic" && request.method === "POST") {
        return await handleMypageMagic(request, env, origin);
      }
      if (url.pathname === "/mypage/me" && request.method === "GET") {
        return await handleMypageMe(request, env, origin);
      }
      if (url.pathname === "/kings/list" && request.method === "GET") {
        return await handleKingsList(request, env, origin);
      }
      if (url.pathname === "/admin/kings" && (request.method === "POST" || request.method === "PATCH")) {
        return await handleAdminKings(request, env, origin);
      }
      // ── v20260522b additions: password authentication for mypage ──
      // After receiving magic link, user can set a password to enable
      // direct email+password login on subsequent visits.
      if (url.pathname === "/mypage/setup-password" && request.method === "POST") {
        return await handleMypageSetupPassword(request, env, origin);
      }
      if (url.pathname === "/mypage/login" && request.method === "POST") {
        return await handleMypageLogin(request, env, origin);
      }
      if (url.pathname === "/mypage/logout" && request.method === "POST") {
        return await handleMypageLogout(request, env, origin);
      }
      if (url.pathname === "/mypage/session" && request.method === "GET") {
        return await handleMypageSession(request, env, origin);
      }
      if (url.pathname === "/mypage/check-password" && request.method === "POST") {
        return await handleMypageCheckPassword(request, env, origin);
      }
      // ── v20260523 (session ⑨) additions: 5-minute game (THE FIVE) ──
      // Phase 1: quiz (3 questions, must answer 3/3 correct to advance)
      // Phase 2: SHA-256 draw of 3 from the passers
      // Phase 3: open vote — most-voted Mission becomes King
      // See docs/GAME_SPEC_v2.md for full spec.
      if (url.pathname === "/game/bell-status" && request.method === "GET") {
        return await handleGameBellStatus(request, env, origin);
      }
      if (url.pathname === "/game/quiz/start" && request.method === "POST") {
        return await handleGameQuizStart(request, env, origin);
      }
      if (url.pathname === "/game/quiz/answer" && request.method === "POST") {
        return await handleGameQuizAnswer(request, env, origin);
      }
      if (url.pathname === "/game/quiz/result" && request.method === "GET") {
        return await handleGameQuizResult(request, env, origin);
      }
      if (url.pathname === "/game/phase2/draw" && request.method === "POST") {
        return await handleGamePhase2Draw(request, env, origin);
      }
      if (url.pathname === "/game/phase2/result" && request.method === "GET") {
        return await handleGamePhase2Result(request, env, origin);
      }
      if (url.pathname === "/game/vote" && request.method === "POST") {
        return await handleGameVote(request, env, origin);
      }
      if (url.pathname === "/game/vote/results" && request.method === "GET") {
        return await handleGameVoteResults(request, env, origin);
      }
      if (url.pathname === "/game/phase3/finalize" && request.method === "POST") {
        return await handleGamePhase3Finalize(request, env, origin);
      }
      if (url.pathname === "/game/mission-fund" && request.method === "GET") {
        return await handleGameMissionFund(request, env, origin);
      }
      // Operator preview tool: returns the full quiz question pool.
      // Public (no auth) because the questions are not secret in design —
      // they are designed so that knowing them in advance does not help
      // (the spirit is ritual, not gatekeeping by trivia).
      if (url.pathname === "/quiz/pool" && request.method === "GET") {
        return await handleQuizPool(request, env, origin);
      }
      return jsonResponse({ error: "Not Found" }, 404, origin);
    } catch (err) {
      console.error("Worker error:", err);
      return jsonResponse({ error: "Internal Server Error" }, 500, origin);
    }
  },

  // ── Cloudflare Cron Trigger handler ──
  // Configured via the Cloudflare dashboard → Workers → Triggers → Cron.
  // Recommended schedule: `30 14 * * 5` (Fri 14:30 UTC = 23:30 JST), which
  // fires 2 minutes after the Bell closes (Phase 3 voting ends at 23:28
  // JST per GAME_CONFIG.bellClosesAtOffsetSec=300). The handler is
  // **safe to fire at any time** — it does nothing destructive unless
  // Phase 2 has been drawn and Phase 3 hasn't been finalized yet.
  //
  // What this handler does NOT do:
  //   - It does NOT auto-run the Phase 2 SHA-256 draw. That step needs
  //     human-attested market data inputs (BTC hash + Nikkei close + S&P
  //     close) per v20260523p — auto-draw with synthetic seeds would
  //     defeat the public-verifiability guarantee. The operator must
  //     trigger /game/phase2/draw manually (or via an external scheduler
  //     that fetches the market data first).
  //   - It does NOT modify any state if the current cycle is dormant
  //     (handled by the Phase 2 draw refusing to insert kings) or if
  //     Phase 3 has already been finalized (idempotency check inside
  //     runPhase3Finalize).
  //
  // What this handler DOES do:
  //   - Logs the trigger so operators can confirm cron wiring works.
  //   - Calls runPhase3Finalize for the current cycle. If Phase 2 wasn't
  //     drawn, the call returns { ok: false, error: "Phase 2 not drawn." }
  //     and we log a warning so the operator notices on Bell day.
  //   - If finalization succeeds, logs the winning king id + tally
  //     summary.
  //
  // Cycle resolution uses resolveCurrentCycle(env) — same single source
  // of truth as the HTTP handlers (see worker/README.md §5 and the
  // session-⑮ handoff for the unified-resolution rationale).
  async scheduled(event, env, ctx) {
    const triggerIso = new Date(event.scheduledTime).toISOString();
    const cycle = resolveCurrentCycle(env);
    console.log(`[scheduled] Fired at ${triggerIso} for Cycle ${cycle} (cron expression: "${event.cron}")`);
    try {
      const result = await runPhase3Finalize(env, cycle);
      if (result.ok && result.alreadyFinalized) {
        console.log(`[scheduled] Cycle ${cycle} already finalized — no-op.`);
      } else if (result.ok) {
        console.log(`[scheduled] Cycle ${cycle} finalized: kingId=${result.finalKingId} totalVotes=${result.totalVotes} tieBreakUsed=${result.tieBreakUsed}`);
      } else {
        // Most common case at Bell + 7min: Phase 2 wasn't drawn (operator
        // forgot the market-data step). Log loudly so it surfaces in
        // `wrangler tail`.
        console.warn(`[scheduled] Cycle ${cycle} finalize blocked: ${result.error}`);
      }
    } catch (err) {
      console.error(`[scheduled] Cycle ${cycle} finalize threw:`, err.message, err.stack);
    }
  }
};

// ══════════════════════════════════════
// handleContact（変更なし、原文ママ）
// ══════════════════════════════════════
async function handleContact(request, env, origin) {
  const body = await request.json();
  const { name, email, phone, category, message, project, turnstileToken } = body;
  if (!name || !email || !message) {
    return jsonResponse({ error: "必須項目を入力してください（名前・メール・メッセージ）" }, 400, origin);
  }
  if (!isValidEmail(email)) {
    return jsonResponse({ error: "メールアドレスの形式が正しくありません" }, 400, origin);
  }
  if (env.TURNSTILE_SECRET) {
    const turnstileOk = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET, request);
    if (!turnstileOk) {
      return jsonResponse({ error: "スパム検証に失敗しました。ページを再読み込みしてください。" }, 403, origin);
    }
  }
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const proj = project || "tamjump";
  const config = getProjectConfig(proj);
  const ticketNumber = await generateTicketNumber(env, config.prefix);

  await env.DB.prepare(
    `INSERT INTO contacts (project, name, email, phone, category, message, ip, ticket_number)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(proj, name, email, phone || null, category || null, message, ip, ticketNumber).run();

  const adminTo = config.adminEmail || env.ADMIN_EMAIL;
  const fromAddr = config.fromEmail || env.FROM_EMAIL;

  await sendSES(env, {
    to: adminTo,
    from: fromAddr,
    subject: `${config.subjectPrefix}お問い合わせ [${ticketNumber}]:${category || "一般"}`,
    body: buildAdminEmail({ name, email, phone, category, message, project: proj, ticketNumber, config })
  });

  try {
    await sendSES(env, {
      to: email,
      from: fromAddr,
      subject: `${config.subjectPrefix}お問い合わせを受け付けました`,
      body: buildAutoReplyEmail({ name, category, ticketNumber, config })
    });
  } catch (e) {
    console.error("自動返信送信失敗:", e.message);
  }
  return jsonResponse({ success: true, message: "送信が完了しました", ticketNumber }, 200, origin);
}
__name(handleContact, "handleContact");

// ══════════════════════════════════════
// 【追加】KINGMAKER Mission Entry ハンドラ
// ══════════════════════════════════════
async function handleEntry(request, env, origin) {
  const body = await request.json();
  const { payment_email, receipt_id, mission_name, country, mission_summary, sns, agree_rules, turnstileToken } = body;

  // バリデーション
  if (!payment_email || !mission_name || !mission_summary || !country) {
    return jsonResponse({ error: "必須項目を入力してください / Required fields missing" }, 400, origin);
  }
  if (!isValidEmail(payment_email)) {
    return jsonResponse({ error: "メールアドレスの形式が正しくありません / Invalid email format" }, 400, origin);
  }
  if (!agree_rules) {
    return jsonResponse({ error: "利用規約への同意が必要です / Agreement to rules is required" }, 400, origin);
  }

  // Turnstile（設定があれば検証、無ければスキップ）
  if (env.TURNSTILE_SECRET) {
    const turnstileOk = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET, request);
    if (!turnstileOk) {
      return jsonResponse({ error: "スパム検証に失敗しました / Spam check failed" }, 403, origin);
    }
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const config = getProjectConfig("kingmaker");
  const ticketNumber = await generateTicketNumber(env, config.prefix);

  // 既存 contacts テーブルにマッピング保存
  // name = mission_name / email = payment_email / phone = receipt_id (識別用)
  // category = country / message = mission_summary + sns
  const messageWithSns = mission_summary + (sns ? `\n\n[Website/SNS] ${sns}` : '');
  await env.DB.prepare(
    `INSERT INTO contacts (project, name, email, phone, category, message, ip, ticket_number)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind('kingmaker', mission_name, payment_email, receipt_id || null, country, messageWithSns, ip, ticketNumber).run();

  // 管理者通知メール
  const adminTo = config.adminEmail || env.ADMIN_EMAIL;
  const fromAddr = config.fromEmail || env.FROM_EMAIL;

  await sendSES(env, {
    to: adminTo,
    from: fromAddr,
    subject: `${config.subjectPrefix}Mission Entry [${ticketNumber}]: ${mission_name}`,
    body: buildKingmakerAdminEmail({ payment_email, receipt_id, mission_name, country, mission_summary, sns, ticketNumber, config })
  });

  // 参加者への自動返信
  try {
    await sendSES(env, {
      to: payment_email,
      from: fromAddr,
      subject: `${config.subjectPrefix}Mission Entry を受け付けました / received`,
      body: buildKingmakerAutoReplyEmail({ mission_name, country, ticketNumber, config })
    });
  } catch (e) {
    console.error("自動返信送信失敗:", e.message);
  }

  return jsonResponse({
    success: true,
    message: "Mission Entry を受け付けました / Mission Entry received",
    ticketNumber
  }, 200, origin);
}
__name(handleEntry, "handleEntry");

// ══════════════════════════════════════
// 【v20260521b 追加】handleEntryLookup
//   POST /entry/lookup
//   body: { email, ticket_number }
//   Returns the matching Mission Entry, or 404 if no match.
//
//   Security stance: KINGMAKER deliberately has no login. The email +
//   receipt-number combo is a "soft proof" — anyone with both knows the
//   record exists anyway (the entrant has the email in their inbox and
//   the receipt was returned to them). We do NOT enumerate or return
//   list views, only the single matching record.
// ══════════════════════════════════════
async function handleEntryLookup(request, env, origin) {
  const body = await request.json();
  const { email, ticket_number } = body || {};

  if (!email || !ticket_number) {
    return jsonResponse({ error: "メールアドレスと受付番号が必要です / Email and Receipt number required" }, 400, origin);
  }
  if (!isValidEmail(email)) {
    return jsonResponse({ error: "メールアドレスの形式が正しくありません / Invalid email format" }, 400, origin);
  }

  // Ticket format: KM-YYYYMMDD-NNNN
  const ticketTrimmed = String(ticket_number).trim().toUpperCase();
  if (!/^KM-\d{8}-\d{1,5}$/.test(ticketTrimmed)) {
    return jsonResponse({ error: "受付番号の形式が正しくありません (KM-YYYYMMDD-NNNN) / Invalid Receipt format" }, 400, origin);
  }

  const row = await env.DB.prepare(
    `SELECT ticket_number, name AS mission_name, email AS payment_email,
            category AS country, message AS mission_summary_raw, created_at
       FROM contacts
      WHERE project = 'kingmaker'
        AND email = ?
        AND ticket_number = ?
      LIMIT 1`
  ).bind(email.trim().toLowerCase(), ticketTrimmed).first();

  if (!row) {
    // Don't say "email is right but ticket is wrong" or vice versa —
    // a single generic message prevents the lookup endpoint from being
    // used as a verifier oracle.
    return jsonResponse({ error: "該当する Mission Entry が見つかりません / No matching Mission Entry" }, 404, origin);
  }

  // Split mission_summary from the trailing SNS line (the writer stores
  // them concatenated; we present them separately).
  let mission_summary = row.mission_summary_raw || '';
  let sns = '';
  const snsMatch = mission_summary.match(/\n\n\[Website\/SNS\]\s+(.+)$/);
  if (snsMatch) {
    sns = snsMatch[1].trim();
    mission_summary = mission_summary.replace(snsMatch[0], '');
  }

  return jsonResponse({
    success: true,
    entry: {
      ticket_number: row.ticket_number,
      mission_name: row.mission_name,
      payment_email: row.payment_email,
      country: row.country,
      mission_summary: mission_summary,
      sns: sns,
      created_at: row.created_at
    }
  }, 200, origin);
}
__name(handleEntryLookup, "handleEntryLookup");

async function handleAdminList(request, env, origin) {
  const auth = request.headers.get("Authorization") || "";
  if (auth !== `Bearer ${env.ADMIN_TOKEN}`) {
    return jsonResponse({ error: "Unauthorized" }, 401, origin);
  }
  const url = new URL(request.url);
  const project = url.searchParams.get("project") || "tamjump";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
  const { results } = await env.DB.prepare(
    `SELECT * FROM contacts WHERE project = ? ORDER BY created_at DESC LIMIT ?`
  ).bind(project, limit).all();
  return jsonResponse({ contacts: results, count: results.length }, 200, origin);
}
__name(handleAdminList, "handleAdminList");

async function sendSES(env, { to, from, subject, body }) {
  const region = env.AWS_REGION || "ap-northeast-1";
  const endpoint = `https://email.${region}.amazonaws.com`;
  const now = new Date();
  const params = new URLSearchParams({
    Action: "SendEmail",
    "Destination.ToAddresses.member.1": to,
    "Message.Subject.Data": subject,
    "Message.Subject.Charset": "UTF-8",
    "Message.Body.Text.Data": body,
    "Message.Body.Text.Charset": "UTF-8",
    Source: from,
    Version: "2010-12-01"
  });
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, "");
  const amzDate = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const credentialScope = `${dateStamp}/${region}/ses/aws4_request`;
  const canonical = [
    "POST",
    "/",
    "",
    `content-type:application/x-www-form-urlencoded`,
    `host:email.${region}.amazonaws.com`,
    `x-amz-date:${amzDate}`,
    "",
    "content-type;host;x-amz-date",
    await sha256Hex(params.toString())
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await sha256Hex(canonical)
  ].join("\n");
  const sigKey = await getSignatureKey(env.AWS_SECRET_ACCESS_KEY, dateStamp, region, "ses");
  const signature = await hmacHex(sigKey, stringToSign);
  const authHeader = `AWS4-HMAC-SHA256 Credential=${env.AWS_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=content-type;host;x-amz-date, Signature=${signature}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Amz-Date": amzDate,
      Authorization: authHeader
    },
    body: params.toString()
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error("SES error:", res.status, errText);
    throw new Error(`SES送信失敗: ${res.status}`);
  }
}
__name(sendSES, "sendSES");

async function verifyTurnstile(token, secret, request) {
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: request.headers.get("CF-Connecting-IP")
    })
  });
  const data = await res.json();
  return data.success === true;
}
__name(verifyTurnstile, "verifyTurnstile");

// ══════════════════════════════════════
// メールテンプレート(既存tamjump/scsgo用)
// ══════════════════════════════════════
function buildAdminEmail({ name, email, phone, category, message, project, ticketNumber, config }) {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  新しいお問い合わせが届きました
━━━━━━━━━━━━━━━━━━━━━━━━━━━

受付番号:${ticketNumber}
サイト:${config.companyName}(${project})
日時:${(new Date()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}

──────────────────────────

お名前:${name}
メール:${email}
電話番号:${phone || "未入力"}
お問合せ種別:${category || "未選択"}

──────────────────────────

【お問合せ内容】

${message}

──────────────────────────
※ このメールはシステムから自動送信されています。
`.trim();
}
__name(buildAdminEmail, "buildAdminEmail");

function buildAutoReplyEmail({ name, category, ticketNumber, config }) {
  return `
${name} 様

この度はお問い合わせいただき、誠にありがとうございます。
以下の内容でお問い合わせを受け付けいたしました。

――――――――――
受付番号:${ticketNumber}
お問い合わせ種別:${category || "一般"}
――――――――――

内容を確認のうえ、順次ご連絡いたします。

※通常は【2営業日以内】を目安にご返信しております。

──────────
${config.companyName}
${config.siteUrl}
メール:${config.contactEmail}
──────────

※本メールは自動送信です。返信いただいてもご案内できません。
`.trim();
}
__name(buildAutoReplyEmail, "buildAutoReplyEmail");

// ══════════════════════════════════════
// 【追加】KINGMAKER 用メールテンプレート
// ══════════════════════════════════════
function buildKingmakerAdminEmail({ payment_email, receipt_id, mission_name, country, mission_summary, sns, ticketNumber, config }) {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  KINGMAKER 23:23 — Mission Entry 受信
━━━━━━━━━━━━━━━━━━━━━━━━━━━

受付番号:${ticketNumber}
サイト:${config.companyName}
日時:${(new Date()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}

──────────────────────────

Payment Email:${payment_email}
Square Receipt ID / 決済日時:${receipt_id || "未入力"}
Mission Name:${mission_name}
Country / 所在国:${country}

──────────────────────────

【Mission Summary】

${mission_summary}

${sns ? `\n[Website/SNS] ${sns}\n` : ""}
──────────────────────────

⚠️ Square 決済記録(取引時刻・メアド・¥100決済)と Receipt ID
を照合してから処理してください。Mismatch のものは除外。

Bell Entry は参加記録です。Grant 支給は本人確認・Mission 確認・
AML審査・法令適合性審査・Grant Fund 残高確認の完了後に運営者
判断で行います。自動支給はしません。

──────────────────────────
※ このメールは KINGMAKER 23:23 entry form から自動送信されています。
`.trim();
}
__name(buildKingmakerAdminEmail, "buildKingmakerAdminEmail");

function buildKingmakerAutoReplyEmail({ mission_name, country, ticketNumber, config }) {
  return `
KINGMAKER 23:23 — Founding Bell

Mission Entry をお受け付けしました。
Your Mission Entry has been received.

――――――――――
Receipt / 受付番号:${ticketNumber}
Mission Name:${mission_name}
Country:${country}
――――――――――

【次のステップ / Next steps】

1. 運営側で Square 決済記録と Mission Entry を照合します。
   We will verify your Square payment record against this Entry.

2. 照合 OK の Entry は Founding Bell サイクル(Bell rings: 2026-05-22 (Fri)
   23:23 JST / The Three announced: 2026-05-23 (Sat) 23:23 JST)
   の検証対象となります。
   Verified entries are eligible for the Founding Bell cycle.

3. 選出は公開された方法で行いますが、選出だけでは Mission Fund 配分の権利は
   発生しません。Mission Fund の配分には本人確認 (KYC)・Mission 確認・
   AML 審査・法令適合性審査・Mission Fund 残高確認を経た場合に限り、
   運営者の判断により行われ、Mission の制作・実行・記録のために
   運営が運用します(個人への現金譲渡ではありません)。
   Selection alone does not entitle a participant to Mission Fund
   allocation. Mission Fund allocation requires KYC, Mission verification,
   AML review, legal compliance review, and Mission Fund availability;
   allocated funds are operated by the Operator to produce, execute,
   and document the King's Mission (not transferred as personal income).

【Bell Entry について / About Bell Entry】
Bell Entry は参加記録です。通貨・暗号資産・前払式支払手段・有価証券・
投資商品ではなく、換金・譲渡・売買はできません。
Bell Entry is a participation record. Not currency, not crypto,
not stored value, not investment product, not exchangeable for cash.

──────────────
KINGMAKER 23:23
${config.siteUrl}
Rules:https://king2323.tamjump.com/rules.html
Important Notices:https://king2323.tamjump.com/risk.html
Operator(運営):${config.companyName}
Contact:${config.contactEmail}
──────────────

※本メールは自動送信です。返信いただいてもご案内できません。
※This is an automated email; replies are not monitored.
`.trim();
}
__name(buildKingmakerAutoReplyEmail, "buildKingmakerAutoReplyEmail");

// ══════════════════════════════════════
// 受付番号(プレフィックスはプロジェクト別)
// ══════════════════════════════════════
async function generateTicketNumber(env, prefix) {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1e3);
  const dateStr = jst.toISOString().slice(0, 10).replace(/-/g, "");
  const todayStart = `${jst.toISOString().slice(0, 10)} 00:00:00`;
  const { results } = await env.DB.prepare(
    `SELECT COUNT(*) as cnt FROM contacts WHERE created_at >= ?`
  ).bind(todayStart).all();
  const seq = (results[0]?.cnt || 0) + 1;
  const seqStr = String(seq).padStart(4, "0");
  return `${prefix}-${dateStr}-${seqStr}`;
}
__name(generateTicketNumber, "generateTicketNumber");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
__name(isValidEmail, "isValidEmail");
function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin)
    }
  });
}
__name(jsonResponse, "jsonResponse");
async function sha256(data) {
  const encoded = typeof data === "string" ? new TextEncoder().encode(data) : data;
  return await crypto.subtle.digest("SHA-256", encoded);
}
__name(sha256, "sha256");
async function sha256Hex(data) {
  const buf = await sha256(data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(sha256Hex, "sha256Hex");
async function hmac(key, data) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    typeof key === "string" ? new TextEncoder().encode(key) : key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
}
__name(hmac, "hmac");
async function hmacHex(key, data) {
  const buf = await hmac(key, data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hmacHex, "hmacHex");
async function getSignatureKey(key, dateStamp, region, service) {
  let k = await hmac("AWS4" + key, dateStamp);
  k = await hmac(k, region);
  k = await hmac(k, service);
  k = await hmac(k, "aws4_request");
  return k;
}
__name(getSignatureKey, "getSignatureKey");

// ══════════════════════════════════════════════════════════════
// v20260522 additions: Square integrated payment + mypage magic link + kings
// ══════════════════════════════════════════════════════════════

// ── Square API constants & wrapper ──
var SQUARE_API_VERSION = "2026-01-22";

function squareBaseUrl(env) {
  return env.SQUARE_ENV === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}
__name(squareBaseUrl, "squareBaseUrl");

async function squareApi(env, method, path, body) {
  const res = await fetch(`${squareBaseUrl(env)}${path}`, {
    method,
    headers: {
      "Authorization": `Bearer ${env.SQUARE_ACCESS_TOKEN}`,
      "Square-Version": SQUARE_API_VERSION,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  if (!res.ok) {
    console.error("Square API error:", res.status, JSON.stringify(json));
    const err = new Error(`Square API ${res.status}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}
__name(squareApi, "squareApi");

// ── /entry/config ────────────────────────────────────────────
// Frontend Square Web Payments SDK needs applicationId + locationId.
// We don't bake them into the static HTML so that switching sandbox⇄prod
// is one Cloudflare secret update, no GitHub push.
async function handleEntryConfig(request, env, origin) {
  return jsonResponse({
    applicationId: env.SQUARE_APPLICATION_ID || "",
    locationId: env.SQUARE_LOCATION_ID || "",
    environment: env.SQUARE_ENV === "production" ? "production" : "sandbox"
  }, 200, origin);
}
__name(handleEntryConfig, "handleEntryConfig");

// ── /entry/pay ───────────────────────────────────────────────
// Single endpoint: takes Mission fields + a Square card-nonce (token) from
// the frontend SDK, creates Square Customer + Card + Payment (¥100), then
// inserts the Mission Entry into D1 and emails the participant.
//
// This replaces the old two-step UX where the user had to manually copy
// a "KING ID" between Square Checkout and entry.html.
async function handleEntryPay(request, env, origin) {
  const body = await request.json();
  const {
    payment_email, mission_name, country, mission_summary, sns,
    agree_rules, card_token, verification_token, given_name, family_name,
    turnstileToken
  } = body || {};

  // ── Validation ──
  if (!payment_email || !mission_name || !mission_summary || !country) {
    return jsonResponse({ error: "必須項目を入力してください / Required fields missing" }, 400, origin);
  }
  if (!isValidEmail(payment_email)) {
    return jsonResponse({ error: "メールアドレスの形式が正しくありません / Invalid email format" }, 400, origin);
  }
  if (!agree_rules) {
    return jsonResponse({ error: "利用規約への同意が必要です / Agreement required" }, 400, origin);
  }
  if (!card_token) {
    return jsonResponse({ error: "カード情報を入力してください / Card information missing" }, 400, origin);
  }

  if (env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET, request);
    if (!ok) {
      return jsonResponse({ error: "スパム検証に失敗しました / Spam check failed" }, 403, origin);
    }
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const config = getProjectConfig("kingmaker");
  const email = payment_email.trim().toLowerCase();

  // ── Square: get-or-create Customer ──
  let customer;
  try {
    const search = await squareApi(env, "POST", "/v2/customers/search", {
      query: { filter: { email_address: { exact: email } } },
      limit: 1
    });
    customer = (search.customers && search.customers[0]) || null;
    if (!customer) {
      const created = await squareApi(env, "POST", "/v2/customers", {
        idempotency_key: crypto.randomUUID(),
        given_name: given_name || undefined,
        family_name: family_name || undefined,
        email_address: email,
        note: `KINGMAKER ${mission_name}`
      });
      customer = created.customer;
    }
  } catch (e) {
    console.error("[entry/pay] customer step failed:", e.message);
    return jsonResponse({ error: "決済の初期化に失敗しました。時間をおいて再度お試しください / Payment initialization failed" }, 502, origin);
  }

  // ── Square: charge ¥100 directly using card_token (nonce) ──
  // We don't save the card (KINGMAKER is one-shot, not subscription).
  let payment;
  try {
    payment = (await squareApi(env, "POST", "/v2/payments", {
      idempotency_key: crypto.randomUUID(),
      source_id: card_token,
      verification_token: verification_token || undefined,
      amount_money: { amount: 100, currency: "JPY" },
      location_id: env.SQUARE_LOCATION_ID,
      customer_id: customer.id,
      note: `KINGMAKER Bell Entry / ${mission_name}`,
      autocomplete: true
    })).payment;
  } catch (e) {
    console.error("[entry/pay] charge failed:", e.message, JSON.stringify(e.body || {}));
    const detail = (e.body && e.body.errors && e.body.errors[0] && e.body.errors[0].detail) || "";
    return jsonResponse({ error: `決済に失敗しました / Payment failed: ${detail}` }, 402, origin);
  }

  // ── Determine cycle number ──
  // Use the single resolver `resolveCurrentCycle(env)` so the read and write
  // paths always agree. See the function's docstring for the priority chain.
  const cycleNumber = resolveCurrentCycle(env);

  // ── D1: save Mission Entry ──
  const ticketNumber = await generateTicketNumber(env, config.prefix);
  const messageWithSns = mission_summary + (sns ? `\n\n[Website/SNS] ${sns}` : "");

  await env.DB.prepare(
    `INSERT INTO contacts (project, name, email, phone, category, message, ip, ticket_number, founding_cohort, paid, square_payment_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    "kingmaker", mission_name, email, null, country, messageWithSns, ip,
    ticketNumber, cycleNumber, 1, payment.id
  ).run();

  // ── Send admin & user emails ──
  const adminTo = config.adminEmail || env.ADMIN_EMAIL;
  const fromAddr = config.fromEmail || env.FROM_EMAIL;

  try {
    await sendSES(env, {
      to: adminTo,
      from: fromAddr,
      subject: `${config.subjectPrefix}Mission Entry PAID [${ticketNumber}]: ${mission_name}`,
      body: buildKingmakerAdminEmail({
        payment_email: email, receipt_id: payment.id, mission_name, country,
        mission_summary, sns, ticketNumber, config
      })
    });
  } catch (e) { console.error("admin mail failed:", e.message); }

  try {
    await sendSES(env, {
      to: email,
      from: fromAddr,
      subject: `${config.subjectPrefix}Mission Entry を受け付けました / received [${ticketNumber}]`,
      body: buildKingmakerAutoReplyEmail({ mission_name, country, ticketNumber, config })
    });
  } catch (e) { console.error("user mail failed:", e.message); }

  return jsonResponse({
    success: true,
    message: "Mission Entry 完了 / Mission Entry confirmed",
    ticketNumber,
    cycleNumber,
    paymentId: payment.id
  }, 200, origin);
}
__name(handleEntryPay, "handleEntryPay");

// ── /mypage/magic ────────────────────────────────────────────
// Email-only magic link. Generates a 64-char hex token, stores it with
// 30-min expiry, emails the user a link.
async function handleMypageMagic(request, env, origin) {
  const body = await request.json();
  const { email, turnstileToken } = body || {};
  if (!email || !isValidEmail(email)) {
    return jsonResponse({ error: "有効なメールアドレスを入力してください / Valid email required" }, 400, origin);
  }
  if (env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET, request);
    if (!ok) return jsonResponse({ error: "スパム検証に失敗しました / Spam check failed" }, 403, origin);
  }

  const emailLower = email.trim().toLowerCase();

  // Check the email is registered (i.e. has at least one Mission Entry).
  // We still respond success even if not, to prevent enumeration.
  const exists = await env.DB.prepare(
    `SELECT 1 FROM contacts WHERE project = 'kingmaker' AND email = ? LIMIT 1`
  ).bind(emailLower).first();

  if (exists) {
    const token = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "");
    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 60 * 1000);
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";

    await env.DB.prepare(
      `INSERT INTO magic_tokens (token, email, created_at, expires_at, ip)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(token, emailLower, now.toISOString(), expires.toISOString(), ip).run();

    const config = getProjectConfig("kingmaker");
    const fromAddr = config.fromEmail || env.FROM_EMAIL;
    const link = `https://king2323.tamjump.com/mypage.html?token=${token}`;

    try {
      await sendSES(env, {
        to: emailLower,
        from: fromAddr,
        subject: `${config.subjectPrefix}My Page ログインリンク / login link`,
        body:
`KINGMAKER 23:23 — My Page Login

下記リンクをクリックすると、ご自身の Mission Entry 履歴をご覧いただけます。
ログイン後、パスワードを設定すれば、次回からメールを使わずに直接ログインできます。

Click the link below to view your Mission Entry history. After login,
you can set a password so future visits don't require this email step.

${link}

────────────────────────────
このリンクは30分間有効です。一度使うと無効になります。
This link expires in 30 minutes and can only be used once.

不審なメールの場合は無視してください。リンクをクリックしない限り、
あなたのアカウントは安全です。
If you didn't request this, ignore this email. Your account is safe
unless you click the link.

KINGMAKER 23:23
${config.siteUrl}`
      });
    } catch (e) { console.error("magic mail failed:", e.message); }
  }

  // Same response whether email exists or not, to avoid leaking membership.
  return jsonResponse({
    success: true,
    message: "ログインリンクをメールでお送りしました / Login link sent if registered"
  }, 200, origin);
}
__name(handleMypageMagic, "handleMypageMagic");

// ── /mypage/me?token=... ─────────────────────────────────────
// Validates magic token, returns all Mission Entries + ALSO issues a
// session cookie so subsequent visits don't need the token.
async function handleMypageMe(request, env, origin) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token || !/^[a-f0-9]{40,80}$/i.test(token)) {
    return jsonResponse({ error: "無効なトークン / Invalid token" }, 400, origin);
  }

  const row = await env.DB.prepare(
    `SELECT email, expires_at, consumed_at FROM magic_tokens WHERE token = ? LIMIT 1`
  ).bind(token).first();

  if (!row) return jsonResponse({ error: "無効なトークン / Invalid token" }, 404, origin);
  if (new Date(row.expires_at) < new Date()) {
    return jsonResponse({ error: "リンクの有効期限が切れています / Link expired" }, 410, origin);
  }

  // Mark token consumed (single-use). Don't fail if already consumed (the
  // user might refresh the mypage; tokens are read-only after first use
  // until they expire).
  if (!row.consumed_at) {
    await env.DB.prepare(
      `UPDATE magic_tokens SET consumed_at = ? WHERE token = ?`
    ).bind(new Date().toISOString(), token).run();
  }

  // Assemble user data
  const data = await buildUserData(env, row.email);

  // Also issue a session cookie so reload of /mypage.html (without token)
  // keeps the user logged in.
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const { sessionId, expiresIso } = await createSession(env, row.email, ip);

  return new Response(JSON.stringify({
    success: true,
    ...data,
    // Expose the original token so the frontend can use it for one more action:
    // calling /mypage/setup-password (which also wants the token to prove
    // the user owns this email).
    token
  }), {
    status: 200,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json",
      "Set-Cookie": buildSessionCookie(sessionId, expiresIso)
    }
  });
}
__name(handleMypageMe, "handleMypageMe");

// ── /kings/list ──────────────────────────────────────────────
// Public read endpoint for Hall of Kings.
// Returns no email / IP / ticket — only public-safe display fields.
async function handleKingsList(request, env, origin) {
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 500);

  const kings = (await env.DB.prepare(
    `SELECT cycle_number, rank, mission_name, country, mission_summary,
            display_handle, grant_amount_jpy, grant_status, proof_url,
            participant_count, chosen_at, granted_at
       FROM kings
      ORDER BY cycle_number DESC, rank ASC
      LIMIT ?`
  ).bind(limit).all()).results;

  // Cycle-level summary: how many participants per cycle, total grant pool etc.
  const cycleSummary = (await env.DB.prepare(
    `SELECT founding_cohort AS cycle_number, COUNT(*) AS participants
       FROM contacts
      WHERE project = 'kingmaker' AND founding_cohort IS NOT NULL AND paid = 1
      GROUP BY founding_cohort
      ORDER BY founding_cohort DESC`
  ).all()).results;

  return jsonResponse({
    success: true,
    kings,
    cycleSummary,
    foundingCohortMax: 3   // cycles 1..3 grant Founding 100 status
  }, 200, origin);
}
__name(handleKingsList, "handleKingsList");

// ── /admin/kings ─────────────────────────────────────────────
// Operator-only: insert a new King row (POST) or update grant_status (PATCH).
async function handleAdminKings(request, env, origin) {
  const auth = request.headers.get("Authorization") || "";
  if (auth !== `Bearer ${env.ADMIN_TOKEN}`) {
    return jsonResponse({ error: "Unauthorized" }, 401, origin);
  }
  const body = await request.json();

  if (request.method === "POST") {
    const {
      cycle_number, rank, mission_name, country, mission_summary,
      display_handle, contact_ticket, grant_amount_jpy, participant_count,
      chosen_at
    } = body;
    if (!cycle_number || !rank || !mission_name) {
      return jsonResponse({ error: "cycle_number, rank, mission_name required" }, 400, origin);
    }
    await env.DB.prepare(
      `INSERT INTO kings (cycle_number, rank, mission_name, country, mission_summary,
                          display_handle, contact_ticket, grant_amount_jpy,
                          participant_count, chosen_at, grant_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'awaiting_fund')`
    ).bind(
      cycle_number, rank, mission_name, country || null,
      mission_summary || null, display_handle || null,
      contact_ticket || null, grant_amount_jpy || 0,
      participant_count || null, chosen_at || new Date().toISOString()
    ).run();
    return jsonResponse({ success: true }, 200, origin);
  }

  // PATCH: update grant_status / grant_amount / proof_url
  const { id, grant_status, grant_amount_jpy, proof_url, granted_at, notes } = body;
  if (!id) return jsonResponse({ error: "id required" }, 400, origin);
  await env.DB.prepare(
    `UPDATE kings SET
       grant_status = COALESCE(?, grant_status),
       grant_amount_jpy = COALESCE(?, grant_amount_jpy),
       proof_url = COALESCE(?, proof_url),
       granted_at = COALESCE(?, granted_at),
       notes = COALESCE(?, notes)
     WHERE id = ?`
  ).bind(
    grant_status || null,
    grant_amount_jpy != null ? grant_amount_jpy : null,
    proof_url || null,
    granted_at || null,
    notes || null,
    id
  ).run();
  return jsonResponse({ success: true }, 200, origin);
}
__name(handleAdminKings, "handleAdminKings");

// ══════════════════════════════════════════════════════════════
// v20260522b: Password authentication for MyPage
// ══════════════════════════════════════════════════════════════
// Flow:
//   1st visit: /mypage/magic → email → magic link
//              → click link → /mypage/me?token=... shows history
//              → user clicks "Set a password" → /mypage/setup-password (token + password)
//              → password saved; session cookie issued
//   Returning visit: /mypage/login (email + password) → session cookie
//   Forgot password: /mypage/magic again → click link → set new password

const SESSION_COOKIE = "km_session";
const SESSION_DAYS = 30;

// ── Password hashing (PBKDF2-SHA256) ──
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}
__name(hexToBytes, "hexToBytes");

function bytesToHex(buf) {
  return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, "0")).join("");
}
__name(bytesToHex, "bytesToHex");

function timingSafeEqualHex(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
__name(timingSafeEqualHex, "timingSafeEqualHex");

async function hashPassword(plain, iter = 100000) {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(plain), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations: iter, hash: "SHA-256" },
    keyMaterial, 256
  );
  return `pbkdf2$${iter}$${bytesToHex(saltBytes)}$${bytesToHex(bits)}`;
}
__name(hashPassword, "hashPassword");

async function verifyPasswordHash(plain, storedHash) {
  if (!plain || !storedHash) return false;
  const parts = String(storedHash).split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iter = parseInt(parts[1], 10);
  const saltHex = parts[2];
  const expectedHex = parts[3];
  if (!iter || !saltHex || !expectedHex) return false;
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(plain), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: hexToBytes(saltHex), iterations: iter, hash: "SHA-256" },
    keyMaterial, expectedHex.length * 4
  );
  return timingSafeEqualHex(bytesToHex(bits), expectedHex);
}
__name(verifyPasswordHash, "verifyPasswordHash");

// ── Session cookie helpers ──
function buildSessionCookie(sessionId, expiresIso) {
  const exp = new Date(expiresIso);
  return [
    `${SESSION_COOKIE}=${sessionId}`,
    "Path=/",
    "Secure",
    "HttpOnly",
    "SameSite=None",
    `Expires=${exp.toUTCString()}`
  ].join("; ");
}
__name(buildSessionCookie, "buildSessionCookie");

function buildClearSessionCookie() {
  return [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "Secure",
    "HttpOnly",
    "SameSite=None",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  ].join("; ");
}
__name(buildClearSessionCookie, "buildClearSessionCookie");

function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (!k) continue;
    out[k] = decodeURIComponent(rest.join("="));
  }
  return out;
}
__name(parseCookies, "parseCookies");

async function getSessionEmail(env, request) {
  const cookies = parseCookies(request.headers.get("Cookie") || "");
  const sid = cookies[SESSION_COOKIE];
  if (!sid) return null;
  const row = await env.DB.prepare(
    `SELECT email, expires_at FROM mypage_sessions WHERE session_id = ? LIMIT 1`
  ).bind(sid).first();
  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) return null;
  // Touch last_seen (best-effort, non-blocking)
  env.DB.prepare(
    `UPDATE mypage_sessions SET last_seen_at = ? WHERE session_id = ?`
  ).bind(new Date().toISOString(), sid).run().catch(() => {});
  return row.email;
}
__name(getSessionEmail, "getSessionEmail");

async function createSession(env, email, ip) {
  const sessionId = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "");
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await env.DB.prepare(
    `INSERT INTO mypage_sessions (session_id, email, created_at, expires_at, last_seen_at, ip)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(sessionId, email, now.toISOString(), expires.toISOString(), now.toISOString(), ip || null).run();
  return { sessionId, expiresIso: expires.toISOString() };
}
__name(createSession, "createSession");

// ── /mypage/check-password ──
// Lightweight check: does this email have a password set yet?
// Used by mypage.html to decide whether to show password-login or magic-link UI.
async function handleMypageCheckPassword(request, env, origin) {
  const body = await request.json();
  const { email } = body || {};
  if (!email || !isValidEmail(email)) {
    return jsonResponse({ error: "有効なメールアドレスを入力してください / Valid email required" }, 400, origin);
  }
  const emailLower = email.trim().toLowerCase();
  const row = await env.DB.prepare(
    `SELECT password_hash FROM mypage_users WHERE email = ? LIMIT 1`
  ).bind(emailLower).first();

  // Always return the same shape; let frontend decide UI.
  // We do reveal whether a password is set, but only to people who already
  // know the email — same exposure level as the magic-link existence check.
  return jsonResponse({
    success: true,
    hasPassword: !!(row && row.password_hash)
  }, 200, origin);
}
__name(handleMypageCheckPassword, "handleMypageCheckPassword");

// ── /mypage/setup-password ──
// Called after user clicks magic link. Takes magic token + new password.
// Creates/updates mypage_users row, then issues a session cookie.
async function handleMypageSetupPassword(request, env, origin) {
  const body = await request.json();
  const { token, password } = body || {};
  if (!token || !/^[a-f0-9]{40,80}$/i.test(token)) {
    return jsonResponse({ error: "無効なトークン / Invalid token" }, 400, origin);
  }
  if (!password || password.length < 8) {
    return jsonResponse({ error: "パスワードは8文字以上で入力してください / Password must be at least 8 characters" }, 400, origin);
  }

  const tokenRow = await env.DB.prepare(
    `SELECT email, expires_at FROM magic_tokens WHERE token = ? LIMIT 1`
  ).bind(token).first();
  if (!tokenRow) {
    return jsonResponse({ error: "無効なトークン / Invalid token" }, 404, origin);
  }
  if (new Date(tokenRow.expires_at) < new Date()) {
    return jsonResponse({ error: "リンクの有効期限が切れています / Link expired" }, 410, origin);
  }

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();

  // UPSERT
  const existing = await env.DB.prepare(
    `SELECT email FROM mypage_users WHERE email = ? LIMIT 1`
  ).bind(tokenRow.email).first();
  if (existing) {
    await env.DB.prepare(
      `UPDATE mypage_users SET password_hash = ?, updated_at = ? WHERE email = ?`
    ).bind(passwordHash, now, tokenRow.email).run();
  } else {
    await env.DB.prepare(
      `INSERT INTO mypage_users (email, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?)`
    ).bind(tokenRow.email, passwordHash, now, now).run();
  }

  // Consume magic token (single-use)
  await env.DB.prepare(
    `UPDATE magic_tokens SET consumed_at = ? WHERE token = ?`
  ).bind(now, token).run();

  // Create session
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const { sessionId, expiresIso } = await createSession(env, tokenRow.email, ip);

  return new Response(JSON.stringify({
    success: true,
    email: tokenRow.email,
    message: "パスワードを設定し、ログインしました / Password set, logged in"
  }), {
    status: 200,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json",
      "Set-Cookie": buildSessionCookie(sessionId, expiresIso)
    }
  });
}
__name(handleMypageSetupPassword, "handleMypageSetupPassword");

// ── /mypage/login ──
// Email + password → session cookie.
async function handleMypageLogin(request, env, origin) {
  const body = await request.json();
  const { email, password } = body || {};
  if (!email || !isValidEmail(email)) {
    return jsonResponse({ error: "有効なメールアドレスを入力してください / Valid email required" }, 400, origin);
  }
  if (!password) {
    return jsonResponse({ error: "パスワードを入力してください / Password required" }, 400, origin);
  }

  const emailLower = email.trim().toLowerCase();
  const row = await env.DB.prepare(
    `SELECT password_hash FROM mypage_users WHERE email = ? LIMIT 1`
  ).bind(emailLower).first();

  if (!row || !row.password_hash) {
    return jsonResponse({ error: "メールアドレスまたはパスワードが正しくありません / Invalid email or password" }, 401, origin);
  }
  const ok = await verifyPasswordHash(password, row.password_hash);
  if (!ok) {
    return jsonResponse({ error: "メールアドレスまたはパスワードが正しくありません / Invalid email or password" }, 401, origin);
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const { sessionId, expiresIso } = await createSession(env, emailLower, ip);

  return new Response(JSON.stringify({
    success: true,
    email: emailLower,
    message: "ログインしました / Logged in"
  }), {
    status: 200,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json",
      "Set-Cookie": buildSessionCookie(sessionId, expiresIso)
    }
  });
}
__name(handleMypageLogin, "handleMypageLogin");

// ── /mypage/logout ──
async function handleMypageLogout(request, env, origin) {
  const cookies = parseCookies(request.headers.get("Cookie") || "");
  const sid = cookies[SESSION_COOKIE];
  if (sid) {
    await env.DB.prepare(
      `DELETE FROM mypage_sessions WHERE session_id = ?`
    ).bind(sid).run();
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json",
      "Set-Cookie": buildClearSessionCookie()
    }
  });
}
__name(handleMypageLogout, "handleMypageLogout");

// ── /mypage/session ──
// Returns user's data IF session cookie is valid. Used by mypage.html on load
// to auto-login if already authenticated.
async function handleMypageSession(request, env, origin) {
  const email = await getSessionEmail(env, request);
  if (!email) {
    return jsonResponse({ success: false, authenticated: false }, 200, origin);
  }
  // Reuse the same data assembly as handleMypageMe (DRY)
  const data = await buildUserData(env, email);
  return jsonResponse({ success: true, authenticated: true, ...data }, 200, origin);
}
__name(handleMypageSession, "handleMypageSession");

// ── Helper: assemble user data (used by /mypage/me and /mypage/session) ──
async function buildUserData(env, email) {
  const entries = (await env.DB.prepare(
    `SELECT ticket_number, name AS mission_name, category AS country,
            message AS mission_summary_raw, created_at,
            founding_cohort, paid, square_payment_id
       FROM contacts
      WHERE project = 'kingmaker' AND email = ?
      ORDER BY created_at DESC`
  ).bind(email).all()).results;

  const tickets = entries.map(e => e.ticket_number);
  let kingHistory = [];
  if (tickets.length) {
    const placeholders = tickets.map(() => "?").join(",");
    kingHistory = (await env.DB.prepare(
      `SELECT cycle_number, rank, grant_status, grant_amount_jpy, granted_at
         FROM kings
        WHERE contact_ticket IN (${placeholders})`
    ).bind(...tickets).all()).results;
  }

  const formatted = entries.map(e => {
    let summary = e.mission_summary_raw || "";
    let sns = "";
    const m = summary.match(/\n\n\[Website\/SNS\]\s+(.+)$/);
    if (m) { sns = m[1].trim(); summary = summary.replace(m[0], ""); }
    return {
      ticket_number: e.ticket_number,
      mission_name: e.mission_name,
      country: e.country,
      mission_summary: summary,
      sns,
      created_at: e.created_at,
      founding_cohort: e.founding_cohort,
      paid: !!e.paid
    };
  });

  let foundingCohort = null;
  for (const f of formatted) {
    if (f.founding_cohort != null && (foundingCohort == null || f.founding_cohort < foundingCohort)) {
      foundingCohort = f.founding_cohort;
    }
  }

  // Check if user has a password set
  const userRow = await env.DB.prepare(
    `SELECT password_hash FROM mypage_users WHERE email = ? LIMIT 1`
  ).bind(email).first();

  return {
    email,
    entries: formatted,
    kingHistory,
    foundingCohort,
    isFoundingMember: foundingCohort != null && foundingCohort <= 3,
    hasPassword: !!(userRow && userRow.password_hash)
  };
}
__name(buildUserData, "buildUserData");

// ══════════════════════════════════════════════════════════════════════
// 5-MINUTE GAME — THE FIVE (Phase 1 quiz · Phase 2 SHA draw · Phase 3 vote)
// ══════════════════════════════════════════════════════════════════════
// All timestamps are JST. The Bell rings every Friday at 23:23 JST.
// Window: 23:23:00 → 23:28:00. Defaults from docs/GAME_SPEC_v2.md § 7:
//   - Q1 voting rights: all paid participants (passed or not).
//   - Q2 timing: Phase1=120s, Phase2=30s, Phase3=150s (+ 0s buffer).
//   - Q3 tie: SHA-256 redraw using the same Phase 2 seed.
//   - Q4 source: operator-written pool (seeded in migration 0003).
//   - Q5 languages: ja + en.
//   - Q6 next Cycle: 2026-05-29 (Fri) 23:23 JST.
//   - Q7 difficulty: balance 1 easy + 1 medium + 1 hard per quiz.
//   - Q8 voting UI: Mission text only (anonymous), no handle.
// Operator can override these by editing GAME_CONFIG below and redeploying.

var GAME_CONFIG = {
  // Cycle 2 opens at this moment (next Bell). Cycle 1 = 2026-05-22T14:23:00Z.
  // After each Cycle's finalize, operator updates these manually.
  currentCycle: 2,
  bellRingsAtIso: "2026-05-29T14:23:00Z",   // 2026-05-29 (Fri) 23:23 JST
  phase1DurationSec: 120,                    // quiz window
  phase2DurationSec: 30,                     // SHA draw animation
  phase3DurationSec: 150,                    // voting window
  // Phase windows (sec offset from bell). End of Phase3 = end of 5 min.
  phase1StartOffsetSec: 0,
  phase2StartOffsetSec: 120,
  phase3StartOffsetSec: 150,
  bellClosesAtOffsetSec: 300,                // total 5 minutes
  // Phase 1
  questionsPerQuiz: 3,
  requiredCorrect: 3,                        // 3/3 to pass
  // Phase 3
  voteRightsAll: true,                       // false = passers only
  // Tie-break
  tieBreakMode: "sha-redraw",                // 'sha-redraw' | 'operator' | 'multi-king'
  // Languages allowed
  allowedLanguages: ["ja", "en"],
  // ─── Dormancy threshold (operator decision 2026-05-23) ───
  // If fewer than this many paid participants are registered for the current
  // Cycle at the moment the Bell rings (23:23:00 JST), the entire game is
  // skipped — no quiz, no draw, no vote. The cycle is marked 'dormant' and
  // participants' Bells carry over to the next Cycle without losing money.
  // Their founding_cohort stays at the original cycle number (B option from
  // session ⑩ planning), preserving the historical Founding Member record.
  // The unspent ¥100 × N stays in the company account and is added to the
  // Mission Fund running total (visible on kings.html / verify.html).
  dormancyThreshold: 1000
};

function gameNowMs() { return Date.now(); }

// ── Cycle resolution (single source of truth) ──
// Returns the integer cycle number to use for THIS request. Priority order:
//   1. env.CURRENT_CYCLE if present and parses to a positive integer
//      (operator override hatch — useful for testing or staged rollover).
//   2. GAME_CONFIG.currentCycle (the source of truth committed in this file).
//   3. 1 (paranoid floor — should never be hit).
//
// Use this for EVERY cycle-aware operation in the Worker so that read and
// write paths never disagree. Before v20260523p the entry-pay write path
// used a different fallback chain from the game-state read paths, which
// meant operator overrides could silently misclassify writes vs reads.
function resolveCurrentCycle(env) {
  const fromEnv = env && env.CURRENT_CYCLE ? parseInt(env.CURRENT_CYCLE, 10) : NaN;
  if (Number.isInteger(fromEnv) && fromEnv > 0) return fromEnv;
  const fromConfig = parseInt(GAME_CONFIG.currentCycle, 10);
  if (Number.isInteger(fromConfig) && fromConfig > 0) return fromConfig;
  return 1;
}
__name(resolveCurrentCycle, "resolveCurrentCycle");

// Parse a caller-supplied cycle override (from body.cycle or
// url.searchParams.get("cycle")). If the value is a positive integer, use
// it; otherwise fall back to resolveCurrentCycle(env). This guards against
// "abc", "-1", "0", "", null, undefined — none of which should reach a SQL
// binding and confuse downstream queries.
function parseCycleOverride(value, env) {
  const n = parseInt(value, 10);
  if (Number.isInteger(n) && n > 0) return n;
  return resolveCurrentCycle(env);
}
__name(parseCycleOverride, "parseCycleOverride");

function gameBellPhase(env) {
  const bellMs = new Date(GAME_CONFIG.bellRingsAtIso).getTime();
  const nowMs = gameNowMs();
  const offsetSec = Math.floor((nowMs - bellMs) / 1000);
  const cycle = resolveCurrentCycle(env);

  if (offsetSec < 0) {
    return { phase: "pre_bell", offsetSec, secondsUntilBell: -offsetSec, cycle };
  }
  if (offsetSec < GAME_CONFIG.phase2StartOffsetSec) {
    return { phase: "phase1", offsetSec, secondsLeft: GAME_CONFIG.phase2StartOffsetSec - offsetSec, cycle };
  }
  if (offsetSec < GAME_CONFIG.phase3StartOffsetSec) {
    return { phase: "phase2", offsetSec, secondsLeft: GAME_CONFIG.phase3StartOffsetSec - offsetSec, cycle };
  }
  if (offsetSec < GAME_CONFIG.bellClosesAtOffsetSec) {
    return { phase: "phase3", offsetSec, secondsLeft: GAME_CONFIG.bellClosesAtOffsetSec - offsetSec, cycle };
  }
  return { phase: "post_bell", offsetSec, cycle };
}
__name(gameBellPhase, "gameBellPhase");

// Look up the paid contact for an email; returns the contact row or null.
// We trust an authenticated session (cookie) OR an email+ticket pair.
async function gameResolveParticipant(env, request) {
  // Path A: cookie session.
  const email = await getSessionEmail(env, request);
  if (email) {
    const row = await env.DB.prepare(
      "SELECT ticket_number, email, founding_cohort, paid FROM contacts WHERE email = ? AND paid = 1 AND founding_cohort = ? ORDER BY created_at DESC LIMIT 1"
    ).bind(email, resolveCurrentCycle(env)).first();
    if (row) return { source: "session", row };
  }
  return { source: null, row: null };
}
__name(gameResolveParticipant, "gameResolveParticipant");

// Public Bell status endpoint — drives the countdown on index.html / play.html.
async function handleGameBellStatus(request, env, origin) {
  const phase = gameBellPhase(env);
  const cycle = phase.cycle;  // already resolved through resolveCurrentCycle
  // Also expose paid-entry count for the current cycle (for play.html participant counter).
  const cnt = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM contacts WHERE paid = 1 AND founding_cohort = ?"
  ).bind(cycle).first();
  const participantCount = cnt ? cnt.n : 0;

  // ─── Dormancy override ─────────────────────────────────────────
  // If the bell has rung but participant count is below threshold, override
  // phase 'phase1/phase2/phase3' with 'dormant'. Pre-bell and post-bell
  // states are not affected.
  let effectivePhase = phase.phase;
  let isDormant = false;
  if (
    (phase.phase === "phase1" || phase.phase === "phase2" || phase.phase === "phase3")
    && participantCount < GAME_CONFIG.dormancyThreshold
  ) {
    effectivePhase = "dormant";
    isDormant = true;
  }

  return jsonResponse({
    ok: true,
    bellRingsAtIso: GAME_CONFIG.bellRingsAtIso,
    serverNowIso: new Date().toISOString(),
    cycle,
    phase: effectivePhase,
    rawPhase: phase.phase,                // unmasked phase, for diagnostics
    secondsLeft: phase.secondsLeft,
    secondsUntilBell: phase.secondsUntilBell,
    participantCount,
    dormancyThreshold: GAME_CONFIG.dormancyThreshold,
    isDormant,
    config: {
      phase1DurationSec: GAME_CONFIG.phase1DurationSec,
      phase2DurationSec: GAME_CONFIG.phase2DurationSec,
      phase3DurationSec: GAME_CONFIG.phase3DurationSec,
      bellClosesAtOffsetSec: GAME_CONFIG.bellClosesAtOffsetSec
    }
  }, 200, origin);
}
__name(handleGameBellStatus, "handleGameBellStatus");

// POST /game/quiz/start — body: { language: 'ja'|'en' }
// Auth: session cookie.
// Creates a game_sessions row if none exists, returns the 3 questions.
async function handleGameQuizStart(request, env, origin) {
  const phase = gameBellPhase(env);
  if (phase.phase !== "phase1") {
    return jsonResponse({ ok: false, error: "Not in Phase 1.", phase: phase.phase }, 403, origin);
  }
  const cycle = phase.cycle;
  const { row: participant } = await gameResolveParticipant(env, request);
  if (!participant) {
    return jsonResponse({ ok: false, error: "Not a paid participant of this Cycle." }, 401, origin);
  }
  const body = await request.json().catch(() => ({}));
  let lang = (body.language || "ja").toLowerCase();
  if (!GAME_CONFIG.allowedLanguages.includes(lang)) lang = "ja";

  // Idempotent: if session already exists, return it.
  let session = await env.DB.prepare(
    "SELECT * FROM game_sessions WHERE cycle_number = ? AND contact_ticket = ?"
  ).bind(cycle, participant.ticket_number).first();

  let assignedGroupIds;
  if (!session) {
    // ─── Dormancy guard ─────────────────────────────────────────
    // If the Cycle is dormant (paid < threshold), don't let the quiz start.
    const cnt = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM contacts WHERE paid = 1 AND founding_cohort = ?"
    ).bind(cycle).first();
    if (cnt && cnt.n < GAME_CONFIG.dormancyThreshold) {
      return jsonResponse({
        ok: false,
        error: "dormant",
        participantCount: cnt.n,
        threshold: GAME_CONFIG.dormancyThreshold,
        message: "Cycle is dormant — minimum participant threshold not reached."
      }, 403, origin);
    }

    // ─── Past-question exclusion ───────────────────────────────────
    // Get every group_id this participant has ever answered (across all Cycles).
    // We will prefer unseen groups; only fall back to seen ones when the pool
    // can't provide enough fresh questions at each difficulty.
    const seenRes = await env.DB.prepare(
      "SELECT DISTINCT group_id FROM quiz_attempts WHERE contact_ticket = ?"
    ).bind(participant.ticket_number).all();
    const seen = (seenRes.results || []).map(r => r.group_id);
    const seenList = seen.length ? seen : [0];   // dummy so NOT IN never empty
    const seenPlaceholders = seenList.map(() => "?").join(",");

    // Pick 3 questions: 1 easy + 1 medium + 1 hard, preferring UNSEEN groups.
    async function pickByDifficulty(diff) {
      // First try: unseen
      const fresh = await env.DB.prepare(
        `SELECT group_id FROM quiz_questions
         WHERE language = ? AND difficulty = ? AND active = 1
           AND group_id NOT IN (${seenPlaceholders})
         ORDER BY RANDOM() LIMIT 1`
      ).bind(lang, diff, ...seenList).first();
      if (fresh) return fresh.group_id;
      // Fallback: pool exhausted at this difficulty — pick any (seen).
      const any = await env.DB.prepare(
        "SELECT group_id FROM quiz_questions WHERE language = ? AND difficulty = ? AND active = 1 ORDER BY RANDOM() LIMIT 1"
      ).bind(lang, diff).first();
      return any ? any.group_id : null;
    }

    const easyId = await pickByDifficulty(1);
    const mediumId = await pickByDifficulty(2);
    const hardId = await pickByDifficulty(3);

    const groups = [easyId, mediumId, hardId].filter(g => g != null);
    // Guard: no duplicates within a single quiz (rare but possible if all
    // unseen are exhausted and RNG picks the same fallback twice).
    const unique = Array.from(new Set(groups));
    if (unique.length < 3) {
      // Fallback: any 3 distinct active groups in language.
      const any = await env.DB.prepare(
        "SELECT DISTINCT group_id FROM quiz_questions WHERE language = ? AND active = 1 ORDER BY RANDOM() LIMIT 3"
      ).bind(lang).all();
      assignedGroupIds = (any.results || []).map(r => r.group_id);
    } else {
      assignedGroupIds = unique;
    }

    if (assignedGroupIds.length < 3) {
      return jsonResponse({ ok: false, error: "Insufficient question pool. Operator must seed more." }, 500, origin);
    }

    const ins = await env.DB.prepare(
      "INSERT INTO game_sessions (cycle_number, contact_ticket, email, language, assigned_q_json, started_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(
      cycle,
      participant.ticket_number,
      participant.email,
      lang,
      JSON.stringify(assignedGroupIds),
      new Date().toISOString()
    ).run();
    session = await env.DB.prepare(
      "SELECT * FROM game_sessions WHERE id = ?"
    ).bind(ins.meta.last_row_id).first();
  } else {
    assignedGroupIds = JSON.parse(session.assigned_q_json);
  }

  // Fetch the 3 questions (without correct_index).
  const placeholders = assignedGroupIds.map(() => "?").join(",");
  const qs = await env.DB.prepare(
    `SELECT id, group_id, category, difficulty, question, choices_json
     FROM quiz_questions WHERE group_id IN (${placeholders}) AND language = ? AND active = 1`
  ).bind(...assignedGroupIds, lang).all();

  // Preserve order according to assignedGroupIds.
  const orderedQs = assignedGroupIds.map(gid => (qs.results || []).find(q => q.group_id === gid)).filter(Boolean);

  return jsonResponse({
    ok: true,
    sessionId: session.id,
    currentIndex: session.current_index,
    correctCount: session.correct_count,
    phase: session.phase,
    quizPassed: session.quiz_passed,
    questions: orderedQs.map(q => ({
      id: q.id,
      groupId: q.group_id,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      choices: JSON.parse(q.choices_json)
    }))
  }, 200, origin);
}
__name(handleGameQuizStart, "handleGameQuizStart");

// POST /game/quiz/answer — body: { sessionId, questionId, chosenIndex }
async function handleGameQuizAnswer(request, env, origin) {
  const phase = gameBellPhase(env);
  if (phase.phase !== "phase1") {
    return jsonResponse({ ok: false, error: "Quiz window closed.", phase: phase.phase }, 403, origin);
  }
  const { row: participant } = await gameResolveParticipant(env, request);
  if (!participant) {
    return jsonResponse({ ok: false, error: "Not a paid participant." }, 401, origin);
  }
  const body = await request.json().catch(() => ({}));
  const sessionId = parseInt(body.sessionId, 10);
  const questionId = parseInt(body.questionId, 10);
  const chosenIndex = parseInt(body.chosenIndex, 10);

  const session = await env.DB.prepare(
    "SELECT * FROM game_sessions WHERE id = ? AND contact_ticket = ?"
  ).bind(sessionId, participant.ticket_number).first();
  if (!session) {
    return jsonResponse({ ok: false, error: "Session not found." }, 404, origin);
  }
  if (session.phase !== "quiz") {
    return jsonResponse({ ok: false, error: "Quiz already finished for this session.", phase: session.phase }, 400, origin);
  }
  if (session.current_index >= GAME_CONFIG.questionsPerQuiz) {
    return jsonResponse({ ok: false, error: "All 3 questions already answered." }, 400, origin);
  }

  const q = await env.DB.prepare(
    "SELECT id, group_id, correct_index, explanation FROM quiz_questions WHERE id = ?"
  ).bind(questionId).first();
  if (!q) {
    return jsonResponse({ ok: false, error: "Question not found." }, 404, origin);
  }

  // Verify questionId belongs to this session's assigned set + expected slot.
  const assigned = JSON.parse(session.assigned_q_json);
  const expectedGroupId = assigned[session.current_index];
  if (q.group_id !== expectedGroupId) {
    return jsonResponse({ ok: false, error: "Question out of order." }, 400, origin);
  }

  const isCorrect = chosenIndex === q.correct_index ? 1 : 0;
  const newIndex = session.current_index + 1;
  const newCorrect = session.correct_count + isCorrect;
  const done = newIndex >= GAME_CONFIG.questionsPerQuiz;
  const passed = done ? (newCorrect >= GAME_CONFIG.requiredCorrect ? 1 : 0) : null;

  await env.DB.prepare(
    "INSERT INTO quiz_attempts (cycle_number, session_id, contact_ticket, question_id, group_id, chosen_index, is_correct, answered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(
    resolveCurrentCycle(env), sessionId, participant.ticket_number,
    q.id, q.group_id, chosenIndex, isCorrect, new Date().toISOString()
  ).run();

  if (done) {
    await env.DB.prepare(
      "UPDATE game_sessions SET current_index = ?, correct_count = ?, phase = 'phase2_wait', quiz_passed = ?, quiz_done_at = ? WHERE id = ?"
    ).bind(newIndex, newCorrect, passed, new Date().toISOString(), sessionId).run();
  } else {
    await env.DB.prepare(
      "UPDATE game_sessions SET current_index = ?, correct_count = ? WHERE id = ?"
    ).bind(newIndex, newCorrect, sessionId).run();
  }

  return jsonResponse({
    ok: true,
    isCorrect: !!isCorrect,
    correctIndex: q.correct_index,
    explanation: q.explanation,
    correctCount: newCorrect,
    currentIndex: newIndex,
    finished: done,
    quizPassed: passed
  }, 200, origin);
}
__name(handleGameQuizAnswer, "handleGameQuizAnswer");

// GET /game/quiz/result — quick poll for own session status
async function handleGameQuizResult(request, env, origin) {
  const { row: participant } = await gameResolveParticipant(env, request);
  if (!participant) {
    return jsonResponse({ ok: false, error: "Not a paid participant." }, 401, origin);
  }
  const session = await env.DB.prepare(
    "SELECT id, cycle_number, current_index, correct_count, phase, quiz_passed, quiz_done_at FROM game_sessions WHERE cycle_number = ? AND contact_ticket = ?"
  ).bind(resolveCurrentCycle(env), participant.ticket_number).first();
  return jsonResponse({ ok: true, session: session || null }, 200, origin);
}
__name(handleGameQuizResult, "handleGameQuizResult");

// POST /game/phase2/draw — admin-triggered SHA draw of The Three from passers.
// Auth: Bearer ADMIN_TOKEN. Can also be called by a cron worker.
async function handleGamePhase2Draw(request, env, origin) {
  const auth = request.headers.get("Authorization") || "";
  if (auth !== `Bearer ${env.ADMIN_TOKEN}`) {
    return jsonResponse({ ok: false, error: "Unauthorized." }, 401, origin);
  }
  const body = await request.json().catch(() => ({}));
  const cycle = parseCycleOverride(body.cycle, env);

  // Idempotent: if already drawn, return existing state.
  let state = await env.DB.prepare(
    "SELECT * FROM cycle_state WHERE cycle_number = ?"
  ).bind(cycle).first();
  if (state && state.phase2_winner_king_ids) {
    return jsonResponse({ ok: true, alreadyDrawn: true, state }, 200, origin);
  }

  // Collect passers.
  // contacts table is a shared inquiry-form schema where:
  //   name     = mission_name
  //   category = country
  //   message  = mission_summary (with optional trailing "[Website/SNS] ..." line)
  // There is no separate handle_name column; we use display_handle = null
  // and fall back to ticket_number for identification.
  const passers = await env.DB.prepare(
    "SELECT gs.contact_ticket, gs.email, gs.language, "
    + "c.category AS country, c.name AS mission_name, c.message AS mission_summary_raw "
    + "FROM game_sessions gs LEFT JOIN contacts c ON gs.contact_ticket = c.ticket_number "
    + "WHERE gs.cycle_number = ? AND gs.quiz_passed = 1 ORDER BY gs.quiz_done_at ASC"
  ).bind(cycle).all();
  const arr = (passers.results || []).map(p => {
    // Strip the "[Website/SNS] ..." suffix from message to get clean mission_summary
    let summary = p.mission_summary_raw || "";
    const snsMatch = summary.match(/\n\n\[Website\/SNS\]\s+(.+)$/);
    if (snsMatch) summary = summary.replace(snsMatch[0], "");
    return {
      contact_ticket: p.contact_ticket,
      email: p.email,
      language: p.language,
      country: p.country,
      mission_name: p.mission_name,
      mission_summary: summary
    };
  });

  if (arr.length === 0) {
    return jsonResponse({ ok: false, error: "No passers in this cycle." }, 400, origin);
  }

  // Seed: caller-supplied (so operator can paste real BTC hash / Nikkei / S&P).
  // The public-verifiability narrative requires that the seed be bound to
  // real-world data the operator couldn't have known in advance. We REFUSE
  // to draw with placeholder zeros unless the caller explicitly passes
  // `allowSyntheticSeed: true` (operator must add this in the request body
  // to override — useful only for dry-run testing where reproducibility
  // matters more than public verifiability).
  const btc    = body.btcHash      || "";
  const nikkei = body.nikkeiClose  || "";
  const sp500  = body.sp500Close   || "";
  const hasSeedInputs = btc && nikkei && sp500;
  if (!hasSeedInputs && !body.allowSyntheticSeed) {
    return jsonResponse({
      ok: false,
      error: "Public seed inputs required. Pass btcHash, nikkeiClose, sp500Close in the request body. Or set allowSyntheticSeed:true to bypass (testing only)."
    }, 400, origin);
  }
  const btcSafe    = btc    || "0000000000000000000000000000000000000000000000000000000000000000";
  const nikkeiSafe = nikkei || "0";
  const sp500Safe  = sp500  || "0";
  const seed = `cycle:${cycle}|btc:${btcSafe}|nikkei:${nikkeiSafe}|sp500:${sp500Safe}|n:${arr.length}`;
  const hash = await sha256Hex(seed);

  // Pick distinct indices from the hash. A SHA-256 hex string is 64 chars.
  // We slide an 8-char window across the whole hash (offsets 0, 8, 16, ...,
  // 56), giving 8 candidate indices on a single pass. If we need more
  // (e.g. after collisions on small `arr`), the loop wraps modulo 64 - 8
  // = 57 so we can re-sample at non-aligned offsets. Before v20260523p
  // this loop used `% 56` which silently skipped offset 56 (the last 8
  // hex chars of the hash), losing one chunk of entropy per cycle.
  const winners = [];
  for (let i = 0; winners.length < Math.min(3, arr.length) && i < 64; i++) {
    const off = (i * 8) % 57;  // 0..56 inclusive — all 8-char windows
    const chunk = hash.substring(off, off + 8);
    const idx = parseInt(chunk, 16) % arr.length;
    if (!winners.includes(idx)) winners.push(idx);
  }
  // Fallback: linear scan (only reached if arr.length is small + hash had
  // extreme collisions; near-impossible for real participant counts).
  while (winners.length < Math.min(3, arr.length)) {
    for (let i = 0; i < arr.length && winners.length < 3; i++) {
      if (!winners.includes(i)) winners.push(i);
    }
  }

  // Insert into kings (rank=1 placeholder; King is set after Phase 3 finalize).
  const nowIso = new Date().toISOString();
  const winnerKingIds = [];
  for (const idx of winners) {
    const p = arr[idx];
    const ins = await env.DB.prepare(
      "INSERT INTO kings (cycle_number, rank, mission_name, country, mission_summary, display_handle, contact_ticket, participant_count, chosen_at, grant_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'awaiting_fund')"
    ).bind(
      cycle, 999, // 999 = candidate; will be updated to 1 (winner) after Phase 3
      p.mission_name || "(no mission name)",
      p.country || null,
      p.mission_summary || "",
      null, // display_handle: not stored in contacts; can be set later by operator
      p.contact_ticket,
      arr.length,
      nowIso
    ).run();
    winnerKingIds.push(ins.meta.last_row_id);
  }

  // Upsert cycle_state.
  if (!state) {
    await env.DB.prepare(
      "INSERT INTO cycle_state (cycle_number, bell_rings_at, phase2_drawn_at, phase2_seed, phase2_hash, phase2_winner_king_ids, participant_count, passed_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      cycle, GAME_CONFIG.bellRingsAtIso, nowIso, seed, hash,
      JSON.stringify(winnerKingIds), arr.length, arr.length
    ).run();
  } else {
    await env.DB.prepare(
      "UPDATE cycle_state SET phase2_drawn_at=?, phase2_seed=?, phase2_hash=?, phase2_winner_king_ids=?, passed_count=? WHERE cycle_number = ?"
    ).bind(nowIso, seed, hash, JSON.stringify(winnerKingIds), arr.length, cycle).run();
  }

  return jsonResponse({
    ok: true,
    cycle,
    seed,
    hash,
    winners: winnerKingIds,
    passerCount: arr.length
  }, 200, origin);
}
__name(handleGamePhase2Draw, "handleGamePhase2Draw");

// GET /game/phase2/result?cycle=N — public; returns the 3 candidates (anonymous Mission only by default)
async function handleGamePhase2Result(request, env, origin) {
  const url = new URL(request.url);
  const cycle = parseCycleOverride(url.searchParams.get("cycle"), env);
  const state = await env.DB.prepare(
    "SELECT * FROM cycle_state WHERE cycle_number = ?"
  ).bind(cycle).first();
  if (!state || !state.phase2_winner_king_ids) {
    return jsonResponse({ ok: false, error: "Phase 2 not yet drawn." }, 404, origin);
  }
  const ids = JSON.parse(state.phase2_winner_king_ids);
  const placeholders = ids.map(() => "?").join(",");
  const kingsRows = await env.DB.prepare(
    `SELECT id, mission_name, mission_summary, country, display_handle FROM kings WHERE id IN (${placeholders})`
  ).bind(...ids).all();
  // Order by ids (preserve draw order).
  const ordered = ids.map(id => (kingsRows.results || []).find(k => k.id === id)).filter(Boolean);
  return jsonResponse({
    ok: true,
    cycle,
    seed: state.phase2_seed,
    hash: state.phase2_hash,
    drawnAt: state.phase2_drawn_at,
    candidates: ordered.map(k => ({
      kingId: k.id,
      // Q8 default: Mission text only (no handle / country)
      missionName: k.mission_name,
      missionSummary: k.mission_summary,
      country: k.country,        // exposed but UI may hide
      handle: k.display_handle   // exposed but UI may hide
    }))
  }, 200, origin);
}
__name(handleGamePhase2Result, "handleGamePhase2Result");

// POST /game/vote — body: { kingId } — auth: cookie session
async function handleGameVote(request, env, origin) {
  const phase = gameBellPhase(env);
  if (phase.phase !== "phase3") {
    return jsonResponse({ ok: false, error: "Voting window not open.", phase: phase.phase }, 403, origin);
  }
  const { row: participant } = await gameResolveParticipant(env, request);
  if (!participant) {
    return jsonResponse({ ok: false, error: "Not a paid participant." }, 401, origin);
  }
  // Q1 default: all participants can vote.
  if (!GAME_CONFIG.voteRightsAll) {
    const sess = await env.DB.prepare(
      "SELECT quiz_passed FROM game_sessions WHERE cycle_number = ? AND contact_ticket = ?"
    ).bind(resolveCurrentCycle(env), participant.ticket_number).first();
    if (!sess || sess.quiz_passed !== 1) {
      return jsonResponse({ ok: false, error: "Only quiz passers may vote." }, 403, origin);
    }
  }
  const body = await request.json().catch(() => ({}));
  const kingId = parseInt(body.kingId, 10);

  // Verify kingId is one of this cycle's 3 candidates.
  const state = await env.DB.prepare(
    "SELECT phase2_winner_king_ids FROM cycle_state WHERE cycle_number = ?"
  ).bind(resolveCurrentCycle(env)).first();
  if (!state || !state.phase2_winner_king_ids) {
    return jsonResponse({ ok: false, error: "The Three not yet drawn." }, 400, origin);
  }
  const valid = JSON.parse(state.phase2_winner_king_ids);
  if (!valid.includes(kingId)) {
    return jsonResponse({ ok: false, error: "Invalid candidate." }, 400, origin);
  }

  // Upsert vote (latest wins; UNIQUE on cycle+voter).
  await env.DB.prepare(
    "INSERT INTO votes (cycle_number, voter_contact_ticket, voted_for_king_id, voted_at) VALUES (?, ?, ?, ?) "
    + "ON CONFLICT (cycle_number, voter_contact_ticket) DO UPDATE SET voted_for_king_id = excluded.voted_for_king_id, voted_at = excluded.voted_at"
  ).bind(resolveCurrentCycle(env), participant.ticket_number, kingId, new Date().toISOString()).run();

  return jsonResponse({ ok: true, votedFor: kingId }, 200, origin);
}
__name(handleGameVote, "handleGameVote");

// GET /game/vote/results?cycle=N — tally (public after Phase 3 ends; live before that)
async function handleGameVoteResults(request, env, origin) {
  const url = new URL(request.url);
  const cycle = parseCycleOverride(url.searchParams.get("cycle"), env);
  const rows = await env.DB.prepare(
    "SELECT voted_for_king_id, COUNT(*) AS n FROM votes WHERE cycle_number = ? GROUP BY voted_for_king_id"
  ).bind(cycle).all();
  const tally = {};
  let total = 0;
  for (const r of (rows.results || [])) {
    tally[r.voted_for_king_id] = r.n;
    total += r.n;
  }
  return jsonResponse({ ok: true, cycle, tally, total }, 200, origin);
}
__name(handleGameVoteResults, "handleGameVoteResults");

// POST /game/phase3/finalize — admin/cron — picks winner, updates kings.rank.
async function handleGamePhase3Finalize(request, env, origin) {
  const auth = request.headers.get("Authorization") || "";
  if (auth !== `Bearer ${env.ADMIN_TOKEN}`) {
    return jsonResponse({ ok: false, error: "Unauthorized." }, 401, origin);
  }
  const body = await request.json().catch(() => ({}));
  const cycle = parseCycleOverride(body.cycle, env);
  const result = await runPhase3Finalize(env, cycle);
  if (!result.ok) {
    return jsonResponse(result, result.statusCode || 400, origin);
  }
  // Strip statusCode before returning.
  const { statusCode, ...payload } = result;
  return jsonResponse(payload, 200, origin);
}
__name(handleGamePhase3Finalize, "handleGamePhase3Finalize");

// Internal Phase 3 finalize — invoked by the HTTP handler above OR by the
// scheduled() cron handler. Returns a plain object suitable for both.
// Idempotent (the `state.finalized_at` check protects against double-runs).
async function runPhase3Finalize(env, cycle) {
  const state = await env.DB.prepare(
    "SELECT * FROM cycle_state WHERE cycle_number = ?"
  ).bind(cycle).first();
  if (!state || !state.phase2_winner_king_ids) {
    return { ok: false, error: "Phase 2 not drawn.", statusCode: 400, cycle };
  }
  if (state.finalized_at) {
    return { ok: true, alreadyFinalized: true, state, cycle };
  }

  const candidates = JSON.parse(state.phase2_winner_king_ids);
  const rows = await env.DB.prepare(
    "SELECT voted_for_king_id, COUNT(*) AS n FROM votes WHERE cycle_number = ? GROUP BY voted_for_king_id"
  ).bind(cycle).all();
  const tally = {};
  for (const c of candidates) tally[c] = 0;
  for (const r of (rows.results || [])) tally[r.voted_for_king_id] = r.n;

  // Find max.
  let maxVotes = -1;
  let winners = [];
  for (const [id, n] of Object.entries(tally)) {
    if (n > maxVotes) { maxVotes = n; winners = [parseInt(id, 10)]; }
    else if (n === maxVotes) winners.push(parseInt(id, 10));
  }

  // Tie-break.
  let finalKingId;
  if (winners.length === 1) {
    finalKingId = winners[0];
  } else if (GAME_CONFIG.tieBreakMode === "sha-redraw") {
    // Re-hash with a tie-break suffix.
    const seed = state.phase2_seed + "|tie:" + winners.join(",");
    const h = await sha256Hex(seed);
    const idx = parseInt(h.substring(0, 8), 16) % winners.length;
    finalKingId = winners[idx];
  } else {
    finalKingId = winners[0]; // default fallback
  }

  // Update ranks: winner = 1, others = 2 or 3 based on vote count desc.
  const sortedByVotes = candidates.slice().sort((a, b) => (tally[b] || 0) - (tally[a] || 0));
  const ranks = {};
  ranks[finalKingId] = 1;
  let nextRank = 2;
  for (const id of sortedByVotes) {
    if (id !== finalKingId) ranks[id] = nextRank++;
  }
  for (const [id, rank] of Object.entries(ranks)) {
    await env.DB.prepare("UPDATE kings SET rank = ? WHERE id = ?").bind(rank, parseInt(id, 10)).run();
  }

  const total = Object.values(tally).reduce((s, n) => s + n, 0);
  const nowIso = new Date().toISOString();
  await env.DB.prepare(
    "UPDATE cycle_state SET finalized_at = ?, final_king_id = ?, vote_count = ? WHERE cycle_number = ?"
  ).bind(nowIso, finalKingId, total, cycle).run();

  return {
    ok: true,
    cycle,
    finalKingId,
    tally,
    totalVotes: total,
    tieBreakUsed: winners.length > 1
  };
}
__name(runPhase3Finalize, "runPhase3Finalize");

// GET /game/mission-fund — public summary of total Mission Fund accumulated.
// Returns: total paid entries, total ¥ collected, ¥ already granted to Kings,
// ¥ pending (awaiting_fund), counts per Cycle. Powers the running-total
// display on kings.html / verify.html.
async function handleGameMissionFund(request, env, origin) {
  // Total paid entries (all cycles, paid=1).
  const totalPaid = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM contacts WHERE paid = 1"
  ).first();
  const totalPaidCount = totalPaid ? totalPaid.n : 0;
  const totalCollectedJpy = totalPaidCount * 100;   // ¥100 per Bell

  // Per-cycle breakdown.
  const perCycle = await env.DB.prepare(
    "SELECT founding_cohort AS cycle, COUNT(*) AS n FROM contacts WHERE paid = 1 GROUP BY founding_cohort ORDER BY founding_cohort ASC"
  ).all();

  // Granted total (Kings who have grant_status = 'granted').
  const granted = await env.DB.prepare(
    "SELECT COALESCE(SUM(grant_amount_jpy), 0) AS s FROM kings WHERE rank = 1 AND grant_status = 'granted'"
  ).first();
  const grantedJpy = granted ? granted.s : 0;

  // Awaiting fund (Kings with grant_status = 'awaiting_fund').
  const awaiting = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM kings WHERE rank = 1 AND grant_status = 'awaiting_fund'"
  ).first();
  const awaitingCount = awaiting ? awaiting.n : 0;

  // Available pool = collected − granted.
  const availableJpy = Math.max(0, totalCollectedJpy - grantedJpy);

  return jsonResponse({
    ok: true,
    totalPaidEntries: totalPaidCount,
    totalCollectedJpy,
    grantedJpy,
    availableJpy,
    awaitingKingCount: awaitingCount,
    perCycle: (perCycle.results || []).map(r => ({
      cycle: r.cycle,
      paidEntries: r.n,
      collectedJpy: r.n * 100
    }))
  }, 200, origin);
}
__name(handleGameMissionFund, "handleGameMissionFund");

// GET /quiz/pool — returns the entire active quiz question pool.
// Used by preview.html (operator tool) to render any quiz combination.
// No auth required — questions are not secret by design.
async function handleQuizPool(request, env, origin) {
  const rows = await env.DB.prepare(
    "SELECT id, group_id, language, category, difficulty, question, choices_json, correct_index, explanation FROM quiz_questions WHERE active = 1 ORDER BY group_id ASC, language ASC"
  ).all();
  return jsonResponse({
    ok: true,
    count: (rows.results || []).length,
    questions: rows.results || []
  }, 200, origin);
}
__name(handleQuizPool, "handleQuizPool");


export {
  index_default as default
};
