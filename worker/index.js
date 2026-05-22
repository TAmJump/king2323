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
      return jsonResponse({ error: "Not Found" }, 404, origin);
    } catch (err) {
      console.error("Worker error:", err);
      return jsonResponse({ error: "Internal Server Error" }, 500, origin);
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

  // ── Determine cycle number from cycle config (env var, falls back to 1) ──
  // Operator sets env.CURRENT_CYCLE = "1" / "2" / etc.
  const cycleNumber = parseInt(env.CURRENT_CYCLE || "1", 10) || 1;

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

export {
  index_default as default
};
