/* ============================================================
   TradeSafe — all-in-one day trading workflow
   Vanilla JS, no build step, localStorage persistence.
   ============================================================ */

/* ---------------- INSTRUMENT DATA ----------------
   Futures & options specs are standard contract specs (tick size / tick value).
   Forex pip values assume a USD-denominated account; pairs where USD is not the
   quote currency will drift slightly with the live exchange rate — treat as indicative.
--------------------------------------------------- */
const INSTRUMENTS = [
  // ---- FUTURES ----
  { symbol:'ES',  name:'E-mini S&P 500',        category:'futures', tickSize:0.25,   tickValue:12.50, unit:'points' },
  { symbol:'MES', name:'Micro E-mini S&P 500',  category:'futures', tickSize:0.25,   tickValue:1.25,  unit:'points' },
  { symbol:'NQ',  name:'E-mini Nasdaq-100',      category:'futures', tickSize:0.25,   tickValue:5.00,  unit:'points' },
  { symbol:'MNQ', name:'Micro E-mini Nasdaq-100',category:'futures', tickSize:0.25,   tickValue:0.50,  unit:'points' },
  { symbol:'YM',  name:'E-mini Dow',             category:'futures', tickSize:1,      tickValue:5.00,  unit:'points' },
  { symbol:'MYM', name:'Micro E-mini Dow',       category:'futures', tickSize:1,      tickValue:0.50,  unit:'points' },
  { symbol:'RTY', name:'E-mini Russell 2000',    category:'futures', tickSize:0.10,   tickValue:5.00,  unit:'points' },
  { symbol:'M2K', name:'Micro Russell 2000',     category:'futures', tickSize:0.10,   tickValue:0.50,  unit:'points' },
  { symbol:'CL',  name:'Crude Oil',              category:'futures', tickSize:0.01,   tickValue:10.00, unit:'points' },
  { symbol:'MCL', name:'Micro Crude Oil',        category:'futures', tickSize:0.01,   tickValue:1.00,  unit:'points' },
  { symbol:'GC',  name:'Gold',                   category:'futures', tickSize:0.10,   tickValue:10.00, unit:'points' },
  { symbol:'MGC', name:'Micro Gold',             category:'futures', tickSize:0.10,   tickValue:1.00,  unit:'points' },
  { symbol:'SI',  name:'Silver',                 category:'futures', tickSize:0.005,  tickValue:25.00, unit:'points' },
  { symbol:'NG',  name:'Natural Gas',            category:'futures', tickSize:0.001,  tickValue:10.00, unit:'points' },
  { symbol:'ZB',  name:'30Y U.S. Treasury Bond', category:'futures', tickSize:0.03125,tickValue:31.25, unit:'points' },
  { symbol:'ZN',  name:'10Y U.S. Treasury Note', category:'futures', tickSize:0.015625,tickValue:15.625,unit:'points' },

  // ---- FOREX (majors) ----
  { symbol:'EURUSD', name:'Euro / US Dollar',        category:'forex', pipSize:0.0001, pipValue:10.00, unit:'pips', note:'Standard lot (100k)' },
  { symbol:'GBPUSD', name:'British Pound / US Dollar',category:'forex', pipSize:0.0001, pipValue:10.00, unit:'pips', note:'Standard lot (100k)' },
  { symbol:'AUDUSD', name:'Australian Dollar / US Dollar', category:'forex', pipSize:0.0001, pipValue:10.00, unit:'pips', note:'Standard lot (100k)' },
  { symbol:'NZDUSD', name:'New Zealand Dollar / US Dollar', category:'forex', pipSize:0.0001, pipValue:10.00, unit:'pips', note:'Standard lot (100k)' },
  { symbol:'USDJPY', name:'US Dollar / Japanese Yen', category:'forex', pipSize:0.01, pipValue:6.50, unit:'pips', note:'Approx — varies with USDJPY rate' },
  { symbol:'USDCHF', name:'US Dollar / Swiss Franc',  category:'forex', pipSize:0.0001, pipValue:11.00, unit:'pips', note:'Approx — varies with USDCHF rate' },
  { symbol:'USDCAD', name:'US Dollar / Canadian Dollar', category:'forex', pipSize:0.0001, pipValue:7.30, unit:'pips', note:'Approx — varies with USDCAD rate' },
  // ---- FOREX (minors) ----
  { symbol:'EURGBP', name:'Euro / British Pound',    category:'forex', pipSize:0.0001, pipValue:12.50, unit:'pips', note:'Approx — quoted in GBP' },
  { symbol:'EURJPY', name:'Euro / Japanese Yen',      category:'forex', pipSize:0.01, pipValue:6.50, unit:'pips', note:'Approx — quoted in JPY' },
  { symbol:'GBPJPY', name:'British Pound / Japanese Yen', category:'forex', pipSize:0.01, pipValue:6.50, unit:'pips', note:'Approx — quoted in JPY' },
  { symbol:'AUDJPY', name:'Australian Dollar / Japanese Yen', category:'forex', pipSize:0.01, pipValue:6.50, unit:'pips', note:'Approx — quoted in JPY' },
  { symbol:'EURAUD', name:'Euro / Australian Dollar', category:'forex', pipSize:0.0001, pipValue:6.60, unit:'pips', note:'Approx — quoted in AUD' },
  { symbol:'EURCHF', name:'Euro / Swiss Franc',       category:'forex', pipSize:0.0001, pipValue:11.00, unit:'pips', note:'Approx — quoted in CHF' },
  { symbol:'GBPCAD', name:'British Pound / Canadian Dollar', category:'forex', pipSize:0.0001, pipValue:7.30, unit:'pips', note:'Approx — quoted in CAD' },
  { symbol:'AUDCAD', name:'Australian Dollar / Canadian Dollar', category:'forex', pipSize:0.0001, pipValue:7.30, unit:'pips', note:'Approx — quoted in CAD' },
  { symbol:'CADJPY', name:'Canadian Dollar / Japanese Yen', category:'forex', pipSize:0.01, pipValue:6.50, unit:'pips', note:'Approx — quoted in JPY' },

  // ---- INDEX / EQUITY OPTIONS (simplified: risk modeled as premium move × 100 × contracts) ----
  { symbol:'SPX', name:'S&P 500 Index Options',  category:'options', tickSize:0.05, tickValue:5.00, unit:'points', note:'Cash-settled, $100 multiplier' },
  { symbol:'SPY', name:'SPY ETF Options',        category:'options', tickSize:0.01, tickValue:1.00, unit:'points', note:'$100 multiplier' },
  { symbol:'QQQ', name:'QQQ ETF Options',        category:'options', tickSize:0.01, tickValue:1.00, unit:'points', note:'$100 multiplier' },
  { symbol:'IWM', name:'IWM ETF Options',        category:'options', tickSize:0.01, tickValue:1.00, unit:'points', note:'$100 multiplier' },
  { symbol:'AAPL', name:'Apple Options',         category:'options', tickSize:0.01, tickValue:1.00, unit:'points', note:'$100 multiplier' },
  { symbol:'TSLA', name:'Tesla Options',         category:'options', tickSize:0.01, tickValue:1.00, unit:'points', note:'$100 multiplier' },
  { symbol:'NVDA', name:'NVIDIA Options',        category:'options', tickSize:0.01, tickValue:1.00, unit:'points', note:'$100 multiplier' },
];

