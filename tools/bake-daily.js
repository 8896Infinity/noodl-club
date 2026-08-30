#!/usr/bin/env node
/* bake-daily.js — the nightly snapshot behind 日报 and 持仓看板.
 *
 * Both pages are honest about their cost: a first-time visitor to the holder
 * board fires ~330 requests (one per holder, for the holding clock) and waits
 * a long time watching a progress bar. This script does that work once a night
 * so the pages can open instantly, with a button to go live on demand.
 *
 * THE DESIGN RULE, and the reason this file is short: it stores RAW API
 * responses keyed by the exact path string the pages ask for. The pages then
 * answer from the snapshot inside their own api() and compute exactly as they
 * always have. No arithmetic is reimplemented here, so a baked figure can
 * never disagree with the same figure after a live refresh.
 *
 * The one exception is `tenure`, and it is deliberate: baking it raw would
 * mean shipping ~300 activity pages (12 MB) instead of 39 KB of conclusions.
 * Its derivation is copied from loadTenure() in holders.html and the two must
 * be kept in step — see CLAUDE.md.
 *
 *   node tools/bake-daily.js [out.json]      default: data/snapshot.json
 */
const fs=require('fs');
const path=require('path');
const zlib=require('zlib');

const TOKEN='hjrg';
/* api.odin.fun answers 403 to every non-browser client now, whatever the User-Agent.
   The site's own proxy is the only way in: Vercel's edge re-issues the request, so
   Cloudflare sees Vercel rather than us. A browser-ish UA is still required. */
/* An escape hatch: if Vercel's automatic DDoS mitigation ever starts challenging
   the CI runner, point this at another way in without editing the file.
   BAKE_BASE=https://api.odin.fun/v2 works from anything Cloudflare trusts. */
const BASE=process.env.BAKE_BASE||'https://noodl.club/api/odin';
const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const OUT=process.argv[2]||path.join(__dirname,'..','data','snapshot.json');

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let calls=0,failed=0;

async function get(p){
  calls++;
  for(let k=0;k<4;k++){
    try{
      const r=await fetch(BASE+p,{headers:{'User-Agent':UA,accept:'application/json'}});
      if(r.ok)return await r.json();
      /* 5xx and the odd Cloudflare hiccup are worth another go; a 404 is an answer */
      if(r.status===404)return null;
    }catch(e){}
    await sleep(500*(k+1));
  }
  failed++;
  return null;
}

/* the snapshot is a map from the exact path a page requests to the answer */
const api={};
async function bake(p){
  const j=await get(p);
  if(j!==null)api[p]=j;
  return j;
}
/* walk a `count`-paginated endpoint the same way the pages do */
async function bakePages(make,per,cap){
  let have=0,count=Infinity;
  for(let pg=1;pg<=cap;pg++){
    const j=await bake(make(pg));
    if(!j)break;
    const d=j.data||[];
    have+=d.length;
    count=j.count!=null?j.count:count;
    if(!d.length||have>=count)break;
  }
  return have;
}

