import { useState, useEffect, useRef, useCallback } from "react";

const GFONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');`;
const FAVICON_B64 = "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";
const OWNER_SECRET = "shubham";
const OWNER_LS_KEY = "sw-owner-v2";
const THEME_KEY    = "sw-theme-v1";

const checkUrlOwner = () => {
  const p = new URLSearchParams(window.location.search);
  const s = p.get("s");
  if (s === OWNER_SECRET) { localStorage.setItem(OWNER_LS_KEY,"true"); window.history.replaceState({},"",window.location.pathname); return true; }
  if (s === "lock") { localStorage.removeItem(OWNER_LS_KEY); window.history.replaceState({},"",window.location.pathname); return false; }
  return localStorage.getItem(OWNER_LS_KEY) === "true";
};

const CATS = [
  { id:"movies",    label:"Movies",    icon:"🎞️", color:"#E50914" },
  { id:"shows",     label:"TV Shows",  icon:"🖥️", color:"#0071EB" },
  { id:"songs",     label:"Music",     icon:"🎧", color:"#1DB954" },
  { id:"articles",  label:"Articles",  icon:"🗞️", color:"#FF6B00" },
  { id:"videos",    label:"Videos",    icon:"📹", color:"#FF0000" },
  { id:"actors",    label:"Actors",    icon:"🎪", color:"#9B59B6" },
  { id:"actresses", label:"Actresses", icon:"👑", color:"#E91E63" },
  { id:"sports",    label:"Athletes",  icon:"⚡", color:"#00BFA5" },
  { id:"habits",    label:"Habits",    icon:"🧠", color:"#F5C518" },
];
const SHAPE = { movies:"tall",shows:"tall",songs:"sq",articles:"wide",videos:"wide",actors:"tall",actresses:"tall",sports:"tall",habits:"wide" };
const RATINGS = ["★ Liked","★★ Loved","★★★ Obsessed"];

const THEMES = {
  spotify:{ name:"Spotify Dark", bg:"#0d0d0d", card:"#181818", hover:"#242424", line:"#2a2a2a", accent:"#1DB954" },
  amoled: { name:"AMOLED Black", bg:"#000000", card:"#0a0a0a", hover:"#111111", line:"#1a1a1a", accent:"#1DB954" },
  sepia:  { name:"Warm Sepia",   bg:"#1a1208", card:"#241a0e", hover:"#2e2214", line:"#3d2e1a", accent:"#d4a853" },
  cinema: { name:"Cinema Red",   bg:"#0d0608", card:"#180a0c", hover:"#220e10", line:"#2e1216", accent:"#E50914" },
};

const gistRead  = async () => { const r=await fetch("/.netlify/functions/gist"); if(!r.ok) throw new Error("Load failed"); return r.json(); };
const gistWrite = async (d)  => { const r=await fetch("/.netlify/functions/gist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}); if(!r.ok) throw new Error("Save failed"); };

const score = (item,idx) => { const w={"★★★ Obsessed":3,"★★ Loved":2,"★ Liked":1}[item.rating]||0; return w*10+Math.max(0,100-idx*3); };

const aiFill = async (name, catLabel, onStatus) => {
  onStatus?.("✨ Searching…");
  const res = await fetch("/.netlify/functions/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
    model:"claude-3-haiku-20240307", max_tokens:1000,
    system:"Pop-culture expert. Respond ONLY with valid JSON. No markdown.",
    messages:[{role:"user",content:`Details for: "${name}" (category: ${catLabel}). Return ONLY:
{"description":"2-3 engaging sentences","genre":"1-3 words","year":"4-digit or empty","fact":"surprising fact","tagline":"most famous quote under 12 words or empty","imageUrl":"direct image URL .jpg/.png/.webp from Wikipedia/TMDb/official","link":"best URL","trailerUrl":"YouTube embed URL like https://www.youtube.com/embed/VIDEO_ID or empty","soundtrack":"Spotify or YouTube link to main theme/song or empty"}`}]
  })});
  if(!res.ok) throw new Error(`Error ${res.status}`);
  const data=await res.json();
  if(data.error) throw new Error(data.error.message||"API error");
  onStatus?.("⚡ Processing…");
  const raw=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
  const clean=raw.replace(/```[a-z]*\n?/gi,"").replace(/```/g,"").trim();
  const hits=[...clean.matchAll(/\{[\s\S]*?\}/g)].map(m=>m[0]).sort((a,b)=>b.length-a.length);
  for(const c of hits){try{const o=JSON.parse(c);if(o.description||o.genre||o.imageUrl) return o;}catch{}}
  throw new Error("Could not parse response");
};

const aiSuggest = async (allItems) => {
  const summary=CATS.map(cat=>{const its=allItems.filter(({cat:c})=>c.id===cat.id).map(({item})=>item.name).slice(0,5);return its.length?`${cat.label}: ${its.join(", ")}`:null;}).filter(Boolean).join("\n");
  const res=await fetch("/.netlify/functions/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
    model:"claude-3-haiku-20240307",max_tokens:600,
    system:"Taste-aware recommendation engine. Return ONLY valid JSON array.",
    messages:[{role:"user",content:`Based on:\n${summary}\n\nSuggest 6 items NOT already listed. Return ONLY:\n[{"name":"...","category":"movies|shows|songs|articles|videos|actors|actresses|sports|habits","reason":"one sentence why","year":"4-digit or empty"}]`}]
  })});
  if(!res.ok) throw new Error("Failed");
  const data=await res.json();
  const raw=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
  const clean=raw.replace(/```[a-z]*\n?/gi,"").replace(/```/g,"").trim();
  const m=clean.match(/\[[\s\S]*\]/);
  if(m) return JSON.parse(m[0]);
  throw new Error("Parse failed");
};

const fireConfetti = () => {
  const cv=document.createElement("canvas");
  cv.style.cssText="position:fixed;inset:0;z-index:9999;pointer-events:none;";
  cv.width=window.innerWidth; cv.height=window.innerHeight;
  document.body.appendChild(cv);
  const ctx=cv.getContext("2d");
  const ps=Array.from({length:130},()=>({x:Math.random()*cv.width,y:-20,r:Math.random()*6+3,color:`hsl(${Math.random()*360},90%,60%)`,vx:(Math.random()-0.5)*5,vy:Math.random()*4+2,tilt:0,ts:Math.random()*.1+.04}));
  let f=0;
  const go=()=>{ ctx.clearRect(0,0,cv.width,cv.height); ps.forEach(p=>{p.tilt+=p.ts;p.x+=p.vx;p.y+=p.vy;ctx.beginPath();ctx.lineWidth=p.r;ctx.strokeStyle=p.color;ctx.moveTo(p.x+Math.sin(p.tilt)*10,p.y);ctx.lineTo(p.x,p.y+p.r*2);ctx.stroke();}); f++; if(f<200) requestAnimationFrame(go); else cv.remove(); };
  go();
};

