import { useState, useEffect, useRef, useCallback } from "react";

const GFONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');`;

const CATS = [
  { id:"movies",    label:"Movies",      icon:"🎞️", color:"#E50914", tag:"FILM"    },
  { id:"shows",     label:"TV Shows",    icon:"🖥️", color:"#0071EB", tag:"SERIES"  },
  { id:"songs",     label:"Music",       icon:"🎧", color:"#1DB954", tag:"MUSIC"   },
  { id:"articles",  label:"Articles",    icon:"🗞️", color:"#FF6B00", tag:"READS"   },
  { id:"videos",    label:"Videos",      icon:"📹", color:"#FF0000", tag:"VIDEO"   },
  { id:"actors",    label:"Actors",      icon:"🎪", color:"#9B59B6", tag:"ACTOR"   },
  { id:"actresses", label:"Actresses",   icon:"👑", color:"#E91E63", tag:"ACTRESS" },
  { id:"sports",    label:"Athletes",    icon:"⚡", color:"#00BFA5", tag:"SPORT"   },
  { id:"habits",    label:"Habits",      icon:"🧠", color:"#F5C518", tag:"HABIT"   },
];

const SHAPE = {
  movies:"tall", shows:"tall", songs:"sq", articles:"wide",
  videos:"wide", actors:"tall", actresses:"tall", sports:"tall", habits:"wide"
};

const OWNER_PASS = "shubham";

/* ── Storage — localStorage for public deployment ── */
async function dbGet() {
  try { const r = localStorage.getItem("sw-v10"); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
async function dbSet(d) {
  try { localStorage.setItem("sw-v10", JSON.stringify(d)); } catch {}
}

/*
  AI FILL — uses web_search to find a real, working image URL plus all metadata.
  Implements a proper agentic loop: if stop_reason === "tool_use", we feed tool
  results back and call again, up to 5 iterations, until we get end_turn + text.
*/
async function aiFill(name, catLabel) {
  const HEADERS = {
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01"
  };
  const TOOLS = [{ type: "web_search_20250305", name: "web_search" }];
  const SYSTEM = `You are a research assistant. When given a name and category, search the web to find accurate details and a real, directly loadable cover image URL. Always end your response with ONLY a JSON object — no markdown fences, no preamble. The JSON must be parseable by JSON.parse() directly.`;

  const userMsg = `Search the web for "${name}" (category: ${catLabel}).

Find: description, genre, year, a surprising fact, tagline, a working direct image URL (ending in .jpg/.png/.webp that a browser <img> tag can load), and the best link.

Then output ONLY this JSON (no code fences, no explanation):
{"description":"...","genre":"...","year":"...","fact":"...","tagline":"...","imageUrl":"...","link":"..."}`;

  let messages = [{ role: "user", content: userMsg }];

  for (let turn = 0; turn < 6; turn++) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM,
        tools: TOOLS,
        messages
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || "API error");

    const content = data.content || [];

    if (data.stop_reason === "end_turn") {
      // Collect all text blocks and extract JSON
      const raw = content.filter(b => b.type === "text").map(b => b.text).join("").trim();
      const clean = raw.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim();
      // Grab the last JSON object (after any prose)
      const matches = [...clean.matchAll(/\{[\s\S]*?\}/g)];
      // Try from longest to shortest to get the full object
      const candidates = matches.map(m => m[0]).sort((a,b) => b.length - a.length);
      for (const c of candidates) {
        try { const obj = JSON.parse(c); if (obj.description || obj.genre) return obj; } catch {}
      }
      throw new Error("No valid JSON in response");
    }

    if (data.stop_reason === "tool_use") {
      // Add assistant turn, then provide tool results to continue
      messages.push({ role: "assistant", content });
      const toolResults = content
        .filter(b => b.type === "tool_use")
        .map(b => ({
          type: "tool_result",
          tool_use_id: b.id,
          content: b.name === "web_search" ? (b.output || "") : "done"
        }));
      if (toolResults.length === 0) break;
      messages.push({ role: "user", content: toolResults });
      continue;
    }

    // Any other stop reason — try to extract text anyway
    const raw = content.filter(b => b.type === "text").map(b => b.text).join("").trim();
    if (raw) {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) { try { return JSON.parse(m[0]); } catch {} }
    }
    break;
  }
  throw new Error("Could not complete search");
}

function score(item, idx) {
  const w = { "★★★ Obsessed":3, "★★ Loved":2, "★ Liked":1 }[item.rating] || 0;
  return w * 10 + Math.max(0, 100 - idx * 3);
}

