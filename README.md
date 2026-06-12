# Grüp Landing — grup.co.za

Static marketing site for Grüp. Deliberately separate from the app (`grup-app`):
no framework, no build step, no shared deploys. The app and the landing page only
meet at links (`Get started` → app sign-up).

## Why a separate repo, static site

- **Independent deploys.** Marketing copy changes shouldn't ride app release cycles,
  and an app rollback shouldn't take the public site with it.
- **Zero dependencies.** Plain HTML/CSS/JS — nothing to patch, nothing to break,
  loads fast, trivially auditable (useful while payment-provider compliance reviews
  the site).
- **Future business sign-up** can start here as a link into the app with a plan
  parameter (`https://app-domain/sign-up?plan=business`) so business users land in
  the app pre-flagged. If the landing page ever needs real forms/backend, that's the
  moment to revisit the stack — not before.

## Structure

```
index.html      — the landing page
terms.html      — Terms of Service
privacy.html    — Privacy Policy (POPIA-aligned)
styles.css      — design tokens mirror the app's globals.css
script.js       — scroll reveals + demo-card animation (vanilla, ~60 lines)
assets/
  grup-intro.svg  — 3s SMIL write-on animation (hero; final frame freezes)
  grup-logo.svg   — static final frame (nav, footer, favicon, reduced-motion)
```

## Deploy (Vercel)

1. Create repo `grup-za/grup-landing`, push these files to `main`.
2. Vercel → New Project → import the repo. Framework preset: **Other**.
   No build command, output directory: root. Deploy.
3. Project → Settings → Domains: add `grup.co.za` and `www.grup.co.za`
   (set www to redirect to the apex). Add the DNS records Vercel specifies
   at the registrar (A record for apex, CNAME for www).
4. Done — pushes to `main` auto-deploy.

(Cloudflare Pages / Netlify work identically if preferred.)

## Before sending to compliance reviewers

- [ ] Create the `hello@grup.co.za` mailbox (or change the address in all three
      HTML files — it appears in the footer, business CTA, terms, and privacy).
- [ ] Update the two `https://dev.grup.co.za/...` links in `index.html`
      (nav "Sign in", hero "Get started") to the production app URL when it exists.
- [ ] Add `assets/og-home.png` (1200×630 social preview) — referenced in the
      `og:image` meta tag; a simple export of the logo on cream is enough.

## Editing notes

- All colours/type are CSS variables at the top of `styles.css` — they mirror the
  app (`--cream #F5E6C8`, `--jungle #0D4A2A`, Playfair Display / Montserrat /
  JetBrains Mono for amounts).
- `prefers-reduced-motion` is respected everywhere: reveals render instantly and
  the demo card shows its completed state.
- The demo card animation plays once when ~45% visible; amounts use the mono face
  with non-breaking thin spacing (R1 250) to match the app's money styling.