/* ═══════════════════ CSS ═══════════════════ */
const buildCSS = (themeId) => {
  const t=THEMES[themeId]||THEMES.spotify;
  return `${GFONTS}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:${t.bg};--card:${t.card};--hover:${t.hover};--line:${t.line};--accent:${t.accent};--black:#000;--t1:#fff;--t2:#B3B3B3;--t3:#6A6A6A;--gold:#F5C518;--red:#E50914;}
html,body{background:var(--bg);color:var(--t1);font-family:'DM Sans',sans-serif;overflow-x:hidden;}
::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:var(--line);border-radius:3px;}
.bg-root{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.bg-img{position:absolute;inset:-10%;background-size:cover;background-position:center;filter:blur(100px) brightness(.17) saturate(2.5);transform:scale(1.2);transition:background-image 1.5s;}
.bg-glows{position:absolute;inset:0;}.bg-glow{position:absolute;border-radius:50%;filter:blur(90px);opacity:.13;}
.bg-darken{position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 50% 0%,transparent,rgba(0,0,0,.78));}
.nav{position:fixed;top:0;left:0;right:0;z-index:900;height:60px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;transition:background .4s;}
.nav.stuck{background:${t.bg}f5;border-bottom:1px solid var(--line);}
.logo{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:.1em;display:flex;align-items:center;gap:8px;user-select:none;}
.logo-dot{width:10px;height:10px;border-radius:50%;background:var(--accent);animation:gpulse 2.4s ease-in-out infinite;flex-shrink:0;}
.logo-dot.owner-on{cursor:pointer;background:#fff;animation:none;box-shadow:0 0 0 3px var(--accent);}
@keyframes gpulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 ${t.accent}66}50%{transform:scale(1.3);box-shadow:0 0 0 6px ${t.accent}00}}
.nav-r{display:flex;align-items:center;gap:8px;}
.owner-pill{padding:4px 14px;border-radius:100px;background:var(--accent);color:#000;font-size:11px;font-weight:800;letter-spacing:.06em;cursor:pointer;}
.nav-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#157040);font-family:'Bebas Neue',sans-serif;font-size:17px;color:#000;display:flex;align-items:center;justify-content:center;}
.nav-icon-btn{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid var(--line);color:var(--t2);font-size:15px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;}
.nav-icon-btn:hover,.nav-icon-btn.on{background:rgba(255,255,255,.14);color:#fff;}
.nav-search{position:relative;display:flex;align-items:center;}
.nav-search-input{background:rgba(255,255,255,.08);border:1px solid var(--line);border-radius:100px;padding:7px 16px 7px 36px;font-size:12px;color:#fff;font-family:'DM Sans',sans-serif;outline:none;width:190px;transition:all .25s;}
.nav-search-input:focus{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.25);width:240px;}
.nav-search-input::placeholder{color:var(--t3);}
.nav-search-icon{position:absolute;left:12px;font-size:13px;color:var(--t3);pointer-events:none;}
.nav-search-clear{position:absolute;right:10px;background:none;border:none;color:var(--t3);font-size:14px;cursor:pointer;}
.search-drop{position:absolute;top:calc(100% + 8px);left:0;right:0;background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.9);z-index:999;max-height:360px;overflow-y:auto;}
.search-item{display:flex;align-items:center;gap:12px;padding:10px 14px;cursor:pointer;transition:background .15s;border-bottom:1px solid var(--line);}
.search-item:last-child{border-bottom:none;}.search-item:hover{background:var(--hover);}
.search-thumb{width:38px;height:38px;border-radius:5px;background:var(--hover);flex-shrink:0;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;font-size:16px;}
.search-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.search-name{font-size:13px;font-weight:600;}.search-meta{font-size:11px;color:var(--t3);display:flex;gap:6px;margin-top:2px;}
.sdot2{width:6px;height:6px;border-radius:50%;flex-shrink:0;margin-top:3px;}
.search-empty{padding:20px;text-align:center;color:var(--t3);font-size:13px;}
.spot{height:100svh;min-height:600px;position:relative;overflow:hidden;}
.spot-cover-bg{position:absolute;inset:0;background-size:cover;background-position:center 20%;filter:blur(2px) brightness(.32) saturate(1.5);transform:scale(1.06);transition:background-image .9s;z-index:0;}
.spot-grad{position:absolute;inset:0;z-index:1;background:linear-gradient(to right,rgba(0,0,0,.9) 0%,rgba(0,0,0,.5) 52%,transparent 100%),linear-gradient(to top,rgba(0,0,0,.97) 0%,transparent 52%),linear-gradient(to bottom,rgba(0,0,0,.45) 0%,transparent 22%);}
.spot-body{position:relative;z-index:2;height:100%;display:flex;align-items:center;padding:80px 60px 60px;gap:60px;}
.spot-left{flex:1;max-width:620px;}
.spot-kicker{display:flex;align-items:center;gap:10px;margin-bottom:20px;}
.spot-cat-tag{padding:5px 14px;border-radius:4px;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#000;}
.spot-hot-tag{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:4px;background:rgba(29,185,84,.12);border:1px solid rgba(29,185,84,.4);font-size:10px;font-weight:800;color:var(--accent);}
.spot-live-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:gpulse 1.8s ease infinite;}
.spot-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(52px,8.5vw,108px);line-height:.88;letter-spacing:.02em;margin-bottom:18px;text-shadow:0 2px 30px rgba(0,0,0,.9);animation:sIn .44s both;}
@keyframes sIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.spot-meta{display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap;}
.spot-year{font-size:13px;font-weight:700;color:var(--gold);}
.spot-genre{padding:3px 10px;border-radius:3px;background:rgba(255,255,255,.1);font-size:12px;font-weight:600;color:var(--t2);}
.spot-rb{font-size:13px;color:var(--gold);}.spot-sep{width:3px;height:3px;border-radius:50%;background:var(--t3);}
.spot-tagline{font-size:14px;font-style:italic;color:var(--accent);border-left:2px solid var(--accent);padding-left:14px;margin-bottom:18px;line-height:1.55;animation:sIn .44s .08s both;}
.spot-desc{font-size:15px;color:var(--t2);line-height:1.65;max-width:500px;margin-bottom:32px;animation:sIn .44s .14s both;}
.spot-btns{display:flex;gap:12px;flex-wrap:wrap;animation:sIn .44s .19s both;}
.sp-btn-w{padding:13px 28px;border-radius:100px;border:none;background:#fff;color:#000;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:8px;transition:all .2s;cursor:pointer;}
.sp-btn-w:hover{background:#e8e8e8;transform:scale(1.03);}
.sp-btn-g{padding:13px 28px;border-radius:100px;background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.15);font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:8px;transition:all .2s;text-decoration:none;cursor:pointer;}
.sp-btn-g:hover{background:rgba(255,255,255,.22);}
.spot-bottom{position:absolute;bottom:0;left:0;right:0;z-index:3;padding:0 60px 36px;display:flex;align-items:flex-end;justify-content:space-between;}
.spot-dots{display:flex;gap:8px;align-items:center;}
.sdot{cursor:pointer;border-radius:100px;height:3px;background:rgba(255,255,255,.22);transition:all .3s;overflow:hidden;position:relative;}
.sdot.sm{width:24px;}.sdot.act{width:52px;}
.sdot-fill{position:absolute;inset:0;background:var(--accent);transform:scaleX(0);transform-origin:left;}
.sdot.act .sdot-fill{animation:sfill 6s linear forwards;}
@keyframes sfill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.spot-navs{display:flex;gap:8px;}
.spot-nav{width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s;cursor:pointer;}
.spot-nav:hover{background:rgba(255,255,255,.2);}
.spot-right{flex-shrink:0;}
.spot-poster{width:clamp(155px,16vw,240px);height:clamp(232px,24vw,360px);border-radius:16px;overflow:hidden;background:var(--card);display:flex;align-items:center;justify-content:center;font-size:60px;box-shadow:0 30px 90px rgba(0,0,0,.95),0 0 0 1px rgba(255,255,255,.1);animation:pIn .58s .15s both;position:relative;}
@keyframes pIn{from{opacity:0;transform:translateX(26px) scale(.95)}to{opacity:1;transform:none}}
.spot-poster img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;}
.spot-empty{height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;position:relative;z-index:2;}
.spot-empty-h{font-family:'Bebas Neue',sans-serif;font-size:42px;letter-spacing:.06em;color:var(--t3);}
.stats-bar{background:rgba(255,255,255,.02);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:14px 36px;display:flex;align-items:center;gap:32px;overflow-x:auto;position:relative;z-index:2;}
.stats-bar::-webkit-scrollbar{display:none;}
.stat-item{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.stat-num{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:.04em;color:var(--accent);}
.stat-lbl{font-size:11px;color:var(--t3);font-weight:600;letter-spacing:.06em;text-transform:uppercase;}
.stat-div{width:1px;height:28px;background:var(--line);flex-shrink:0;}
.view-tabs{display:flex;gap:6px;padding:20px 28px 0;position:relative;z-index:2;}
.vtab{padding:7px 16px;border-radius:100px;border:1px solid var(--line);background:transparent;color:var(--t3);font-size:12px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;letter-spacing:.04em;}
.vtab:hover{color:#fff;border-color:rgba(255,255,255,.25);}
.vtab.on{background:var(--accent);color:#000;border-color:var(--accent);}
.content{background:transparent;padding-bottom:80px;position:relative;z-index:2;}
.nrow{padding-top:28px;}
.nrow-hdr{display:flex;align-items:center;justify-content:space-between;padding:0 28px 12px;}
.nrow-left{display:flex;align-items:center;gap:12px;}
.nrow-title{font-size:20px;font-weight:700;}
.nrow-count{font-size:11px;font-weight:700;padding:2px 9px;border-radius:100px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--t3);}
.nrow-right{display:flex;align-items:center;gap:8px;}
.nrow-sort{font-size:11px;font-weight:700;color:var(--t3);background:none;border:none;font-family:'DM Sans',sans-serif;cursor:pointer;padding:4px 10px;border-radius:100px;transition:all .2s;}
.nrow-sort:hover,.nrow-sort.on{color:#fff;background:rgba(255,255,255,.09);}
.nrow-add-btn{font-size:12px;font-weight:700;color:var(--t2);background:none;border:none;font-family:'DM Sans',sans-serif;cursor:pointer;transition:color .2s;}
.nrow-add-btn:hover{color:#fff;}
.nrow-wrap{position:relative;}
.nrow-track{display:flex;gap:0;padding:4px 28px 32px;overflow-x:auto;overflow-y:visible;scroll-behavior:smooth;scrollbar-width:none;align-items:flex-end;}
.nrow-track::-webkit-scrollbar{display:none;}
.narr{position:absolute;top:50%;transform:translateY(-65%);width:36px;height:72px;border-radius:4px;z-index:5;background:rgba(6,6,6,.95);border:1px solid rgba(255,255,255,.12);color:#fff;font-size:22px;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:all .2s;cursor:pointer;}
.nrow-wrap:hover .narr{opacity:1;pointer-events:all;}.narr:hover{background:rgba(40,40,40,.98);}
.narr-l{left:0;}.narr-r{right:0;}
.nrow-empty{padding:2px 28px 28px;font-size:13px;color:var(--t3);}
.rcard-wrap{display:flex;align-items:flex-end;flex-shrink:0;margin-right:10px;}
.rcard-num{font-family:'Bebas Neue',sans-serif;font-size:112px;line-height:.82;letter-spacing:-4px;color:transparent;-webkit-text-stroke:2.5px rgba(155,155,155,.36);user-select:none;flex-shrink:0;margin-right:-22px;z-index:0;}
.rcard-wrap:nth-child(1) .rcard-num{-webkit-text-stroke:2.5px rgba(215,215,215,.55);}
.rcard-wrap:nth-child(2) .rcard-num{-webkit-text-stroke:2.5px rgba(195,195,195,.47);}
.rcard-wrap:nth-child(3) .rcard-num{-webkit-text-stroke:2.5px rgba(175,175,175,.42);}
.rcard-wrap .nc{z-index:1;}
.nc{flex-shrink:0;position:relative;cursor:pointer;border-radius:6px;transition:transform .28s cubic-bezier(.22,.61,.36,1),z-index 0s .28s;z-index:1;}
.nc:hover{transform:scale(1.18);z-index:60;transition:transform .28s cubic-bezier(.22,.61,.36,1),z-index 0s 0s;}
.nc.tall{width:130px;}.nc.sq{width:155px;}.nc.wide{width:230px;}
.nc-img-box{width:100%;border-radius:6px;overflow:hidden;position:relative;box-shadow:0 4px 18px rgba(0,0,0,.6);transition:box-shadow .28s,border-radius .28s;}
.nc:hover .nc-img-box{box-shadow:0 18px 50px rgba(0,0,0,.9);border-radius:6px 6px 0 0;}
.nc.tall .nc-img-box{padding-top:150%;}.nc.sq .nc-img-box{padding-top:100%;}.nc.wide .nc-img-box{padding-top:56.25%;}
.nc-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:36px;background:linear-gradient(145deg,var(--card),var(--hover));}
.nc-real-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;}
.nc-trailer{position:absolute;inset:0;z-index:2;opacity:0;transition:opacity .4s;pointer-events:none;}
.nc:hover .nc-trailer{opacity:1;}
.nc-trailer iframe{width:100%;height:100%;border:none;}
.nc-star{position:absolute;top:6px;right:6px;background:rgba(0,0,0,.85);border-radius:3px;padding:2px 6px;font-size:10px;font-weight:800;color:var(--gold);opacity:0;transition:opacity .2s;z-index:3;}
.nc:hover .nc-star{opacity:1;}
.nc-rw-badge{position:absolute;bottom:6px;left:6px;background:rgba(0,0,0,.85);border-radius:3px;padding:2px 6px;font-size:9px;font-weight:800;color:var(--t2);z-index:3;}
.nc-priv-badge{position:absolute;top:6px;left:6px;background:rgba(0,0,0,.85);border-radius:3px;padding:2px 6px;font-size:10px;z-index:3;}
.nc.is-private .nc-img-box{opacity:.55;}
.nc-panel{position:absolute;top:100%;left:0;right:0;background:var(--hover);border-radius:0 0 6px 6px;padding:12px 11px 10px;opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity .18s,transform .18s;z-index:7;box-shadow:0 20px 40px rgba(0,0,0,.8);}
.nc:hover .nc-panel{opacity:1;transform:none;pointer-events:all;}
.nc-panel-title{font-size:12px;font-weight:700;line-height:1.25;margin-bottom:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.nc-panel-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:9px;}
.npm-yr{font-size:11px;font-weight:700;color:var(--accent);}
.npm-g{font-size:10px;color:var(--t2);background:rgba(255,255,255,.08);padding:2px 7px;border-radius:3px;}
.npm-dot{width:3px;height:3px;border-radius:50%;background:var(--t3);}
.nc-panel-btns{display:flex;gap:4px;flex-wrap:wrap;}
.npb{height:26px;border-radius:100px;border:none;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:4px;transition:all .15s;cursor:pointer;}
.npb-play{background:#fff;color:#000;flex:1;}.npb-play:hover{background:#e8e8e8;}
.npb-ic{background:rgba(255,255,255,.1);color:var(--t2);width:26px;flex:none;}.npb-ic:hover{background:rgba(255,255,255,.25);color:#fff;}
.npb-priv.on{background:rgba(255,200,0,.18);color:var(--gold);}
.npb-del:hover{background:rgba(229,9,20,.2);color:#ff5555;}
.nc-label{padding:6px 2px 0;font-size:11px;font-weight:500;color:var(--t2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity .15s;}
.nc:hover .nc-label{opacity:0;}
.nc-add{flex-shrink:0;border:1.5px dashed var(--line);border-radius:6px;background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--t3);transition:all .25s;cursor:pointer;}
.nc-add:hover{border-color:var(--accent);color:var(--accent);background:rgba(29,185,84,.04);}
.nc-add.tall{width:130px;height:195px;}.nc-add.sq{width:155px;height:155px;}.nc-add.wide{width:230px;height:130px;}
.nc-add-plus{font-size:28px;line-height:1;transition:transform .35s cubic-bezier(.34,1.56,.64,1);}
.nc-add:hover .nc-add-plus{transform:rotate(90deg) scale(1.1);}
.nc-add-lbl{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;}
.moodboard-wrap{padding:28px 28px 60px;position:relative;z-index:2;}
.moodboard{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;}
.mb-card{position:relative;border-radius:10px;overflow:hidden;cursor:pointer;aspect-ratio:2/3;background:var(--card);transition:transform .25s,box-shadow .25s;}
.mb-card.wide{aspect-ratio:16/9;}.mb-card.sq{aspect-ratio:1;}
.mb-card:hover{transform:scale(1.04);box-shadow:0 20px 50px rgba(0,0,0,.9);}
.mb-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.mb-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:42px;background:linear-gradient(145deg,var(--card),var(--hover));}
.mb-overlay{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(0,0,0,.92),transparent);padding:14px 10px 10px;}
.mb-name{font-size:12px;font-weight:700;line-height:1.3;}.mb-meta{font-size:10px;color:var(--t3);margin-top:2px;}
.mb-priv{position:absolute;top:8px;right:8px;font-size:10px;}
.det-bg{position:fixed;inset:0;z-index:950;background:rgba(0,0,0,.88);animation:fadeIn .18s ease;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.det-box{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:951;width:min(920px,95vw);max-height:90vh;background:var(--card);border:1px solid rgba(255,255,255,.1);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;animation:bPop .26s cubic-bezier(.34,1.56,.64,1);}
@keyframes bPop{from{transform:translate(-50%,-50%) scale(.94);opacity:0}to{transform:translate(-50%,-50%) scale(1);opacity:1}}
.det-hero{height:280px;position:relative;overflow:hidden;flex-shrink:0;background:var(--hover);}
.det-hero-img{position:absolute;inset:0;background-size:cover;background-position:center 20%;filter:blur(1px) brightness(.35) saturate(1.6);transform:scale(1.05);}
.det-hero-grad{position:absolute;inset:0;background:linear-gradient(to right,rgba(24,24,24,.92),rgba(24,24,24,.45) 55%,transparent),linear-gradient(to top,var(--card),transparent 65%);}
.det-trailer{position:absolute;inset:0;z-index:2;}
.det-trailer iframe{width:100%;height:100%;border:none;}
.det-play-btn{position:absolute;bottom:14px;right:14px;z-index:3;padding:8px 18px;border-radius:100px;background:rgba(0,0,0,.8);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:12px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:6px;}
.det-play-btn:hover{background:var(--accent);border-color:var(--accent);color:#000;}
.det-poster{position:absolute;left:36px;bottom:0;width:130px;height:195px;border-radius:8px 8px 0 0;overflow:hidden;background:var(--hover);box-shadow:0 -20px 60px rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;font-size:46px;}
.det-poster img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;}
.det-actions{position:absolute;top:12px;right:12px;display:flex;gap:8px;z-index:4;}
.det-x{width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.7);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:15px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;}
.det-x:hover{background:rgba(229,9,20,.5);}
.det-body{padding:18px 32px 24px 190px;overflow-y:auto;flex:1;}
.det-cat-lbl{display:inline-block;padding:3px 12px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#000;margin-bottom:10px;}
.det-name{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,5vw,52px);letter-spacing:.02em;line-height:.92;margin-bottom:12px;}
.det-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;}
.chip{padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;background:rgba(255,255,255,.08);color:var(--t2);}
.chip-y{background:rgba(245,197,24,.1);color:var(--gold);border:1px solid rgba(245,197,24,.2);}
.chip-r{background:rgba(255,100,100,.1);color:#ff9999;border:1px solid rgba(255,100,100,.2);}
.det-tagline{font-size:14px;font-style:italic;color:var(--accent);border-left:2px solid var(--accent);padding-left:12px;margin-bottom:12px;line-height:1.55;}
.det-desc{font-size:14px;color:var(--t2);line-height:1.75;margin-bottom:12px;}
.det-box-sec{background:rgba(255,255,255,.04);border-radius:8px;padding:12px 14px;margin-bottom:12px;}
.det-sec-h{font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;margin-bottom:6px;display:block;}
.det-sec-h.green{color:var(--accent);}.det-sec-h.gold{color:var(--gold);}.det-sec-h.blue{color:#0071EB;}
.det-fact-txt{font-size:13px;color:var(--t2);line-height:1.65;}
.det-notes-txt{font-size:13px;color:var(--t2);line-height:1.65;white-space:pre-wrap;}
.det-rw-row{display:flex;align-items:center;gap:14px;}
.det-rw-num{font-family:'Bebas Neue',sans-serif;font-size:36px;color:var(--accent);line-height:1;}
.det-rw-info{flex:1;}
.det-rw-lbl{font-size:11px;color:var(--t3);font-weight:600;text-transform:uppercase;letter-spacing:.08em;}
.det-rw-btn{padding:7px 16px;border-radius:100px;border:none;background:var(--accent);color:#000;font-size:11px;font-weight:800;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;}
.det-rw-btn:hover{filter:brightness(1.15);}
.det-st-row{display:flex;align-items:center;gap:10px;}
.det-st-ico{font-size:20px;flex-shrink:0;}
.det-st-link{font-size:13px;color:var(--accent);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.det-st-link:hover{text-decoration:underline;}
.det-footer{flex-shrink:0;padding:14px 32px;border-top:1px solid var(--line);display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
.det-btn{padding:9px 20px;border-radius:100px;border:none;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px;transition:all .2s;cursor:pointer;text-decoration:none;}
.det-btn-w{background:#fff;color:#000;}.det-btn-w:hover{background:#e8e8e8;}
.det-btn-g{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.12);}.det-btn-g:hover{background:rgba(255,255,255,.2);}
.det-btn-d{background:transparent;color:var(--t3);border:1px solid var(--line);}.det-btn-d:hover{border-color:rgba(229,9,20,.4);color:#ff5555;}
.modal-bg{position:fixed;inset:0;z-index:980;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .15s;}
.modal-box{background:var(--card);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:32px;width:100%;max-width:520px;max-height:92vh;overflow-y:auto;animation:slideUp .2s cubic-bezier(.22,.61,.36,1);}
.modal-box.wide{max-width:760px;}
@keyframes slideUp{from{transform:translateY(18px);opacity:0}to{transform:none;opacity:1}}
.mhdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;}
.mtitle{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:.08em;}
.mclose{width:30px;height:30px;border-radius:50%;background:var(--hover);border:1px solid var(--line);color:var(--t2);font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;}
.mclose:hover{color:#ff5555;}
.ai-bar{background:var(--hover);border:1px solid var(--line);border-radius:8px;padding:13px 15px;display:flex;align-items:center;gap:12px;margin-bottom:4px;}
.ai-icon{font-size:20px;}.ai-text{flex:1;}
.ai-title{font-size:13px;font-weight:700;margin-bottom:2px;}.ai-sub{font-size:11px;color:var(--t3);}
.ai-btn{padding:8px 16px;border-radius:100px;border:none;background:var(--accent);color:#000;font-size:11px;font-weight:800;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:all .2s;cursor:pointer;}
.ai-btn:hover:not(:disabled){filter:brightness(1.15);}.ai-btn:disabled{opacity:.35;cursor:not-allowed;}
.ai-spin{display:inline-flex;gap:4px;align-items:center;}
.ai-spin i{width:5px;height:5px;border-radius:50%;background:var(--accent);animation:asd .9s ease infinite;display:block;}
.ai-spin i:nth-child(2){animation-delay:.15s;}.ai-spin i:nth-child(3){animation-delay:.3s;}
@keyframes asd{0%,80%,100%{transform:scale(.55);opacity:.3}40%{transform:scale(1);opacity:1}}
.ai-status{font-size:11px;padding:5px 2px 8px;display:flex;align-items:center;gap:6px;}
.ai-status.ok{color:var(--accent);}.ai-status.err{color:#ff8888;}.ai-status.loading{color:var(--t2);}
.fg{display:flex;flex-direction:column;gap:5px;margin-bottom:14px;}
.fl{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--t3);}
.fi,.ft{background:var(--hover);border:1px solid var(--line);border-radius:6px;padding:11px 14px;color:#fff;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s;width:100%;}
.fi:focus,.ft:focus{border-color:var(--accent);}
.fi::placeholder,.ft::placeholder{color:rgba(255,255,255,.2);}
.ft{resize:vertical;min-height:72px;line-height:1.6;}
.two{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.rrow{display:flex;gap:8px;}
.ropt{flex:1;padding:9px 4px;text-align:center;background:var(--hover);border:1px solid var(--line);border-radius:100px;font-size:11px;font-weight:700;color:var(--t3);transition:all .2s;cursor:pointer;}
.ropt.on{background:var(--gold);color:#000;border-color:var(--gold);}
.mftr{display:flex;gap:10px;margin-top:16px;}
.mc{flex:1;padding:12px;border-radius:100px;border:1px solid var(--line);background:transparent;color:var(--t2);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:color .2s;}
.mc:hover{color:#fff;}
.ms{flex:2;padding:12px;border-radius:100px;border:none;background:var(--accent);color:#000;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:800;cursor:pointer;transition:all .2s;}
.ms:hover:not(:disabled){filter:brightness(1.1);}.ms:disabled{opacity:.35;cursor:not-allowed;}
.img-prev{display:flex;align-items:center;gap:10px;margin-top:8px;padding:10px;background:rgba(255,255,255,.03);border-radius:6px;border:1px solid var(--line);}
.img-prev-thumb{width:54px;height:54px;border-radius:4px;overflow:hidden;background:var(--hover);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;position:relative;}
.img-prev-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.img-prev-note{font-size:11px;color:var(--t3);line-height:1.55;}
.img-prev-note b{color:var(--accent);}
.wrapped-page{padding:28px;position:relative;z-index:2;}
.wrapped-hero{text-align:center;padding:48px 20px;background:linear-gradient(135deg,var(--card),var(--hover));border-radius:20px;margin-bottom:28px;position:relative;overflow:hidden;}
.wrapped-hero::before{content:'2025';font-family:'Bebas Neue',sans-serif;font-size:240px;color:var(--accent);opacity:.04;position:absolute;top:-40px;left:50%;transform:translateX(-50%);pointer-events:none;}
.wrapped-title{font-family:'Bebas Neue',sans-serif;font-size:52px;letter-spacing:.06em;position:relative;z-index:1;}
.wrapped-sub{font-size:15px;color:var(--t2);margin-top:8px;position:relative;z-index:1;}
.wrapped-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:28px;}
.wrapped-card{background:var(--hover);border-radius:14px;padding:22px;text-align:center;}
.wc-num{font-family:'Bebas Neue',sans-serif;font-size:52px;color:var(--accent);line-height:1;}
.wc-lbl{font-size:11px;color:var(--t3);font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-top:4px;}
.wc-sub{font-size:12px;color:var(--t2);margin-top:6px;font-weight:600;}
.wrapped-section{background:var(--hover);border-radius:14px;padding:22px;margin-bottom:16px;}
.ws-title{font-size:14px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px;}
.decade-row{margin-bottom:10px;}
.decade-top{display:flex;justify-content:space-between;font-size:12px;color:var(--t2);margin-bottom:5px;}
.decade-bar-bg{height:7px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden;}
.decade-bar-fill{height:100%;border-radius:4px;transition:width 1.2s ease;}
.quotes-page{padding:28px;position:relative;z-index:2;}
.quote-hero{background:linear-gradient(135deg,var(--card),var(--hover));border-radius:20px;padding:52px 40px;text-align:center;position:relative;overflow:hidden;margin-bottom:28px;}
.quote-big-mark{font-family:'Bebas Neue',sans-serif;font-size:160px;color:var(--accent);opacity:.06;position:absolute;top:-30px;left:20px;line-height:1;pointer-events:none;}
.quote-text{font-size:clamp(20px,3vw,30px);font-style:italic;line-height:1.5;margin-bottom:16px;position:relative;z-index:1;}
.quote-src{font-size:14px;color:var(--t3);position:relative;z-index:1;}.quote-src b{color:var(--t2);}
.quotes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;}
.qcard{background:var(--hover);border-radius:12px;padding:20px;border-left:3px solid var(--accent);cursor:pointer;transition:background .2s;}
.qcard:hover{background:rgba(255,255,255,.06);}
.qcard-text{font-size:14px;font-style:italic;color:var(--t1);line-height:1.6;margin-bottom:8px;}
.qcard-src{font-size:11px;color:var(--t3);}
.suggests-page{padding:28px;position:relative;z-index:2;}
.sugg-hero{text-align:center;margin-bottom:28px;}
.sugg-title{font-family:'Bebas Neue',sans-serif;font-size:42px;letter-spacing:.06em;margin-bottom:8px;}
.sugg-sub{font-size:14px;color:var(--t2);}
.sugg-btn{padding:12px 28px;border-radius:100px;border:none;background:var(--accent);color:#000;font-size:13px;font-weight:800;font-family:'DM Sans',sans-serif;cursor:pointer;margin-top:14px;transition:all .2s;}
.sugg-btn:hover:not(:disabled){filter:brightness(1.1);}.sugg-btn:disabled{opacity:.35;cursor:not-allowed;}
.sugg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;}
.sugg-card{background:var(--hover);border-radius:12px;padding:18px;border:1px solid var(--line);}
.sugg-cat{font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:6px;}
.sugg-name{font-size:15px;font-weight:700;margin-bottom:6px;}.sugg-year{font-size:11px;color:var(--t3);margin-bottom:8px;}
.sugg-reason{font-size:12px;color:var(--t2);line-height:1.55;}
.recommends-page{padding:80px 36px 60px;position:relative;z-index:2;}
.rec-hero{text-align:center;margin-bottom:48px;}
.rec-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(48px,8vw,88px);letter-spacing:.04em;margin-bottom:10px;}
.rec-sub{font-size:16px;color:var(--t2);}
.rec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:20px;}
.rec-card{background:var(--card);border-radius:12px;overflow:hidden;cursor:pointer;transition:transform .25s;border:1px solid var(--line);}
.rec-card:hover{transform:translateY(-5px);}
.rec-img{aspect-ratio:2/3;background:var(--hover);position:relative;display:flex;align-items:center;justify-content:center;font-size:48px;}
.rec-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.rec-body{padding:12px;}.rec-name{font-size:13px;font-weight:700;margin-bottom:4px;}
.rec-meta{font-size:11px;color:var(--t3);}
.theme-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px;}
.theme-opt{padding:16px;border-radius:10px;border:2px solid var(--line);cursor:pointer;transition:all .2s;text-align:center;}
.theme-opt:hover{border-color:rgba(255,255,255,.3);}.theme-opt.on{border-color:var(--accent);}
.theme-dot{width:22px;height:22px;border-radius:50%;margin:0 auto 8px;}
.theme-name{font-size:12px;font-weight:700;}
.coll-page{padding:28px;position:relative;z-index:2;}
.coll-list{display:flex;flex-direction:column;gap:10px;margin-bottom:24px;}
.coll-item{background:var(--hover);border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:background .2s;border:1px solid var(--line);}
.coll-item:hover{background:rgba(255,255,255,.07);}
.coll-icon{font-size:26px;}.coll-info{flex:1;}
.coll-name{font-size:14px;font-weight:700;margin-bottom:3px;}.coll-count{font-size:11px;color:var(--t3);}
.coll-del{background:none;border:none;color:var(--t3);font-size:16px;cursor:pointer;padding:4px;transition:color .2s;}
.coll-del:hover{color:#ff5555;}
.toast{position:fixed;bottom:28px;right:28px;z-index:9999;background:var(--hover);border:1px solid rgba(255,255,255,.12);border-radius:100px;padding:12px 20px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px;animation:tpop .26s cubic-bezier(.34,1.56,.64,1);box-shadow:0 16px 40px rgba(0,0,0,.7);}
@keyframes tpop{from{transform:translateY(12px) scale(.95);opacity:0}to{transform:none;opacity:1}}
.site-footer{text-align:center;padding:40px 0 20px;color:var(--t3);font-size:12px;line-height:1.9;}
@media(max-width:900px){
  .spot-right{display:none;}.spot-body{padding:70px 22px 60px;}.spot-bottom{padding:0 22px 28px;}
  .nav{padding:0 16px;}.det-body{padding:14px 18px 18px;}.det-poster{display:none;}.det-footer{padding:12px 18px;}
  .modal-box{padding:22px;}.two{grid-template-columns:1fr;}.stats-bar{padding:12px 16px;gap:20px;}
  .rcard-num{font-size:80px;letter-spacing:-2px;}.moodboard{grid-template-columns:repeat(auto-fill,minmax(120px,1fr));}
  .wrapped-grid{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:500px){
  .spot-title{font-size:44px;}.nav-search{display:none;}.rcard-num{font-size:64px;margin-right:-14px;}
  .nrow-hdr,.nrow-track,.nrow-empty{padding-left:14px;padding-right:14px;}
}`;
};