/* ═══════════════════════════════ CSS ═══════════════════════════════ */
const CSS = `
${GFONTS}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --black:#000;--bg:#121212;--card:#181818;--hover:#282828;--line:#2a2a2a;
  --green:#1DB954;--green-h:#1ED760;
  --t1:#fff;--t2:#B3B3B3;--t3:#6A6A6A;
  --gold:#F5C518;--red:#E50914;
}
html,body{background:var(--black);color:var(--t1);font-family:'DM Sans',sans-serif;overflow-x:hidden;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--line);border-radius:3px;}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:900;height:60px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;transition:background .5s;}
.nav.stuck{background:rgba(18,18,18,.97);border-bottom:1px solid var(--line);backdrop-filter:blur(20px);}
.logo{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:.1em;display:flex;align-items:center;gap:8px;user-select:none;}
.logo-dot{width:10px;height:10px;border-radius:50%;background:var(--green);animation:gpulse 2.4s ease-in-out infinite;cursor:pointer;flex-shrink:0;transition:box-shadow .15s;}
.logo-dot.tapped{animation:none;box-shadow:0 0 0 8px rgba(29,185,84,.28);}
.logo-dot.owner-on{background:#fff;animation:none;box-shadow:0 0 0 3px var(--green);}
@keyframes gpulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(29,185,84,.4)}50%{transform:scale(1.3);box-shadow:0 0 0 6px rgba(29,185,84,0)}}
.nav-r{display:flex;align-items:center;gap:8px;}
.owner-pill{padding:4px 14px;border-radius:100px;background:var(--green);color:#000;font-size:11px;font-weight:800;letter-spacing:.06em;cursor:pointer;}
.nav-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#1DB954,#157040);font-family:'Bebas Neue',sans-serif;font-size:18px;color:#000;display:flex;align-items:center;justify-content:center;}

/* SPOTLIGHT */
.spot{height:100svh;min-height:600px;position:relative;overflow:hidden;background:var(--black);}
.spot-wash{position:absolute;inset:0;background-size:cover;background-position:center 20%;filter:blur(60px) brightness(.22) saturate(2);transform:scale(1.15);}
.spot-grad{position:absolute;inset:0;background:linear-gradient(to right,rgba(0,0,0,.95),rgba(0,0,0,.65) 50%,rgba(0,0,0,.1)),linear-gradient(to top,#000,transparent 55%),linear-gradient(to bottom,rgba(0,0,0,.5),transparent 20%);}
.spot-body{position:relative;z-index:2;height:100%;display:flex;align-items:center;padding:80px 60px 60px;gap:60px;}
.spot-left{flex:1;max-width:660px;}
.spot-kicker{display:flex;align-items:center;gap:10px;margin-bottom:20px;}
.spot-cat-tag{padding:5px 14px;border-radius:4px;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#000;}
.spot-hot-tag{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:4px;background:rgba(29,185,84,.12);border:1px solid var(--green);font-size:10px;font-weight:800;letter-spacing:.08em;color:var(--green);}
.spot-live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:gpulse 1.8s ease infinite;}
.spot-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(56px,8.5vw,110px);line-height:.88;letter-spacing:.02em;margin-bottom:18px;text-shadow:0 4px 40px rgba(0,0,0,.8);animation:sIn .55s cubic-bezier(.22,.61,.36,1) both;}
@keyframes sIn{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
.spot-meta{display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap;}
.spot-year{font-size:13px;font-weight:700;color:var(--gold);}
.spot-genre{padding:3px 10px;border-radius:3px;background:rgba(255,255,255,.09);font-size:12px;font-weight:600;color:var(--t2);}
.spot-rating{font-size:13px;color:var(--gold);}
.spot-sep{width:3px;height:3px;border-radius:50%;background:var(--t3);}
.spot-tagline{font-size:14px;font-style:italic;color:var(--green);border-left:2px solid var(--green);padding-left:14px;margin-bottom:18px;line-height:1.55;animation:sIn .55s .1s cubic-bezier(.22,.61,.36,1) both;}
.spot-desc{font-size:15px;color:var(--t2);line-height:1.65;max-width:520px;margin-bottom:32px;animation:sIn .55s .15s cubic-bezier(.22,.61,.36,1) both;}
.spot-btns{display:flex;gap:12px;flex-wrap:wrap;animation:sIn .55s .2s cubic-bezier(.22,.61,.36,1) both;}
.sp-btn-w{padding:14px 30px;border-radius:100px;border:none;background:#fff;color:#000;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:8px;transition:all .2s;cursor:pointer;}
.sp-btn-w:hover{background:#e0e0e0;transform:scale(1.03);}
.sp-btn-g{padding:14px 30px;border-radius:100px;background:rgba(255,255,255,.1);color:#fff;border:none;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:8px;transition:all .2s;backdrop-filter:blur(8px);text-decoration:none;cursor:pointer;}
.sp-btn-g:hover{background:rgba(255,255,255,.2);}
.spot-bottom{position:absolute;bottom:0;left:0;right:0;z-index:3;padding:0 60px 36px;display:flex;align-items:flex-end;justify-content:space-between;}
.spot-dots{display:flex;gap:8px;align-items:center;}
.sdot{cursor:pointer;border-radius:100px;height:3px;background:rgba(255,255,255,.25);transition:all .3s;overflow:hidden;position:relative;}
.sdot.sm{width:24px;}.sdot.act{width:52px;background:rgba(255,255,255,.2);}
.sdot-fill{position:absolute;inset:0;background:var(--green);transform:scaleX(0);transform-origin:left;}
.sdot.act .sdot-fill{animation:sfill 6s linear forwards;}
@keyframes sfill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.spot-navs{display:flex;gap:8px;}
.spot-nav{width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:18px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(12px);transition:all .2s;cursor:pointer;}
.spot-nav:hover{background:rgba(255,255,255,.15);}
.spot-right{flex-shrink:0;}
/* Poster: fixed size container, bg placeholder, img on top via object-fit */
.spot-poster{
  width:clamp(170px,18vw,260px);
  height:clamp(255px,27vw,390px);
  border-radius:14px;overflow:hidden;
  background:var(--card);
  display:flex;align-items:center;justify-content:center;font-size:64px;
  box-shadow:0 40px 100px rgba(0,0,0,.85),0 0 0 1px rgba(255,255,255,.08);
  animation:pIn .7s .15s cubic-bezier(.22,.61,.36,1) both;
  position:relative;
}
@keyframes pIn{from{opacity:0;transform:translateX(30px) scale(.95)}to{opacity:1;transform:none}}
.spot-poster img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}
.spot-empty{height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;}
.spot-empty-h{font-family:'Bebas Neue',sans-serif;font-size:42px;letter-spacing:.06em;color:var(--t3);}
.spot-empty-s{font-size:14px;color:var(--t3);}

/* ROWS */
.content{background:var(--black);padding-bottom:100px;}
.nrow{padding-top:32px;}
.nrow-hdr{display:flex;align-items:center;justify-content:space-between;padding:0 28px 14px;}
.nrow-title{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:700;}
.nrow-icon{font-size:22px;}
.nrow-count{font-size:11px;font-weight:700;padding:2px 9px;border-radius:100px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--t3);}
.nrow-add-btn{font-size:12px;font-weight:700;color:var(--t2);background:none;border:none;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:5px;transition:all .2s;cursor:pointer;}
.nrow-add-btn:hover{color:#fff;gap:9px;}
.nrow-wrap{position:relative;}
.nrow-track{display:flex;gap:10px;padding:4px 28px 24px;overflow-x:auto;overflow-y:visible;scroll-behavior:smooth;scrollbar-width:none;}
.nrow-track::-webkit-scrollbar{display:none;}
.nrow-wrap::before,.nrow-wrap::after{content:'';position:absolute;top:0;bottom:0;width:80px;z-index:4;pointer-events:none;opacity:0;transition:opacity .3s;}
.nrow-wrap::before{left:0;background:linear-gradient(to right,#000,transparent);}
.nrow-wrap::after{right:0;background:linear-gradient(to left,#000,transparent);}
.nrow-wrap:hover::before,.nrow-wrap:hover::after{opacity:1;}
.narr{position:absolute;top:50%;transform:translateY(-50%);width:38px;height:80px;border-radius:4px;z-index:5;background:rgba(18,18,18,.95);border:1px solid rgba(255,255,255,.12);color:#fff;font-size:24px;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:all .2s;cursor:pointer;}
.nrow-wrap:hover .narr{opacity:1;pointer-events:all;}
.narr:hover{background:rgba(40,40,40,.98);}
.narr-l{left:0;}.narr-r{right:0;}
.nrow-empty{padding:2px 28px 28px;font-size:13px;color:var(--t3);}

/* NETFLIX CARD */
.nc{flex-shrink:0;position:relative;cursor:pointer;border-radius:6px;transition:transform .3s cubic-bezier(.22,.61,.36,1),z-index 0s .3s;z-index:1;}
.nc:hover{transform:scale(1.2);z-index:60;transition:transform .3s cubic-bezier(.22,.61,.36,1),z-index 0s 0s;}
.nc.tall{width:130px;}.nc.sq{width:155px;}.nc.wide{width:235px;}

/*
  Image container: always renders at the card's aspect ratio.
  The emoji placeholder is always in the background.
  The <img> sits on top via absolute positioning.
  When img loads → covers placeholder. When img errors → stays hidden, placeholder shows.
  NO new Image() preload — direct <img> render.
*/
.nc-img-box{width:100%;border-radius:6px;overflow:hidden;position:relative;box-shadow:0 4px 16px rgba(0,0,0,.5);transition:box-shadow .3s;}
.nc:hover .nc-img-box{box-shadow:0 16px 48px rgba(0,0,0,.8);border-radius:6px 6px 0 0;}
/* padding-top forces height even when all children are absolute */
.nc.tall .nc-img-box{padding-top:150%;}
.nc.sq  .nc-img-box{padding-top:100%;}
.nc.wide .nc-img-box{padding-top:56.25%;}
.nc-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:36px;background:linear-gradient(145deg,var(--card),var(--hover));}
.nc-real-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}
.nc-badge{position:absolute;top:6px;left:6px;padding:2px 7px;border-radius:3px;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;z-index:2;}
.nc-badge.top{background:var(--red);color:#fff;}.nc-badge.new{background:var(--green);color:#000;}
.nc-star{position:absolute;top:6px;right:6px;background:rgba(0,0,0,.85);border-radius:3px;padding:2px 6px;font-size:10px;font-weight:800;color:var(--gold);opacity:0;transition:opacity .2s;z-index:2;}
.nc:hover .nc-star{opacity:1;}
.nc-panel{position:absolute;top:100%;left:0;right:0;background:var(--hover);border-radius:0 0 6px 6px;padding:12px 12px 10px;opacity:0;transform:translateY(-2px);pointer-events:none;transition:opacity .2s .05s,transform .2s .05s;z-index:7;min-width:160px;box-shadow:0 16px 40px rgba(0,0,0,.7);}
.nc:hover .nc-panel{opacity:1;transform:translateY(0);pointer-events:all;}
.nc-panel-title{font-size:13px;font-weight:700;line-height:1.2;margin-bottom:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.nc-panel-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:9px;}
.npm-yr{font-size:11px;font-weight:700;color:var(--green);}
.npm-g{font-size:10px;color:var(--t2);background:rgba(255,255,255,.08);padding:2px 7px;border-radius:3px;}
.npm-dot{width:3px;height:3px;border-radius:50%;background:var(--t3);}
.nc-panel-btns{display:flex;gap:6px;}
.npb{height:30px;border-radius:100px;border:none;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:4px;transition:all .15s;cursor:pointer;}
.npb-play{background:#fff;color:#000;flex:1;}.npb-play:hover{background:#e8e8e8;}
.npb-more{background:rgba(255,255,255,.15);color:#fff;width:30px;flex:none;}.npb-more:hover{background:rgba(255,255,255,.28);}
.npb-edit{background:rgba(255,255,255,.1);color:var(--t2);width:30px;flex:none;}.npb-edit:hover{background:rgba(245,197,24,.2);color:var(--gold);}
.npb-del{background:rgba(255,255,255,.1);color:var(--t2);width:30px;flex:none;}.npb-del:hover{background:rgba(229,9,20,.2);color:#ff5555;}
.nc-label{padding:7px 2px 0;font-size:11px;font-weight:500;color:var(--t2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity .15s;}
.nc:hover .nc-label{opacity:0;}
.nc-add{flex-shrink:0;border:1.5px dashed var(--line);border-radius:6px;background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--t3);transition:all .25s;cursor:pointer;}
.nc-add:hover{border-color:var(--green);color:var(--green);background:rgba(29,185,84,.05);}
.nc-add.tall{width:130px;height:195px;}.nc-add.sq{width:155px;height:155px;}.nc-add.wide{width:235px;height:132px;}
.nc-add-plus{font-size:28px;line-height:1;transition:transform .35s cubic-bezier(.34,1.56,.64,1);}
.nc-add:hover .nc-add-plus{transform:rotate(90deg) scale(1.1);}
.nc-add-lbl{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;}

/* DETAIL */
.det-bg{position:fixed;inset:0;z-index:950;background:rgba(0,0,0,.85);backdrop-filter:blur(20px);animation:fadeIn .2s ease;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.det-box{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:951;width:min(860px,95vw);max-height:90vh;background:var(--card);border:1px solid rgba(255,255,255,.1);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;animation:bPop .35s cubic-bezier(.34,1.56,.64,1);}
@keyframes bPop{from{transform:translate(-50%,-50%) scale(.93);opacity:0}to{transform:translate(-50%,-50%) scale(1);opacity:1}}
.det-hero{height:300px;position:relative;overflow:hidden;flex-shrink:0;background:var(--hover);}
.det-hero-blur{position:absolute;inset:0;background-size:cover;background-position:center;filter:blur(35px) brightness(.3) saturate(2);transform:scale(1.15);}
.det-hero-grad{position:absolute;inset:0;background:linear-gradient(to right,rgba(24,24,24,.9),rgba(24,24,24,.4) 50%,transparent),linear-gradient(to top,var(--card),transparent 60%);}
/* Poster inside hero */
.det-poster{position:absolute;left:36px;bottom:0;width:140px;height:210px;border-radius:8px 8px 0 0;overflow:hidden;background:var(--hover);box-shadow:0 -20px 60px rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;font-size:52px;}
.det-poster img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}
.det-actions{position:absolute;top:14px;right:14px;display:flex;gap:8px;z-index:3;}
.det-x{width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.7);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);transition:all .2s;cursor:pointer;}
.det-x:hover{background:rgba(229,9,20,.5);}
.det-body{padding:20px 36px 24px 200px;overflow-y:auto;flex:1;}
/* Category label — text only, no icon */
.det-cat-lbl{display:inline-block;padding:4px 14px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#000;margin-bottom:12px;}
.det-name{font-family:'Bebas Neue',sans-serif;font-size:clamp(30px,5vw,56px);letter-spacing:.02em;line-height:.9;margin-bottom:14px;}
.det-imdb-row{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap;}
.imdb-box{background:var(--gold);color:#000;font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:.1em;padding:3px 10px;border-radius:4px;}
.imdb-stars{font-size:14px;color:var(--gold);}
.imdb-lbl{font-size:12px;color:var(--t3);}
.det-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}
.chip{padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;background:rgba(255,255,255,.08);color:var(--t2);}
.chip-y{background:rgba(245,197,24,.1);color:var(--gold);border:1px solid rgba(245,197,24,.2);}
.det-tagline{font-size:14px;font-style:italic;color:var(--green);border-left:2px solid var(--green);padding-left:12px;margin-bottom:14px;line-height:1.55;}
.det-desc{font-size:14px;color:var(--t2);line-height:1.75;margin-bottom:14px;}
.det-fact{background:var(--hover);border-radius:6px;padding:14px 16px;border-left:3px solid var(--green);font-size:13px;color:var(--t2);line-height:1.65;}
.det-fact-h{font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--green);margin-bottom:4px;display:block;}
.det-footer{flex-shrink:0;padding:16px 36px;border-top:1px solid var(--line);display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
.det-btn{padding:10px 24px;border-radius:100px;border:none;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:6px;transition:all .2s;cursor:pointer;}
.det-btn-w{background:#fff;color:#000;}.det-btn-w:hover{background:#e8e8e8;}
.det-btn-g{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.15);}.det-btn-g:hover{background:rgba(255,255,255,.2);}
.det-btn-d{background:transparent;color:var(--t3);border:1px solid var(--line);}.det-btn-d:hover{border-color:rgba(229,9,20,.4);color:#ff5555;}

/* MODALS */
.modal-bg{position:fixed;inset:0;z-index:980;background:rgba(0,0,0,.92);backdrop-filter:blur(24px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease;}
.modal-box{background:var(--card);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:36px;width:100%;max-width:500px;max-height:92vh;overflow-y:auto;animation:bPop .32s cubic-bezier(.34,1.56,.64,1);}
.mhdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;}
.mtitle{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:.08em;line-height:1;}
.mclose{width:32px;height:32px;border-radius:50%;background:var(--hover);border:1px solid var(--line);color:var(--t2);font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s;cursor:pointer;}
.mclose:hover{color:#ff5555;border-color:rgba(229,9,20,.4);}
.ai-bar{background:var(--hover);border:1px solid var(--line);border-radius:8px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:4px;}
.ai-icon{font-size:20px;}
.ai-text{flex:1;}
.ai-title{font-size:13px;font-weight:700;margin-bottom:2px;}
.ai-sub{font-size:11px;color:var(--t3);}
.ai-btn{padding:8px 18px;border-radius:100px;border:none;background:var(--green);color:#000;font-size:11px;font-weight:800;font-family:'DM Sans',sans-serif;letter-spacing:.04em;white-space:nowrap;transition:all .2s;flex-shrink:0;cursor:pointer;}
.ai-btn:hover:not(:disabled){background:var(--green-h);}
.ai-btn:disabled{opacity:.35;cursor:not-allowed;}
.ai-spin{display:inline-flex;gap:4px;align-items:center;}
.ai-spin i{width:5px;height:5px;border-radius:50%;background:var(--green);animation:asd .9s ease infinite;display:block;}
.ai-spin i:nth-child(2){animation-delay:.15s;}.ai-spin i:nth-child(3){animation-delay:.3s;}
@keyframes asd{0%,80%,100%{transform:scale(.55);opacity:.3}40%{transform:scale(1);opacity:1}}
.ai-status{font-size:11px;padding:6px 2px 10px;}
.ai-status.ok{color:var(--green);}
.ai-status.err{color:#ff8888;}
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
/* Image preview — live feedback */
.img-prev{display:flex;align-items:center;gap:10px;margin-top:8px;padding:10px 12px;background:rgba(255,255,255,.04);border-radius:6px;border:1px solid var(--line);}
.img-prev-thumb{width:60px;height:60px;border-radius:4px;overflow:hidden;background:var(--hover);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;position:relative;}
.img-prev-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.img-prev-note{font-size:11px;color:var(--t3);line-height:1.55;}
.img-prev-note b{color:var(--green);}
.img-prev-note.err b{color:#ff8888;}
.lm{max-width:320px;text-align:center;}
.lm-e{font-size:48px;margin-bottom:14px;}
.lm-h{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:.08em;margin-bottom:8px;}
.lm-s{font-size:13px;color:var(--t2);margin-bottom:22px;line-height:1.65;}
.lm-err{color:#ff5555;font-size:12px;font-weight:700;margin-top:8px;}
.lm-hint{font-size:11px;color:var(--t3);margin-top:14px;line-height:1.5;}
.toast{position:fixed;bottom:28px;right:28px;z-index:9999;background:var(--hover);border:1px solid rgba(255,255,255,.12);border-radius:100px;padding:12px 20px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px;animation:tpop .35s cubic-bezier(.34,1.56,.64,1);box-shadow:0 16px 40px rgba(0,0,0,.7);}
@keyframes tpop{from{transform:translateY(12px) scale(.95);opacity:0}to{transform:none;opacity:1}}
.site-footer{text-align:center;padding:40px 0 0;color:var(--t3);font-size:12px;}

@media(max-width:900px){
  .spot-right{display:none;}
  .spot-body{padding:70px 24px 60px;}
  .spot-bottom{padding:0 24px 28px;}
  .nav{padding:0 16px;}
  .nrow-hdr,.nrow-empty{padding-left:16px;padding-right:16px;}
  .nrow-track{padding-left:16px;padding-right:16px;}
  .det-body{padding:16px 20px 20px;}
  .det-poster{display:none;}
  .det-footer{padding:14px 20px;}
  .modal-box{padding:24px;}
  .two{grid-template-columns:1fr;}
}
@media(max-width:500px){
  .spot-title{font-size:46px;}
}
`;

