/* Shared #NOODL post helpers — used by index.html (chopsticks dropdown)
 * and tweets.html (full list). Depends on tweets.js having run first. */
(function (root) {
  'use strict';

  var T = {};

  // Engagement weighting: a repost carries someone's whole audience, so it
  // counts double; replies count once as a proxy for conversation.
  T.heat = function (t) {
    return (+t.likes || 0) + 2 * (+t.retweets || 0) + (+t.replies || 0);
  };

  // A post with a malformed date must not poison the comparator: NaN makes
  // every comparison false and leaves the whole sort in an arbitrary order.
  T.time = function (t) {
    var v = Date.parse(t && t.date);
    return isNaN(v) ? 0 : v;
  };

  T.byHeat = function (list) {
    return list.slice().sort(function (a, b) {
      return T.heat(b) - T.heat(a) || T.time(b) - T.time(a);
    });
  };

  T.byTime = function (list) {
    return list.slice().sort(function (a, b) {
      return T.time(b) - T.time(a) || T.heat(b) - T.heat(a);
    });
  };

  T.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  // Tokenise the RAW text, then escape each piece as it is emitted. Decorating
  // an already-escaped string instead would let the regexes match their own
  // escape output (&#39; contains "#39") and chew up injected markup.
  var TOKEN = /(#[A-Za-z0-9_]+)|(@[A-Za-z0-9_]+)|((?:https?:\/\/)?[a-z0-9-]+\.(?:fun|com|club|io|xyz|org|net|co\.uk)(?:\/[^\s<]*)?)/gi;

  T.rich = function (text) {
    var s = String(text == null ? '' : text), out = '', last = 0, m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(s)) !== null) {
      out += T.esc(s.slice(last, m.index));
      var cls = m[3] ? 'fd-link' : 'fd-tag';
      out += '<span class="' + cls + '">' + T.esc(m[0]) + '</span>';
      last = m.index + m[0].length;
    }
    return out + T.esc(s.slice(last));
  };

  T.initial = function (name) {
    return (String(name || '?').trim()[0] || '?').toUpperCase();
  };

  T.fmtDate = function (iso, lang) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' });
  };

  T.fmtNum = function (n) {
    n = +n || 0;
    return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : String(n);
  };

  T.list = function () {
    return Array.isArray(root.NOODL_TWEETS) ? root.NOODL_TWEETS : [];
  };

  T.SEARCH_URL = 'https://x.com/search?q=%23NOODL&f=live';

  root.NoodlTweets = T;
})(window);