/* ═══════════════════ SMALL COMPONENTS ═══════════════════ */
function Toast({msg,emoji}){ return <div className="toast"><span>{emoji}</span>{msg}</div>; }

function SearchBar({allItems,onSelect}){
  const [q,setQ]=useState("");const [open,setOpen]=useState(false);const ref=useRef();
  const vis = q.length>1 ? allItems.filter(({item})=>item.name.toLowerCase().includes(q.toLowerCase())).slice(0,8) : [];
  useEffect(()=>{ const fn=e=>{if(!ref.current?.contains(e.target)) setOpen(false);}; document.addEventListener("mousedown",fn); return()=>document.removeEventListener("mousedown",fn); },[]);
  return(
    <div className="nav-search" ref={ref}>
      <span className="nav-search-icon">🔍</span>
      <input className="nav-search-input" placeholder="Search vault…" value={q} onChange={e=>{setQ(e.target.value);setOpen(true);}} onFocus={()=>setOpen(true)}/>
      {q&&<button className="nav-search-clear" onClick={()=>{setQ("");setOpen(false);}}>×</button>}
      {open&&q.length>1&&(
        <div className="search-drop">
          {vis.length===0?<div className="search-empty">No results for "{q}"</div>:vis.map(({item,cat})=>(
            <div key={item.id} className="search-item" onClick={()=>{onSelect(item,cat);setQ("");setOpen(false);}}>
              <div className="search-thumb">{item.image&&<img src={item.image} alt="" onError={e=>e.target.style.display="none"}/>}<span>{cat.icon}</span></div>
              <div className="search-info">
                <div className="search-name">{item.name}</div>
                <div className="search-meta"><div className="sdot2" style={{background:cat.color}}/><span>{cat.label}</span>{item.year&&<><span>·</span><span>{item.year}</span></>}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Spotlight({tops,isOwner,onOpen,onAdd,onSpotChange}){
  const [idx,setIdx]=useState(0);const [aKey,setAKey]=useState(0);const timer=useRef();
  const goTo=useCallback(i=>{clearTimeout(timer.current);setIdx(i);setAKey(k=>k+1);},[]);
  useEffect(()=>{ if(!tops.length) return; onSpotChange?.(tops[idx]); },[idx,tops]);
  useEffect(()=>{ if(!tops.length) return; timer.current=setTimeout(()=>setIdx(i=>(i+1)%tops.length),6000); return()=>clearTimeout(timer.current); },[idx,aKey,tops.length]);
  if(!tops.length) return(
    <div className="spot"><div className="spot-empty">
      <div className="spot-empty-h">YOUR VAULT IS EMPTY</div>
      <div className="spot-empty-s">Start adding your favourites</div>
      {isOwner&&<button className="sp-btn-w" onClick={onAdd}>+ Add First Item</button>}
    </div></div>
  );
  const {item,cat}=tops[idx];
  return(
    <div className="spot">
      {item.image&&<div className="spot-cover-bg" style={{backgroundImage:`url(${item.image})`}}/>}
      <div className="spot-grad"/>
      <div className="spot-body">
        <div className="spot-left">
          <div className="spot-kicker">
            <div className="spot-cat-tag" style={{background:cat.color}}>{cat.icon} {cat.label}</div>
            <div className="spot-hot-tag"><div className="spot-live-dot"/>TOP PICK</div>
          </div>
          <div key={aKey} className="spot-title">{item.name}</div>
          <div className="spot-meta">
            {item.year&&<span className="spot-year">{item.year}</span>}
            {item.year&&item.genre&&<div className="spot-sep"/>}
            {item.genre&&<span className="spot-genre">{item.genre}</span>}
            {item.rating&&<><div className="spot-sep"/><span className="spot-rb">{item.rating}</span></>}
            {item.rewatchCount>0&&<><div className="spot-sep"/><span className="spot-rb">▶ {item.rewatchCount}×</span></>}
          </div>
          {item.tagline&&<div className="spot-tagline">"{item.tagline}"</div>}
          <div className="spot-desc">{item.description||"One of the all-time favourites."}</div>
          <div className="spot-btns">
            <button className="sp-btn-w" onClick={()=>onOpen(item,cat)}>▶ View Details</button>
            {item.link&&<a className="sp-btn-g" href={item.link} target="_blank" rel="noreferrer">🔗 Open</a>}
          </div>
        </div>
        <div className="spot-right">
          <div className="spot-poster">
            <span>{cat.icon}</span>
            {item.image&&<img src={item.image} alt={item.name} onError={e=>e.target.style.display="none"}/>}
          </div>
        </div>
      </div>
      <div className="spot-bottom">
        <div className="spot-dots">{tops.map((_,i)=>(
          <div key={i} className={`sdot ${i===idx?"act":"sm"}`} onClick={()=>goTo(i)}>
            {i===idx&&<div key={aKey} className="sdot-fill"/>}
          </div>
        ))}</div>
        <div className="spot-navs">
          <div className="spot-nav" onClick={()=>goTo((idx-1+tops.length)%tops.length)}>‹</div>
          <div className="spot-nav" onClick={()=>goTo((idx+1)%tops.length)}>›</div>
        </div>
      </div>
    </div>
  );
}

function NC({item,cat,isOwner,onOpen,onEdit,onDelete,onTogglePrivate,onRewatch}){
  const sh=SHAPE[cat.id]||"tall";
  return(
    <div className={`nc ${sh}${item.private?" is-private":""}`} onClick={()=>onOpen(item,cat)}>
      <div className="nc-img-box">
        <div className="nc-ph">{cat.icon}</div>
        {item.image&&<img src={item.image} alt="" className="nc-real-img" onError={e=>e.target.style.display="none"}/>}
        {item.trailerUrl&&<div className="nc-trailer"><iframe src={item.trailerUrl+"?autoplay=1&mute=1&controls=0&loop=1"} allow="autoplay"/></div>}
        {item.rating&&<div className="nc-star">{item.rating.split(" ")[0]}</div>}
        {item.rewatchCount>0&&<div className="nc-rw-badge">▶ {item.rewatchCount}×</div>}
        {isOwner&&item.private&&<div className="nc-priv-badge">🔒</div>}
      </div>
      <div className="nc-panel">
        <div className="nc-panel-title">{item.name}</div>
        <div className="nc-panel-meta">
          {item.year&&<span className="npm-yr">{item.year}</span>}
          {item.year&&item.genre&&<span className="npm-dot"/>}
          {item.genre&&<span className="npm-g">{item.genre}</span>}
        </div>
        <div className="nc-panel-btns">
          <button className="npb npb-play" onClick={e=>{e.stopPropagation();onOpen(item,cat);}}>▶ View</button>
          {isOwner&&<>
            <button className="npb npb-ic" title="Rewatch +1" onClick={e=>{e.stopPropagation();onRewatch(item.id,cat.id);}}>▶+</button>
            <button className={`npb npb-ic npb-priv${item.private?" on":""}`} title={item.private?"Make Public":"Make Private"} onClick={e=>{e.stopPropagation();onTogglePrivate(item.id,cat.id);}}>
              {item.private?"🔒":"🌐"}
            </button>
            <button className="npb npb-ic" title="Edit" onClick={e=>{e.stopPropagation();onEdit(item,cat);}}>✏</button>
            <button className="npb npb-ic npb-del" title="Delete" onClick={e=>{e.stopPropagation();if(window.confirm("Remove?")) onDelete(item.id,cat.id);}}>🗑</button>
          </>}
        </div>
      </div>
      <div className="nc-label">{item.name}{item.private&&isOwner?" 🔒":""}</div>
    </div>
  );
}

function NRow({cat,items,isOwner,onOpen,onEdit,onDelete,onAdd,onTogglePrivate,onRewatch}){
  const ref=useRef();const [sort,setSort]=useState("default");
  const scroll=d=>ref.current?.scrollBy({left:d*420,behavior:"smooth"});
  const visible=isOwner?items:items.filter(i=>!i.private);
  const sorted=[...visible].sort((a,b)=>{
    if(sort==="rating"){const w={"★★★ Obsessed":3,"★★ Loved":2,"★ Liked":1};return(w[b.rating]||0)-(w[a.rating]||0);}
    if(sort==="year") return(parseInt(b.year)||0)-(parseInt(a.year)||0);
    return 0;
  });
  if(sorted.length===0&&!isOwner) return null;
  return(
    <div className="nrow">
      <div className="nrow-hdr">
        <div className="nrow-left">
          <div className="nrow-title">{cat.label}</div>
          <span className="nrow-count">{sorted.length}{isOwner&&items.filter(i=>i.private).length>0&&<span style={{color:"var(--gold)",fontSize:10,marginLeft:4}}>({items.filter(i=>i.private).length}🔒)</span>}</span>
        </div>
        <div className="nrow-right">
          {sorted.length>1&&<>
            <button className={`nrow-sort ${sort==="rating"?"on":""}`} onClick={()=>setSort(s=>s==="rating"?"default":"rating")}>Rating</button>
            <button className={`nrow-sort ${sort==="year"?"on":""}`} onClick={()=>setSort(s=>s==="year"?"default":"year")}>Year</button>
          </>}
          {isOwner&&<button className="nrow-add-btn" onClick={onAdd}>+ Add →</button>}
        </div>
      </div>
      {sorted.length===0&&<div className="nrow-empty">Nothing here yet.</div>}
      {sorted.length>0&&(
        <div className="nrow-wrap">
          <button className="narr narr-l" onClick={()=>scroll(-1)}>‹</button>
          <div className="nrow-track" ref={ref}>
            {sorted.map((item,i)=>(
              <div key={item.id} className="rcard-wrap">
                <div className="rcard-num">{i+1}</div>
                <NC item={item} cat={cat} isOwner={isOwner} onOpen={onOpen} onEdit={(it,c)=>onEdit(it,c||cat)} onDelete={onDelete} onTogglePrivate={onTogglePrivate} onRewatch={onRewatch}/>
              </div>
            ))}
            {isOwner&&<div className={`nc-add ${SHAPE[cat.id]||"tall"}`} onClick={onAdd} style={{marginLeft:sorted.length?10:0}}>
              <div className="nc-add-plus">+</div><div className="nc-add-lbl">Add</div>
            </div>}
          </div>
          <button className="narr narr-r" onClick={()=>scroll(1)}>›</button>
        </div>
      )}
    </div>
  );
}

function MoodBoard({allItems,isOwner,onOpen}){
  const visible=isOwner?allItems:allItems.filter(({item})=>!item.private);
  return(
    <div className="moodboard-wrap">
      <div className="moodboard">
        {visible.map(({item,cat})=>(
          <div key={item.id} className={`mb-card ${SHAPE[cat.id]||"tall"}`} onClick={()=>onOpen(item,cat)}>
            <div className="mb-ph">{cat.icon}</div>
            {item.image&&<img src={item.image} alt="" onError={e=>e.target.style.display="none"}/>}
            {isOwner&&item.private&&<div className="mb-priv">🔒</div>}
            <div className="mb-overlay">
              <div className="mb-name">{item.name}</div>
              <div className="mb-meta">{cat.label}{item.year&&` · ${item.year}`}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendsPage({allItems,onOpen}){
  const tops=allItems.filter(({item})=>!item.private&&item.rating==="★★★ Obsessed").slice(0,24);
  return(
    <div className="recommends-page">
      <div className="rec-hero">
        <div className="rec-title">SHUBHAM RECOMMENDS</div>
        <div className="rec-sub">Handpicked favourites — Obsessed tier only</div>
      </div>
      {tops.length===0&&<div style={{textAlign:"center",color:"var(--t3)",paddingTop:40}}>No Obsessed-rated items yet.</div>}
      <div className="rec-grid">
        {tops.map(({item,cat})=>(
          <div key={item.id} className="rec-card" onClick={()=>onOpen(item,cat)}>
            <div className="rec-img"><span>{cat.icon}</span>{item.image&&<img src={item.image} alt="" onError={e=>e.target.style.display="none"}/>}</div>
            <div className="rec-body">
              <div className="rec-name">{item.name}</div>
              <div className="rec-meta">{cat.label}{item.year&&` · ${item.year}`}{item.genre&&` · ${item.genre}`}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WrappedPage({allItems}){
  const total=allItems.length;
  const obsessed=allItems.filter(({item})=>item.rating==="★★★ Obsessed").length;
  const linked=allItems.filter(({item})=>item.link).length;
  const rewatched=allItems.reduce((s,{item})=>s+(item.rewatchCount||0),0);
  const catCounts=CATS.map(cat=>({cat,count:allItems.filter(({cat:c})=>c.id===cat.id).length})).sort((a,b)=>b.count-a.count);
  const topCat=catCounts[0];
  const decades={};
  allItems.forEach(({item})=>{const y=parseInt(item.year);if(y){const d=Math.floor(y/10)*10;decades[d]=(decades[d]||0)+1;}});
  const maxD=Math.max(1,...Object.values(decades));
  const sortedDecades=Object.entries(decades).sort((a,b)=>parseInt(a[0])-parseInt(b[0]));
  const decadeColors=["#E50914","#0071EB","#1DB954","#FF6B00","#9B59B6","#00BFA5","#F5C518"];
  return(
    <div className="wrapped-page">
      <div className="wrapped-hero">
        <div className="wrapped-title">YOUR WRAPPED</div>
        <div className="wrapped-sub">Everything you love, by the numbers</div>
      </div>
      <div className="wrapped-grid">
        <div className="wrapped-card"><div className="wc-num">{total}</div><div className="wc-lbl">Total Favourites</div></div>
        <div className="wrapped-card"><div className="wc-num">{obsessed}</div><div className="wc-lbl">Obsessed</div></div>
        <div className="wrapped-card"><div className="wc-num">{rewatched}</div><div className="wc-lbl">Rewatches</div></div>
        <div className="wrapped-card"><div className="wc-num">{linked}</div><div className="wc-lbl">Links Saved</div></div>
        {topCat?.count>0&&<div className="wrapped-card"><div className="wc-num">{topCat.cat.icon}</div><div className="wc-lbl">Top Category</div><div className="wc-sub">{topCat.cat.label} · {topCat.count}</div></div>}
      </div>
      <div className="wrapped-section">
        <div className="ws-title">📊 By Category</div>
        {catCounts.filter(({count})=>count>0).map(({cat,count},i)=>(
          <div key={cat.id} className="decade-row">
            <div className="decade-top"><span>{cat.icon} {cat.label}</span><span style={{color:"var(--accent)"}}>{count}</span></div>
            <div className="decade-bar-bg"><div className="decade-bar-fill" style={{width:`${(count/catCounts[0].count)*100}%`,background:cat.color}}/></div>
          </div>
        ))}
      </div>
      {sortedDecades.length>0&&(
        <div className="wrapped-section">
          <div className="ws-title">🕰️ Taste Through Decades</div>
          {sortedDecades.map(([d,count],i)=>(
            <div key={d} className="decade-row">
              <div className="decade-top"><span>{d}s</span><span style={{color:"var(--accent)"}}>{count}</span></div>
              <div className="decade-bar-bg"><div className="decade-bar-fill" style={{width:`${(count/maxD)*100}%`,background:decadeColors[i%decadeColors.length]}}/></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuotesPage({allItems}){
  const quotes=allItems.filter(({item})=>item.tagline&&!item.private).map(({item,cat})=>({text:item.tagline,source:item.name,cat}));
  const [heroIdx]=useState(()=>Math.floor(Math.random()*Math.max(1,quotes.length)));
  const hero=quotes[heroIdx%quotes.length];
  return(
    <div className="quotes-page">
      {hero&&(
        <div className="quote-hero">
          <div className="quote-big-mark">"</div>
          <div className="quote-text">"{hero.text}"</div>
          <div className="quote-src">— <b>{hero.source}</b></div>
        </div>
      )}
      {quotes.length===0&&<div style={{textAlign:"center",color:"var(--t3)",paddingTop:40}}>No quotes saved yet. Add taglines to your items!</div>}
      <div className="quotes-grid">
        {quotes.map((q,i)=>(
          <div key={i} className="qcard" style={{borderLeftColor:q.cat.color}}>
            <div className="qcard-text">"{q.text}"</div>
            <div className="qcard-src">{q.cat.icon} {q.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuggestsPage({allItems}){
  const [results,setResults]=useState([]);const [loading,setLoading]=useState(false);const [done,setDone]=useState(false);
  const fetch_=async()=>{
    setLoading(true);
    try{const r=await aiSuggest(allItems);setResults(r);setDone(true);}
    catch{setResults([]);}
    finally{setLoading(false);}
  };
  return(
    <div className="suggests-page">
      <div className="sugg-hero">
        <div className="sugg-title">YOU MIGHT LIKE</div>
        <div className="sugg-sub">AI picks based on your vault</div>
        {!done&&<button className="sugg-btn" disabled={loading} onClick={fetch_}>{loading?<><span className="ai-spin"><i/><i/><i/></span> Thinking…</>:"✨ Generate Suggestions"}</button>}
        {done&&<button className="sugg-btn" onClick={()=>{setDone(false);setResults([]);}}>↺ Regenerate</button>}
      </div>
      {results.length>0&&(
        <div className="sugg-grid">
          {results.map((r,i)=>{const cat=CATS.find(c=>c.id===r.category)||CATS[0];return(
            <div key={i} className="sugg-card">
              <div className="sugg-cat" style={{color:cat.color}}>{cat.icon} {cat.label}</div>
              <div className="sugg-name">{r.name}</div>
              {r.year&&<div className="sugg-year">{r.year}</div>}
              <div className="sugg-reason">{r.reason}</div>
            </div>
          );})}
        </div>
      )}
    </div>
  );
}

function ThemeModal({current,onSelect,onClose}){
  return(
    <div className="modal-bg" onClick={e=>{if(e.target.classList.contains("modal-bg")) onClose();}}>
      <div className="modal-box" style={{maxWidth:400}}>
        <div className="mhdr"><div className="mtitle">THEMES</div><button className="mclose" onClick={onClose}>×</button></div>
        <div className="theme-grid">
          {Object.entries(THEMES).map(([id,th])=>(
            <div key={id} className={`theme-opt${current===id?" on":""}`} onClick={()=>onSelect(id)}>
              <div className="theme-dot" style={{background:th.accent}}/>
              <div className="theme-name">{th.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditModal({cat,edit,onClose,onSave}){
  const [form,setForm]=useState({name:"",genre:"",year:"",description:"",tagline:"",fact:"",image:"",link:"",trailerUrl:"",soundtrack:"",rating:"",notes:"",...(edit||{})});
  const [aiStatus,setAiStatus]=useState(null);const [aiLoading,setAiLoading]=useState(false);
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const doAI=async()=>{
    if(!form.name.trim()) return;
    setAiLoading(true);setAiStatus({type:"loading",msg:"Searching…"});
    try{
      const r=await aiFill(form.name,cat.label,m=>setAiStatus({type:"loading",msg:m}));
      setForm(f=>({...f,description:r.description||f.description,genre:r.genre||f.genre,year:r.year||f.year,fact:r.fact||f.fact,tagline:r.tagline||f.tagline,image:r.imageUrl||f.image,link:r.link||f.link,trailerUrl:r.trailerUrl||f.trailerUrl,soundtrack:r.soundtrack||f.soundtrack}));
      setAiStatus({type:"ok",msg:"✅ Filled!"});
    }catch(e){setAiStatus({type:"err",msg:`⚠ ${e.message}`});}
    finally{setAiLoading(false);}
  };
  const submit=()=>{if(!form.name.trim()) return;onSave(form);};
  return(
    <div className="modal-bg" onClick={e=>{if(e.target.classList.contains("modal-bg")) onClose();}}>
      <div className="modal-box wide">
        <div className="mhdr">
          <div className="mtitle">{edit?"EDIT":"ADD"} · {cat.label.toUpperCase()}</div>
          <button className="mclose" onClick={onClose}>×</button>
        </div>
        <div className="fg"><label className="fl">Name *</label><input className="fi" value={form.name} onChange={set("name")} placeholder={`${cat.label} name…`}/></div>
        <div className="ai-bar">
          <span className="ai-icon">✦</span>
          <div className="ai-text"><div className="ai-title">AI Auto-Fill</div><div className="ai-sub">Fills all fields + cover via Claude AI</div></div>
          <button className="ai-btn" disabled={aiLoading||!form.name.trim()} onClick={doAI}>{aiLoading?<span className="ai-spin"><i/><i/><i/></span>:"Auto Fill ✨"}</button>
        </div>
        {aiStatus&&<div className={`ai-status ${aiStatus.type}`}>{aiStatus.msg}</div>}
        <div className="two">
          <div className="fg"><label className="fl">Genre</label><input className="fi" value={form.genre} onChange={set("genre")} placeholder="Drama, Action…"/></div>
          <div className="fg"><label className="fl">Year</label><input className="fi" value={form.year} onChange={set("year")} placeholder="2024"/></div>
        </div>
        <div className="fg"><label className="fl">Tagline / Quote</label><input className="fi" value={form.tagline} onChange={set("tagline")} placeholder="Most famous line…"/></div>
        <div className="fg"><label className="fl">Description</label><textarea className="ft" value={form.description} onChange={set("description")} placeholder="Why you love it…"/></div>
        <div className="fg"><label className="fl">Fun Fact</label><input className="fi" value={form.fact} onChange={set("fact")} placeholder="One surprising fact…"/></div>
        <div className="fg"><label className="fl">Personal Notes (owner only)</label><textarea className="ft" style={{minHeight:56}} value={form.notes} onChange={set("notes")} placeholder="Your private thoughts…"/></div>
        <div className="fg"><label className="fl">Soundtrack Link</label><input className="fi" value={form.soundtrack} onChange={set("soundtrack")} placeholder="Spotify or YouTube link to theme…"/></div>
        <div className="fg"><label className="fl">Trailer URL (YouTube embed)</label><input className="fi" value={form.trailerUrl} onChange={set("trailerUrl")} placeholder="https://www.youtube.com/embed/…"/></div>
        <div className="fg"><label className="fl">Link</label><input className="fi" value={form.link} onChange={set("link")} placeholder="https://…"/></div>
        <div className="fg">
          <label className="fl">Cover Image URL</label>
          <input className="fi" value={form.image} onChange={set("image")} placeholder="Direct .jpg / .png / .webp URL…"/>
          {form.image&&<div className="img-prev"><div className="img-prev-thumb">{form.image&&<img src={form.image} alt="" onError={e=>e.target.style.display="none"}/>}</div><div className="img-prev-note">Preview — if blank, URL may be invalid</div></div>}
        </div>
        <div className="fg">
          <label className="fl">Rating</label>
          <div className="rrow">{RATINGS.map(r=><div key={r} className={`ropt${form.rating===r?" on":""}`} onClick={()=>setForm(f=>({...f,rating:r}))}>{r}</div>)}</div>
        </div>
        <div className="mftr">
          <button className="mc" onClick={onClose}>Cancel</button>
          <button className="ms" disabled={!form.name.trim()} onClick={submit}>{edit?"Save Changes →":"Add →"}</button>
        </div>
      </div>
    </div>
  );
}

function Detail({item,cat,isOwner,onClose,onEdit,onDelete,onRewatch}){
  const [showTrailer,setShowTrailer]=useState(false);
  useEffect(()=>{ const fn=e=>{if(e.key==="Escape") onClose();}; document.addEventListener("keydown",fn); return()=>document.removeEventListener("keydown",fn); },[]);
  return(
    <>
      <div className="det-bg" onClick={onClose}/>
      <div className="det-box">
        <div className="det-hero">
          {item.image&&!showTrailer&&<div className="det-hero-img" style={{backgroundImage:`url(${item.image})`}}/>}
          {!showTrailer&&<div className="det-hero-grad"/>}
          {showTrailer&&item.trailerUrl&&<div className="det-trailer"><iframe src={item.trailerUrl+"?autoplay=1"} allow="autoplay; fullscreen" allowFullScreen/></div>}
          <div className="det-poster">{cat.icon}{item.image&&<img src={item.image} alt="" onError={e=>e.target.style.display="none"}/>}</div>
          <div className="det-actions">
            {item.trailerUrl&&<button className="det-x" title="Toggle Trailer" onClick={()=>setShowTrailer(s=>!s)}>{showTrailer?"⬛":"▶"}</button>}
            <button className="det-x" onClick={onClose}>×</button>
          </div>
          {item.trailerUrl&&!showTrailer&&<button className="det-play-btn" onClick={()=>setShowTrailer(true)}>▶ Watch Trailer</button>}
        </div>
        <div className="det-body">
          <div className="det-cat-lbl" style={{background:cat.color}}>{cat.icon} {cat.label}</div>
          <div className="det-name">{item.name}</div>
          <div className="det-chips">
            {item.year&&<span className="chip chip-y">{item.year}</span>}
            {item.genre&&<span className="chip">{item.genre}</span>}
            {item.rating&&<span className="chip chip-r">{item.rating}</span>}
            {item.private&&isOwner&&<span className="chip" style={{background:"rgba(255,200,0,.1)",color:"var(--gold)",border:"1px solid rgba(255,200,0,.2)"}}>🔒 Private</span>}
          </div>
          {item.tagline&&<div className="det-tagline">"{item.tagline}"</div>}
          {item.description&&<div className="det-desc">{item.description}</div>}
          {item.fact&&<div className="det-box-sec" style={{borderLeft:"3px solid var(--accent)"}}>
            <span className="det-sec-h green">FUN FACT</span>
            <div className="det-fact-txt">{item.fact}</div>
          </div>}
          {isOwner&&item.notes&&<div className="det-box-sec" style={{borderLeft:"3px solid var(--gold)"}}>
            <span className="det-sec-h gold">MY NOTES</span>
            <div className="det-notes-txt">{item.notes}</div>
          </div>}
          <div className="det-box-sec" style={{borderLeft:"3px solid #0071EB"}}>
            <span className="det-sec-h blue">REWATCH COUNT</span>
            <div className="det-rw-row">
              <div className="det-rw-num">{item.rewatchCount||0}</div>
              <div className="det-rw-info"><div className="det-rw-lbl">Times Rewatched</div></div>
              {isOwner&&<button className="det-rw-btn" onClick={()=>onRewatch(item.id,cat.id)}>▶ +1 Rewatch</button>}
            </div>
          </div>
          {item.soundtrack&&<div className="det-box-sec" style={{borderLeft:"3px solid var(--accent)"}}>
            <span className="det-sec-h green">SOUNDTRACK</span>
            <div className="det-st-row">
              <span className="det-st-ico">🎵</span>
              <a className="det-st-link" href={item.soundtrack} target="_blank" rel="noreferrer">{item.soundtrack}</a>
            </div>
          </div>}
        </div>
        <div className="det-footer">
          {item.link&&<a className="det-btn det-btn-w" href={item.link} target="_blank" rel="noreferrer">🔗 Open</a>}
          {isOwner&&<button className="det-btn det-btn-g" onClick={()=>onEdit(item)}>✏ Edit</button>}
          {isOwner&&<button className="det-btn det-btn-d" onClick={()=>{if(window.confirm("Remove?")) onDelete(item.id,cat.id);}}>🗑 Delete</button>}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════ APP ═══════════════════ */
export default function App(){
  const [data,setData]       = useState({});
  const [loading,setLoading] = useState(true);
  const [saving,setSaving]   = useState(false);
  const [isOwner,setIsOwner] = useState(()=>checkUrlOwner());
  const [theme,setTheme]     = useState(()=>localStorage.getItem(THEME_KEY)||"spotify");
  const [view,setView]       = useState("rows");
  const [showAdd,setShowAdd] = useState(false);
  const [addCat,setAddCat]   = useState(null);
  const [editItem,setEditItem]= useState(null);
  const [detail,setDetail]   = useState(null);
  const [toast,setToast]     = useState(null);
  const [scrolled,setScrolled]= useState(false);
  const [spotTop,setSpotTop] = useState(null);
  const [showTheme,setShowTheme]=useState(false);
  const toastTimer=useRef();const saveTimer=useRef();

  /* favicon + title */
  useEffect(()=>{
    document.querySelectorAll("link[rel*='icon']").forEach(el=>el.remove());
    const lnk=document.createElement("link");lnk.rel="icon";lnk.type="image/png";
    lnk.href=`data:image/png;base64,${FAVICON_B64}`;document.head.appendChild(lnk);
    document.title="Shubham.World";
  },[]);

  /* load from Gist */
  useEffect(()=>{
    gistRead().then(d=>{setData(d||{});setLoading(false);}).catch(()=>{setLoading(false);showT("Could not load vault","⚠️");});
  },[]);

  /* auto-save to Gist */
  useEffect(()=>{
    if(!isOwner||loading) return;
    clearTimeout(saveTimer.current);setSaving(true);
    saveTimer.current=setTimeout(()=>{
      gistWrite(data).then(()=>setSaving(false)).catch(()=>{setSaving(false);showT("Save failed","⚠️");});
    },1400);
  },[data]);

  useEffect(()=>{ const fn=()=>setScrolled(window.scrollY>60); window.addEventListener("scroll",fn); return()=>window.removeEventListener("scroll",fn); },[]);

  const showT=(m,e="✅")=>{setToast({msg:m,emoji:e});clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(null),2600);};
  const lockOwner=()=>{localStorage.removeItem(OWNER_LS_KEY);setIsOwner(false);showT("Vault locked","🔒");};
  const changeTheme=id=>{setTheme(id);localStorage.setItem(THEME_KEY,id);setShowTheme(false);};

  const items    = id => data[id]||[];
  const allItems = CATS.flatMap(cat=>items(cat.id).map(item=>({item,cat})));
  const total    = allItems.length;
  const linked   = allItems.filter(({item})=>item.link).length;
  const obsessed = allItems.filter(({item})=>item.rating==="★★★ Obsessed").length;
  const tops     = allItems.filter(({item})=>!item.private).map(({item,cat})=>({item,cat,sc:score(item,items(cat.id).indexOf(item))})).sort((a,b)=>b.sc-a.sc).slice(0,5);
  const bgUrl    = spotTop?.item?.image||tops[0]?.item?.image||null;
  const glows    = tops.slice(0,5).map((t,i)=>{const p=[{top:"-10%",left:"-5%"},{top:"-8%",right:"-5%"},{top:"25%",left:"40%"},{bottom:0,right:"5%"},{bottom:0,left:"5%"}];return{color:t.cat.color,pos:p[i]};});

  const openAdd  = cat        =>{setAddCat(cat);setEditItem(null);setShowAdd(true);};
  const openEdit = (item,cat) =>{setAddCat(cat);setEditItem(item);setShowAdd(true);};
  const openDet  = (item,cat) =>{setDetail({item,cat});};

  const handleSave=vals=>{
    if(editItem){
      setData(d=>({...d,[addCat.id]:(d[addCat.id]||[]).map(i=>i.id===editItem.id?{...i,...vals}:i)}));
      showT(`"${vals.name}" updated!`,"💾");
    } else {
      const newItem={...vals,id:Date.now().toString(),rewatchCount:0,addedAt:new Date().toISOString()};
      setData(d=>({...d,[addCat.id]:[...(d[addCat.id]||[]),newItem]}));
      showT(`"${vals.name}" added!`,addCat.icon);
      if(vals.rating==="★★★ Obsessed") setTimeout(fireConfetti,200);
    }
    setShowAdd(false);setEditItem(null);
  };

  const handleDelete=(id,catId)=>{
    const cid=catId||CATS.find(c=>items(c.id).some(i=>i.id===id))?.id;
    if(!cid) return;
    setData(d=>({...d,[cid]:(d[cid]||[]).filter(i=>i.id!==id)}));
    setDetail(null);showT("Removed","🗑");
  };

  const handleTogglePrivate=(id,catId)=>{
    const cid=catId||CATS.find(c=>items(c.id).some(i=>i.id===id))?.id;
    if(!cid) return;
    let nowPrivate=false;
    setData(d=>({...d,[cid]:(d[cid]||[]).map(i=>{if(i.id!==id) return i;nowPrivate=!i.private;return{...i,private:!i.private};})}));
    setTimeout(()=>showT(nowPrivate?"Hidden from public 🔒":"Now public 🌐",""),50);
  };

  const handleRewatch=(id,catId)=>{
    const cid=catId||CATS.find(c=>items(c.id).some(i=>i.id===id))?.id;
    if(!cid) return;
    setData(d=>({...d,[cid]:(d[cid]||[]).map(i=>i.id===id?{...i,rewatchCount:(i.rewatchCount||0)+1}:i)}));
    showT("Rewatch logged! ▶","🎬");
  };

  const CSS=buildCSS(theme);

  if(loading) return(
    <>
      <style>{CSS}</style>
      <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,background:THEMES[theme].bg}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:".1em",color:THEMES[theme].accent}}>SHUBHAM.WORLD</div>
        <div className="ai-spin"><i/><i/><i/></div>
      </div>
    </>
  );

  const VIEWS=[{id:"rows",label:"Rows"},{id:"moodboard",label:"Poster Wall"},{id:"recommends",label:"Recommends"},{id:"quotes",label:"Quotes"},{id:"wrapped",label:"Wrapped"},{id:"suggests",label:"You Might Like"}];

  return(
    <>
      <style>{CSS}</style>
      <div className="bg-root">
        {bgUrl&&<div className="bg-img" style={{backgroundImage:`url(${bgUrl})`}}/>}
        <div className="bg-glows">{glows.map((g,i)=><div key={i} className="bg-glow" style={{background:g.color,width:"45vw",height:"40vh",...g.pos}}/>)}</div>
        <div className="bg-darken"/>
      </div>

      <nav className={`nav ${scrolled?"stuck":""}`}>
        <div className="logo">
          <div className={`logo-dot${isOwner?" owner-on":""}`} onClick={isOwner?lockOwner:undefined} title={isOwner?"Click to lock":""}/>
          SHUBHAM.WORLD
          {saving&&<span style={{fontSize:10,color:"var(--accent)",marginLeft:6,opacity:.7}}>saving…</span>}
        </div>
        <div className="nav-r">
          <SearchBar allItems={allItems} onSelect={openDet}/>
          <div className="nav-icon-btn" title="Change Theme" onClick={()=>setShowTheme(true)}>🎨</div>
          {isOwner&&<div className="owner-pill" onClick={lockOwner}>● OWNER</div>}
          <div className="nav-avatar">S</div>
        </div>
      </nav>

      {view==="rows"&&(
        <>
          <Spotlight tops={tops} isOwner={isOwner} onOpen={openDet} onAdd={()=>openAdd(CATS[0])} onSpotChange={t=>setSpotTop(t)}/>
          {total>0&&(
            <div className="stats-bar">
              <div className="stat-item"><span className="stat-num">{total}</span><span className="stat-lbl">Favourites</span></div>
              <div className="stat-div"/>
              <div className="stat-item"><span className="stat-num">{CATS.filter(c=>items(c.id).length>0).length}</span><span className="stat-lbl">Categories</span></div>
              <div className="stat-div"/>
              <div className="stat-item"><span className="stat-num">{obsessed}</span><span className="stat-lbl">Obsessed</span></div>
              <div className="stat-div"/>
              <div className="stat-item"><span className="stat-num">{linked}</span><span className="stat-lbl">Links</span></div>
            </div>
          )}
        </>
      )}

      <div className="view-tabs">
        {VIEWS.map(v=><button key={v.id} className={`vtab${view===v.id?" on":""}`} onClick={()=>setView(v.id)}>{v.label}</button>)}
      </div>

      <div className="content">
        {view==="rows"&&CATS.map(cat=><NRow key={cat.id} cat={cat} items={items(cat.id)} isOwner={isOwner} onOpen={openDet} onEdit={openEdit} onDelete={handleDelete} onAdd={()=>openAdd(cat)} onTogglePrivate={handleTogglePrivate} onRewatch={handleRewatch}/>)}
        {view==="moodboard"&&<MoodBoard allItems={allItems} isOwner={isOwner} onOpen={openDet}/>}
        {view==="recommends"&&<RecommendsPage allItems={allItems} onOpen={openDet}/>}
        {view==="quotes"&&<QuotesPage allItems={allItems}/>}
        {view==="wrapped"&&<WrappedPage allItems={allItems}/>}
        {view==="suggests"&&<SuggestsPage allItems={allItems}/>}
        <div className="site-footer">{total} favourites · {linked} links<br/><span style={{opacity:.4}}>Made with 🖤 by Shubham</span></div>
      </div>

      {detail&&<Detail item={detail.item} cat={detail.cat} isOwner={isOwner} onClose={()=>setDetail(null)} onEdit={item=>{setDetail(null);openEdit(item,detail.cat);}} onDelete={handleDelete} onRewatch={handleRewatch}/>}
      {showAdd&&addCat&&isOwner&&<EditModal cat={addCat} edit={editItem} onClose={()=>{setShowAdd(false);setEditItem(null);}} onSave={handleSave}/>}
      {showTheme&&<ThemeModal current={theme} onSelect={changeTheme} onClose={()=>setShowTheme(false)}/>}
      {toast&&<Toast msg={toast.msg} emoji={toast.emoji}/>}
    </>
  );
}