/* ============================================================================
 * #NOODL post feed — curated.
 *
 * WHY CURATED, NOT AUTO-PULLED:
 *   1. X has no free public API for hashtag search; the paid API needs a secret
 *      key, which cannot live in a static site without leaking it.
 *   2. The #NOODL hashtag is not ours alone — X's own "top" results for #NOODL
 *      are mostly 2019-2020 Japanese posts about "Noodl", an unrelated visual
 *      programming tool. Auto-pulling would put those on the front page.
 *
 * TO ADD A POST: copy a block below, fill it in from the post on X, save, and
 * push. Ordering is computed from `likes`/`retweets`/`replies` — see heat()
 * in tweets-ui.js; nothing here needs to be kept in order by hand.
 * `date` is the post's own timestamp, ISO-8601 UTC.
 * ========================================================================== */
window.NOODL_TWEETS = [
  {
    id: '2077064246001795285',
    url: 'https://x.com/SuZhe_eth/status/2077064246001795285',
    name: 'SuZhe',
    handle: 'SuZhe_eth',
    date: '2026-07-15T00:14:00Z',
    text: '录了个 ODIN·FUN V2 新版的操作视频（以欧意 web3 手机钱包为例）@okx\n\n点此直通平台首发代币 NOODL：\nodin.fun/token/hjrg\n\n#NOODL',
    likes: 11,
    retweets: 4,
    replies: 1
  },
  {
    id: '2076874066179584492',
    url: 'https://x.com/TycheTDOG/status/2076874066179584492',
    name: 'U.mi',
    handle: 'TycheTDOG',
    date: '2026-07-14T03:38:58Z',
    text: '今天看了看奥丁平台，odin.fun，目前也就 first 概念可以玩一下，但是目前大家还是怀疑资金安全问题，这个希望能尽快解决，可以先小资金几百几千刀布局一下这个代币，#NOODL，后面解决了安全问题在考虑进大资金，至于奥丁狗还是先观望一下',
    likes: 4,
    retweets: 2,
    replies: 5
  },
  {
    id: '2076343852785697108',
    url: 'https://x.com/jincong/status/2076343852785697108',
    name: '金聪',
    handle: 'jincong',
    date: '2026-07-12T16:32:05Z',
    text: '现在加入 ODIN·FUN V2 版本，以闪电速度交易符文资产。\nodin.fun\n\n新平台第一个部署的代币是 Noodle Nova $NOODL\n\nHey @BobBodily is it the first token on ODIN·FUN?\n\n#NOODL',
    likes: 3,
    retweets: 0,
    replies: 1
  }
];
