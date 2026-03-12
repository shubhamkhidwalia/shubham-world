import { useState, useEffect, useRef, useCallback } from "react";

const GFONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');`;
const FAVICON_B64 = "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";

/* ── Owner auth via secret URL ── */
const OWNER_SECRET = "shubham";
const OWNER_LS_KEY = "sw-owner-v2";
const checkUrlOwner = () => {
  const p = new URLSearchParams(window.location.search);
  const s = p.get("s");
  if (s === OWNER_SECRET) { localStorage.setItem(OWNER_LS_KEY,"true"); window.history.replaceState({},"",window.location.pathname); return true; }
  if (s === "lock") { localStorage.removeItem(OWNER_LS_KEY); window.history.replaceState({},"",window.location.pathname); return false; }
  return localStorage.getItem(OWNER_LS_KEY) === "true";
};

const CATS = [
  { id:"movies",    label:"Movies",    icon:"🎞️",  color:"#E50914" },
  { id:"shows",     label:"TV Shows",  icon:"🖥️",  color:"#0071EB" },
  { id:"songs",     label:"Music",     icon:"🎧",  color:"#1DB954" },
  { id:"articles",  label:"Articles",  icon:"🗞️",  color:"#FF6B00" },
  { id:"videos",    label:"Videos",    icon:"📹",  color:"#FF0000" },
  { id:"actors",    label:"Actors",    icon:"🎪",  color:"#9B59B6" },
  { id:"actresses", label:"Actresses", icon:"👑",  color:"#E91E63" },
  { id:"sports",    label:"Athletes",  icon:"⚡",  color:"#00BFA5" },
  { id:"habits",    label:"Habits",    icon:"🧠",  color:"#F5C518" },
];
const SHAPE = { movies:"tall",shows:"tall",songs:"sq",articles:"wide",videos:"wide",actors:"tall",actresses:"tall",sports:"tall",habits:"wide" };
const RATINGS = ["★ Liked","★★ Loved","★★★ Obsessed"];

/* ── Gist DB ── */
const gistRead  = async () => {
  const r = await fetch("/.netlify/functions/gist");
  if (!r.ok) throw new Error("Failed to load vault");
  return r.json();
};
const gistWrite = async (data) => {
  const r = await fetch("/.netlify/functions/gist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to save vault");
};

const score = (item, idx) => {
  const w = {"★★★ Obsessed":3,"★★ Loved":2,"★ Liked":1}[item.rating]||0;
  return w*10+Math.max(0,100-idx*3);
};

