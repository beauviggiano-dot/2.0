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
  sizePrecision: 'ts_size_precision',
  privacy: 'ts_privacy',
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
  sizePrecision: load(LS.sizePrecision, 1), // decimals for position size: 0, 1, or 2
  privacy: load(LS.privacy, false), // blur P&L values on the dashboard
  direction: 'long',
  catFilter: 'all',
  editingTradeId: null,
  pendingScreenshot: null,
  tradeCalAnchor: new Date(), // dashboard trade calendar current period
  tradeCalMode: 'month',      // 'month' or 'year'
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
  if (view==='backtest') renderBacktest();
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

// Size rounding precision: highlight the active button and recompute.
function updatePrecisionButtons(){
  document.querySelectorAll('.prec-btn').forEach(btn=>{
    const active = parseInt(btn.dataset.prec,10) === state.sizePrecision;
    btn.classList.toggle('bg-gold/10', active);
    btn.classList.toggle('text-gold', active);
    btn.classList.toggle('font-medium', active);
    btn.classList.toggle('text-muted', !active);
  });
}
document.querySelectorAll('.prec-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    state.sizePrecision = parseInt(btn.dataset.prec,10);
    save(LS.sizePrecision, state.sizePrecision);
    updatePrecisionButtons();
    calcSizer();
  });
});

let lastSizerResult = null;
function calcSizer(){
  const inst = state.selected;
  const riskInput = parseFloat(document.getElementById('riskValue').value) || 0;
  const stopDist = parseFloat(document.getElementById('stopDistance').value) || 0;
  const entry = parseFloat(document.getElementById('entryPrice').value);
  const target = parseFloat(document.getElementById('targetPrice').value);

  const riskDollar = state.riskMode==='percent' ? (state.account * riskInput/100) : riskInput;

  // User-selected rounding precision (0, 1, or 2 decimals). Always truncate
  // down so we never round up into more risk than the trader intended.
  const dp = state.sizePrecision;
  const factor = Math.pow(10, dp);
  const truncate = (v) => Math.floor(v * factor) / factor;

  let size = 0, riskPerUnit = 0, sizeLabel = 'Contracts', sizeSub = '';
  if (inst.category==='futures' || inst.category==='options'){
    const ticks = inst.tickSize>0 ? stopDist / inst.tickSize : 0;
    riskPerUnit = ticks * inst.tickValue;
    size = riskPerUnit>0 ? truncate(riskDollar / riskPerUnit) : 0;
    sizeLabel = 'Contracts';
    sizeSub = riskPerUnit>0 ? `${fmtMoney(riskPerUnit)} risk / contract` : '';
  } else if (inst.category==='forex'){
    riskPerUnit = stopDist * inst.pipValue; // per standard lot
    const lots = riskPerUnit>0 ? truncate(riskDollar/riskPerUnit) : 0;
    size = lots;
    sizeLabel = 'Lots (standard)';
    sizeSub = riskPerUnit>0 ? `${fmtMoney(riskPerUnit)} risk / lot · ${fmtNum(lots*100,0)} micro-lots` : '';
  }

  document.getElementById('resultSize').textContent = fmtNum(size, dp);
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

  const preview = document.getElementById('tScreenshotPreview');
  if (trade && trade.screenshot){ preview.src = trade.screenshot; preview.classList.remove('hidden'); state.pendingScreenshot = trade.screenshot; }
  else { preview.classList.add('hidden'); preview.src=''; }
  document.getElementById('tScreenshot').value = '';

  document.getElementById('tradeModal').classList.remove('hidden');
}
document.getElementById('newTradeBtn').addEventListener('click', ()=> openTradeModal(null, null));