const REFLECTION_PROMPTS = {
  preCatalyst: "What was the catalyst for this setup?",
  prePlan: "Does this fit my trading plan / edge?",
  preEmotion: "What is my emotional state right now?",
  postRules: "Did I follow my risk rules? Why or why not?",
  postChange: "What would I do differently next time?",
  postEmotion: "How do I feel after this trade closed?"
};

/* ---------------- STORAGE ---------------- */
const LS = {
  account: 'rl_account_balance',
  favorites: 'rl_favorites',
  defaults: 'rl_instrument_defaults',
  trades: 'rl_trades',
  theme: 'ts_theme',
  backtests: 'ts_backtests',
};
function load(key, fallback){ try{ const v = localStorage.getItem(key); return v===null? fallback : JSON.parse(v); }catch(e){ return fallback; } }
function save(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){ console.error('Storage failed', e); } }

let state = {
  account: load(LS.account, 10000),
  favorites: load(LS.favorites, ['ES','NQ','EURUSD']),
  defaults: load(LS.defaults, {}),
  trades: load(LS.trades, []),
  backtests: load(LS.backtests, []),
  theme: load(LS.theme, 'dark'),
  editingBacktestId: null,
  selected: INSTRUMENTS[0],
  riskMode: 'dollar', // or 'percent'
  direction: 'long',
  catFilter: 'all',
  editingTradeId: null,
  pendingScreenshot: null,
};

/* ---------------- HELPERS ---------------- */
function fmtMoney(n){
  if (n===null || n===undefined || isNaN(n)) return '—';
  const sign = n<0 ? '-' : '';
  return sign + '$' + Math.abs(n).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
}
function fmtNum(n, dp=2){ if(n===null||n===undefined||isNaN(n)) return '—'; return n.toLocaleString('en-US',{minimumFractionDigits:dp,maximumFractionDigits:dp}); }
function todayISO(){ const d=new Date(); return d.toISOString().slice(0,10); }
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(()=> t.classList.add('hidden'), 2600);
}
function uid(){ return 't_' + Date.now() + '_' + Math.floor(Math.random()*10000); }

/* ---------------- THEME (light / dark) ---------------- */
const SUN_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
function applyTheme(){
  const light = state.theme === 'light';
  const root = document.documentElement;
  root.classList.toggle('theme-light', light);
  root.classList.toggle('theme-dark', !light);
  // Sidebar toggle shows icon + label; mobile shows icon only.
  const full = document.getElementById('themeToggle');
  if (full) full.innerHTML = (light ? MOON_ICON : SUN_ICON) + `<span>${light ? 'Dark mode' : 'Light mode'}</span>`;
  const mob = document.getElementById('themeToggleMobile');
  if (mob) mob.innerHTML = light ? MOON_ICON : SUN_ICON;
  // Charts read CSS colors, so refresh them on theme change.
  if (typeof rerenderCharts === 'function') rerenderCharts();
}
function toggleTheme(){
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  save(LS.theme, state.theme);
  applyTheme();
}

/* ---------------- INTRO LOADING SCREEN ---------------- */
function hideIntro(){
  const el = document.getElementById('introScreen');
  if (!el) return;
  setTimeout(()=>{
    el.classList.add('fade');
    setTimeout(()=> el.remove(), 650);
  }, 1600);
}

/* ---------------- NAVIGATION ---------------- */
function setView(view){
  state.view = view;
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+view).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(b=>{
    b.classList.toggle('active', b.dataset.view===view);
  });
  if (view==='dashboard') renderDashboard();
  if (view==='journal') renderJournal();
  if (view==='calendar') renderCalendar();
  window.scrollTo({top:0});
}
document.querySelectorAll('[data-view]').forEach(btn=>{
  btn.addEventListener('click', ()=> setView(btn.dataset.view));
});

/* ================================================================
   RISK SIZER
   ================================================================ */
function renderInstrumentList(){
  const search = document.getElementById('instrumentSearch').value.trim().toUpperCase();
  const cat = state.catFilter;
  const list = document.getElementById('instrumentList');
  list.innerHTML = '';

  const favSet = new Set(state.favorites);
  let items = INSTRUMENTS.filter(i=>{
    if (cat!=='all' && i.category!==cat) return false;
    if (search && !(i.symbol.includes(search) || i.name.toUpperCase().includes(search))) return false;
    return true;
  });

  // Favorites first (only when no active search/cat narrows them out awkwardly — keep simple: show a favorites block when "all" and no search)
  if (cat==='all' && !search){
    const favs = INSTRUMENTS.filter(i=>favSet.has(i.symbol));
    if (favs.length){
      const label = document.createElement('div');
      label.className = 'text-[10px] uppercase tracking-wide text-faint px-2 pt-1 pb-1';
      label.textContent = 'Favorites';
      list.appendChild(label);
      favs.forEach(i=> list.appendChild(instrumentRow(i, favSet)));
      const divider = document.createElement('div');
      divider.className = 'divider-dash my-2';
      list.appendChild(divider);
    }
  }

  const groups = {futures:'Futures', forex:'Forex', options:'Index / Equity Options'};
  Object.keys(groups).forEach(g=>{
    const groupItems = items.filter(i=>i.category===g);
    if (!groupItems.length) return;
    const label = document.createElement('div');
    label.className = 'text-[10px] uppercase tracking-wide text-faint px-2 pt-2 pb-1';
    label.textContent = groups[g];
    list.appendChild(label);
    groupItems.forEach(i=> list.appendChild(instrumentRow(i, favSet)));
  });

  if (!items.length){
    list.innerHTML = '<div class="text-center text-muted text-sm py-10">No instruments match.</div>';
  }
}
function instrumentRow(i, favSet){
  const row = document.createElement('button');
  const isSel = state.selected && state.selected.symbol===i.symbol;
  row.className = 'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition hover:bg-panel2 ' + (isSel? 'bg-panel2 border border-gold/40' : 'border border-transparent');
  row.innerHTML = `
    <div class="flex items-center gap-2 min-w-0">
      ${favSet.has(i.symbol) ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="#D4A24C" stroke="#D4A24C"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1z"/></svg>' : '<span class="w-3"></span>'}
      <div class="min-w-0">
        <div class="text-sm font-semibold">${i.symbol}</div>
        <div class="text-[11px] text-muted truncate">${i.name}</div>
      </div>
    </div>
    <span class="text-[10px] text-faint uppercase">${i.category}</span>
  `;
  row.addEventListener('click', ()=> selectInstrument(i.symbol));
  return row;
}
function selectInstrument(symbol){
  const inst = INSTRUMENTS.find(i=>i.symbol===symbol);
  if (!inst) return;
  state.selected = inst;
  document.getElementById('selSymbol').textContent = `${inst.symbol} — ${inst.name}`;
  document.getElementById('unitLabel').textContent = inst.unit;
  // apply saved defaults if present
  const def = state.defaults[symbol];
  if (def){
    setRiskMode(def.mode);
    document.getElementById('riskValue').value = def.value;
    document.getElementById('stopDistance').value = def.stopDistance;
  }
  updateFavIcon();
  renderInstrumentList();
  calcSizer();
}
function updateFavIcon(){
  const star = document.getElementById('favStar');
  const isFav = state.favorites.includes(state.selected.symbol);
  star.setAttribute('fill', isFav ? '#D4A24C' : 'none');
  star.setAttribute('stroke', isFav ? '#D4A24C' : '#8B93A1');
}
document.getElementById('favToggle').addEventListener('click', ()=>{
  const sym = state.selected.symbol;
  const idx = state.favorites.indexOf(sym);
  if (idx>-1) state.favorites.splice(idx,1); else state.favorites.push(sym);
  save(LS.favorites, state.favorites);
  updateFavIcon();
  renderInstrumentList();
});
document.getElementById('instrumentSearch').addEventListener('input', renderInstrumentList);
document.querySelectorAll('.cat-filter').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.cat-filter').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
    state.catFilter = btn.dataset.cat;
    renderInstrumentList();
  });
});