/* ── AI Fill ── */
const aiFill = async (name, catLabel, onStatus) => {
  onStatus?.("✨ Searching…");
  const payload = {
    model: "claude-3-haiku-20240307",
    max_tokens: 900,
    system: "Pop-culture expert. Respond ONLY with valid JSON. No markdown, no prose.",
    messages: [{ role:"user", content:`Details for: "${name}" (category: ${catLabel}). Return ONLY this JSON:
{"description":"2-3 engaging sentences","genre":"1-3 word genre","year":"4-digit year or empty","fact":"surprising fact","tagline":"famous quote under 10 words or empty","imageUrl":"real direct image URL ending .jpg .jpeg .png .webp from Wikipedia/Wikimedia/TMDb/official","link":"best URL: Wikipedia IMDb Spotify YouTube or official site"}`}]
  };
  const res = await fetch("/.netlify/functions/claude", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message||"API error");
  onStatus?.("⚡ Processing…");
  const raw   = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
  const clean = raw.replace(/```[a-z]*\n?/gi,"").replace(/```/g,"").trim();
  const hits  = [...clean.matchAll(/\{[\s\S]*?\}/g)].map(m=>m[0]).sort((a,b)=>b.length-a.length);
  for (const c of hits) { try { const o=JSON.parse(c); if(o.description||o.genre||o.imageUrl) return o; } catch{} }
  throw new Error("Could not parse response");
};
const CSS = `
${GFONTS}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--black:#000;--bg:#0d0d0d;--card:#181818;--hover:#242424;--line:#2a2a2a;--green:#1DB954;--green-h:#1ED760;--t1:#fff;--t2:#B3B3B3;--t3:#6A6A6A;--gold:#F5C518;--red:#E50914;}
html,body{background:var(--black);color:var(--t1);font-family:'DM Sans',sans-serif;overflow-x:hidden;}
::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:var(--line);border-radius:3px;}
.bg-root{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.bg-img{position:absolute;inset:-10%;background-size:cover;background-position:center;filter:blur(100px) brightness(.17) saturate(2.5);transform:scale(1.2);transition:background-image 1.5s ease;}
.bg-glows{position:absolute;inset:0;}
.bg-glow{position:absolute;border-radius:50%;filter:blur(90px);opacity:.15;transition:all 1.2s ease;}
.bg-darken{position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 50% 0%,transparent,rgba(0,0,0,.78) 100%);}
.nav{position:fixed;top:0;left:0;right:0;z-index:900;height:60px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;transition:background .4s;}
.nav.stuck{background:rgba(6,6,6,.97);border-bottom:1px solid var(--line);}
.logo{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:.1em;display:flex;align-items:center;gap:8px;user-select:none;position:relative;z-index:1;}
.logo-dot{width:10px;height:10px;border-radius:50%;background:var(--green);animation:gpulse 2.4s ease-in-out infinite;flex-shrink:0;}
.logo-dot.owner-on{cursor:pointer;background:#fff;animation:none;box-shadow:0 0 0 3px var(--green);}
@keyframes gpulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(29,185,84,.4)}50%{transform:scale(1.3);box-shadow:0 0 0 6px rgba(29,185,84,0)}}
.nav-r{display:flex;align-items:center;gap:10px;position:relative;z-index:1;}
.owner-pill{padding:4px 14px;border-radius:100px;background:var(--green);color:#000;font-size:11px;font-weight:800;letter-spacing:.06em;cursor:pointer;transition:background .2s;}
.owner-pill:hover{background:var(--green-h);}
.nav-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#1DB954,#157040);font-family:'Bebas Neue',sans-serif;font-size:17px;color:#000;display:flex;align-items:center;justify-content:center;}
.nav-search{position:relative;display:flex;align-items:center;}
.nav-search-input{background:rgba(255,255,255,.08);border:1px solid var(--line);border-radius:100px;padding:7px 16px 7px 36px;font-size:12px;color:#fff;font-family:'DM Sans',sans-serif;outline:none;width:190px;transition:all .25s;}
.nav-search-input:focus{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.25);width:240px;}
.nav-search-input::placeholder{color:var(--t3);}
.nav-search-icon{position:absolute;left:12px;font-size:13px;color:var(--t3);pointer-events:none;}
.nav-search-clear{position:absolute;right:10px;background:none;border:none;color:var(--t3);font-size:14px;cursor:pointer;line-height:1;padding:0;}
.nav-search-clear:hover{color:#fff;}
.search-drop{position:absolute;top:calc(100% + 8px);left:0;right:0;background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.9);z-index:999;max-height:360px;overflow-y:auto;}
.search-item{display:flex;align-items:center;gap:12px;padding:10px 14px;cursor:pointer;transition:background .15s;border-bottom:1px solid var(--line);}
.search-item:last-child{border-bottom:none;}.search-item:hover{background:var(--hover);}
.search-thumb{width:38px;height:38px;border-radius:5px;background:var(--hover);flex-shrink:0;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;font-size:16px;}
.search-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.search-info{flex:1;min-width:0;}
.search-name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.search-meta{font-size:11px;color:var(--t3);display:flex;gap:6px;align-items:center;margin-top:2px;}
.sdot2{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.search-empty{padding:20px;text-align:center;color:var(--t3);font-size:13px;}
.spot{height:100svh;min-height:600px;position:relative;overflow:hidden;}
.spot-cover-bg{position:absolute;inset:0;background-size:cover;background-position:center 20%;filter:blur(2px) brightness(.32) saturate(1.5);transform:scale(1.06);transition:background-image .9s ease;z-index:0;}
.spot-grad{position:absolute;inset:0;z-index:1;background:linear-gradient(to right,rgba(0,0,0,.9) 0%,rgba(0,0,0,.5) 52%,rgba(0,0,0,.06) 100%),linear-gradient(to top,rgba(0,0,0,.97) 0%,transparent 52%),linear-gradient(to bottom,rgba(0,0,0,.45) 0%,transparent 22%);}
.spot-body{position:relative;z-index:2;height:100%;display:flex;align-items:center;padding:80px 60px 60px;gap:60px;}
.spot-left{flex:1;max-width:620px;}
.spot-kicker{display:flex;align-items:center;gap:10px;margin-bottom:20px;}
.spot-cat-tag{padding:5px 14px;border-radius:4px;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#000;}
.spot-hot-tag{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:4px;background:rgba(29,185,84,.12);border:1px solid rgba(29,185,84,.4);font-size:10px;font-weight:800;letter-spacing:.08em;color:var(--green);}
.spot-live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:gpulse 1.8s ease infinite;}
.spot-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(52px,8.5vw,108px);line-height:.88;letter-spacing:.02em;margin-bottom:18px;text-shadow:0 2px 30px rgba(0,0,0,.9);animation:sIn .44s cubic-bezier(.22,.61,.36,1) both;}
@keyframes sIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.spot-meta{display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap;}
.spot-year{font-size:13px;font-weight:700;color:var(--gold);}
.spot-genre{padding:3px 10px;border-radius:3px;background:rgba(255,255,255,.1);font-size:12px;font-weight:600;color:var(--t2);}
.spot-rb{font-size:13px;color:var(--gold);}
.spot-sep{width:3px;height:3px;border-radius:50%;background:var(--t3);}
.spot-tagline{font-size:14px;font-style:italic;color:var(--green);border-left:2px solid var(--green);padding-left:14px;margin-bottom:18px;line-height:1.55;animation:sIn .44s .08s cubic-bezier(.22,.61,.36,1) both;}
.spot-desc{font-size:15px;color:var(--t2);line-height:1.65;max-width:500px;margin-bottom:32px;animation:sIn .44s .14s cubic-bezier(.22,.61,.36,1) both;}
.spot-btns{display:flex;gap:12px;flex-wrap:wrap;animation:sIn .44s .19s cubic-bezier(.22,.61,.36,1) both;}
.sp-btn-w{padding:13px 28px;border-radius:100px;border:none;background:#fff;color:#000;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:8px;transition:all .2s;cursor:pointer;}
.sp-btn-w:hover{background:#e8e8e8;transform:scale(1.03);}
.sp-btn-g{padding:13px 28px;border-radius:100px;background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.15);font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:8px;transition:all .2s;text-decoration:none;cursor:pointer;}
.sp-btn-g:hover{background:rgba(255,255,255,.22);}
.spot-bottom{position:absolute;bottom:0;left:0;right:0;z-index:3;padding:0 60px 36px;display:flex;align-items:flex-end;justify-content:space-between;}
.spot-dots{display:flex;gap:8px;align-items:center;}
.sdot{cursor:pointer;border-radius:100px;height:3px;background:rgba(255,255,255,.22);transition:all .3s;overflow:hidden;position:relative;}
.sdot.sm{width:24px;}.sdot.act{width:52px;}
.sdot-fill{position:absolute;inset:0;background:var(--green);transform:scaleX(0);transform-origin:left;}
.sdot.act .sdot-fill{animation:sfill 6s linear forwards;}
@keyframes sfill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.spot-navs{display:flex;gap:8px;}
.spot-nav{width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s;cursor:pointer;}
.spot-nav:hover{background:rgba(255,255,255,.2);}
.spot-right{flex-shrink:0;}
.spot-poster{width:clamp(155px,16vw,240px);height:clamp(232px,24vw,360px);border-radius:16px;overflow:hidden;background:var(--card);display:flex;align-items:center;justify-content:center;font-size:60px;box-shadow:0 30px 90px rgba(0,0,0,.95),0 0 0 1px rgba(255,255,255,.1);animation:pIn .58s .15s cubic-bezier(.22,.61,.36,1) both;position:relative;}
@keyframes pIn{from{opacity:0;transform:translateX(26px) scale(.95)}to{opacity:1;transform:none}}
.spot-poster img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;}
.spot-empty{height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;position:relative;z-index:2;}
.spot-empty-h{font-family:'Bebas Neue',sans-serif;font-size:42px;letter-spacing:.06em;color:var(--t3);}
.spot-empty-s{font-size:14px;color:var(--t3);}
.stats-bar{background:rgba(255,255,255,.02);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:14px 36px;display:flex;align-items:center;gap:32px;overflow-x:auto;position:relative;z-index:2;}
.stats-bar::-webkit-scrollbar{display:none;}
.stat-item{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.stat-num{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:.04em;color:var(--green);}
.stat-lbl{font-size:11px;color:var(--t3);font-weight:600;letter-spacing:.06em;text-transform:uppercase;}
.stat-div{width:1px;height:28px;background:var(--line);flex-shrink:0;}
.content{background:transparent;padding-bottom:80px;position:relative;z-index:2;}
.nrow{padding-top:28px;}
.nrow-hdr{display:flex;align-items:center;justify-content:space-between;padding:0 28px 12px;}
.nrow-left{display:flex;align-items:center;gap:12px;}
.nrow-title{font-size:20px;font-weight:700;}
.nrow-count{font-size:11px;font-weight:700;padding:2px 9px;border-radius:100px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--t3);}
.nrow-right{display:flex;align-items:center;gap:8px;}
.nrow-sort{font-size:11px;font-weight:700;color:var(--t3);background:none;border:none;font-family:'DM Sans',sans-serif;cursor:pointer;padding:4px 10px;border-radius:100px;transition:all .2s;}
.nrow-sort:hover,.nrow-sort.on{color:#fff;background:rgba(255,255,255,.09);}
.nrow-add-btn{font-size:12px;font-weight:700;color:var(--t2);background:none;border:none;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:5px;transition:all .2s;cursor:pointer;}
.nrow-add-btn:hover{color:#fff;gap:8px;}
.nrow-wrap{position:relative;}
.nrow-track{display:flex;gap:0;padding:4px 28px 32px;overflow-x:auto;overflow-y:visible;scroll-behavior:smooth;scrollbar-width:none;-webkit-overflow-scrolling:touch;align-items:flex-end;}
.nrow-track::-webkit-scrollbar{display:none;}
.nrow-wrap::before,.nrow-wrap::after{content:'';position:absolute;top:0;bottom:0;width:80px;z-index:4;pointer-events:none;opacity:0;transition:opacity .3s;}
.nrow-wrap::before{left:0;background:linear-gradient(to right,rgba(0,0,0,.95),transparent);}
.nrow-wrap::after{right:0;background:linear-gradient(to left,rgba(0,0,0,.95),transparent);}
.nrow-wrap:hover::before,.nrow-wrap:hover::after{opacity:1;}
.narr{position:absolute;top:50%;transform:translateY(-65%);width:36px;height:72px;border-radius:4px;z-index:5;background:rgba(6,6,6,.95);border:1px solid rgba(255,255,255,.12);color:#fff;font-size:22px;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:all .2s;cursor:pointer;}
.nrow-wrap:hover .narr{opacity:1;pointer-events:all;}.narr:hover{background:rgba(40,40,40,.98);}
.narr-l{left:0;}.narr-r{right:0;}
.nrow-empty{padding:2px 28px 28px;font-size:13px;color:var(--t3);}
.rcard-wrap{display:flex;align-items:flex-end;flex-shrink:0;margin-right:10px;}
.rcard-num{font-family:'Bebas Neue',sans-serif;font-size:112px;line-height:.82;letter-spacing:-4px;color:transparent;-webkit-text-stroke:2.5px rgba(155,155,155,.36);user-select:none;flex-shrink:0;margin-right:-22px;position:relative;z-index:0;}
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
.nc-real-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;z-index:1;}
.nc-star{position:absolute;top:6px;right:6px;background:rgba(0,0,0,.85);border-radius:3px;padding:2px 6px;font-size:10px;font-weight:800;color:var(--gold);opacity:0;transition:opacity .2s;z-index:2;}
.nc:hover .nc-star{opacity:1;}
.nc-panel{position:absolute;top:100%;left:0;right:0;background:var(--hover);border-radius:0 0 6px 6px;padding:12px 11px 10px;opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity .18s,transform .18s;z-index:7;min-width:140px;box-shadow:0 20px 40px rgba(0,0,0,.8);}
.nc:hover .nc-panel{opacity:1;transform:none;pointer-events:all;}
.nc-panel-title{font-size:12px;font-weight:700;line-height:1.25;margin-bottom:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.nc-panel-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:9px;}
.npm-yr{font-size:11px;font-weight:700;color:var(--green);}
.npm-g{font-size:10px;color:var(--t2);background:rgba(255,255,255,.08);padding:2px 7px;border-radius:3px;}
.npm-dot{width:3px;height:3px;border-radius:50%;background:var(--t3);}
.nc-panel-btns{display:flex;gap:5px;}
.npb{height:28px;border-radius:100px;border:none;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:4px;transition:all .15s;cursor:pointer;}
.npb-play{background:#fff;color:#000;flex:1;}.npb-play:hover{background:#e8e8e8;}
.npb-more{background:rgba(255,255,255,.14);color:#fff;width:28px;flex:none;}.npb-more:hover{background:rgba(255,255,255,.28);}
.npb-edit{background:rgba(255,255,255,.08);color:var(--t2);width:28px;flex:none;}.npb-edit:hover{background:rgba(245,197,24,.2);color:var(--gold);}
.npb-del{background:rgba(255,255,255,.08);color:var(--t2);width:28px;flex:none;}.npb-del:hover{background:rgba(229,9,20,.2);color:#ff5555;}
.nc-label{padding:6px 2px 0;font-size:11px;font-weight:500;color:var(--t2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity .15s;}
.nc:hover .nc-label{opacity:0;}
.nc-add{flex-shrink:0;border:1.5px dashed var(--line);border-radius:6px;background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--t3);transition:all .25s;cursor:pointer;}
.nc-add:hover{border-color:var(--green);color:var(--green);background:rgba(29,185,84,.04);}
.nc-add.tall{width:130px;height:195px;}.nc-add.sq{width:155px;height:155px;}.nc-add.wide{width:230px;height:130px;}
.nc-add-plus{font-size:28px;line-height:1;transition:transform .35s cubic-bezier(.34,1.56,.64,1);}
.nc-add:hover .nc-add-plus{transform:rotate(90deg) scale(1.1);}
.nc-add-lbl{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;}
.det-bg{position:fixed;inset:0;z-index:950;background:rgba(0,0,0,.88);animation:fadeIn .18s ease;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.det-box{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:951;width:min(860px,95vw);max-height:90vh;background:var(--card);border:1px solid rgba(255,255,255,.1);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;animation:bPop .26s cubic-bezier(.34,1.56,.64,1);}
@keyframes bPop{from{transform:translate(-50%,-50%) scale(.94);opacity:0}to{transform:translate(-50%,-50%) scale(1);opacity:1}}
.det-hero{height:300px;position:relative;overflow:hidden;flex-shrink:0;background:var(--hover);}
.det-hero-img{position:absolute;inset:0;background-size:cover;background-position:center 20%;filter:blur(1px) brightness(.35) saturate(1.6);transform:scale(1.05);}
.det-hero-grad{position:absolute;inset:0;background:linear-gradient(to right,rgba(24,24,24,.92),rgba(24,24,24,.45) 55%,rgba(24,24,24,.08)),linear-gradient(to top,var(--card),transparent 65%);}
.det-poster{position:absolute;left:36px;bottom:0;width:140px;height:210px;border-radius:8px 8px 0 0;overflow:hidden;background:var(--hover);box-shadow:0 -20px 60px rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;font-size:52px;}
.det-poster img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;}
.det-actions{position:absolute;top:14px;right:14px;display:flex;gap:8px;z-index:3;}
.det-x{width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.7);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .2s;cursor:pointer;}
.det-x:hover{background:rgba(229,9,20,.5);}
.det-body{padding:20px 36px 24px 200px;overflow-y:auto;flex:1;}
.det-cat-lbl{display:inline-block;padding:4px 14px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#000;margin-bottom:12px;}
.det-name{font-family:'Bebas Neue',sans-serif;font-size:clamp(30px,5vw,52px);letter-spacing:.02em;line-height:.92;margin-bottom:14px;}
.det-imdb-row{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap;}
.imdb-box{background:var(--gold);color:#000;font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:.1em;padding:3px 10px;border-radius:4px;}
.imdb-stars{font-size:14px;color:var(--gold);}.imdb-lbl{font-size:12px;color:var(--t3);}
.det-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}
.chip{padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;background:rgba(255,255,255,.08);color:var(--t2);}
.chip-y{background:rgba(245,197,24,.1);color:var(--gold);border:1px solid rgba(245,197,24,.2);}
.det-tagline{font-size:14px;font-style:italic;color:var(--green);border-left:2px solid var(--green);padding-left:12px;margin-bottom:14px;line-height:1.55;}
.det-desc{font-size:14px;color:var(--t2);line-height:1.75;margin-bottom:14px;}
.det-fact{background:rgba(29,185,84,.06);border-radius:8px;padding:14px 16px;border-left:3px solid var(--green);font-size:13px;color:var(--t2);line-height:1.65;}
.det-fact-h{font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--green);margin-bottom:5px;display:block;}
.det-footer{flex-shrink:0;padding:16px 36px;border-top:1px solid var(--line);display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
.det-btn{padding:10px 22px;border-radius:100px;border:none;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px;transition:all .2s;cursor:pointer;text-decoration:none;}
.det-btn-w{background:#fff;color:#000;}.det-btn-w:hover{background:#e8e8e8;}
.det-btn-g{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.12);}.det-btn-g:hover{background:rgba(255,255,255,.2);}
.det-btn-d{background:transparent;color:var(--t3);border:1px solid var(--line);}.det-btn-d:hover{border-color:rgba(229,9,20,.4);color:#ff5555;}
.modal-bg{position:fixed;inset:0;z-index:980;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .15s ease;}
.modal-box{background:var(--card);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:36px;width:100%;max-width:500px;max-height:92vh;overflow-y:auto;animation:slideUp .2s cubic-bezier(.22,.61,.36,1);}
@keyframes slideUp{from{transform:translateY(18px);opacity:0}to{transform:none;opacity:1}}
.mhdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;}
.mtitle{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:.08em;line-height:1;}
.mclose{width:32px;height:32px;border-radius:50%;background:var(--hover);border:1px solid var(--line);color:var(--t2);font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s;cursor:pointer;}
.mclose:hover{color:#ff5555;border-color:rgba(229,9,20,.4);}
.ai-bar{background:var(--hover);border:1px solid var(--line);border-radius:8px;padding:13px 15px;display:flex;align-items:center;gap:12px;margin-bottom:4px;}
.ai-icon{font-size:20px;}.ai-text{flex:1;}
.ai-title{font-size:13px;font-weight:700;margin-bottom:2px;}
.ai-sub{font-size:11px;color:var(--t3);}
.ai-btn{padding:8px 16px;border-radius:100px;border:none;background:var(--green);color:#000;font-size:11px;font-weight:800;font-family:'DM Sans',sans-serif;letter-spacing:.04em;white-space:nowrap;transition:all .2s;flex-shrink:0;cursor:pointer;}
.ai-btn:hover:not(:disabled){background:var(--green-h);}
.ai-btn:disabled{opacity:.35;cursor:not-allowed;}
.ai-spin{display:inline-flex;gap:4px;align-items:center;}
.ai-spin i{width:5px;height:5px;border-radius:50%;background:var(--green);animation:asd .9s ease infinite;display:block;}
.ai-spin i:nth-child(2){animation-delay:.15s;}.ai-spin i:nth-child(3){animation-delay:.3s;}
@keyframes asd{0%,80%,100%{transform:scale(.55);opacity:.3}40%{transform:scale(1);opacity:1}}
.ai-status{font-size:11px;padding:5px 2px 8px;display:flex;align-items:center;gap:6px;}
.ai-status.ok{color:var(--green);}.ai-status.err{color:#ff8888;}.ai-status.loading{color:var(--t2);}
.fg{display:flex;flex-direction:column;gap:5px;margin-bottom:14px;}
.fl{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--t3);}
.fi,.ft{background:var(--hover);border:1px solid var(--line);border-radius:6px;padding:11px 14px;color:#fff;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s;width:100%;}
.fi:focus,.ft:focus{border-color:var(--green);}
.fi::placeholder,.ft::placeholder{color:rgba(255,255,255,.2);}
.ft{resize:vertical;min-height:72px;line-height:1.6;}
.two{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.rrow{display:flex;gap:8px;}
.ropt{flex:1;padding:9px 4px;text-align:center;background:var(--hover);border:1px solid var(--line);border-radius:100px;font-size:11px;font-weight:700;color:var(--t3);transition:all .2s;cursor:pointer;}
.ropt.on{background:var(--gold);color:#000;border-color:var(--gold);}
.mftr{display:flex;gap:10px;margin-top:16px;}
.mc{flex:1;padding:12px;border-radius:100px;border:1px solid var(--line);background:transparent;color:var(--t2);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;transition:all .2s;cursor:pointer;}
.mc:hover{color:#fff;}
.ms{flex:2;padding:12px;border-radius:100px;border:none;background:var(--green);color:#000;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:800;transition:all .2s;cursor:pointer;}
.ms:hover:not(:disabled){background:var(--green-h);transform:scale(1.02);}
.ms:disabled{opacity:.35;cursor:not-allowed;transform:none;}
.img-prev{display:flex;align-items:center;gap:10px;margin-top:8px;padding:10px 12px;background:rgba(255,255,255,.03);border-radius:6px;border:1px solid var(--line);}
.img-prev-thumb{width:60px;height:60px;border-radius:4px;overflow:hidden;background:var(--hover);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;position:relative;}
.img-prev-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.img-prev-note{font-size:11px;color:var(--t3);line-height:1.55;}
.img-prev-note b{color:var(--green);}.img-prev-note.err b{color:#ff8888;}
.toast{position:fixed;bottom:28px;right:28px;z-index:9999;background:var(--hover);border:1px solid rgba(255,255,255,.12);border-radius:100px;padding:12px 20px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px;animation:tpop .26s cubic-bezier(.34,1.56,.64,1);box-shadow:0 16px 40px rgba(0,0,0,.7);}
@keyframes tpop{from{transform:translateY(12px) scale(.95);opacity:0}to{transform:none;opacity:1}}
.site-footer{text-align:center;padding:40px 0 20px;color:var(--t3);font-size:12px;line-height:1.8;}
@media(max-width:900px){
  .spot-right{display:none;}.spot-body{padding:70px 22px 60px;}.spot-bottom{padding:0 22px 28px;}
  .nav{padding:0 16px;}.nav-search-input{width:140px;}.nav-search-input:focus{width:180px;}
  .nrow-hdr,.nrow-empty{padding-left:16px;padding-right:16px;}.nrow-track{padding-left:16px;padding-right:16px;}
  .det-body{padding:16px 20px 20px;}.det-poster{display:none;}.det-footer{padding:14px 20px;}
  .modal-box{padding:22px;}.two{grid-template-columns:1fr;}.stats-bar{padding:12px 16px;gap:20px;}
  .rcard-num{font-size:80px;letter-spacing:-2px;}
}
@media(max-width:500px){
  .spot-title{font-size:44px;}.sp-btn-w,.sp-btn-g{padding:11px 20px;font-size:13px;}
  .nav-search{display:none;}.rcard-num{font-size:64px;margin-right:-14px;}
}
`;

