# NOODL.club — Noodle Nova 🍜

Community site for **NOODL (Noodle Nova)**, the first token launched on [ODIN•FUN](https://odin.fun/token/hjrg).

A living "noodle galaxy": the golden noodle spiral is the project roadmap, slowly rotating like a solar system.

## The five planets

| Planet | Idea |
|---|---|
| 🥇 First is First | The first token ever launched on Odin.Fun |
| 🍥 New Odin HODL | N·O·O·D·L — a meme with cultural identity |
| 🤝 One Bowl, One Consensus | On-chain & off-chain players, one community on Odin.Fun |
| ♻️ Buyback & Listing Engine | Odin.Fun internal community buyback + listing fees |
| 🍜 1 NOODL = 1 NOODLE (center) | One token = one bowl of ramen at Noodle Nova, London (~£15) |

## The road to Nova

The spiral lights up as market cap grows (log scale), live from the Odin.Fun API:

`0.211 BTC (launch) → 5 → 50 → 500 → 5000 BTC (NOVA)`

Reached milestones glow; unreached ones stay grey.

## Pages

| Page | What it does |
|---|---|
| `index.html` | The noodle galaxy, the story, and a comparison of what every Bitcoin-ecosystem "first" reached at its peak |
| `holders.html` | Live holder board — every holder's share, cost basis and unrealised P&L, the liquidity pool and its fee yield, NOODLER / CHEF titles, and price / volume / holder / pool charts |
| `daily.html` | A daily report drawn on a single canvas, bilingual on one sheet, saveable as an image or copied straight to the clipboard for sharing |
| `tweets.html` | Every #NOODL post collected so far, sorted by heat or by date |

## Stack

- Static HTML — no build step, no framework
- Live data: `https://api.odin.fun/v2/token/hjrg` (amounts in millisats ÷ 1e11 = BTC) + `/v2/currency/btc` for USD.
  Fee rates are read from `/v2/settings` rather than hardcoded
- `vercel.json` provides a same-origin `/api/odin/*` proxy fallback in case CORS ever closes
- EN / 中文 bilingual throughout, `prefers-reduced-motion` friendly

## Deploy

Static site on Vercel — no configuration needed. Domain: **NOODL.club**

## Links

- Token: https://odin.fun/token/hjrg
- Community: https://odin.fun/c/7ij3h-flwdx-jncgk-765tf-qyu7w-cr77f-wjvqt-bvapu-tgx56-aydty-bqe
- Noodle Nova (London): https://deliveroo.co.uk/menu/london/temple/noodle-nova

*NOODL is a community meme token. Nothing here is financial advice — just noodles.* 🍜