// P&L stepper buttons: adjust by $10 per click, treating blank as 0.
function stepPnl(delta){
  const el = document.getElementById('tPnl');
  const current = el.value==='' ? 0 : (parseFloat(el.value) || 0);
  el.value = Math.round((current + delta) * 100) / 100;
}
document.getElementById('tPnlMinus').addEventListener('click', ()=> stepPnl(-10));
document.getElementById('tPnlPlus').addEventListener('click', ()=> stepPnl(10));
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
  const dateFilter = document.getElementById('filterDate').value;

  let list = [...state.trades].sort((a,b)=> (b.date+b.time).localeCompare(a.date+a.time));
  list = list.filter(t=>{
    if (instFilter!=='all' && t.instrument!==instFilter) return false;
    if (dateFilter && t.date!==dateFilter) return false;
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
['filterSearch','filterResult','filterInstrument','filterDate'].forEach(id=>{
  document.getElementById(id).addEventListener('input', renderJournal);
  document.getElementById(id).addEventListener('change', renderJournal);
});
document.getElementById('filterDateClear').addEventListener('click', ()=>{
  document.getElementById('filterDate').value = '';
  renderJournal();
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
   ECONOMIC NEWS CALENDAR (live ForexFactory data via /api/calendar)
   ================================================================ */

// ---- date helpers (all in local time, anchored to noon to dodge DST edges) ----
function ymd(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function monthKey(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; }
function startOfWeek(d){ // Monday
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay(); const diff = (day===0? -6 : 1-day);
  x.setDate(x.getDate()+diff); return x;
}

// Calendar UI state.
const calState = {
  mode: 'week',            // 'week' | 'month'
  anchor: new Date(),      // any date within the shown period
  monthCache: {},          // 'YYYY-MM' -> { events, status }
  currency: 'all',
  folders: new Set(['high','medium','low','holiday']),
  source: '',
};

// Fetch (and cache) one month of events. Adjacent months are pulled too so a
// week that straddles a month boundary still shows every day.
async function ensureMonth(key){
  if (calState.monthCache[key]) return calState.monthCache[key];
  const entry = { events: [], status: 'loading' };
  calState.monthCache[key] = entry;
  try {
    const res = await fetch(`/api/calendar?month=${key}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('feed ' + res.status);
    const data = await res.json();
    entry.events = (data.events || []).map(e=>({
      ...e,
      time: e.allDay ? 'All Day' : new Date(e.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
      weekday: new Date(e.day+'T12:00:00').toLocaleDateString(undefined,{weekday:'long', month:'short', day:'numeric'}),
    }));
    entry.status = 'live';
    calState.source = data.source || 'live';
  } catch (err) {
    console.log('[v0] calendar month load failed:', key, err.message);
    entry.status = 'error';
  }
  return entry;
}

// Return every cached event across all loaded months (deduped by id).
function allCachedEvents(){
  const seen = new Set(); const out = [];
  Object.values(calState.monthCache).forEach(m=>m.events.forEach(e=>{
    if (!seen.has(e.id)){ seen.add(e.id); out.push(e); }
  }));
  return out;
}

// Events for the current period (week or month) after folder + currency filters.
function periodEvents(){
  let from, to;
  if (calState.mode === 'week'){
    from = startOfWeek(calState.anchor);
    to = new Date(from); to.setDate(from.getDate()+7);
  } else {
    from = new Date(calState.anchor.getFullYear(), calState.anchor.getMonth(), 1);
    to = new Date(calState.anchor.getFullYear(), calState.anchor.getMonth()+1, 1);
  }
  const fromIso = ymd(from), toIso = ymd(to);
  return allCachedEvents().filter(e=>{
    if (e.day < fromIso || e.day >= toIso) return false;
    if (!calState.folders.has(e.impact)) return false;
    if (calState.currency !== 'all' && e.currency !== calState.currency) return false;
    return true;
  }).sort((a,b)=> (a.date).localeCompare(b.date));
}

// Backwards-compatible helper used by the dashboard + journal news dropdown:
// events for the real current week.
function getWeekEvents(){
  const from = startOfWeek(new Date());
  const to = new Date(from); to.setDate(from.getDate()+7);
  const fromIso = ymd(from), toIso = ymd(to);
  return allCachedEvents()
    .filter(e=> e.day>=fromIso && e.day<toIso)
    .sort((a,b)=> a.date.localeCompare(b.date));
}

// Load the months needed for the current anchor + period, then re-render.
async function loadCalendar(){
  const keys = new Set([monthKey(calState.anchor)]);
  // Include neighbouring months so straddling weeks are complete.
  const a = calState.anchor;
  keys.add(monthKey(new Date(a.getFullYear(), a.getMonth()-1, 15)));
  keys.add(monthKey(new Date(a.getFullYear(), a.getMonth()+1, 15)));
  // Always keep the real current week available for the dashboard.
  keys.add(monthKey(new Date()));
  updateCalSource('loading');
  await Promise.all([...keys].map(ensureMonth));
  if (state.view === 'calendar') renderCalendar();
  renderDashboard();
}

function updateCalSource(forced){
  const el = document.getElementById('calSource');
  if (!el) return;
  const cur = calState.monthCache[monthKey(calState.anchor)];
  const status = forced || (cur && cur.status) || 'idle';
  if (status==='loading') el.textContent = 'Loading…';
  else if (status==='error') el.textContent = 'Feed unavailable';
  else el.textContent = 'Live · ForexFactory';
}

function periodLabel(){
  if (calState.mode==='month'){
    return calState.anchor.toLocaleDateString(undefined,{month:'long', year:'numeric'});
  }
  const from = startOfWeek(calState.anchor);
  const to = new Date(from); to.setDate(from.getDate()+6);
  const l = from.toLocaleDateString(undefined,{month:'short', day:'numeric'});
  const r = to.toLocaleDateString(undefined,{month:'short', day:'numeric', year:'numeric'});
  return `${l} – ${r}`;
}

let _calBound = false;
function bindCalendarControls(){
  if (_calBound) return; _calBound = true;

  document.getElementById('calPrev').addEventListener('click', ()=>shiftPeriod(-1));
  document.getElementById('calNext').addEventListener('click', ()=>shiftPeriod(1));
  document.getElementById('calToday').addEventListener('click', ()=>{ calState.anchor = new Date(); loadCalendar(); });

  document.querySelectorAll('#calViewToggle button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      calState.mode = btn.dataset.mode;
      document.querySelectorAll('#calViewToggle button').forEach(b=>b.classList.toggle('on', b===btn));
      loadCalendar();
    });
  });

  document.querySelectorAll('.folder-cb').forEach(cb=>{
    cb.addEventListener('change', ()=>{
      const imp = cb.dataset.impact;
      if (cb.checked) calState.folders.add(imp); else calState.folders.delete(imp);
      cb.closest('.folder-check').classList.toggle('on', cb.checked);
      renderCalendarBody();
    });
  });
}

function shiftPeriod(dir){
  const a = calState.anchor;
  if (calState.mode==='month'){
    calState.anchor = new Date(a.getFullYear(), a.getMonth()+dir, 1);
  } else {
    calState.anchor = new Date(a.getFullYear(), a.getMonth(), a.getDate()+dir*7);
  }
  loadCalendar();
}

function renderCalendar(){
  bindCalendarControls();
  document.getElementById('calPeriodLabel').textContent = periodLabel();
  updateCalSource();

  // Build currency chips from everything currently loaded.
  const priority = ['USD','EUR','GBP','JPY','CHF','CAD','AUD','NZD','CNY'];
  const currencies = [...new Set(allCachedEvents().map(e=>e.currency))]
    .sort((a,b)=>{ const ia=priority.indexOf(a), ib=priority.indexOf(b); return (ia<0?99:ia)-(ib<0?99:ib) || a.localeCompare(b); });
  const curBox = document.getElementById('currencyFilters');
  if (curBox && curBox.dataset.sig !== currencies.join(',')){
    curBox.dataset.sig = currencies.join(',');
    curBox.innerHTML = `<button data-cur="all" class="currency-filter chip ${calState.currency==='all'?'on':''} px-3 py-1.5 rounded-full text-xs">All FX</button>` +
      currencies.map(c=>`<button data-cur="${c}" class="currency-filter chip ${calState.currency===c?'on':''} px-3 py-1.5 rounded-full text-xs">${c}</button>`).join('');
    curBox.querySelectorAll('.currency-filter').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        curBox.querySelectorAll('.currency-filter').forEach(b=>b.classList.remove('on'));
        btn.classList.add('on');
        calState.currency = btn.dataset.cur;
        renderCalendarBody();
      });
    });
  }
  renderCalendarBody();
}

function renderCalendarBody(){
  if (calState.mode==='month') renderCalendarMonth();
  else renderCalendarList();
}

function eventRowHtml(e){
  return `<div class="bg-panel border border-line rounded-xl px-4 py-3 flex items-center gap-4">
      <div class="w-16 text-xs num text-muted shrink-0">${e.time}</div>
      <span class="w-2.5 h-2.5 rounded-full impact-${e.impact} shrink-0"></span>
      <div class="w-12 text-xs font-semibold shrink-0">${e.currency}</div>
      <div class="flex-1 min-w-0"><div class="text-sm">${e.title}</div></div>
      <div class="hidden sm:flex gap-4 text-xs text-muted shrink-0">
        <div><span class="text-faint">Act</span> <span class="num">${e.actual ?? '—'}</span></div>
        <div><span class="text-faint">Fcst</span> <span class="num">${e.forecast ?? '—'}</span></div>
        <div><span class="text-faint">Prev</span> <span class="num">${e.previous ?? '—'}</span></div>
      </div>
    </div>`;
}

function renderCalendarList(){
  const monthGrid = document.getElementById('calendarMonth');
  const container = document.getElementById('calendarDays');
  const empty = document.getElementById('calEmpty');
  monthGrid.classList.add('hidden');
  container.classList.remove('hidden');
  container.innerHTML = '';

  const events = periodEvents();
  const byDay = {};
  events.forEach(e=>{ (byDay[e.day] = byDay[e.day]||[]).push(e); });
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
    list.innerHTML = dayEvents.map(eventRowHtml).join('');
    wrap.appendChild(list);
    container.appendChild(wrap);
  });

  empty.classList.toggle('hidden', events.length>0);
}

function renderCalendarMonth(){
  const container = document.getElementById('calendarDays');
  const grid = document.getElementById('calendarMonth');
  const empty = document.getElementById('calEmpty');
  container.classList.add('hidden');
  grid.classList.remove('hidden');

  const events = periodEvents();
  const byDay = {};
  events.forEach(e=>{ (byDay[e.day] = byDay[e.day]||[]).push(e); });
  empty.classList.toggle('hidden', events.length>0);

  const year = calState.anchor.getFullYear(), month = calState.anchor.getMonth();
  const first = new Date(year, month, 1);
  const gridStart = startOfWeek(first);
  const todayIso = todayISO();
  const rank = { high:0, medium:1, low:2, holiday:3 };

  const dows = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  let html = `<div class="grid grid-cols-7 gap-px bg-line border border-line rounded-xl overflow-hidden">`;
  html += dows.map(d=>`<div class="bg-panel2 text-center text-[11px] uppercase tracking-wide text-faint py-2">${d}</div>`).join('');

  for (let i=0;i<42;i++){
    const d = new Date(gridStart); d.setDate(gridStart.getDate()+i);
    const iso = ymd(d);
    const inMonth = d.getMonth()===month;
    const dayEvents = (byDay[iso]||[]).slice().sort((a,b)=> (rank[a.impact]-rank[b.impact]) || a.date.localeCompare(b.date));
    const isToday = iso===todayIso;
    const top = dayEvents.slice(0,3);
    const more = dayEvents.length - top.length;
    html += `<div class="bg-panel min-h-[92px] p-1.5 ${inMonth?'':'opacity-40'}">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs num ${isToday?'text-gold font-semibold':'text-muted'}">${d.getDate()}</span>
          ${isToday?'<span class="w-1.5 h-1.5 rounded-full bg-gold"></span>':''}
        </div>
        <div class="space-y-0.5">
          ${top.map(e=>`<div class="flex items-center gap-1 text-[10px] truncate" title="${e.time} ${e.currency} ${e.title.replace(/"/g,'')}">
              <span class="cal-dot impact-${e.impact}"></span>
              <span class="text-faint">${e.currency}</span>
              <span class="truncate">${e.title}</span>
            </div>`).join('')}
          ${more>0?`<div class="text-[10px] text-faint">+${more} more</div>`:''}
        </div>
      </div>`;
  }
  html += `</div>`;
  grid.innerHTML = html;
}

/* ================================================================
   DASHBOARD
   ================================================================ */
/* ---------- Privacy blur (hide P&L while streaming) ---------- */
function applyPrivacy(){
  document.body.classList.toggle('privacy-on', state.privacy);
  const btn = document.getElementById('privacyToggle');
  const label = document.getElementById('privacyLabel');
  if (btn) btn.setAttribute('aria-pressed', String(state.privacy));
  if (label) label.textContent = state.privacy ? 'Show P&L' : 'Hide P&L';
}
document.getElementById('privacyToggle').addEventListener('click', ()=>{
  state.privacy = !state.privacy;
  save(LS.privacy, state.privacy);
  applyPrivacy();
});

function renderDashboard(){
  document.getElementById('todayDate').textContent = new Date().toLocaleDateString(undefined,{weekday:'long', month:'long', day:'numeric'});
  const hr = new Date().getHours();
  document.getElementById('greeting').textContent = hr<12? 'Good morning.' : hr<17? 'Good afternoon.' : 'Good evening.';

  const today = todayISO();
  const todayTrades = state.trades.filter(t=>t.date===today);
  const todayPnl = todayTrades.reduce((s,t)=> s + (t.pnl||0), 0);
  document.getElementById('statTodayPnl').textContent = fmtMoney(todayPnl);
  document.getElementById('statTodayPnl').className = 'num sensitive text-xl font-semibold ' + (todayPnl>0?'text-profit':todayPnl<0?'text-loss':'');

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
      <div class="num sensitive ${pnlColor}">${t.pnl!==null?fmtMoney(t.pnl):'Open'}</div>
    </div>`;
  }).join('') : '<div class="text-muted text-sm">No trades yet — log your first from the Risk Sizer.</div>';

  // upcoming high impact news
  const now = new Date();
  const upcoming = getWeekEvents().filter(e=> e.impact==='high' && new Date(e.date) >= now).slice(0,4);
  document.getElementById('dashNews').innerHTML = upcoming.length ? upcoming.map(e=>`
    <div class="flex items-center gap-2 border-b border-line last:border-0 pb-2 last:pb-0">
      <span class="w-2 h-2 rounded-full impact-high shrink-0"></span>
      <div class="min-w-0 flex-1">
        <div class="truncate">${e.title}</div>
        <div class="text-xs text-faint">${e.currency} · ${(e.weekday||'').split(',')[0]} ${e.time}</div>
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
  renderTradeCalendar();
}

/* ---------- Dashboard trade calendar ---------- */
let _tcBound = false;
function bindTradeCalendar(){
  if (_tcBound) return; _tcBound = true;
  document.querySelectorAll('.tc-mode').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      state.tradeCalMode = btn.dataset.mode;
      renderTradeCalendar();
    });
  });
  document.getElementById('tcPrev').addEventListener('click', ()=> tcStep(-1));
  document.getElementById('tcNext').addEventListener('click', ()=> tcStep(1));
  document.getElementById('tcToday').addEventListener('click', ()=>{
    state.tradeCalAnchor = new Date();
    renderTradeCalendar();
  });
}
function tcStep(dir){
  const a = state.tradeCalAnchor;
  state.tradeCalAnchor = state.tradeCalMode==='year'
    ? new Date(a.getFullYear()+dir, 0, 1)
    : new Date(a.getFullYear(), a.getMonth()+dir, 1);
  renderTradeCalendar();
}
// Sum closed-trade P&L per ISO day.
function tradesByDay(){
  const map = {};
  state.trades.forEach(t=>{
    if (t.pnl===null || t.pnl===undefined) return;
    (map[t.date] = map[t.date] || { pnl:0, count:0 });
    map[t.date].pnl += t.pnl; map[t.date].count++;
  });
  return map;
}
function renderTradeCalendar(){
  bindTradeCalendar();
  document.querySelectorAll('.tc-mode').forEach(btn=>{
    const active = btn.dataset.mode===state.tradeCalMode;
    btn.classList.toggle('bg-gold/10', active);
    btn.classList.toggle('text-gold', active);
    btn.classList.toggle('font-medium', active);
    btn.classList.toggle('text-muted', !active);
  });
  if (state.tradeCalMode==='year') renderTradeCalYear();
  else renderTradeCalMonth();
}
function renderTradeCalMonth(){
  const anchor = state.tradeCalAnchor;
  const year = anchor.getFullYear(), month = anchor.getMonth();
  document.getElementById('tcLabel').textContent = anchor.toLocaleDateString(undefined,{month:'long', year:'numeric'});

  const byDay = tradesByDay();
  const gridStart = startOfWeek(new Date(year, month, 1));
  const todayIso = todayISO();
  let monthPnl = 0, green = 0, red = 0;

  const dows = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  let html = `<div class="grid grid-cols-7 gap-px bg-line border border-line rounded-xl overflow-hidden">`;
  html += dows.map(d=>`<div class="bg-panel2 text-center text-[11px] uppercase tracking-wide text-faint py-2">${d}</div>`).join('');
  for (let i=0;i<42;i++){
    const d = new Date(gridStart); d.setDate(gridStart.getDate()+i);
    const iso = ymd(d);
    const inMonth = d.getMonth()===month;
    const day = byDay[iso];
    const isToday = iso===todayIso;
    if (inMonth && day){ monthPnl += day.pnl; if (day.pnl>0) green++; else if (day.pnl<0) red++; }
    let cellBg = 'bg-panel', pnlHtml = '';
    if (day && inMonth){
      cellBg = day.pnl>0 ? 'bg-profit/10' : day.pnl<0 ? 'bg-loss/10' : 'bg-panel';
      const c = day.pnl>0 ? 'text-profit' : day.pnl<0 ? 'text-loss' : 'text-muted';
      pnlHtml = `<div class="num sensitive text-[11px] font-semibold ${c} mt-1 truncate">${fmtMoney(day.pnl)}</div>
        <div class="text-[9px] text-faint">${day.count} trade${day.count>1?'s':''}</div>`;
    }
    html += `<div class="${cellBg} min-h-[68px] p-1.5 ${inMonth?'':'opacity-40'}">
        <div class="text-xs num ${isToday?'text-gold font-semibold':'text-muted'}">${d.getDate()}</div>
        ${pnlHtml}
      </div>`;
  }
  html += `</div>`;
  document.getElementById('tcBody').innerHTML = html;

  document.getElementById('tcStat1Label').textContent = 'Month P&L';
  document.getElementById('tcStat2Label').textContent = 'Green days';
  document.getElementById('tcStat3Label').textContent = 'Red days';
  const s1 = document.getElementById('tcStat1');
  s1.textContent = fmtMoney(monthPnl);
  s1.className = 'num sensitive font-semibold ' + (monthPnl>0?'text-profit':monthPnl<0?'text-loss':'');
  document.getElementById('tcStat2').textContent = green;
  document.getElementById('tcStat3').textContent = red;
}
function renderTradeCalYear(){
  const year = state.tradeCalAnchor.getFullYear();
  document.getElementById('tcLabel').textContent = String(year);

  const byMonth = Array.from({length:12}, ()=>({ pnl:0, count:0 }));
  state.trades.forEach(t=>{
    if (t.pnl===null || t.pnl===undefined) return;
    const d = new Date(t.date + 'T00:00:00');
    if (d.getFullYear()!==year) return;
    byMonth[d.getMonth()].pnl += t.pnl; byMonth[d.getMonth()].count++;
  });
  let yearPnl = 0, green = 0, red = 0;
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let html = `<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">`;
  for (let m=0;m<12;m++){
    const mm = byMonth[m];
    yearPnl += mm.pnl;
    if (mm.pnl>0) green++; else if (mm.pnl<0) red++;
    const c = mm.pnl>0 ? 'text-profit' : mm.pnl<0 ? 'text-loss' : 'text-muted';
    const hover = mm.pnl>0 ? 'hover:border-profit/40' : mm.pnl<0 ? 'hover:border-loss/40' : 'hover:border-gold/40';
    html += `<button class="tc-month-card bg-panel2 border border-line rounded-xl p-4 text-left ${hover} transition" data-month="${m}">
        <div class="text-sm font-semibold">${names[m]}</div>
        <div class="num sensitive text-lg font-semibold mt-1 ${c}">${mm.count?fmtMoney(mm.pnl):'—'}</div>
        <div class="text-[10px] text-faint mt-0.5">${mm.count} trade${mm.count===1?'':'s'}</div>
      </button>`;
  }
  html += `</div>`;
  const body = document.getElementById('tcBody');
  body.innerHTML = html;
  body.querySelectorAll('.tc-month-card').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      state.tradeCalAnchor = new Date(year, parseInt(btn.dataset.month,10), 1);
      state.tradeCalMode = 'month';
      renderTradeCalendar();
    });
  });

  document.getElementById('tcStat1Label').textContent = 'Year P&L';
  document.getElementById('tcStat2Label').textContent = 'Green months';
  document.getElementById('tcStat3Label').textContent = 'Red months';
  const s1 = document.getElementById('tcStat1');
  s1.textContent = fmtMoney(yearPnl);
  s1.className = 'num sensitive font-semibold ' + (yearPnl>0?'text-profit':yearPnl<0?'text-loss':'');
  document.getElementById('tcStat2').textContent = green;
  document.getElementById('tcStat3').textContent = red;
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
   BACKTESTING
   ================================================================ */
let btEquityChartInstance = null;

// Resolve a trade's dollar result. R-multiple trades use the strategy's risk.
function btTradePnl(trade, strategy){
  if (trade.resultType === 'r'){
    const risk = strategy && strategy.risk ? strategy.risk : 0;
    return (trade.r || 0) * risk;
  }
  return trade.pnl || 0;
}

function btStats(strategy){
  const trades = (strategy.trades || []).slice().sort((a,b)=> (a.date||'').localeCompare(b.date||''));
  const start = strategy.capital || 0;
  let equity = start, peak = start, maxDD = 0;
  let wins = 0, losses = 0, grossWin = 0, grossLoss = 0, net = 0;
  const curve = [{ label: 'Start', value: start }];
  trades.forEach((t,i)=>{
    const pnl = btTradePnl(t, strategy);
    net += pnl; equity += pnl;
    if (pnl > 0){ wins++; grossWin += pnl; }
    else if (pnl < 0){ losses++; grossLoss += Math.abs(pnl); }
    peak = Math.max(peak, equity);
    maxDD = Math.max(maxDD, peak - equity);
    curve.push({ label: t.date || ('#'+(i+1)), value: equity });
  });
  const decided = wins + losses;
  return {
    trades, count: trades.length, net, wins, losses,
    winRate: decided ? (wins/decided)*100 : 0,
    profitFactor: grossLoss ? grossWin/grossLoss : (grossWin ? Infinity : 0),
    expectancy: trades.length ? net/trades.length : 0,
    avgWin: wins ? grossWin/wins : 0,
    avgLoss: losses ? -grossLoss/losses : 0,
    maxDD, endEquity: equity, start, curve,
  };
}

function renderBacktest(){
  bindBacktestControls();
  renderStrategyList();
  const strat = state.backtests.find(s=>s.id===state.selectedBacktestId) || state.backtests[0] || null;
  state.selectedBacktestId = strat ? strat.id : null;
  const empty = document.getElementById('btEmpty');
  const detail = document.getElementById('btDetail');
  if (!strat){ empty.classList.remove('hidden'); detail.classList.add('hidden'); return; }
  empty.classList.add('hidden'); detail.classList.remove('hidden');
  renderStrategyDetail(strat);
}

function renderStrategyList(){
  const box = document.getElementById('strategyList');
  if (!state.backtests.length){
    box.innerHTML = '<div class="text-muted text-sm px-1 py-4">No strategies yet.</div>';
    return;
  }
  box.innerHTML = state.backtests.map(s=>{
    const st = btStats(s);
    const active = s.id===state.selectedBacktestId;
    const pnlClass = st.net>0?'text-profit':st.net<0?'text-loss':'text-muted';
    return `<button class="strategy-item w-full text-left rounded-lg px-3 py-2.5 border ${active?'border-goldSoft bg-gold/10':'border-line bg-panel2 hover:border-goldSoft'}" data-id="${s.id}">
        <div class="font-medium text-sm truncate">${s.name}</div>
        <div class="flex items-center justify-between mt-1 text-xs">
          <span class="text-faint">${st.count} trade${st.count===1?'':'s'}</span>
          <span class="num ${pnlClass}">${fmtMoney(st.net)}</span>
        </div>
      </button>`;
  }).join('');
  box.querySelectorAll('.strategy-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.selectedBacktestId = btn.dataset.id; renderBacktest(); });
  });
}

function renderStrategyDetail(strat){
  const st = btStats(strat);
  document.getElementById('btName').textContent = strat.name;
  document.getElementById('btDesc').textContent = strat.desc || '';
  document.getElementById('btCapital').textContent = fmtMoney(strat.capital || 0);

  const netEl = document.getElementById('btNetPnl');
  netEl.textContent = fmtMoney(st.net);
  netEl.className = 'num text-xl font-semibold mt-1 ' + (st.net>0?'text-profit':st.net<0?'text-loss':'');
  document.getElementById('btWinRate').textContent = st.count ? st.winRate.toFixed(1)+'%' : '—';
  document.getElementById('btProfitFactor').textContent = st.count ? (st.profitFactor===Infinity ? '∞' : fmtNum(st.profitFactor,2)) : '—';
  document.getElementById('btExpectancy').textContent = st.count ? fmtMoney(st.expectancy) : '—';
  document.getElementById('btTotal').textContent = st.count;
  document.getElementById('btAvgWin').textContent = st.wins ? fmtMoney(st.avgWin) : '—';
  document.getElementById('btAvgLoss').textContent = st.losses ? fmtMoney(st.avgLoss) : '—';
  document.getElementById('btMaxDD').textContent = st.maxDD ? fmtMoney(-st.maxDD) : '—';

  renderBtEquityChart(st);
  renderBtTradeList(strat);
}

function renderBtEquityChart(st){
  const ctx = document.getElementById('btEquityChart');
  if (!ctx) return;
  if (btEquityChartInstance) btEquityChartInstance.destroy();
  const th = chartTheme();
  const up = st.endEquity >= st.start;
  const line = up ? cssColor('--c-profit') : cssColor('--c-loss');
  btEquityChartInstance = new Chart(ctx, {
    type:'line',
    data:{ labels: st.curve.map(p=>p.label), datasets:[{
      data: st.curve.map(p=>p.value), borderColor: line, backgroundColor: line+'22',
      fill:true, tension:0.25, pointRadius:0, borderWidth:2,
    }]},
    options:{ plugins:{legend:{display:false}}, scales:{
      x:{ grid:{display:false}, ticks:{color:th.text, font:{size:10}, maxTicksLimit:8} },
      y:{ grid:{color:th.grid}, ticks:{color:th.text, callback:v=>'$'+v.toLocaleString()} }
    }, responsive:true, maintainAspectRatio:false }
  });
}

function renderBtTradeList(strat){
  const list = document.getElementById('btTradeList');
  const empty = document.getElementById('btTradeEmpty');
  const dateFilter = document.getElementById('btFilterDate').value;
  const trades = (strat.trades || [])
    .filter(t=> !dateFilter || t.date===dateFilter)
    .slice().sort((a,b)=> (b.date||'').localeCompare(a.date||''));
  empty.classList.toggle('hidden', trades.length>0);
  empty.textContent = dateFilter && !trades.length
    ? 'No simulated trades on this date.'
    : 'No trades yet — add simulated trades to test this strategy.';
  list.innerHTML = trades.map(t=>{
    const pnl = btTradePnl(t, strat);
    const pnlClass = pnl>0?'text-profit':pnl<0?'text-loss':'text-muted';
    const resultLabel = t.resultType==='r' ? `${t.r>0?'+':''}${fmtNum(t.r,2)}R` : fmtMoney(pnl);
    return `<button class="bt-trade-item w-full text-left bg-panel2 border border-line rounded-xl px-4 py-3 flex items-center gap-4 hover:border-goldSoft" data-id="${t.id}">
        <div class="w-24 text-xs num text-muted shrink-0">${t.date || '—'}</div>
        <div class="w-14 text-xs font-semibold shrink-0">${t.instrument || '—'}</div>
        <div class="w-14 text-xs shrink-0 ${t.direction==='Short'?'text-loss':'text-profit'}">${t.direction || ''}</div>
        <div class="flex-1 min-w-0 text-sm truncate text-muted">${t.notes || ''}</div>
        <div class="num text-sm font-semibold shrink-0 ${pnlClass}">${resultLabel}</div>
      </button>`;
  }).join('');
  list.querySelectorAll('.bt-trade-item').forEach(btn=>{
    btn.addEventListener('click', ()=> openBtTradeModal(btn.dataset.id));
  });
}

/* ---------- Strategy modal ---------- */
function openStrategyModal(id){
  state.editingBacktestId = id || null;
  const s = id ? state.backtests.find(x=>x.id===id) : null;
  document.getElementById('strategyModalTitle').textContent = s ? 'Edit strategy' : 'New strategy';
  document.getElementById('sName').value = s ? s.name : '';
  document.getElementById('sDesc').value = s ? (s.desc||'') : '';
  document.getElementById('sCapital').value = s ? s.capital : 10000;
  document.getElementById('sRisk').value = s ? (s.risk||'') : 100;
  document.getElementById('strategyDeleteBtn').classList.toggle('hidden', !s);
  document.getElementById('strategyModal').classList.remove('hidden');
}
function closeStrategyModal(){ document.getElementById('strategyModal').classList.add('hidden'); state.editingBacktestId=null; }
function saveStrategy(){
  const name = document.getElementById('sName').value.trim();
  if (!name){ toast('Strategy needs a name'); return; }
  const capital = parseFloat(document.getElementById('sCapital').value) || 0;
  const risk = parseFloat(document.getElementById('sRisk').value) || 0;
  const desc = document.getElementById('sDesc').value.trim();
  if (state.editingBacktestId){
    const s = state.backtests.find(x=>x.id===state.editingBacktestId);
    if (s){ s.name=name; s.desc=desc; s.capital=capital; s.risk=risk; }
  } else {
    const s = { id: uid(), name, desc, capital, risk, trades: [] };
    state.backtests.push(s);
    state.selectedBacktestId = s.id;
  }
  save(LS.backtests, state.backtests);
  closeStrategyModal();
  renderBacktest();
  toast('Strategy saved');
}
function deleteStrategy(){
  if (!state.editingBacktestId) return;
  state.backtests = state.backtests.filter(s=>s.id!==state.editingBacktestId);
  if (state.selectedBacktestId===state.editingBacktestId) state.selectedBacktestId = null;
  save(LS.backtests, state.backtests);
  closeStrategyModal();
  renderBacktest();
  toast('Strategy deleted');
}

/* ---------- Backtest trade modal ---------- */
function syncBtResultType(){
  const type = document.getElementById('btResultType').value;
  document.getElementById('btDollarWrap').classList.toggle('hidden', type!=='dollar');
  document.getElementById('btRWrap').classList.toggle('hidden', type!=='r');
}
function openBtTradeModal(id){
  const strat = state.backtests.find(s=>s.id===state.selectedBacktestId);
  if (!strat) return;
  state.editingBtTradeId = id || null;
  const t = id ? (strat.trades||[]).find(x=>x.id===id) : null;
  document.getElementById('btTradeModalTitle').textContent = t ? 'Edit simulated trade' : 'Add simulated trade';
  document.getElementById('btDate').value = t ? (t.date||'') : todayISO();
  document.getElementById('btInstrument').value = t ? (t.instrument||'') : '';
  document.getElementById('btDirection').value = t ? (t.direction||'Long') : 'Long';
  document.getElementById('btResultType').value = t ? (t.resultType||'dollar') : 'dollar';
  document.getElementById('btPnl').value = t && t.resultType!=='r' ? (t.pnl ?? '') : '';
  document.getElementById('btR').value = t && t.resultType==='r' ? (t.r ?? '') : '';
  document.getElementById('btNotes').value = t ? (t.notes||'') : '';
  document.getElementById('btTradeDeleteBtn').classList.toggle('hidden', !t);
  syncBtResultType();
  document.getElementById('btTradeModal').classList.remove('hidden');
}
function closeBtTradeModal(){ document.getElementById('btTradeModal').classList.add('hidden'); state.editingBtTradeId=null; }
function saveBtTrade(){
  const strat = state.backtests.find(s=>s.id===state.selectedBacktestId);
  if (!strat) return;
  const resultType = document.getElementById('btResultType').value;
  const trade = {
    id: state.editingBtTradeId || uid(),
    date: document.getElementById('btDate').value || todayISO(),
    instrument: document.getElementById('btInstrument').value.trim(),
    direction: document.getElementById('btDirection').value,
    resultType,
    pnl: resultType==='dollar' ? (parseFloat(document.getElementById('btPnl').value) || 0) : null,
    r: resultType==='r' ? (parseFloat(document.getElementById('btR').value) || 0) : null,
    notes: document.getElementById('btNotes').value.trim(),
  };
  strat.trades = strat.trades || [];
  if (state.editingBtTradeId){
    const idx = strat.trades.findIndex(x=>x.id===state.editingBtTradeId);
    if (idx>=0) strat.trades[idx] = trade;
  } else {
    strat.trades.push(trade);
  }
  save(LS.backtests, state.backtests);
  closeBtTradeModal();
  renderBacktest();
  toast('Trade saved');
}
function deleteBtTrade(){
  const strat = state.backtests.find(s=>s.id===state.selectedBacktestId);
  if (!strat || !state.editingBtTradeId) return;
  strat.trades = (strat.trades||[]).filter(x=>x.id!==state.editingBtTradeId);
  save(LS.backtests, state.backtests);
  closeBtTradeModal();
  renderBacktest();
  toast('Trade deleted');
}

let _btBound = false;
function bindBacktestControls(){
  if (_btBound) return; _btBound = true;
  document.getElementById('newBacktestBtn').addEventListener('click', ()=> openStrategyModal());
  document.getElementById('btEditBtn').addEventListener('click', ()=> openStrategyModal(state.selectedBacktestId));
  document.getElementById('strategyModalClose').addEventListener('click', closeStrategyModal);
  document.getElementById('strategyCancelBtn').addEventListener('click', closeStrategyModal);
  document.getElementById('strategySaveBtn').addEventListener('click', saveStrategy);
  document.getElementById('strategyDeleteBtn').addEventListener('click', deleteStrategy);
  document.getElementById('btAddTradeBtn').addEventListener('click', ()=> openBtTradeModal());
  document.getElementById('btTradeModalClose').addEventListener('click', closeBtTradeModal);
  document.getElementById('btTradeCancelBtn').addEventListener('click', closeBtTradeModal);
  document.getElementById('btTradeSaveBtn').addEventListener('click', saveBtTrade);
  document.getElementById('btTradeDeleteBtn').addEventListener('click', deleteBtTrade);
  document.getElementById('btResultType').addEventListener('change', syncBtResultType);
  const rerunBtList = ()=>{
    const strat = state.backtests.find(s=>s.id===state.selectedBacktestId);
    if (strat) renderBtTradeList(strat);
  };
  document.getElementById('btFilterDate').addEventListener('input', rerunBtList);
  document.getElementById('btFilterDate').addEventListener('change', rerunBtList);
  document.getElementById('btFilterDateClear').addEventListener('click', ()=>{
    document.getElementById('btFilterDate').value = '';
    rerunBtList();
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
  updatePrecisionButtons();
  applyPrivacy();
  selectInstrument('ES');
  renderInstrumentList();
  renderDashboard();
  setView('dashboard');
  // Pull the live ForexFactory calendar; falls back to sample data on failure.
  loadCalendar();
}
init();