/* ══════════ COMPONENTS ══════════ */
const Toast = ({ msg, emoji }) => <div className="toast"><span>{emoji}</span>{msg}</div>;

function ImgPreview({ src }) {
  const [ok, setOk] = useState(null);
  useEffect(() => { if (src) setOk(null); }, [src]);
  if (!src) return null;
  return (
    <div className="img-prev">
      <div className="img-prev-thumb">
        <span>🖼</span>
        <img src={src} alt=""
          style={ok===false?{display:"none"}:{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}
          onLoad={()=>setOk(true)} onError={()=>setOk(false)}/>
      </div>
      <div className={`img-prev-note ${ok===false?"err":""}`}>
        {ok===null&&"Checking image…"}
        {ok===true&&<><b>✓ Image looks good</b></>}
        {ok===false&&<><b>✕ Can't load this URL</b> — try a direct .jpg or .png link</>}
      </div>
    </div>
  );
}

function EditModal({ cat, edit, onClose, onSave }) {
  const [name,setName]=useState(edit?.name||"");
  const [link,setLink]=useState(edit?.link||"");
  const [image,setImage]=useState(edit?.image||"");
  const [desc,setDesc]=useState(edit?.desc||"");
  const [fact,setFact]=useState(edit?.fact||"");
  const [tagline,setTagline]=useState(edit?.tagline||"");
  const [genre,setGenre]=useState(edit?.genre||"");
  const [year,setYear]=useState(edit?.year||"");
  const [rating,setRating]=useState(edit?.rating||"");
  const [busy,setBusy]=useState(false);
  const [aiSt,setAiSt]=useState(null);

  useEffect(()=>{
    const fn=e=>e.key==="Escape"&&!busy&&onClose();
    window.addEventListener("keydown",fn);
    return()=>window.removeEventListener("keydown",fn);
  },[busy]);

  const fill=async()=>{
    if(!name.trim()||busy) return;
    setBusy(true); setAiSt({type:"loading",msg:"Looking it up…"});
    try {
      const r=await aiFill(name.trim(),cat.label,msg=>setAiSt({type:"loading",msg}));
      if(r.description) setDesc(r.description);
      if(r.genre) setGenre(r.genre);
      if(r.year) setYear(r.year);
      if(r.fact) setFact(r.fact);
      if(r.tagline) setTagline(r.tagline);
      if(r.imageUrl) setImage(r.imageUrl);
      if(r.link) setLink(r.link);
      setAiSt({type:"ok",msg:"✓ Done! Check image preview below."});
    } catch(e) {
      setAiSt({type:"err",msg:`⚠ ${e.message}`});
    }
    setBusy(false);
  };

  const save=()=>{
    if(!name.trim()) return;
    onSave({name:name.trim(),link:link.trim(),image:image.trim(),
            desc:desc.trim(),fact:fact.trim(),tagline:tagline.trim(),
            genre:genre.trim(),year:year.trim(),rating});
  };

  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&!busy&&onClose()}>
      <div className="modal-box">
        <div className="mhdr">
          <div className="mtitle">{edit?`Edit · ${edit.name.slice(0,22)}`:`Add · ${cat.label}`}</div>
          <button className="mclose" onClick={onClose} disabled={busy}>×</button>
        </div>
        <div className="fg">
          <label className="fl">Name *</label>
          <input className="fi" value={name} onChange={e=>setName(e.target.value)} placeholder={`Your favourite ${cat.label.toLowerCase()}…`}/>
        </div>
        <div className="ai-bar">
          <div className="ai-icon">✨</div>
          <div className="ai-text">
            <div className="ai-title">AI Auto-Fill</div>
            <div className="ai-sub">Fills all fields + cover image via Claude AI</div>
          </div>
          {busy?<div className="ai-spin"><i/><i/><i/></div>
               :<button className="ai-btn" onClick={fill} disabled={!name.trim()}>{edit?"Re-Fill ✨":"Auto Fill ✨"}</button>}
        </div>
        {aiSt&&<div className={`ai-status ${aiSt.type}`}>
          {aiSt.type==="loading"&&<div className="ai-spin" style={{marginRight:4}}><i/><i/><i/></div>}
          {aiSt.msg}
        </div>}
        <div className="two">
          <div className="fg" style={{marginBottom:0}}><label className="fl">Genre</label><input className="fi" value={genre} onChange={e=>setGenre(e.target.value)} placeholder="Drama, Action…"/></div>
          <div className="fg" style={{marginBottom:0}}><label className="fl">Year</label><input className="fi" value={year} onChange={e=>setYear(e.target.value)} placeholder="2012"/></div>
        </div>
        <div style={{height:14}}/>
        <div className="fg"><label className="fl">Tagline / Quote</label><input className="fi" value={tagline} onChange={e=>setTagline(e.target.value)} placeholder="Most famous line…"/></div>
        <div className="fg"><label className="fl">Description</label><textarea className="ft" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Why you love it…"/></div>
        <div className="fg"><label className="fl">Fun Fact</label><input className="fi" value={fact} onChange={e=>setFact(e.target.value)} placeholder="One surprising fact…"/></div>
        <div className="fg">
          <label className="fl">Link</label>
          <input className="fi" value={link} onChange={e=>setLink(e.target.value)} placeholder="https://…"/>
          {link&&<a href={link} target="_blank" rel="noreferrer" style={{fontSize:11,color:"var(--green)",marginTop:4,display:"inline-block"}}>↗ Test link</a>}
        </div>
        <div className="fg">
          <label className="fl">Cover Image URL</label>
          <input className="fi" value={image} onChange={e=>setImage(e.target.value)} placeholder="Direct .jpg / .png / .webp URL…"/>
          <ImgPreview src={image}/>
        </div>
        <div className="fg">
          <label className="fl">Your Rating</label>
          <div className="rrow">
            {RATINGS.map(r=><div key={r} className={`ropt ${rating===r?"on":""}`} onClick={()=>setRating(rating===r?"":r)}>{r}</div>)}
          </div>
        </div>
        <div className="mftr">
          <button className="mc" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="ms" onClick={save} disabled={!name.trim()||busy}>{edit?"Save Changes":"Add →"}</button>
        </div>
      </div>
    </div>
  );
}