function setRiskMode(mode){
  state.riskMode = mode;
  const dBtn = document.getElementById('modeDollar'), pBtn = document.getElementById('modePercent');
  dBtn.classList.toggle('bg-panel2', mode==='dollar'); dBtn.classList.toggle('text-gold', mode==='dollar'); dBtn.classList.toggle('text-muted', mode!=='dollar');
  pBtn.classList.toggle('bg-panel2', mode==='percent'); pBtn.classList.toggle('text-gold', mode==='percent'); pBtn.classList.toggle('text-muted', mode!=='percent');
}
document.getElementById('modeDollar').addEventListener('click', ()=>{ setRiskMode('dollar'); calcSizer(); });
document.getElementById('modePercent').addEventListener('click', ()=>{ setRiskMode('percent'); calcSizer(); });

function setDirection(dir){
  state.direction = dir;
  const lBtn = document.getElementById('dirLong'), sBtn = document.getElementById('dirShort');
  lBtn.classList.toggle('bg-profit/10', dir==='long'); lBtn.classList.toggle('text-profit', dir==='long'); lBtn.classList.toggle('font-medium', dir==='long'); lBtn.classList.toggle('text-muted', dir!=='long');
  sBtn.classList.toggle('bg-loss/10', dir==='short'); sBtn.classList.toggle('text-loss', dir==='short'); sBtn.classList.toggle('font-medium', dir==='short'); sBtn.classList.toggle('text-muted', dir!=='short');
}
document.getElementById('dirLong').addEventListener('click', ()=>{ setDirection('long'); calcSizer(); });
document.getElementById('dirShort').addEventListener('click', ()=>{ setDirection('short'); calcSizer(); });

['riskValue','stopDistance','entryPrice','targetPrice'].forEach(id=>{
  document.getElementById(id).addEventListener('input', calcSizer);
});

let lastSizerResult = null;
function calcSizer(){
  const inst = state.selected;
  const riskInput = parseFloat(document.getElementById('riskValue').value) || 0;
  const stopDist = parseFloat(document.getElementById('stopDistance').value) || 0;
  const entry = parseFloat(document.getElementById('entryPrice').value);
  const target = parseFloat(document.getElementById('targetPrice').value);

  const riskDollar = state.riskMode==='percent' ? (state.account * riskInput/100) : riskInput;

  let size = 0, riskPerUnit = 0, sizeLabel = 'Contracts', sizeSub = '';
  if (inst.category==='futures' || inst.category==='options'){
    const ticks = inst.tickSize>0 ? stopDist / inst.tickSize : 0;
    riskPerUnit = ticks * inst.tickValue;
    size = riskPerUnit>0 ? Math.floor(riskDollar / riskPerUnit) : 0;
    sizeLabel = 'Contracts';
    sizeSub = riskPerUnit>0 ? `${fmtMoney(riskPerUnit)} risk / contract` : '';
  } else if (inst.category==='forex'){
    riskPerUnit = stopDist * inst.pipValue; // per standard lot
    const lots = riskPerUnit>0 ? Math.floor((riskDollar/riskPerUnit)*100)/100 : 0;
    size = lots;
    sizeLabel = 'Lots (standard)';
    sizeSub = riskPerUnit>0 ? `${fmtMoney(riskPerUnit)} risk / lot · ${fmtNum(lots*100,0)} micro-lots` : '';
  }

  document.getElementById('resultSize').textContent = inst.category==='forex' ? fmtNum(size,2) : fmtNum(size,0);
  document.getElementById('sizeLabel').textContent = sizeLabel;
  document.getElementById('resultSizeSub').textContent = sizeSub;

  const actualDollarRisk = size * riskPerUnit;
  document.getElementById('resultDollarRisk').textContent = fmtMoney(actualDollarRisk);
  document.getElementById('resultPercentAccount').textContent = state.account>0 ? ((actualDollarRisk/state.account)*100).toFixed(2)+'%' : '—';

  // stop price
  let stopPrice = null;
  if (!isNaN(entry)){
    const unitSize = inst.category==='forex' ? inst.pipSize : 1; // stopDist already in "points" for futures/options (price units)
    const distanceInPrice = inst.category==='forex' ? stopDist*inst.pipSize : stopDist;
    stopPrice = state.direction==='long' ? entry - distanceInPrice : entry + distanceInPrice;
  }
  document.getElementById('resultStopPrice').textContent = stopPrice!==null ? fmtNum(stopPrice, inst.category==='forex'?5:2) : '—';

  // R:R
  let rr = null;
  if (!isNaN(entry) && !isNaN(target) && stopPrice!==null){
    const risk = Math.abs(entry-stopPrice);
    const reward = Math.abs(target-entry);
    if (risk>0) rr = reward/risk;
  }
  document.getElementById('resultRR').textContent = rr!==null ? '1 : '+rr.toFixed(2) : '—';

  // warnings
  const warnEl = document.getElementById('ticketWarning');
  let warn = '';
  if (size<=0 && riskDollar>0 && stopDist>0) warn = 'Size rounds to zero — stop distance is too wide for this risk amount, or risk is too small. Widen your risk or tighten the stop.';
  else if (state.account>0 && (actualDollarRisk/state.account) > 0.05) warn = `This risks ${((actualDollarRisk/state.account)*100).toFixed(1)}% of your account — most trading plans cap single-trade risk at 1–2%.`;
  if (warn){ warnEl.textContent = warn; warnEl.classList.remove('hidden'); } else { warnEl.classList.add('hidden'); }

  document.getElementById('ticketTime').textContent = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

  lastSizerResult = { inst, riskDollar: actualDollarRisk, size, sizeLabel, entry: isNaN(entry)?null:entry, stopPrice, target: isNaN(target)?null:target, direction: state.direction, rr };
}

document.getElementById('saveDefaultBtn').addEventListener('click', ()=>{
  state.defaults[state.selected.symbol] = {
    mode: state.riskMode,
    value: parseFloat(document.getElementById('riskValue').value)||0,
    stopDistance: parseFloat(document.getElementById('stopDistance').value)||0,
  };
  save(LS.defaults, state.defaults);
  toast(`Default risk settings saved for ${state.selected.symbol}`);
});

