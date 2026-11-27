# Build notes — Hartono Household Budget (Make.fun entry)

This file is a build summary written by the agent that built this entry. It is
NOT a transcript bundle and must not be passed off as one. A real submission
needs the transcript bundle the kit's CLI makes
(`node cli/makefun.mjs bundle`, run from inside the unpacked kit) from the
recorded sessions that built the entry — the top-level agent's session and
every subagent session it started. This subagent's own session log lives on
the machine that ran it; the parent agent must bundle it (see the skill's
step 4) before submitting. Note the competition's `handed_over_places` is
`none`: an entry whose sessions are handed over by hand is ranked but takes
no paid place.

## What was built, and when

- Built: Fri 2026-11-27 (WIB), in one session, for Dimas Wisnu Saputra
  (GitHub: dimaswisnus2897, Make.fun account linked to that GitHub login,
  Phantom wallet linked).
- Bounty: “Make the best household budget site”
  (best-household-budget-site-20261126-1457), $50 total, 10 places × $5,
  ends Sun 2026-11-29 14:57 UTC (21:57 WIB).
- Builder: a Muse Spark subagent (model ipnext/avocado-5.17-v2 family,
  harness: Muse app), running on this VM with Node v24.22.1.
- Kit: downloaded from https://make.fun/c/best-household-budget-site-20261126-1457/kit
  (16,343,902 bytes), skill.md version 1.5.307, harness
  `harness@2ded2f9e2884385a700132f1b7010c4c9070dd35930161ccf86b4bb1e96df813`.

## Files the agent wrote in this session

- `app/index.html` — page shell, navigation (Dashboard / Transactions /
  Budgets / Savings Goals / Bills / Reports, hash routes).
- `app/styles.css` — original design, system fonts only, responsive.
- `app/data.js` — seed data for November 2026 (19 transactions, 7 budgets,
  3 savings goals, 7 bills, Jun–Nov monthly trend). Every figure on the site
  is computed from these lists.
- `app/app.js` — routing, rendering, all interactions (add/edit/delete
  transactions, filters, search, budget editing, adding funds to goals, new
  goals, marking bills paid, adding bills), inline-SVG donut and bar charts,
  localStorage persistence.
- `main.ts` — entrypoint written in this session following the kit starter's
  pattern: copies `app/` and `screenshots/` to the output directory and
  writes `dossier.json` with `buildDossier` from the vendored library.
- `shots.json` — the 4 screenshots and the views/viewports they were taken of.
- `LICENSE` — MIT, Copyright (c) 2026 Dimas Wisnu Saputra.
- `README.md` — follows the competition's `readme_template`; the referral
  code is still a placeholder (see README).

## Files taken from the kit, unchanged

- `vendor/makefun-frontend.ts` — kit copy, sha256
  `4c8da1c8e76490b3a847670f49137d3ec23953e3c988fe6a6cb320fce5739240`,
  identical to the kit's `kit.json` entry.
- `serve.ts` — kit starter's static dev server, unchanged
  (sha256 `7b91854fe3390992f2cb85fd158e1f3bad9a298ab2b51adc1ff54d715420fb1a`).

Nothing was copied from any other entry, site, or public solution. The starter
site (a recipe collection) was read only to learn the required layout; none of
its content, text, or images is in this entry.

## Verification performed in this session

- Node: `node --version` → v24.22.1 (satisfies the Node.js 22.18+ requirement;
  the grader runs Node 22.23.4).
- `main.ts` run locally with `MAKEFUN_OUTPUT_DIR=out` — exits 0 and writes
  `out/dossier.json`, `out/app/`, `out/screenshots/`; run twice, the dossier
  is byte-identical (deterministic).
- Screenshots: real renders of this site in headless Chromium (Playwright),
  desktop 1280×800 and phone 390×844, each under 256 KiB.
- No external references: every `src`/`href` in `app/` is a relative local
  path; no CDN, no web fonts, no `http(s)://` URLs in the app's source
  (checked by grep; the only URLs in the repo are the make.fun badge links
  in this README, which are not part of the site).
- App size: 4 files, well under the 993-file / 16 MiB caps; `index.html`
  under 1 MiB.

## Not verified / not done here

- The kit's `check` and `submit` commands were not run (they need the GitHub
  repository to exist and a signed-in kit CLI with Dimas's keypair).
- The package has not been pushed to GitHub and has not been submitted to
  Make.fun.
- The referral code in the README footer is a placeholder.
- The transcript bundle for submission must be made by the parent agent from
  its recorded sessions (see the note at the top).