function Detail({ item, cat, isOwner, onClose, onEdit, onDelete }) {
  const stars=item.rating==="★★★ Obsessed"?"★★★★★":item.rating==="★★ Loved"?"★★★★":"★★★";
  useEffect(()=>{
    const fn=e=>e.key==="Escape"&&onClose();
    window.addEventListener("keydown",fn);
    return()=>window.removeEventListener("keydown",fn);
  },[]);
  return (
    <>
      <div className="det-bg" onClick={onClose}/>
      <div className="det-box">
        <div className="det-hero">
          {item.image&&<div className="det-hero-img" style={{backgroundImage:`url(${item.image})`}}/>}
          <div className="det-hero-grad"/>
          <div className="det-poster">
            <span style={{position:"relative",zIndex:0}}>{cat.icon}</span>
            {item.image&&<img src={item.image} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:1}} onError={e=>e.target.style.display="none"}/>}
          </div>
          <div className="det-actions">
            {isOwner&&<>
              <button className="det-x" style={{background:"rgba(245,197,24,.2)",color:"#F5C518"}} onClick={()=>{onClose();onEdit(item);}}>✏️</button>
              <button className="det-x" style={{background:"rgba(229,9,20,.2)",color:"#ff5555"}} onClick={()=>{if(window.confirm("Remove?")) onDelete(item.id);}}>🗑</button>
            </>}
            <button className="det-x" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="det-body">
          <div className="det-cat-lbl" style={{background:cat.color}}>{cat.label}</div>
          <div className="det-name">{item.name}</div>
          <div className="det-imdb-row">
            <div className="imdb-box">IMDb</div>
            <div className="imdb-stars">{stars}</div>
            <div className="imdb-lbl">Shubham's Pick</div>
          </div>
          <div className="det-chips">
            {item.genre&&<span className="chip">{item.genre}</span>}
            {item.year&&<span className="chip chip-y">{item.year}</span>}
            {item.rating&&<span className="chip chip-y">{item.rating}</span>}
          </div>
          {item.tagline&&<div className="det-tagline">"{item.tagline}"</div>}
          {item.desc&&<div className="det-desc">{item.desc}</div>}
          {item.fact&&<div className="det-fact"><span className="det-fact-h">💡 Did You Know</span>{item.fact}</div>}
        </div>
        <div className="det-footer">
          {item.link&&<a className="det-btn det-btn-w" href={item.link} target="_blank" rel="noreferrer">▶ Open Link</a>}
          {isOwner&&<>
            <button className="det-btn det-btn-g" onClick={()=>{onClose();onEdit(item);}}>✏ Edit</button>
            <button className="det-btn det-btn-d" onClick={()=>{if(window.confirm("Remove?")) onDelete(item.id);}}>🗑 Remove</button>
          </>}
          <button className="det-btn det-btn-g" style={{marginLeft:"auto"}} onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
}