document.getElementById('logTradeBtn').addEventListener('click', ()=>{
  if (!lastSizerResult || lastSizerResult.size<=0){ toast('Set a valid risk and stop distance first.'); return; }
  openTradeModal(null, {
    instrument: lastSizerResult.inst.symbol,
    direction: lastSizerResult.direction==='long'?'Long':'Short',
    entry: lastSizerResult.entry,
    size: lastSizerResult.size,
    risk: Math.round(lastSizerResult.riskDollar*100)/100,
    stopPrice: lastSizerResult.stopPrice,
  });
  setView('journal');
});

/* ================================================================
   ACCOUNT MODAL
   ================================================================ */
function refreshAccountDisplays(){
  document.getElementById('sidebarAccount').textContent = fmtMoney(state.account);
  document.getElementById('mobileAccountBtn').textContent = '$'+Math.round(state.account).toLocaleString();
}
document.getElementById('openAccountBtn').addEventListener('click', openAccountModal);
document.getElementById('mobileAccountBtn').addEventListener('click', openAccountModal);
function openAccountModal(){
  document.getElementById('accountBalanceInput').value = state.account;
  document.getElementById('accountModal').classList.remove('hidden');
}
document.getElementById('accountCancelBtn').addEventListener('click', ()=> document.getElementById('accountModal').classList.add('hidden'));
document.getElementById('accountSaveBtn').addEventListener('click', ()=>{
  const v = parseFloat(document.getElementById('accountBalanceInput').value);
  if (!isNaN(v) && v>=0){ state.account = v; save(LS.account, v); refreshAccountDisplays(); calcSizer(); renderDashboard(); }
  document.getElementById('accountModal').classList.add('hidden');
});

/* ================================================================
   JOURNAL
   ================================================================ */
function openTradeModal(tradeId, prefill){
  state.editingTradeId = tradeId;
  state.pendingScreenshot = null;
  const trade = tradeId ? state.trades.find(t=>t.id===tradeId) : null;
  document.getElementById('tradeModalTitle').textContent = tradeId ? 'Edit journal entry' : 'New journal entry';
  document.getElementById('tradeDeleteBtn').classList.toggle('hidden', !tradeId);

  const d = trade || prefill || {};
  document.getElementById('tInstrument').value = d.instrument || '';
  document.getElementById('tDirection').value = d.direction || 'Long';
  document.getElementById('tDate').value = d.date || todayISO();
  document.getElementById('tTime').value = d.time || new Date().toTimeString().slice(0,5);
  document.getElementById('tEntry').value = d.entry ?? '';
  document.getElementById('tExit').value = d.exit ?? '';
  document.getElementById('tSize').value = d.size ?? '';
  document.getElementById('tRisk').value = d.risk ?? '';
  document.getElementById('tPnl').value = d.pnl ?? '';
  document.getElementById('tSetup').value = d.setup || '';
  document.getElementById('tTags').value = (d.tags||[]).join(', ');
  document.getElementById('tPreCatalyst').value = d.preCatalyst || '';
  document.getElementById('tPrePlan').value = d.prePlan || '';
  document.getElementById('tPreEmotion').value = d.preEmotion || '';
  document.getElementById('tPostRules').value = d.postRules || '';
  document.getElementById('tPostChange').value = d.postChange || '';
  document.getElementById('tPostEmotion').value = d.postEmotion || '';

  populateNewsEventSelect(d.newsEvent || '');

  const preview = document.getElementById('tScreenshotPreview');
  if (trade && trade.screenshot){ preview.src = trade.screenshot; preview.classList.remove('hidden'); state.pendingScreenshot = trade.screenshot; }
  else { preview.classList.add('hidden'); preview.src=''; }
  document.getElementById('tScreenshot').value = '';

  document.getElementById('tradeModal').classList.remove('hidden');
}
function populateNewsEventSelect(selected){
  const sel = document.getElementById('tNewsEvent');
  sel.innerHTML = '<option value="">None</option>';
  getWeekEvents().forEach(ev=>{
    const label = `${ev.date} ${ev.time} · ${ev.currency} · ${ev.title}`;
    const opt = document.createElement('option');
    opt.value = label; opt.textContent = label;
    if (label===selected) opt.selected = true;
    sel.appendChild(opt);
  });
}
document.getElementById('newTradeBtn').addEventListener('click', ()=> openTradeModal(null, null));
document.getElementById('tradeModalClose').addEventListener('click', closeTradeModal);
document.getElementById('tradeCancelBtn').addEventListener('click', closeTradeModal);
function closeTradeModal(){ document.getElementById('tradeModal').classList.add('hidden'); }

document.getElementById('tScreenshot').addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    state.pendingScreenshot = reader.result;
    const preview = document.getElementById('tScreenshotPreview');
    preview.src = reader.result; preview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

document.getElementById('tradeSaveBtn').addEventListener('click', ()=>{
  const instrument = document.getElementById('tInstrument').value.trim().toUpperCase();
  if (!instrument){ toast('Instrument is required.'); return; }
  const entry = parseFloat(document.getElementById('tEntry').value);
  const exit = parseFloat(document.getElementById('tExit').value);
  const pnlInput = document.getElementById('tPnl').value;
  const data = {
    instrument,
    direction: document.getElementById('tDirection').value,
    date: document.getElementById('tDate').value || todayISO(),
    time: document.getElementById('tTime').value || '09:30',
    entry: isNaN(entry) ? null : entry,
    exit: isNaN(exit) ? null : exit,
    size: parseFloat(document.getElementById('tSize').value) || null,
    risk: parseFloat(document.getElementById('tRisk').value) || null,
    pnl: pnlInput==='' ? null : parseFloat(pnlInput),
    setup: document.getElementById('tSetup').value.trim(),
    tags: document.getElementById('tTags').value.split(',').map(s=>s.trim()).filter(Boolean),
    newsEvent: document.getElementById('tNewsEvent').value,
    preCatalyst: document.getElementById('tPreCatalyst').value,
    prePlan: document.getElementById('tPrePlan').value,
    preEmotion: document.getElementById('tPreEmotion').value,
    postRules: document.getElementById('tPostRules').value,
    postChange: document.getElementById('tPostChange').value,
    postEmotion: document.getElementById('tPostEmotion').value,
    screenshot: state.pendingScreenshot,
  };
  // R multiple
  data.rMultiple = (data.risk && data.pnl!==null && data.risk>0) ? (data.pnl/data.risk) : null;

  if (state.editingTradeId){
    const idx = state.trades.findIndex(t=>t.id===state.editingTradeId);
    state.trades[idx] = {...state.trades[idx], ...data};
  } else {
    data.id = uid();
    state.trades.unshift(data);
  }
  save(LS.trades, state.trades);
  closeTradeModal();
  renderJournal();
  renderDashboard();
  toast('Journal entry saved.');
});

