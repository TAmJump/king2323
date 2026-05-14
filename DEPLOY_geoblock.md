# Cloudflare geo-restriction setup (Japan-only)

Until each foreign jurisdiction has been reviewed by counsel, KINGMAKER 23:23 must serve only Japanese IPs. The page-level disclaimer cannot replace network-level blocking — visitors from US/UK/EU must not be able to reach the application.

## What to configure in Cloudflare

1. **Dashboard → Security → WAF → Custom rules → Create rule**

2. Rule name: `Geo restriction — JP only`

3. Expression (Edit Expression):
   ```
   (ip.geoip.country ne "JP")
   ```

4. Action: `Block` with custom response code `451` (Unavailable For Legal Reasons) and the body:
   ```
   KINGMAKER 23:23 is currently only available within Japan.
   
   The platform is operating in compliance with Japanese law (Criminal Code §187,
   Payment Services Act, Financial Instruments and Exchange Act, Premiums and
   Representations Act). Operation in other jurisdictions requires per-country
   legal review, which has not yet been completed.
   
   We are not accepting registrations or payments from this region.
   ```

5. Deploy.

## What to test after deploying

```bash
# From a JP IP (should pass)
curl -sI https://king2323.tamjump.com/index.html
# Expect: HTTP/2 200

# From a non-JP IP (use a VPN to e.g. US)
curl -sI https://king2323.tamjump.com/index.html
# Expect: HTTP/2 451
```

## What is NOT enough on its own

- Adding a `lang="ja"` HTML attribute → not a block
- Showing a "JP only" banner → bypassable
- Geo-redirecting on JS → bypassable, runs after page loads

## When to lift

For each jurisdiction you want to open (US, UK, EU member states, etc.):

1. Engage local counsel (gambling law + consumer protection + payment regulation).
2. Update Terms of Service for that country.
3. Confirm Square's local merchant agreement permits this category of charge.
4. Add that country code to the rule expression:
   ```
   (ip.geoip.country ne "JP" and ip.geoip.country ne "TW")
   ```
5. Document the legal basis in this file before deploying.

## Note on Bond / Mission-Bond model (planned)

When the architecture transitions from the current Bell/Coin model to the Mission-Bond + voting model:
- Bond purchases must still be geofenced to Japan until other markets are cleared.
- Voting/proposing can technically open more broadly, but only if anonymous/passive
  participation doesn't constitute "facilitating" a regulated activity in the visitor's
  country. Counsel review required before any cross-border voting access.