(async()=>{
  const t0=Date.now();
  const say=m=>console.log(m);
  say('baking from '+BASE);

  /* ---- what both pages open with ---- */
  await Promise.all([
    bake('/settings'),
    bake('/token/'+TOKEN),
    bake('/currency/btc'),
    bake('/statistics/dashboard'),
    bake('/token/'+TOKEN+'/owners?limit=1000'),
    bake('/token/'+TOKEN+'/liquidity?limit=1000')
  ]);
  const owners=((api['/token/'+TOKEN+'/owners?limit=1000']||{}).data)||[];
  const lps=((api['/token/'+TOKEN+'/liquidity?limit=1000']||{}).data)||[];
  say('  owners '+owners.length+'  liquidity providers '+lps.length);

  /* ---- every token: the 24h launch count and the platform fee take ---- */
  const nTok=await bakePages(pg=>'/tokens?limit=100&page='+pg,100,60);
  say('  tokens '+nTok);

  /* ---- the whole trade feed: charts, pool history, holder delta ---- */
  const nTr=await bakePages(pg=>'/token/'+TOKEN+'/trades?limit=1000&page='+pg,1000,8);
  say('  trades '+nTr);

  /* ---- platform money in and out, for the daily report's 24h flow ---- */
  for(const action of ['deposit','withdraw']){
    for(let p=1;p<=5;p++){
      const j=await bake('/activities?limit=100&page='+p+'&action='+action);
      if(!j||!(j.data||[]).length||(j.data||[]).length<100)break;
    }
  }

  /* ---- the LP ledger: mint/burn per provider, for pool earnings ---- */
  let lpReq=0;
  for(const o of lps){
    let have=0,count=Infinity;
    for(let pg=1;pg<=20;pg++){
      const j=await bake('/user/'+o.user+'/activity?token=lp_'+TOKEN+'&limit=100&page='+pg);
      lpReq++;
      if(!j)break;
      const d=j.data||[];have+=d.length;count=j.count!=null?j.count:count;
      if(!d.length||have>=count)break;
    }
  }
  say('  lp ledger requests '+lpReq);

  /* ---- the holding clock. This is the slow one: one walk per holder.
         Baked as conclusions, not as ~300 raw pages — see the header note.
         Derivation copied from loadTenure() in holders.html. ---- */
  const tenure={},xfers=[];
  const users=owners.map(o=>o.user);
  for(let i=0;i<users.length;i+=12){
    await Promise.all(users.slice(i,i+12).map(async u=>{
      try{
        const first=await get('/user/'+u+'/activity?token='+TOKEN+'&limit=100&page=1');
        if(!first){tenure[u]=null;return;}
        let all=first.data||[];
        const pages=Math.ceil((first.count||0)/100);
        for(let pg=2;pg<=pages;pg++){
          const nx=await get('/user/'+u+'/activity?token='+TOKEN+'&limit=100&page='+pg);
          all=all.concat((nx&&nx.data)||[]);
        }
        const acq=[],sells=[];
        all.forEach(a=>{
          const t=Date.parse(a.time);
          if(a.action==='BUY'||a.action==='RECEIVE')acq.push(t);
          else if(a.action==='SELL')sells.push(t);
          if(a.action==='RECEIVE')xfers.push({t:t,u:u,d:Number(a.amount_token)});
          else if(a.action==='SEND')xfers.push({t:t,u:u,d:-Number(a.amount_token)});
        });
        const firstAcq=acq.length?Math.min.apply(null,acq):null;
        const lastSell=sells.length?Math.max.apply(null,sells):null;
        tenure[u]={since:lastSell?Math.max(firstAcq||0,lastSell):firstAcq,firstAcq,lastSell};
      }catch(e){tenure[u]=null;}
    }));
    if(i%120===0)process.stdout.write('  tenure '+Math.min(i+12,users.length)+'/'+users.length+'\r');
  }
  say('  tenure '+Object.keys(tenure).length+' holders, '+xfers.length+' transfers   ');

  /* A partly-fetched snapshot is worse than yesterday's whole one: it would
     quietly show wrong totals. Refuse rather than publish a hole. */
  const known=Object.keys(tenure).filter(u=>tenure[u]).length;
  const bad=[];
  if(!api['/token/'+TOKEN])bad.push('token');
  if(!owners.length)bad.push('owners');
  if(nTr<500)bad.push('trades ('+nTr+')');
  if(users.length&&known/users.length<0.9)bad.push('tenure '+known+'/'+users.length);
  if(failed>calls*0.05)bad.push('too many failed calls '+failed+'/'+calls);
  if(bad.length){
    console.error('\nREFUSING to write an incomplete snapshot: '+bad.join(', '));
    process.exit(1);
  }

  const snap={
    v:1,
    at:Date.now(),
    atISO:new Date().toISOString(),
    source:BASE,
    counts:{owners:owners.length,lps:lps.length,tokens:nTok,trades:nTr,
            tenure:Object.keys(tenure).length,xfers:xfers.length,calls,failed},
    api,
    tenure:{ts:Date.now(),data:tenure,xfers}
  };
  const text=JSON.stringify(snap);
  fs.mkdirSync(path.dirname(OUT),{recursive:true});
  /* write beside the real file and rename: a crash mid-write must not leave a
     truncated snapshot where yesterday's whole one used to be */
  const tmp=OUT+'.new';
  fs.writeFileSync(tmp,text);
  JSON.parse(fs.readFileSync(tmp,'utf8'));      /* it must parse back */
  fs.renameSync(tmp,OUT);
  say('\nwrote '+OUT);
  say('  paths '+Object.keys(api).length+'  raw '+(text.length/1048576).toFixed(2)+' MB'
     +'  gzip '+(zlib.gzipSync(text,{level:9}).length/1024).toFixed(0)+' KB'
     +'  brotli '+(zlib.brotliCompressSync(Buffer.from(text)).length/1024).toFixed(0)+' KB');
  say('  '+calls+' api calls, '+failed+' failed, '+((Date.now()-t0)/1000).toFixed(0)+'s');
})().catch(e=>{console.error(e);process.exit(1);});