document.getElementById('tradeDeleteBtn').addEventListener('click', ()=>{
  if (!state.editingTradeId) return;
  state.trades = state.trades.filter(t=>t.id!==state.editingTradeId);
  save(LS.trades, state.trades);
  closeTradeModal();
  renderJournal();
  renderDashboard();
  toast('Entry deleted.');
});

function openDetailModal(tradeId){
  const t = state.trades.find(x=>x.id===tradeId);
  if (!t) return;
  document.getElementById('detailTitle').textContent = `${t.instrument} · ${t.direction} · ${t.date}`;
  const pnlColor = t.pnl>0 ? 'text-profit' : t.pnl<0 ? 'text-loss' : 'text-muted';
  document.getElementById('detailBody').innerHTML = `
    <div class="grid grid-cols-2 gap-3">
      <div><div class="text-[11px] text-faint uppercase">Entry</div><div class="num">${t.entry ?? '—'}</div></div>
      <div><div class="text-[11px] text-faint uppercase">Exit</div><div class="num">${t.exit ?? '—'}</div></div>
      <div><div class="text-[11px] text-faint uppercase">Size</div><div class="num">${t.size ?? '—'}</div></div>
      <div><div class="text-[11px] text-faint uppercase">Planned risk</div><div class="num">${fmtMoney(t.risk)}</div></div>
      <div><div class="text-[11px] text-faint uppercase">P&amp;L</div><div class="num font-semibold ${pnlColor}">${t.pnl!==null?fmtMoney(t.pnl):'Open'}</div></div>
      <div><div class="text-[11px] text-faint uppercase">R multiple</div><div class="num">${t.rMultiple!==null && t.rMultiple!==undefined ? t.rMultiple.toFixed(2)+'R' : '—'}</div></div>
    </div>
    ${t.setup? `<div><div class="text-[11px] text-faint uppercase mb-1">Setup</div><div>${t.setup}</div></div>` : ''}
    ${t.tags && t.tags.length ? `<div class="flex flex-wrap gap-1">${t.tags.map(tag=>`<span class="chip on px-2 py-0.5 rounded-full text-xs">${tag}</span>`).join('')}</div>` : ''}
    ${t.newsEvent ? `<div><div class="text-[11px] text-faint uppercase mb-1">News event</div><div class="text-xs">${t.newsEvent}</div></div>` : ''}
    ${(t.preCatalyst||t.prePlan||t.preEmotion) ? `<div class="bg-panel2 rounded-lg p-3 border border-line"><div class="text-xs font-semibold text-gold mb-1">Pre-trade</div>
      ${t.preCatalyst?`<div class="text-xs text-muted mb-1"><i>${REFLECTION_PROMPTS.preCatalyst}</i></div><div class="text-sm mb-2">${t.preCatalyst}</div>`:''}
      ${t.prePlan?`<div class="text-xs text-muted mb-1"><i>${REFLECTION_PROMPTS.prePlan}</i></div><div class="text-sm mb-2">${t.prePlan}</div>`:''}
      ${t.preEmotion?`<div class="text-xs text-muted mb-1"><i>${REFLECTION_PROMPTS.preEmotion}</i></div><div class="text-sm">${t.preEmotion}</div>`:''}
    </div>`:''}
    ${(t.postRules||t.postChange||t.postEmotion) ? `<div class="bg-panel2 rounded-lg p-3 border border-line"><div class="text-xs font-semibold text-gold mb-1">Post-trade</div>
      ${t.postRules?`<div class="text-xs text-muted mb-1"><i>${REFLECTION_PROMPTS.postRules}</i></div><div class="text-sm mb-2">${t.postRules}</div>`:''}
      ${t.postChange?`<div class="text-xs text-muted mb-1"><i>${REFLECTION_PROMPTS.postChange}</i></div><div class="text-sm mb-2">${t.postChange}</div>`:''}
      ${t.postEmotion?`<div class="text-xs text-muted mb-1"><i>${REFLECTION_PROMPTS.postEmotion}</i></div><div class="text-sm">${t.postEmotion}</div>`:''}
    </div>`:''}
    ${t.screenshot ? `<img src="${t.screenshot}" class="rounded-lg border border-line w-full">` : ''}
  `;
  document.getElementById('detailEditBtn').onclick = ()=>{ closeDetailModal(); openTradeModal(tradeId); };
  document.getElementById('detailModal').classList.remove('hidden');
}
function closeDetailModal(){ document.getElementById('detailModal').classList.add('hidden'); }
document.getElementById('detailClose').addEventListener('click', closeDetailModal);
document.getElementById('detailCloseBtn').addEventListener('click', closeDetailModal);

