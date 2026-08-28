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

The row of tabs under the header is the whole navigation:
**Home → Holder board → NOODL Revelation → Defi → Community.**

| Page | What it does |
|---|---|
| `index.html` | **Home.** The noodle galaxy on top, and under it the daily report — drawn on a single canvas, bilingual on one sheet, saveable as an image or copied straight to the clipboard. A golden vortex in the corner warps you into the 3D universe |
| `holders.html` | **Holder board.** Every holder's share, cost basis and unrealised P&L, the liquidity pool and its fee yield, NOODLER / CHEF titles, and price / volume / holder / pool charts |
| `revelation.html` | **The NOODL Revelation.** The long read, in five parts: what NOODL is, the culture in a bowl of noodles, First is First (including what every Bitcoin-ecosystem "first" reached at its peak), the community, and the road to Nova |
| `defi.html` | **Defi.** Four chapters behind one door: the road here, read the battle, the NOODL universe, and the recruiting desk |
| `universe.html` | **NOODL Universe.** One bowl of noodles is one galaxy. Every odin.fun address ever made floats in it — 408,461 V1 addresses as grey rock worlds, everyone still holding on V2 as blue ocean worlds, NOODL holders as burning suns, pool chefs spinning. Click any world, even a mote of dust, and its dossier opens: holdings, settled P&L, V1 assets, BTC mainnet address, and the money trails linking it to other stars |
| `road.html` | **The road here.** 98 seconds from launch to today, price rising against a wall of people calling it dead, over an ECG of the market |
| `battle.html` | **Battlefield.** Every trade on odin.fun drawn as an interstellar battle across five theatres of the Silk Road: buys advance in green, sells push back in red, liquidity pools are the barracks, and the front line is the live price |
| `demo.html` | **Join the battle (demo).** A top-down shooter — drop in, clear the field. Soldiers are named after real recent traders |
| `community.html` | **Community.** Four doors — Odin community, X, Telegram, QQ — each with a QR code baked into the page |
| `tweets.html` | Every #NOODL post collected so far, sorted by heat or by date |
| `daily.html` | Redirects to the report's new home on the front page, so links shared before the move still land |

## Stack

- Static HTML — no build step, no framework
- Live data: `https://api.odin.fun/v2/token/hjrg` (amounts in millisats ÷ 1e11 = BTC) + `/v2/currency/btc` for USD.
  Fee rates are read from `/v2/settings` rather than hardcoded
- The universe is one WebGL point cloud — the bowl, the soup, the dust and every
  address share a single interleaved buffer; worlds get their stone, ocean and fire
  procedurally in the fragment shader as you zoom in
- `vercel.json` provides a same-origin `/api/odin/*` proxy fallback in case CORS ever closes
- EN / 中文 bilingual throughout, `prefers-reduced-motion` friendly

## Deploy

Static site on Vercel — no configuration needed. Domain: **NOODL.club**

## Links

- Token: https://odin.fun/token/hjrg
- Community: https://odin.fun/c/7ij3h-flwdx-jncgk-765tf-qyu7w-cr77f-wjvqt-bvapu-tgx56-aydty-bqe
- Noodle Nova (London): https://deliveroo.co.uk/menu/london/temple/noodle-nova

*NOODL is a community meme token. Nothing here is financial advice — just noodles.* 🍜
