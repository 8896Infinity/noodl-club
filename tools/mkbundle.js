#!/usr/bin/env node
/* mkbundle.js — one payload for a multi-file commit.
 *
 * mk2.js and mkfull.js each produce their own stream of pieces, so a four-file
 * change means four hand-transcribed streams. This packs them into ONE gzipped
 * JSON: patched files carry mk2's {find,replace} ops against the live copy,
 * new files carry their whole text. Each entry keeps its own SHA-256 so the
 * page can refuse any file that did not rebuild byte-for-byte.
 *
 *   node tools/mkbundle.js <tag> patch:<live>:<local>:<repoPath> full:<local>:<repoPath> ...
 *
 * Pieces are 650 chars — see CLAUDE.md on why 2600 is too long to hand-copy.
 */
const fs=require('fs'),zlib=require('zlib'),path=require('path'),crypto=require('crypto');
const NL=String.fromCharCode(10);
const S=__dirname;
const TAG=process.argv[2];
const sha=t=>crypto.createHash('sha256').update(Buffer.from(t,'utf8')).digest('hex');

/* mk2's differ, verbatim in behaviour: LCS by line, each hunk grown until its
   `find` occurs exactly once in the old file, then a dry run must reproduce
   the new file byte-for-byte before anything ships. */
function ops(OLD,NEW){
  const a=OLD.split(NL),b=NEW.split(NL);
  let p=0;while(p<a.length&&p<b.length&&a[p]===b[p])p++;
  let q=0;while(q<a.length-p&&q<b.length-p&&a[a.length-1-q]===b[b.length-1-q])q++;
  const A=a.slice(p,a.length-q),B=b.slice(p,b.length-q);
  const m=A.length,n=B.length;
  const L=Array.from({length:m+1},()=>new Uint32Array(n+1));
  for(let i=m-1;i>=0;i--)for(let j=n-1;j>=0;j--)L[i][j]=A[i]===B[j]?L[i+1][j+1]+1:Math.max(L[i+1][j],L[i][j+1]);
  const hunks=[];let i=0,j=0,cur=null;
  const flush=()=>{if(cur){hunks.push(cur);cur=null}};
  while(i<m&&j<n){ if(A[i]===B[j]){flush();i++;j++;} else { if(!cur)cur={start:p+i,del:0,ins:[]};
    if(L[i+1][j]>=L[i][j+1]){cur.del++;i++;}else{cur.ins.push(B[j]);j++;} } }
  if(i<m||j<n){if(!cur)cur={start:p+i,del:0,ins:[]};cur.del+=m-i;while(j<n)cur.ins.push(B[j++]);}
  flush();
  const merged=[];
  for(const h of hunks){const last=merged[merged.length-1];
    if(last&&h.start-(last.start+last.del)<6){const gap=a.slice(last.start+last.del,h.start);
      last.ins=last.ins.concat(gap,h.ins);last.del=(h.start+h.del)-last.start;}
    else merged.push({start:h.start,del:h.del,ins:h.ins});}
  const out=merged.map((h,k)=>{let c=2;for(;;){
    const st=Math.max(0,h.start-c),e=Math.min(a.length,h.start+h.del+c);
    const find=a.slice(st,e).join(NL);
    if(find&&OLD.split(find).length===2)
      return {find,replace:a.slice(st,h.start).concat(h.ins,a.slice(h.start+h.del,e)).join(NL)};
    c+=2;if(c>400)throw new Error('hunk '+k+' never unique');}});
  let t=OLD;out.forEach((o,k)=>{const c=t.split(o.find).length-1;
    if(c!==1)throw new Error('op '+k+' matches '+c);t=t.replace(o.find,()=>o.replace);});
  if(t!==NEW)throw new Error('dry run MISMATCH');
  return out;
}

const files=[];
for(const arg of process.argv.slice(3)){
  const bits=arg.split(':');
  if(bits[0]==='patch'){
    const [,live,local,repo]=bits;
    const OLD=fs.readFileSync(live,'utf8'), NEW=fs.readFileSync(local,'utf8');
    files.push({path:repo,kind:'patch',ops:ops(OLD,NEW),sha:sha(NEW),bytes:Buffer.byteLength(NEW,'utf8')});
    console.log('  patch '+repo+'  ops='+files[files.length-1].ops.length+'  sha='+files[files.length-1].sha.slice(0,12));
  }else if(bits[0]==='full'){
    const [,local,repo]=bits;
    const NEW=fs.readFileSync(local,'utf8');
    files.push({path:repo,kind:'full',text:NEW,sha:sha(NEW),bytes:Buffer.byteLength(NEW,'utf8')});
    console.log('  full  '+repo+'  '+files[files.length-1].bytes+' B  sha='+files[files.length-1].sha.slice(0,12));
  }else throw new Error('bad arg '+arg);
}

const b64=zlib.gzipSync(Buffer.from(JSON.stringify({v:1,files}),'utf8'),{level:9}).toString('base64');
const N=650,cnt=Math.ceil(b64.length/N);
const dj=x=>{let h=5381;for(let i=0;i<x.length;i++)h=(Math.imul(h,33)^x.charCodeAt(i))>>>0;return h.toString(16)};
for(let k=0;k<cnt;k++)fs.writeFileSync(path.join(S,TAG+k+'.txt'),b64.slice(k*N,(k+1)*N));
console.log('\n'+TAG+'  files='+files.length+'  b64='+b64.length+'  pieces='+cnt);
console.log(Array.from({length:cnt},(_,k)=>k+':'+dj(b64.slice(k*N,(k+1)*N))).join(' '));