function renderJournal(){
  populateInstrumentFilter();
  const search = document.getElementById('filterSearch').value.trim().toLowerCase();
  const result = document.getElementById('filterResult').value;
  const instFilter = document.getElementById('filterInstrument').value;

  let list = [...state.trades].sort((a,b)=> (b.date+b.time).localeCompare(a.date+a.time));
  list = list.filter(t=>{
    if (instFilter!=='all' && t.instrument!==instFilter) return false;
    if (result==='win' && !(t.pnl>0)) return false;
    if (result==='loss' && !(t.pnl<0)) return false;
    if (result==='open' && t.pnl!==null) return false;
    if (search){
      const hay = [t.instrument, t.setup, ...(t.tags||[])].join(' ').toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  const container = document.getElementById('tradeList');
  container.innerHTML = '';
  document.getElementById('emptyJournal').classList.toggle('hidden', state.trades.length>0);

  list.forEach(t=>{
    const pnlColor = t.pnl>0 ? 'text-profit' : t.pnl<0 ? 'text-loss' : 'text-muted';
    const dirColor = t.direction==='Long' ? 'text-profit border-profit/30 bg-profit/10' : 'text-loss border-loss/30 bg-loss/10';
    const row = document.createElement('button');
    row.className = 'w-full text-left bg-panel border border-line rounded-xl px-4 py-3 flex items-center justify-between hover:border-gold/40 transition';
    row.innerHTML = `
      <div class="flex items-center gap-3 min-w-0">
        <span class="text-xs font-medium border ${dirColor} rounded-md px-2 py-1">${t.direction}</span>
        <div class="min-w-0">
          <div class="font-semibold text-sm flex items-center gap-2">${t.instrument} ${t.setup?`<span class="text-faint font-normal text-xs">· ${t.setup}</span>`:''}</div>
          <div class="text-xs text-muted">${t.date} ${t.time}</div>
        </div>
      </div>
      <div class="text-right shrink-0">
        <div class="num font-semibold ${pnlColor}">${t.pnl!==null? fmtMoney(t.pnl) : 'Open'}</div>
        <div class="text-xs text-faint num">${t.rMultiple!==null && t.rMultiple!==undefined ? t.rMultiple.toFixed(2)+'R' : ''}</div>
      </div>
    `;
    row.addEventListener('click', ()=> openDetailModal(t.id));
    container.appendChild(row);
  });

  renderHeatmap();
  renderSetupChart();
  renderTimeOfDayChart();
}
function populateInstrumentFilter(){
  const sel = document.getElementById('filterInstrument');
  const current = sel.value;
  const syms = [...new Set(state.trades.map(t=>t.instrument))].sort();
  sel.innerHTML = '<option value="all">All instruments</option>' + syms.map(s=>`<option value="${s}">${s}</option>`).join('');
  if (syms.includes(current)) sel.value = current;
}
['filterSearch','filterResult','filterInstrument'].forEach(id=>{
  document.getElementById(id).addEventListener('input', renderJournal);
  document.getElementById(id).addEventListener('change', renderJournal);
});

document.getElementById('exportCsvBtn').addEventListener('click', ()=>{
  if (!state.trades.length){ toast('No trades to export yet.'); return; }
  const cols = ['date','time','instrument','direction','entry','exit','size','risk','pnl','rMultiple','setup','tags','newsEvent','preCatalyst','prePlan','preEmotion','postRules','postChange','postEmotion'];
  const rows = [cols.join(',')];
  state.trades.forEach(t=>{
    const row = cols.map(c=>{
      let v = t[c];
      if (Array.isArray(v)) v = v.join('|');
      if (v===null || v===undefined) v = '';
      v = String(v).replace(/"/g,'""');
      return `"${v}"`;
    });
    rows.push(row.join(','));
  });
  downloadBlob(rows.join('\n'), 'tradesafe_trades.csv', 'text/csv');
});
document.getElementById('exportJsonBtn').addEventListener('click', ()=>{
  if (!state.trades.length){ toast('No trades to export yet.'); return; }
  downloadBlob(JSON.stringify(state.trades, null, 2), 'tradesafe_trades.json', 'application/json');
});
function downloadBlob(content, filename, type){
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ---------- Journal charts ---------- */
let setupChartInstance=null, todChartInstance=null, equityChartInstance=null;
function cssColor(varName){
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v ? `rgb(${v})` : '#8B93A1';
}
function chartTheme(){
  return { grid:cssColor('--c-line'), text:cssColor('--c-muted'), gold:cssColor('--c-gold') };
}
// Re-draw all charts (used when the theme changes so colors match).
function rerenderCharts(){
  if (state.view === 'journal'){ renderSetupChart(); renderTimeOfDayChart(); }
  renderEquityChart();
}
function renderSetupChart(){
  const ctx = document.getElementById('setupChart');
  const bySetup = {};
  state.trades.forEach(t=>{
    const key = t.setup || 'Untagged';
    if (!bySetup[key]) bySetup[key] = {wins:0, total:0};
    if (t.pnl!==null){ bySetup[key].total++; if (t.pnl>0) bySetup[key].wins++; }
  });
  const labels = Object.keys(bySetup).filter(k=>bySetup[k].total>0);
  const data = labels.map(k=> Math.round((bySetup[k].wins/bySetup[k].total)*100));
  if (setupChartInstance) setupChartInstance.destroy();
  const th = chartTheme();
  setupChartInstance = new Chart(ctx, {
    type:'bar',
    data:{ labels, datasets:[{ data, backgroundColor:'#D4A24C', borderRadius:6, maxBarThickness:28 }]},
    options:{ plugins:{legend:{display:false}}, scales:{
      x:{ grid:{display:false}, ticks:{color:th.text, font:{size:10}} },
      y:{ min:0, max:100, grid:{color:th.grid}, ticks:{color:th.text, callback:v=>v+'%'} }
    }, responsive:true }
  });
}
function renderTimeOfDayChart(){
  const ctx = document.getElementById('todChart');
  const buckets = {Morning:{wins:0,total:0}, Midday:{wins:0,total:0}, Afternoon:{wins:0,total:0}};
  state.trades.forEach(t=>{
    if (t.pnl===null || !t.time) return;
    const hr = parseInt(t.time.split(':')[0],10);
    const key = hr<11 ? 'Morning' : hr<14 ? 'Midday' : 'Afternoon';
    buckets[key].total++; if (t.pnl>0) buckets[key].wins++;
  });
  const labels = Object.keys(buckets);
  const data = labels.map(k=> buckets[k].total ? Math.round((buckets[k].wins/buckets[k].total)*100) : 0);
  if (todChartInstance) todChartInstance.destroy();
  const th = chartTheme();
  todChartInstance = new Chart(ctx, {
    type:'bar',
    data:{ labels, datasets:[{ data, backgroundColor:'#5AA9E6', borderRadius:6, maxBarThickness:36 }]},
    options:{ plugins:{legend:{display:false}}, scales:{
      x:{ grid:{display:false}, ticks:{color:th.text} },
      y:{ min:0, max:100, grid:{color:th.grid}, ticks:{color:th.text, callback:v=>v+'%'} }
    }, responsive:true }
  });
}
function renderHeatmap(){
  const el = document.getElementById('heatmap');
  el.innerHTML = '';
  const days = 35;
  const byDate = {};
  state.trades.forEach(t=>{ if (t.pnl!==null){ byDate[t.date] = (byDate[t.date]||0) + t.pnl; } });
  const maxAbs = Math.max(1, ...Object.values(byDate).map(v=>Math.abs(v)));
  const today = new Date();
  const cells = [];
  for (let i=days-1;i>=0;i--){
    const d = new Date(today); d.setDate(d.getDate()-i);
    const iso = d.toISOString().slice(0,10);
    cells.push({iso, val: byDate[iso]});
  }
  cells.forEach(c=>{
    const div = document.createElement('div');
    let cls = 'heat-0';
    if (c.val!==undefined){
      const ratio = c.val/maxAbs;
      if (c.val>0) cls = ratio>0.66?'heat-win-4':ratio>0.33?'heat-win-3':ratio>0.05?'heat-win-2':'heat-win-1';
      else if (c.val<0) cls = ratio<-0.66?'heat-loss-4':ratio<-0.33?'heat-loss-3':ratio<-0.05?'heat-loss-2':'heat-loss-1';
    }
    div.className = `w-full aspect-square rounded-sm ${cls}`;
    div.title = c.val!==undefined ? `${c.iso}: ${fmtMoney(c.val)}` : c.iso;
    el.appendChild(div);
  });
}

/* ================================================================
   ECONOMIC NEWS CALENDAR (sample data, relative to current week)
   ================================================================ */
const NEWS_TEMPLATE = [
  // day offset from Monday, time, currency, impact, title, forecast, previous
  {day:0, time:'08:30', currency:'USD', impact:'medium', title:'Retail Sales m/m', forecast:'0.3%', previous:'0.1%'},
  {day:0, time:'10:00', currency:'EUR', impact:'low', title:'Industrial Production m/m', forecast:'0.2%', previous:'-0.1%'},
  {day:1, time:'08:30', currency:'USD', impact:'high', title:'CPI m/m', forecast:'0.2%', previous:'0.3%'},
  {day:1, time:'09:00', currency:'GBP', impact:'medium', title:'Claimant Count Change', forecast:'12.4k', previous:'15.2k'},
  {day:1, time:'14:00', currency:'USD', impact:'low', title:'Business Inventories m/m', forecast:'0.1%', previous:'0.2%'},
  {day:2, time:'08:15', currency:'EUR', impact:'high', title:'ECB Interest Rate Decision', forecast:'2.50%', previous:'2.50%'},
  {day:2, time:'08:30', currency:'USD', impact:'high', title:'Core Retail Sales m/m', forecast:'0.4%', previous:'0.2%'},
  {day:2, time:'08:30', currency:'CAD', impact:'medium', title:'Manufacturing Sales m/m', forecast:'0.5%', previous:'-0.3%'},
  {day:2, time:'08:30', currency:'USD', impact:'high', title:'Initial Jobless Claims', forecast:'225k', previous:'233k'},
  {day:3, time:'02:00', currency:'JPY', impact:'medium', title:'BoJ Policy Statement', forecast:'—', previous:'—'},
  {day:3, time:'08:30', currency:'USD', impact:'high', title:'PPI m/m', forecast:'0.2%', previous:'0.3%'},
  {day:3, time:'10:00', currency:'USD', impact:'medium', title:'Michigan Consumer Sentiment (prelim)', forecast:'68.5', previous:'67.9'},
  {day:4, time:'04:30', currency:'GBP', impact:'medium', title:'GDP m/m', forecast:'0.2%', previous:'0.0%'},
  {day:4, time:'08:30', currency:'USD', impact:'high', title:'Non-Farm Payrolls', forecast:'185k', previous:'175k'},
  {day:4, time:'08:30', currency:'USD', impact:'high', title:'Unemployment Rate', forecast:'4.1%', previous:'4.1%'},
  {day:4, time:'08:30', currency:'CAD', impact:'medium', title:'Employment Change', forecast:'22.0k', previous:'27.0k'},
];
function getWeekDates(){
  const now = new Date();
  const day = now.getDay(); // 0 Sun .. 6 Sat
  const diffToMonday = (day===0? -6 : 1-day);
  const monday = new Date(now); monday.setDate(now.getDate()+diffToMonday);
  const dates = [];
  for (let i=0;i<5;i++){ const d = new Date(monday); d.setDate(monday.getDate()+i); dates.push(d); }
  return dates;
}
// Cache of live events fetched from the ForexFactory feed (via /api/calendar).
// Stays null until the fetch succeeds, at which point we use real data.
let LIVE_EVENTS = null;
let calLoadState = 'idle'; // 'idle' | 'loading' | 'live' | 'error'

// Fallback: map the built-in sample template onto the current week's dates.
function getTemplateEvents(){
  const dates = getWeekDates();
  return NEWS_TEMPLATE.map(ev=>{
    const d = dates[ev.day];
    const iso = d.toISOString().slice(0,10);
    return {...ev, date: iso, weekday: d.toLocaleDateString(undefined,{weekday:'long', month:'short', day:'numeric'})};
  }).sort((a,b)=> (a.date+a.time).localeCompare(b.date+b.time));
}

function getWeekEvents(){
  return LIVE_EVENTS && LIVE_EVENTS.length ? LIVE_EVENTS : getTemplateEvents();
}

// Fetch the real ForexFactory calendar and re-render anything that shows events.
async function loadCalendar(){
  calLoadState = 'loading';
  try {
    const res = await fetch('/api/calendar', { cache: 'no-store' });
    if (!res.ok) throw new Error('feed ' + res.status);
    const data = await res.json();
    if (!data.events || !data.events.length) throw new Error('empty feed');
    LIVE_EVENTS = data.events;
    calLoadState = 'live';
  } catch (err) {
    console.log('[v0] calendar feed failed, using sample data:', err.message);
    calLoadState = 'error';
  }
  // Rebuild currency filters against the new dataset, then re-render consumers.
  const curBox = document.getElementById('currencyFilters');
  if (curBox) curBox.dataset.built = '';
  if (state.view === 'calendar') renderCalendar();
  renderDashboard();
}
let calFilters = {currency:'all', impact:'all'};
function renderCalendar(){
  const events = getWeekEvents();
  const eventDates = [...new Set(events.map(e=>e.date))].sort();
  const fmtLabel = (iso)=> new Date(iso+'T12:00:00Z').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
  if (eventDates.length){
    document.getElementById('calWeekLabel').textContent = fmtLabel(eventDates[0]) + ' – ' + fmtLabel(eventDates[eventDates.length-1]);
  } else {
    const dates = getWeekDates();
    document.getElementById('calWeekLabel').textContent =
      dates[0].toLocaleDateString(undefined,{month:'short',day:'numeric'}) + ' – ' + dates[4].toLocaleDateString(undefined,{month:'short',day:'numeric', year:'numeric'});
  }

  // Source badge so users know whether data is live from ForexFactory.
  const srcEl = document.getElementById('calSource');
  if (srcEl){
    if (calLoadState==='live') srcEl.textContent = 'Live · ForexFactory';
    else if (calLoadState==='loading') srcEl.textContent = 'Loading live data…';
    else if (calLoadState==='error') srcEl.textContent = 'Offline · sample data';
    else srcEl.textContent = '';
  }

  const priority = ['USD','EUR','GBP','JPY','CHF','CAD','AUD','NZD','CNY'];
  const currencies = [...new Set(events.map(e=>e.currency))]
    .sort((a,b)=>{ const ia=priority.indexOf(a), ib=priority.indexOf(b); return (ia<0?99:ia)-(ib<0?99:ib) || a.localeCompare(b); });
  const curBox = document.getElementById('currencyFilters');
  if (curBox.dataset.built !== '1'){
    // Currency set can change when live data loads, so rebuild these chips.
    calFilters.currency = 'all';
    curBox.innerHTML = `<button data-cur="all" class="currency-filter chip on px-3 py-1.5 rounded-full text-xs">All FX</button>` +
      currencies.map(c=>`<button data-cur="${c}" class="currency-filter chip px-3 py-1.5 rounded-full text-xs">${c}</button>`).join('');
    curBox.dataset.built = '1';
    curBox.querySelectorAll('.currency-filter').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        curBox.querySelectorAll('.currency-filter').forEach(b=>b.classList.remove('on'));
        btn.classList.add('on');
        calFilters.currency = btn.dataset.cur;
        renderCalendarList();
      });
    });
  }
  // Impact filter buttons are static markup — bind their listeners only once.
  if (!renderCalendar._impactBound){
    renderCalendar._impactBound = true;
    document.querySelectorAll('.impact-filter').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        document.querySelectorAll('.impact-filter').forEach(b=>b.classList.remove('on'));
        btn.classList.add('on');
        calFilters.impact = btn.dataset.impact;
        renderCalendarList();
      });
    });
  }
  renderCalendarList();
}
function renderCalendarList(){
  const events = getWeekEvents().filter(e=>{
    if (calFilters.currency!=='all' && e.currency!==calFilters.currency) return false;
    if (calFilters.impact!=='all' && e.impact!==calFilters.impact) return false;
    return true;
  });
  const byDay = {};
  events.forEach(e=>{ (byDay[e.date] = byDay[e.date]||[]).push(e); });

  const container = document.getElementById('calendarDays');
  container.innerHTML = '';
  const todayIso = todayISO();
  Object.keys(byDay).sort().forEach(date=>{
    const dayEvents = byDay[date];
    const wrap = document.createElement('div');
    const isToday = date===todayIso;
    wrap.innerHTML = `<div class="flex items-center gap-2 mb-2">
        <h3 class="font-display font-semibold text-sm">${dayEvents[0].weekday}</h3>
        ${isToday? '<span class="text-[10px] uppercase tracking-wide text-gold bg-gold/10 border border-goldSoft rounded-full px-2 py-0.5">Today</span>':''}
      </div>`;
    const list = document.createElement('div');
    list.className = 'space-y-2';
    dayEvents.forEach(e=>{
      const row = document.createElement('div');
      row.className = 'bg-panel border border-line rounded-xl px-4 py-3 flex items-center gap-4';
      row.innerHTML = `
        <div class="w-14 text-xs num text-muted shrink-0">${e.time}</div>
        <span class="w-2.5 h-2.5 rounded-full impact-${e.impact} shrink-0"></span>
        <div class="w-12 text-xs font-semibold shrink-0">${e.currency}</div>
        <div class="flex-1 min-w-0">
          <div class="text-sm">${e.title}</div>
        </div>
        <div class="hidden sm:flex gap-4 text-xs text-muted shrink-0">
          <div><span class="text-faint">Fcst</span> <span class="num">${e.forecast}</span></div>
          <div><span class="text-faint">Prev</span> <span class="num">${e.previous}</span></div>
        </div>
      `;
      list.appendChild(row);
    });
    wrap.appendChild(list);
    container.appendChild(wrap);
  });
  if (!events.length){
    container.innerHTML = '<div class="text-center text-muted py-16">No events match these filters.</div>';
  }
}

