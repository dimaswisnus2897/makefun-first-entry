# makefun-first-entry

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/dimaswisnus2897/makefun-first-entry/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/dimaswisnus2897/makefun-first-entry/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Hartono Household Budget — a working household budget site that runs offline in a browser on a desktop and on a phone. Dashboard, transactions, budgets, savings goals, bills and reports, with real figures for November 2026 and every control doing what it says.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

Entered on [make.fun](https://make.fun/?ref=scrx0f78&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards

## What this is

An entry for make.fun's **“Make the best household budget site”** bounty
($50 in USDC, 10 places paid $5 each, ends Sun 29 Nov 2026 21:57 WIB).
The site is plain static files under `app/` — no build step, no network
requests, no external fonts or libraries. It works offline from its own files.

Features (all working, data saved in the browser's localStorage):

- **Dashboard** — income $4,850.00, expenses $2,705.93, balance $2,144.07 and a
  44.2% savings rate for November 2026, plus budget, goal, bill and recent-transaction previews.
- **Transactions** — 19 real transactions (salary, rent, groceries, utilities,
  transport, dining, entertainment, health). Add, edit and delete them, filter
  by category and type, search by text.
- **Budgets** — monthly limits for 7 categories with progress bars and remaining
  amounts; every budget can be edited.
- **Savings Goals** — Emergency Fund ($3,850 of $5,000), Bali Family Vacation
  ($1,120 of $1,800) and New Laptop ($640 of $1,200); add funds in one tap or
  start a new goal.
- **Bills** — 7 recurring bills with due dates and paid/upcoming status; mark
  bills paid or add new ones.
- **Reports** — spending by category as a donut chart and income vs expenses
  for June–November 2026 as a bar chart (both drawn as inline SVG, no libraries).

## Preview it

```sh
node serve.ts
# open http://localhost:8080 — also try it at a phone size
```

Requires Node.js 22.18 or later (this machine used Node v24.22.1).

## Upload to GitHub (dimaswisnus2897)

The existing repository `https-github.com-new` should first be renamed to
`makefun-first-entry` (GitHub → repository → Settings → Repository name).
Then, from this folder:

```sh
git init
git add .
git commit -m "Hartono Household Budget — Make.fun entry"
git branch -M main
git remote add origin https://github.com/dimaswisnus2897/makefun-first-entry.git
git push -u origin main
```

Then set the repository About (GitHub → ⚙️ next to About):

- Description: `Hartono Household Budget — a working offline household budget site. Built by an AI agent for make.fun's “Make the best household budget site” bounty, $50 in USDC.`
- Website: `https://make.fun/bounty/best-household-budget-site-20261126-1457`
- Topics: `makefun`, `ai-agents`, `bounties`, `code`

## Submit to Make.fun

From the unpacked competition kit (see `transcripts/BUILD-NOTES.md`):

```sh
node cli/makefun.mjs check --kit . --repo <your repository> --transcripts transcripts.tar.gz
node cli/makefun.mjs submit --competition best-household-budget-site-20261126-1457 --repo-url https://github.com/dimaswisnus2897/makefun-first-entry --commit <sha> --bundle transcripts.tar.gz --keypair <your keypair>
```

Submit before Sun 29 Nov 2026 14:57 UTC (21:57 WIB). At most 10 submissions
a day and 20 in total; the last submission before the deadline is the final entry.

## What is NOT verified yet

- **Referral code:** the footer above still says `YOUR-REFERRAL-CODE`. Replace
  it with the real code from `node cli/makefun.mjs referrals` (run inside the
  unpacked kit, signed in as Dimas) before submitting.
- **Kit `check` / submit:** not run here — they need the GitHub repository to
  exist and a signed-in kit CLI with Dimas's keypair. The package has not been
  pushed to GitHub or submitted to Make.fun.
- **Transcripts:** this repo carries `transcripts/BUILD-NOTES.md`, a build
  summary written by the building agent. A real submission needs the transcript
  bundle the kit's CLI makes (`node cli/makefun.mjs bundle`); see
  `transcripts/BUILD-NOTES.md` for what that requires.
- **Vendor file:** `vendor/makefun-frontend.ts` is the kit's copy, unchanged
  (sha256 `4c8da1c8e76490b3a847670f49137d3ec23953e3c988fe6a6cb320fce5739240`,
  matching the kit's `kit.json`). `serve.ts` is the kit starter's dev server,
  unchanged.
