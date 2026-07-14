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

## Stack

- Single static `index.html` — no build step, no framework
- Live data: `https://api.odin.fun/v2/token/hjrg` (marketcap in millisats ÷ 1e11 = BTC) + `/v2/currency/btc` for USD
- `vercel.json` provides a same-origin `/api/odin/*` proxy fallback in case CORS ever closes
- EN / 中文 bilingual, `prefers-reduced-motion` friendly

## Deploy

Static site on Vercel — no configuration needed. Domain: **NOODL.club**

## Links

- Token: https://odin.fun/token/hjrg
- Community: https://odin.fun/c/7ij3h-flwdx-jncgk-765tf-qyu7w-cr77f-wjvqt-bvapu-tgx56-aydty-bqe
- Noodle Nova (London): https://deliveroo.co.uk/menu/london/temple/noodle-nova

*NOODL is a community meme token. Nothing here is financial advice — just noodles.* 🍜