/* ================================================================
   DASHBOARD
   ================================================================ */
function renderDashboard(){
  document.getElementById('todayDate').textContent = new Date().toLocaleDateString(undefined,{weekday:'long', month:'long', day:'numeric'});
  const hr = new Date().getHours();
  document.getElementById('greeting').textContent = hr<12? 'Good morning.' : hr<17? 'Good afternoon.' : 'Good evening.';

  const today = todayISO();
  const todayTrades = state.trades.filter(t=>t.date===today);
  const todayPnl = todayTrades.reduce((s,t)=> s + (t.pnl||0), 0);
  document.getElementById('statTodayPnl').textContent = fmtMoney(todayPnl);
  document.getElementById('statTodayPnl').className = 'num text-xl font-semibold ' + (todayPnl>0?'text-profit':todayPnl<0?'text-loss':'');

  const openRisk = todayTrades.filter(t=>t.pnl===null).reduce((s,t)=> s + (t.risk||0), 0);
  document.getElementById('statOpenRisk').textContent = fmtMoney(openRisk);

  const cutoff = new Date(); cutoff.setDate(cutoff.getDate()-30);
  const recent = state.trades.filter(t=> t.pnl!==null && new Date(t.date) >= cutoff);
  const wins = recent.filter(t=>t.pnl>0).length;
  document.getElementById('statWinRate').textContent = recent.length ? Math.round((wins/recent.length)*100)+'%' : '—';
  document.getElementById('statTradeCount').textContent = state.trades.length;

  // recent trades
  const recentBox = document.getElementById('dashRecentTrades');
  const last5 = [...state.trades].sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time)).slice(0,5);
  recentBox.innerHTML = last5.length ? last5.map(t=>{
    const pnlColor = t.pnl>0?'text-profit':t.pnl<0?'text-loss':'text-muted';
    return `<div class="flex items-center justify-between text-sm border-b border-line last:border-0 pb-2 last:pb-0">
      <div><span class="font-semibold">${t.instrument}</span> <span class="text-faint text-xs">${t.date}</span></div>
      <div class="num ${pnlColor}">${t.pnl!==null?fmtMoney(t.pnl):'Open'}</div>
    </div>`;
  }).join('') : '<div class="text-muted text-sm">No trades yet — log your first from the Risk Sizer.</div>';

  // upcoming high impact news
  const now = new Date();
  const upcoming = getWeekEvents().filter(e=> e.impact==='high' && new Date(e.date+'T'+e.time) >= now).slice(0,4);
  document.getElementById('dashNews').innerHTML = upcoming.length ? upcoming.map(e=>`
    <div class="flex items-center gap-2 border-b border-line last:border-0 pb-2 last:pb-0">
      <span class="w-2 h-2 rounded-full impact-high shrink-0"></span>
      <div class="min-w-0 flex-1">
        <div class="truncate">${e.title}</div>
        <div class="text-xs text-faint">${e.currency} · ${e.weekday.split(',')[0]} ${e.time}</div>
      </div>
    </div>`).join('') : '<div class="text-muted text-sm">No high-impact events left this week.</div>';

  // favorites
  const favBox = document.getElementById('dashFavorites');
  favBox.innerHTML = state.favorites.map(sym=>{
    const inst = INSTRUMENTS.find(i=>i.symbol===sym);
    if (!inst) return '';
    return `<button class="fav-quick bg-panel2 border border-line rounded-lg px-3 py-2 text-left hover:border-gold/40 transition" data-sym="${sym}">
      <div class="text-sm font-semibold">${sym}</div>
      <div class="text-[10px] text-faint truncate">${inst.category}</div>
    </button>`;
  }).join('') || '<div class="text-muted text-sm col-span-full">No favorites yet — star instruments in the Risk Sizer.</div>';
  favBox.querySelectorAll('.fav-quick').forEach(btn=>{
    btn.addEventListener('click', ()=>{ setView('sizer'); selectInstrument(btn.dataset.sym); });
  });

  renderEquityChart();
}
function renderEquityChart(){
  const ctx = document.getElementById('dashEquityChart');
  const closed = [...state.trades].filter(t=>t.pnl!==null).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  let cum = 0;
  const labels = closed.map(t=>t.date);
  const data = closed.map(t=>{ cum += t.pnl; return Math.round(cum*100)/100; });
  if (equityChartInstance) equityChartInstance.destroy();
  const th = chartTheme();
  equityChartInstance = new Chart(ctx, {
    type:'line',
    data:{ labels: labels.length?labels:['Start'], datasets:[{
      data: data.length?data:[0], borderColor:th.gold, backgroundColor:'rgba(212,162,76,0.08)',
      fill:true, tension:0.3, pointRadius:0, borderWidth:2,
    }]},
    options:{ plugins:{legend:{display:false}}, scales:{
      x:{ grid:{display:false}, ticks:{color:th.text, maxTicksLimit:6, font:{size:10}} },
      y:{ grid:{color:th.grid}, ticks:{color:th.text, callback:v=>'$'+v} }
    }, responsive:true }
  });
}

/* ================================================================
   INIT
   ================================================================ */
function init(){
  applyTheme();
  hideIntro();
  const tt = document.getElementById('themeToggle');
  if (tt) tt.addEventListener('click', toggleTheme);
  const ttm = document.getElementById('themeToggleMobile');
  if (ttm) ttm.addEventListener('click', toggleTheme);

  refreshAccountDisplays();
  setRiskMode('dollar');
  setDirection('long');
  selectInstrument('ES');
  renderInstrumentList();
  renderDashboard();
  setView('dashboard');
  // Pull the live ForexFactory calendar; falls back to sample data on failure.
  loadCalendar();
}
init();