function NC({ item, cat, isOwner, onOpen, onEdit, onDelete }) {
  const sh=SHAPE[cat.id]||"tall";
  return (
    <div className={`nc ${sh}`}>
      <div className="nc-img-box">
        <div className="nc-ph">{cat.icon}</div>
        {item.image&&<img src={item.image} alt="" className="nc-real-img" onError={e=>e.target.style.display="none"}/>}
        {item.rating&&<div className="nc-star">{item.rating.split(" ")[0]}</div>}
      </div>
      <div className="nc-panel">
        <div className="nc-panel-title">{item.name}</div>
        <div className="nc-panel-meta">
          {item.year&&<span className="npm-yr">{item.year}</span>}
          {item.year&&item.genre&&<span className="npm-dot"/>}
          {item.genre&&<span className="npm-g">{item.genre}</span>}
        </div>
        <div className="nc-panel-btns">
          <button className="npb npb-play" onClick={()=>onOpen(item,cat)}>▶ View</button>
          <button className="npb npb-more" onClick={()=>onOpen(item,cat)}>ℹ</button>
          {isOwner&&<>
            <button className="npb npb-edit" onClick={e=>{e.stopPropagation();onEdit(item,cat);}}>✏</button>
            <button className="npb npb-del" onClick={e=>{e.stopPropagation();if(window.confirm("Remove?")) onDelete(item.id,cat.id);}}>🗑</button>
          </>}
        </div>
      </div>
      <div className="nc-label">{item.name}</div>
    </div>
  );
}