/* ═══════════════════════════ COMPONENTS ═══════════════════════════ */

const RATINGS = ["★ Liked", "★★ Loved", "★★★ Obsessed"];

function Toast({ msg, emoji }) {
  return <div className="toast"><span>{emoji}</span>{msg}</div>;
}

/*
  CoverImg — the definitive image renderer.
  - Placeholder emoji always rendered in the background (absolutely positioned).
  - <img> sits on top. If it loads: covers the placeholder. If it errors: hides itself.
  - NO new Image() preload. Direct render. No state that could hang.
*/
function CoverImg({ src, fallback }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => setHidden(false), [src]);  // reset on URL change

  if (!src) return <>{fallback}</>;

  return (
    <>
      {fallback}
      <img
        src={src}
        alt=""
        className="nc-real-img"
        onError={() => setHidden(true)}
        style={hidden ? { display:"none" } : {}}
      />
    </>
  );
}

/*
  ImgPreview — live feedback in the edit modal.
  Same direct-render approach. Shows tick or cross based on img load.
*/
function ImgPreview({ src }) {
  const [ok, setOk] = useState(null); // null=pending, true=ok, false=fail
  useEffect(() => { if (src) setOk(null); }, [src]);
  if (!src) return null;
  return (
    <div className="img-prev">
      <div className="img-prev-thumb">
        <span style={{zIndex:0}}>🖼</span>
        <img
          src={src}
          alt=""
          style={ok===false ? {display:"none"} : {position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}
          onLoad={() => setOk(true)}
          onError={() => setOk(false)}
        />
      </div>
      <div className={`img-prev-note ${ok===false?"err":""}`}>
        {ok === null  && <span>Loading preview…</span>}
        {ok === true  && <span><b>✓ Image visible</b> — will show on cards</span>}
        {ok === false && <span><b>✕ Can't load this URL</b><br/>Paste a direct .jpg / .png / .webp link</span>}
      </div>
    </div>
  );
}

function LockModal({ onClose, onUnlock }) {
  const [pw, setPw] = useState(""), [err, setErr] = useState(false);
  const go = () => {
    if (pw === OWNER_PASS) { onUnlock(); onClose(); }
    else { setErr(true); setPw(""); setTimeout(() => setErr(false), 1800); }
  };
  return (
    <div className="modal-bg" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-box lm">
        <div className="lm-e">🔐</div>
        <div className="lm-h">Owner Access</div>
        <div className="lm-s">Shubham's vault.<br/>Visitors browse — only he edits.</div>
        <input className="fi" type="password" value={pw}
          onChange={e=>setPw(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&go()}
          placeholder="Password…" autoFocus />
        {err && <div className="lm-err">WRONG PASSWORD</div>}
        <div className="mftr" style={{marginTop:20}}>
          <button className="mc" onClick={onClose}>Back</button>
          <button className="ms" onClick={go}>Unlock →</button>
        </div>
        <div className="lm-hint">Only Shubham knows the password.</div>
      </div>
    </div>
  );
}

function EditModal({ cat, edit, onClose, onSave }) {
  const [name,    setName]    = useState(edit?.name    || "");
  const [link,    setLink]    = useState(edit?.link    || "");
  const [image,   setImage]   = useState(edit?.image   || "");
  const [desc,    setDesc]    = useState(edit?.desc    || "");
  const [fact,    setFact]    = useState(edit?.fact    || "");
  const [tagline, setTagline] = useState(edit?.tagline || "");
  const [genre,   setGenre]   = useState(edit?.genre   || "");
  const [year,    setYear]    = useState(edit?.year    || "");
  const [rating,  setRating]  = useState(edit?.rating  || "");
  const [busy,    setBusy]    = useState(false);
  const [aiSt,    setAiSt]    = useState(null);

  const fill = async () => {
    if (!name.trim() || busy) return;
    setBusy(true);
    setAiSt({ type:"loading", msg:"Filling in details…" });
    try {
      const r = await aiFill(name.trim(), cat.label);
      if (r.description) setDesc(r.description);
      if (r.genre)       setGenre(r.genre);
      if (r.year)        setYear(r.year);
      if (r.fact)        setFact(r.fact);
      if (r.tagline)     setTagline(r.tagline);
      if (r.imageUrl)    setImage(r.imageUrl);
      if (r.link)        setLink(r.link);
      setAiSt({ type:"ok", msg:`✓ Done! Check the image preview — replace URL if it doesn't load.` });
    } catch (e) {
      setAiSt({ type:"err", msg:`⚠ ${e.message || "Failed"} — fill manually` });
    }
    setBusy(false);
  };

  const save = () => {
    if (!name.trim()) return;
    onSave({ name:name.trim(), link:link.trim(), image:image.trim(),
             desc:desc.trim(), fact:fact.trim(), tagline:tagline.trim(),
             genre:genre.trim(), year:year.trim(), rating });
  };

  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        <div className="mhdr">
          <div className="mtitle">{edit ? "Edit Item" : `Add · ${cat.label}`}</div>
          <button className="mclose" onClick={onClose}>×</button>
        </div>

        <div className="fg">
          <label className="fl">Name *</label>
          <input className="fi" value={name} onChange={e=>setName(e.target.value)}
            placeholder={`Your favourite ${cat.label.toLowerCase()}…`} />
        </div>

        {!edit && (
          <>
            <div className="ai-bar">
              <div className="ai-icon">✨</div>
              <div className="ai-text">
                <div className="ai-title">AI Auto-Fill</div>
                <div className="ai-sub">Searches the web → fills all fields + cover image</div>
              </div>
              {busy
                ? <div className="ai-spin"><i/><i/><i/></div>
                : <button className="ai-btn" onClick={fill} disabled={!name.trim()}>
                    Auto Fill ✨
                  </button>
              }
            </div>
            {aiSt && (
              <div className={`ai-status ${aiSt.type}`}>{aiSt.msg}</div>
            )}
          </>
        )}

        <div className="two">
          <div className="fg" style={{marginBottom:0}}>
            <label className="fl">Genre</label>
            <input className="fi" value={genre} onChange={e=>setGenre(e.target.value)} placeholder="e.g. Drama" />
          </div>
          <div className="fg" style={{marginBottom:0}}>
            <label className="fl">Year</label>
            <input className="fi" value={year} onChange={e=>setYear(e.target.value)} placeholder="e.g. 2012" />
          </div>
        </div>
        <div style={{height:14}}/>

        <div className="fg">
          <label className="fl">Tagline / Quote</label>
          <input className="fi" value={tagline} onChange={e=>setTagline(e.target.value)} placeholder="Famous line…" />
        </div>
        <div className="fg">
          <label className="fl">Description</label>
          <textarea className="ft" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Why you love it…"/>
        </div>
        <div className="fg">
          <label className="fl">Fun Fact</label>
          <input className="fi" value={fact} onChange={e=>setFact(e.target.value)} placeholder="One surprising fact…" />
        </div>

        <div className="fg">
          <label className="fl">Link</label>
          <input className="fi" value={link} onChange={e=>setLink(e.target.value)} placeholder="https://…" />
          {link && <a href={link} target="_blank" rel="noopener noreferrer"
            style={{fontSize:11,color:"var(--green)",marginTop:4,display:"inline-block"}}>↗ Test link</a>}
        </div>

        <div className="fg">
          <label className="fl">Cover Image URL</label>
          <input className="fi" value={image} onChange={e=>setImage(e.target.value)}
            placeholder="Paste a direct .jpg / .png / .webp URL…" />
          <ImgPreview src={image} />
        </div>

        <div className="fg">
          <label className="fl">Your Rating</label>
          <div className="rrow">
            {RATINGS.map(r => (
              <div key={r} className={`ropt ${rating===r?"on":""}`} onClick={()=>setRating(rating===r?"":r)}>{r}</div>
            ))}
          </div>
        </div>

        <div className="mftr">
          <button className="mc" onClick={onClose}>Cancel</button>
          <button className="ms" onClick={save} disabled={!name.trim()}>
            {edit ? "Save Changes" : "Add →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ item, cat, isOwner, onClose, onEdit, onDelete }) {
  const stars = item.rating==="★★★ Obsessed"?"★★★★★":item.rating==="★★ Loved"?"★★★★":"★★★";
  return (
    <>
      <div className="det-bg" onClick={onClose}/>
      <div className="det-box">
        <div className="det-hero">
          {item.image && <div className="det-hero-blur" style={{backgroundImage:`url(${item.image})`}}/>}
          <div className="det-hero-grad"/>
          <div className="det-poster">
            <span style={{zIndex:0}}>{cat.icon}</span>
            {item.image && (
              <img src={item.image} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}
                onError={e=>e.target.style.display="none"} />
            )}
          </div>
          <div className="det-actions">
            {isOwner && <>
              <button className="det-x" style={{background:"rgba(245,197,24,.2)",color:"#F5C518"}}
                onClick={()=>{onClose();onEdit(item);}}>✏️</button>
              <button className="det-x" style={{background:"rgba(229,9,20,.2)",color:"#ff5555"}}
                onClick={()=>{if(window.confirm("Remove?"))onDelete(item.id);}}>🗑</button>
            </>}
            <button className="det-x" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="det-body">
          {/* Category badge — text only, NO icon */}
          <div className="det-cat-lbl" style={{background:cat.color}}>{cat.label}</div>
          <div className="det-name">{item.name}</div>
          <div className="det-imdb-row">
            <div className="imdb-box">IMDb</div>
            <div className="imdb-stars">{stars}</div>
            <div className="imdb-lbl">Shubham's Pick</div>
          </div>
          <div className="det-chips">
            {item.genre  && <span className="chip">{item.genre}</span>}
            {item.year   && <span className="chip">{item.year}</span>}
            {item.rating && <span className="chip chip-y">{item.rating}</span>}
          </div>
          {item.tagline && <div className="det-tagline">"{item.tagline}"</div>}
          {item.desc    && <div className="det-desc">{item.desc}</div>}
          {item.fact    && <div className="det-fact"><span className="det-fact-h">💡 Did You Know</span>{item.fact}</div>}
        </div>
        <div className="det-footer">
          {item.link && <a className="det-btn det-btn-w" href={item.link} target="_blank" rel="noopener noreferrer">▶ Open Link</a>}
          {isOwner && <>
            <button className="det-btn det-btn-g" onClick={()=>{onClose();onEdit(item);}}>✏ Edit</button>
            <button className="det-btn det-btn-d" onClick={()=>{if(window.confirm("Remove?"))onDelete(item.id);}}>🗑 Remove</button>
          </>}
          <button className="det-btn det-btn-g" style={{marginLeft:"auto"}} onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
}

function NC({ item, cat, isOwner, onOpen, onEdit, onDelete, badge }) {
  const sh = SHAPE[cat.id] || "tall";
  return (
    <div className={`nc ${sh}`}>
      <div className="nc-img-box">
        {/* Placeholder — always rendered underneath */}
        <div className="nc-ph">{cat.icon}</div>
        {/* Real image on top — hides itself on error, revealing placeholder */}
        {item.image && (
          <img src={item.image} alt="" className="nc-real-img"
            onError={e => e.target.style.display="none"} />
        )}
        {badge && <div className={`nc-badge ${badge}`}>{badge==="new"?"NEW":"TOP"}</div>}
        {item.rating && <div className="nc-star">{item.rating.split(" ")[0]}</div>}
      </div>
      <div className="nc-panel">
        <div className="nc-panel-title">{item.name}</div>
        <div className="nc-panel-meta">
          {item.year  && <span className="npm-yr">{item.year}</span>}
          {item.year&&item.genre && <span className="npm-dot"/>}
          {item.genre && <span className="npm-g">{item.genre}</span>}
        </div>
        <div className="nc-panel-btns">
          <button className="npb npb-play" onClick={()=>onOpen(item,cat)}>▶ View</button>
          <button className="npb npb-more" onClick={()=>onOpen(item,cat)}>ℹ</button>
          {isOwner && <>
            <button className="npb npb-edit" onClick={e=>{e.stopPropagation();onEdit(item,cat);}}>✏</button>
            <button className="npb npb-del"  onClick={e=>{e.stopPropagation();if(window.confirm("Remove?"))onDelete(item.id,cat.id);}}>🗑</button>
          </>}
        </div>
      </div>
      <div className="nc-label">{item.name}</div>
    </div>
  );
}

function NRow({ cat, items, isOwner, onOpen, onEdit, onDelete, onAdd }) {
  const ref = useRef(null);
  const scroll = d => ref.current?.scrollBy({left:d*400, behavior:"smooth"});
  return (
    <div className="nrow">
      <div className="nrow-hdr">
        <div className="nrow-title">
          {cat.label}
          <span className="nrow-count">{items.length}</span>
        </div>
        {isOwner && <button className="nrow-add-btn" onClick={onAdd}>+ Add →</button>}
      </div>
      {items.length===0 && !isOwner ? (
        <div className="nrow-empty">Nothing here yet.</div>
      ) : (
        <div className="nrow-wrap">
          <button className="narr narr-l" onClick={()=>scroll(-1)}>‹</button>
          <div className="nrow-track" ref={ref}>
            {items.map((item,idx) => (
              <NC key={item.id} item={item} cat={cat} isOwner={isOwner}
                badge={idx===0&&items.length>2?"top":idx===items.length-1&&items.length>1?"new":null}
                onOpen={onOpen} onEdit={(i,c)=>onEdit(i,c||cat)} onDelete={onDelete}/>
            ))}
            {isOwner && (
              <div className={`nc-add ${SHAPE[cat.id]||"tall"}`} onClick={onAdd}>
                <div className="nc-add-plus">+</div>
                <div className="nc-add-lbl">Add</div>
              </div>
            )}
          </div>
          <button className="narr narr-r" onClick={()=>scroll(1)}>›</button>
        </div>
      )}
    </div>
  );
}

function Spotlight({ tops, isOwner, onOpen, onAdd }) {
  const [idx,  setIdx]  = useState(0);
  const [aKey, setAKey] = useState(0);
  const timer = useRef(null);

  const goTo = useCallback((i) => {
    clearTimeout(timer.current);
    setIdx(i); setAKey(k=>k+1);
  }, []);

  useEffect(() => {
    if (!tops.length) return;
    timer.current = setTimeout(() => {
      setIdx(p=>(p+1)%tops.length);
      setAKey(k=>k+1);
    }, 6000);
    return () => clearTimeout(timer.current);
  }, [idx, tops.length]);

  if (!tops.length) return (
    <div className="spot-empty">
      <div style={{fontSize:72,opacity:.15}}>🌌</div>
      <div className="spot-empty-h">Your Vault Awaits</div>
      <div className="spot-empty-s">{isOwner?"Tap the dot 5× to unlock, then start adding.":"Nothing saved yet."}</div>
    </div>
  );

  const { item, cat } = tops[idx];

  return (
    <div className="spot">
      {item.image && <div className="spot-wash" style={{backgroundImage:`url(${item.image})`}} key={`w${idx}`}/>}
      <div className="spot-grad"/>

      <div className="spot-body" key={aKey}>
        <div className="spot-left">
          <div className="spot-kicker">
            {/* Category badge — text only, no icon */}
            <span className="spot-cat-tag" style={{background:cat.color}}>{cat.label}</span>
            <span className="spot-hot-tag"><span className="spot-live-dot"/> TRENDING #{idx+1}</span>
          </div>
          <div className="spot-title">{item.name}</div>
          <div className="spot-meta">
            {item.year   && <><span className="spot-year">{item.year}</span><span className="spot-sep"/></>}
            {item.genre  && <><span className="spot-genre">{item.genre}</span><span className="spot-sep"/></>}
            {item.rating && <span className="spot-rating">{item.rating}</span>}
          </div>
          {item.tagline && <div className="spot-tagline">"{item.tagline}"</div>}
          {item.desc    && <div className="spot-desc">{item.desc.slice(0,160)}{item.desc.length>160?"…":""}</div>}
          <div className="spot-btns">
            <button className="sp-btn-w" onClick={()=>onOpen(item,cat)}>▶ View Details</button>
            {item.link && <a className="sp-btn-g" href={item.link} target="_blank" rel="noopener noreferrer">↗ Open Link</a>}
            {isOwner && <button className="sp-btn-g" onClick={onAdd}>+ Add New</button>}
          </div>
        </div>

        {/* Spotlight poster — same direct-img approach */}
        <div className="spot-right">
          <div className="spot-poster" key={`p${idx}`}>
            <span style={{position:"relative",zIndex:0}}>{cat.icon}</span>
            {item.image && (
              <img src={item.image} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:1}}
                onError={e=>e.target.style.display="none"} />
            )}
          </div>
        </div>
      </div>

      <div className="spot-bottom">
        <div className="spot-dots">
          {tops.map((_,i)=>(
            <div key={i} className={`sdot ${i===idx?"act":"sm"}`} onClick={()=>goTo(i)}>
              {i===idx && <div className="sdot-fill" key={aKey}/>}
            </div>
          ))}
        </div>
        <div className="spot-navs">
          <button className="spot-nav" onClick={()=>goTo((idx-1+tops.length)%tops.length)}>‹</button>
          <button className="spot-nav" onClick={()=>goTo((idx+1)%tops.length)}>›</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ APP ═══════════════════════════ */
export default function App() {
  const [data,     setData]     = useState({});
  const [loaded,   setLoaded]   = useState(false);
  const [isOwner,  setIsOwner]  = useState(false);
  const [showLock, setShowLock] = useState(false);
  const [showAdd,  setShowAdd]  = useState(false);
  const [addCat,   setAddCat]   = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [detail,   setDetail]   = useState(null);
  const [toast,    setToast]    = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [dotTap,   setDotTap]   = useState(false);
  const tapCount   = useRef(0);
  const tapTimer   = useRef(null);
  const toastTimer = useRef(null);

  useEffect(()=>{ dbGet().then(d=>{setData(d);setLoaded(true);}); },[]);
  useEffect(()=>{ if(loaded) dbSet(data); },[data,loaded]);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  const showT=(m,e="✅")=>{
    setToast({msg:m,emoji:e});
    clearTimeout(toastTimer.current);
    toastTimer.current=setTimeout(()=>setToast(null),2600);
  };

  /* 5 rapid taps on the pulsing green dot → owner login */
  const handleDot=()=>{
    tapCount.current+=1;
    setDotTap(true);
    setTimeout(()=>setDotTap(false),180);
    clearTimeout(tapTimer.current);
    if(tapCount.current>=5){
      tapCount.current=0;
      if(isOwner){setIsOwner(false);showT("Vault locked","🔒");}
      else setShowLock(true);
      return;
    }
    tapTimer.current=setTimeout(()=>{tapCount.current=0;},1800);
  };

  const items  = id => data[id]||[];
  const total  = Object.values(data).reduce((a,v)=>a+(Array.isArray(v)?v.length:0),0);
  const linked = Object.values(data).flat().filter(i=>i?.link).length;

  const tops = CATS
    .flatMap(cat=>items(cat.id).map((item,idx)=>({item,cat,sc:score(item,idx)})))
    .sort((a,b)=>b.sc-a.sc)
    .slice(0,5);

  const openAdd  = cat       => {setAddCat(cat);setEditItem(null);setShowAdd(true);};
  const openEdit = (item,cat)=> {setAddCat(cat);setEditItem(item);setShowAdd(true);};
  const openDet  = (item,cat)=> setDetail({item,cat});

  const handleSave=vals=>{
    if(editItem){
      setData(d=>({...d,[addCat.id]:(d[addCat.id]||[]).map(i=>i.id===editItem.id?{...i,...vals}:i)}));
      showT(`"${vals.name}" updated!`,"💾");
    }else{
      setData(d=>({...d,[addCat.id]:[...(d[addCat.id]||[]),{...vals,id:Date.now().toString()}]}));
      showT(`"${vals.name}" added!`,addCat.icon);
    }
    setShowAdd(false);setEditItem(null);
  };

  const handleDelete=(id,catId)=>{
    const cid=catId||CATS.find(c=>items(c.id).some(i=>i.id===id))?.id;
    if(!cid)return;
    setData(d=>({...d,[cid]:(d[cid]||[]).filter(i=>i.id!==id)}));
    setDetail(null);
    showT("Removed","🗑");
  };

  if(!loaded) return (
    <div style={{background:"#000",height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:10,height:10,borderRadius:"50%",background:"#1DB954"}}/>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:".1em"}}>SHUBHAM.WORLD</span>
      </div>
      <div style={{display:"flex",gap:6}}>
        {[0,.18,.36].map((d,i)=>(
          <div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#1DB954",animation:`asd .9s ${d}s ease infinite`}}/>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{CSS}</style>

      <nav className={`nav ${scrolled?"stuck":""}`}>
        <div className="logo">
          <div className={`logo-dot${dotTap?" tapped":""}${isOwner?" owner-on":""}`} onClick={handleDot}/>
          SHUBHAM.WORLD
        </div>
        <div className="nav-r">
          {isOwner && (
            <div className="owner-pill" onClick={()=>{setIsOwner(false);showT("Vault locked","🔒");}}>
              ● OWNER
            </div>
          )}
          <div className="nav-avatar">S</div>
        </div>
      </nav>

      <Spotlight tops={tops} isOwner={isOwner} onOpen={openDet} onAdd={()=>openAdd(CATS[0])}/>

      <div className="content">
        {CATS.map(cat=>(
          <NRow key={cat.id} cat={cat} items={items(cat.id)} isOwner={isOwner}
            onOpen={openDet} onEdit={openEdit} onDelete={handleDelete}
            onAdd={()=>openAdd(cat)}/>
        ))}
        <div className="site-footer">{total} favourites · {linked} links · Shubham's World</div>
      </div>

      {detail && (
        <Detail item={detail.item} cat={detail.cat} isOwner={isOwner}
          onClose={()=>setDetail(null)}
          onEdit={item=>{setDetail(null);openEdit(item,detail.cat);}}
          onDelete={handleDelete}/>
      )}

      {showLock && (
        <LockModal onClose={()=>setShowLock(false)}
          onUnlock={()=>{setIsOwner(true);showT("Swagat hai Shubham! 🎉","🔓");}}/>
      )}

      {showAdd&&addCat&&isOwner && (
        <EditModal cat={addCat} edit={editItem}
          onClose={()=>{setShowAdd(false);setEditItem(null);}}
          onSave={handleSave}/>
      )}

      {toast && <Toast msg={toast.msg} emoji={toast.emoji}/>}
    </>
  );
}