function NRow({ cat, items, isOwner, onOpen, onEdit, onDelete, onAdd }) {
  const ref=useRef(null);
  const [sort,setSort]=useState("default");
  const scroll=d=>ref.current?.scrollBy({left:d*420,behavior:"smooth"});
  const sorted=[...items].sort((a,b)=>{
    if(sort==="rating"){const w={"★★★ Obsessed":3,"★★ Loved":2,"★ Liked":1};return(w[b.rating]||0)-(w[a.rating]||0);}
    if(sort==="year") return(parseInt(b.year)||0)-(parseInt(a.year)||0);
    return 0;
  });
  return (
    <div className="nrow">
      <div className="nrow-hdr">
        <div className="nrow-left"><div className="nrow-title">{cat.label}</div><span className="nrow-count">{items.length}</span></div>
        <div className="nrow-right">
          {items.length>1&&<>
            <button className={`nrow-sort ${sort==="rating"?"on":""}`} onClick={()=>setSort(s=>s==="rating"?"default":"rating")}>Rating</button>
            <button className={`nrow-sort ${sort==="year"?"on":""}`} onClick={()=>setSort(s=>s==="year"?"default":"year")}>Year</button>
          </>}
          {isOwner&&<button className="nrow-add-btn" onClick={onAdd}>+ Add →</button>}
        </div>
      </div>
      {items.length===0&&!isOwner?<div className="nrow-empty">Nothing here yet.</div>:(
        <div className="nrow-wrap">
          <button className="narr narr-l" onClick={()=>scroll(-1)}>‹</button>
          <div className="nrow-track" ref={ref}>
            {sorted.map((item,idx)=>(
              <div key={item.id} className="rcard-wrap">
                <div className="rcard-num">{idx+1}</div>
                <NC item={item} cat={cat} isOwner={isOwner} onOpen={onOpen} onEdit={(i,c)=>onEdit(i,c||cat)} onDelete={onDelete}/>
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

function Spotlight({ tops, isOwner, onOpen, onAdd, onSpotChange }) {
  const [idx,setIdx]=useState(0);
  const [aKey,setAKey]=useState(0);
  const timer=useRef(null);
  const goTo=useCallback(i=>{clearTimeout(timer.current);setIdx(i);setAKey(k=>k+1);},[]);
  useEffect(()=>{
    if(!tops.length) return;
    onSpotChange?.(tops[idx]);
    timer.current=setTimeout(()=>{const n=(idx+1)%tops.length;setIdx(n);setAKey(k=>k+1);},6000);
    return()=>clearTimeout(timer.current);
  },[idx,tops.length]);
  useEffect(()=>{if(tops[idx]) onSpotChange?.(tops[idx]);},[idx]);
  if(!tops.length) return (
    <div className="spot-empty">
      <div style={{fontSize:72,opacity:.1}}>🌌</div>
      <div className="spot-empty-h">Your Vault Awaits</div>
      <div className="spot-empty-s">{isOwner?"Start adding your favourites below.":"Nothing saved yet."}</div>
    </div>
  );
  const {item,cat}=tops[idx];
  return (
    <div className="spot">
      <div className="spot-cover-bg" key={`cb${idx}`} style={{backgroundImage:item.image?`url(${item.image})`:"none"}}/>
      <div className="spot-grad"/>
      <div className="spot-body" key={aKey}>
        <div className="spot-left">
          <div className="spot-kicker">
            <span className="spot-cat-tag" style={{background:cat.color}}>{cat.label}</span>
            <span className="spot-hot-tag"><span className="spot-live-dot"/> TRENDING #{idx+1}</span>
          </div>
          <div className="spot-title">{item.name}</div>
          <div className="spot-meta">
            {item.year&&<><span className="spot-year">{item.year}</span><span className="spot-sep"/></>}
            {item.genre&&<><span className="spot-genre">{item.genre}</span><span className="spot-sep"/></>}
            {item.rating&&<span className="spot-rb">{item.rating}</span>}
          </div>
          {item.tagline&&<div className="spot-tagline">"{item.tagline}"</div>}
          {item.desc&&<div className="spot-desc">{item.desc.slice(0,160)}{item.desc.length>160?"…":""}</div>}
          <div className="spot-btns">
            <button className="sp-btn-w" onClick={()=>onOpen(item,cat)}>▶ View Details</button>
            {item.link&&<a className="sp-btn-g" href={item.link} target="_blank" rel="noreferrer">↗ Open Link</a>}
            {isOwner&&<button className="sp-btn-g" onClick={onAdd}>+ Add New</button>}
          </div>
        </div>
        <div className="spot-right">
          <div className="spot-poster" key={`p${idx}`}>
            <span style={{position:"relative",zIndex:0}}>{cat.icon}</span>
            {item.image&&<img src={item.image} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:1}} onError={e=>e.target.style.display="none"}/>}
          </div>
        </div>
      </div>
      <div className="spot-bottom">
        <div className="spot-dots">
          {tops.map((_,i)=><div key={i} className={`sdot ${i===idx?"act":"sm"}`} onClick={()=>goTo(i)}>
            {i===idx&&<div className="sdot-fill" key={aKey}/>}
          </div>)}
        </div>
        <div className="spot-navs">
          <button className="spot-nav" onClick={()=>goTo((idx-1+tops.length)%tops.length)}>‹</button>
          <button className="spot-nav" onClick={()=>goTo((idx+1)%tops.length)}>›</button>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ allItems }) {
  const [q,setQ]=useState(""); const [open,setOpen]=useState(false); const [det,setDet]=useState(null);
  const ref=useRef(null);
  useEffect(()=>{const fn=e=>{if(!ref.current?.contains(e.target))setOpen(false);};document.addEventListener("mousedown",fn);return()=>document.removeEventListener("mousedown",fn);},[]);
  const results=q.trim().length<2?[]:allItems.filter(({item})=>item.name.toLowerCase().includes(q.toLowerCase())||(item.genre||"").toLowerCase().includes(q.toLowerCase())).slice(0,8);
  return (
    <div className="nav-search" ref={ref}>
      <span className="nav-search-icon">🔍</span>
      <input className="nav-search-input" value={q} onChange={e=>{setQ(e.target.value);setOpen(true);}} onFocus={()=>setOpen(true)} placeholder="Search vault…"/>
      {q&&<button className="nav-search-clear" onClick={()=>{setQ("");setOpen(false);}}>×</button>}
      {open&&q.trim().length>=2&&(
        <div className="search-drop">
          {results.length===0?<div className="search-empty">No results for "{q}"</div>
          :results.map(({item,cat})=>(
            <div key={item.id} className="search-item" onClick={()=>{setDet({item,cat});setOpen(false);setQ("");}}>
              <div className="search-thumb"><span>{cat.icon}</span>{item.image&&<img src={item.image} alt="" onError={e=>e.target.style.display="none"}/>}</div>
              <div className="search-info">
                <div className="search-name">{item.name}</div>
                <div className="search-meta"><div className="sdot2" style={{background:cat.color}}/><span style={{color:cat.color,fontSize:10,fontWeight:700}}>{cat.label}</span>{item.year&&<span>{item.year}</span>}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {det&&<Detail item={det.item} cat={det.cat} isOwner={false} onClose={()=>setDet(null)} onEdit={()=>{}} onDelete={()=>{}}/>}
    </div>
  );
}

/* ══════════ APP ══════════ */
export default function App() {
  const [data,     setData]     = useState({});
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [isOwner,  setIsOwner]  = useState(()=>checkUrlOwner());
  const [showAdd,  setShowAdd]  = useState(false);
  const [addCat,   setAddCat]   = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [detail,   setDetail]   = useState(null);
  const [toast,    setToast]    = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [spotTop,  setSpotTop]  = useState(null);
  const toastTimer = useRef(null);
  const saveTimer  = useRef(null);

  /* Favicon + title */
  useEffect(()=>{
    document.querySelectorAll("link[rel*='icon']").forEach(el=>el.remove());
    const lnk=document.createElement("link"); lnk.rel="icon"; lnk.type="image/png";
    lnk.href=`data:image/png;base64,${FAVICON_B64}`;
    document.head.appendChild(lnk);
    document.title="Shubham.World";
  },[]);

  /* Load vault from Gist on mount */
  useEffect(()=>{
    gistRead()
      .then(d=>{ setData(d||{}); setLoading(false); })
      .catch(()=>{ setLoading(false); showT("Could not load vault","⚠️"); });
  },[]);

  /* Auto-save to Gist when owner changes data */
  useEffect(()=>{
    if (!isOwner || loading) return;
    clearTimeout(saveTimer.current);
    setSaving(true);
    saveTimer.current = setTimeout(()=>{
      gistWrite(data)
        .then(()=>setSaving(false))
        .catch(()=>{ setSaving(false); showT("Save failed","⚠️"); });
    }, 1200);
  },[data]);

  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>60); window.addEventListener("scroll",fn); return()=>window.removeEventListener("scroll",fn);},[]);

  const showT=(m,e="✅")=>{setToast({msg:m,emoji:e}); clearTimeout(toastTimer.current); toastTimer.current=setTimeout(()=>setToast(null),2600);};

  const lockOwner=()=>{ localStorage.removeItem(OWNER_LS_KEY); setIsOwner(false); showT("Vault locked","🔒"); };

  const items    = id => data[id]||[];
  const allItems = CATS.flatMap(cat=>items(cat.id).map(item=>({item,cat})));
  const total    = allItems.length;
  const linked   = allItems.filter(({item})=>item.link).length;
  const obsessed = allItems.filter(({item})=>item.rating==="★★★ Obsessed").length;
  const tops     = allItems.map(({item,cat})=>({item,cat,sc:score(item,items(cat.id).indexOf(item))})).sort((a,b)=>b.sc-a.sc).slice(0,5);

  const openAdd  = cat        =>{setAddCat(cat);setEditItem(null);setShowAdd(true);};
  const openEdit = (item,cat) =>{setAddCat(cat);setEditItem(item);setShowAdd(true);};
  const openDet  = (item,cat) =>setDetail({item,cat});

  const handleSave = vals => {
    if (editItem) {
      setData(d=>({...d,[addCat.id]:(d[addCat.id]||[]).map(i=>i.id===editItem.id?{...i,...vals}:i)}));
      showT(`"${vals.name}" updated!`,"💾");
    } else {
      setData(d=>({...d,[addCat.id]:[...(d[addCat.id]||[]),{...vals,id:Date.now().toString()}]}));
      showT(`"${vals.name}" added!`,addCat.icon);
    }
    setShowAdd(false); setEditItem(null);
  };

  const handleDelete=(id,catId)=>{
    const cid=catId||CATS.find(c=>items(c.id).some(i=>i.id===id))?.id;
    if(!cid) return;
    setData(d=>({...d,[cid]:(d[cid]||[]).filter(i=>i.id!==id)}));
    setDetail(null); showT("Removed","🗑");
  };

  const bgUrl = spotTop?.item?.image||tops[0]?.item?.image||null;
  const glows = tops.slice(0,5).map((t,i)=>{
    const px=[{top:"-10%",left:"-5%"},{top:"-8%",right:"-5%"},{top:"25%",left:"40%"},{bottom:"0",right:"5%"},{bottom:"0",left:"5%"}];
    return{color:t.cat.color,pos:px[i]};
  });

  if (loading) return (
    <>
      <style>{CSS}</style>
      <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,background:"#000"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:".1em",color:"#1DB954"}}>SHUBHAM.WORLD</div>
        <div className="ai-spin"><i/><i/><i/></div>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>

      {/* Ambient BG */}
      <div className="bg-root">
        {bgUrl&&<div className="bg-img" style={{backgroundImage:`url(${bgUrl})`}}/>}
        <div className="bg-glows">
          {glows.map((g,i)=><div key={i} className="bg-glow" style={{background:g.color,width:"45vw",height:"40vh",...g.pos}}/>)}
        </div>
        <div className="bg-darken"/>
      </div>

      {/* Nav */}
      <nav className={`nav ${scrolled?"stuck":""}`}>
        <div className="logo">
          <div className={`logo-dot${isOwner?" owner-on":""}`}
            onClick={isOwner?lockOwner:undefined}
            title={isOwner?"Click to lock":""}/>
          SHUBHAM.WORLD
          {saving&&<span style={{fontSize:10,color:"var(--green)",marginLeft:6,opacity:.7}}>saving…</span>}
        </div>
        <div className="nav-r">
          <SearchBar allItems={allItems}/>
          {isOwner&&<div className="owner-pill" onClick={lockOwner}>● OWNER</div>}
          <div className="nav-avatar">S</div>
        </div>
      </nav>

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

      <div className="content">
        {CATS.map(cat=><NRow key={cat.id} cat={cat} items={items(cat.id)} isOwner={isOwner} onOpen={openDet} onEdit={openEdit} onDelete={handleDelete} onAdd={()=>openAdd(cat)}/>)}
        <div className="site-footer">{total} favourites · {linked} links<br/><span style={{opacity:.4}}>Made with 🖤 by Shubham</span></div>
      </div>

      {detail&&<Detail item={detail.item} cat={detail.cat} isOwner={isOwner}
        onClose={()=>setDetail(null)}
        onEdit={item=>{setDetail(null);openEdit(item,detail.cat);}}
        onDelete={handleDelete}/>}

      {showAdd&&addCat&&isOwner&&<EditModal cat={addCat} edit={editItem}
        onClose={()=>{setShowAdd(false);setEditItem(null);}}
        onSave={handleSave}/>}

      {toast&&<Toast msg={toast.msg} emoji={toast.emoji}/>}
    </>
  );
}