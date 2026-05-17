const API_KEY  = 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const sForm      = document.getElementById('sForm');
const cInput     = document.getElementById('cInput');
const errMsg     = document.getElementById('errMsg');
const dashboard  = document.getElementById('dashboard');
const locHero    = document.getElementById('locHero');
const locName    = document.getElementById('locName');
const locCountry = document.getElementById('locCountry');
const locClock   = document.getElementById('locClock');
const cardGrid   = document.getElementById('cardGrid');

let clockTick = null;
function emoji(id) {
  if (id >= 200 && id < 300) return '⛈️';
  if (id >= 300 && id < 400) return '🌦️';
  if (id >= 500 && id < 600) return '🌧️';
  if (id >= 600 && id < 700) return '❄️';
  if (id >= 700 && id < 800) return '🌫️';
  if (id === 800)             return '☀️';
  if (id > 800)               return '☁️';
  return '🌡️';
}

function getTheme(id, rise, set) {
  const now = Date.now() / 1000;
  if (now < rise || now > set) return 'night';
  if (id >= 200 && id < 300)   return 'storm';
  if (id >= 300 && id < 600)   return 'rain';
  if (id >= 600 && id < 700)   return 'snow';
  if (id >= 700 && id < 800)   return 'fog';
  if (id === 800)               return 'clear-day';
  return 'cloudy';
}

function fmtTime(ts, tz) {
  const d = new Date((ts + tz) * 1000);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
}

function fmtDay(ts) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(ts * 1000).getDay()];
}

function dirStr(deg) {
  return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];
}

function noAnim() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function counter(el, from, to, ms, toFixed = 0) {
  if (!el) return;
  if (noAnim()) { el.textContent = to.toFixed(toFixed); return; }

  const t0 = performance.now();
  (function step(now) {
    const p = Math.min((now - t0) / ms, 1);
    const eased = 1 - Math.pow(1 - p, 3);          // cubic ease-out
    el.textContent = (from + (to - from) * eased).toFixed(toFixed);
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

function wxIcon(id, rise, set) {
  const isNight = Date.now() / 1000 < rise || Date.now() / 1000 > set;
  if (id >= 200 && id < 300) return iconStorm();
  if (id >= 300 && id < 600) return iconRain();
  if (id >= 600 && id < 700) return iconSnow();
  if (id >= 700 && id < 800) return iconFog();
  if (id === 800)             return isNight ? iconMoon() : iconSun();
  if (id > 800)               return iconCloud();
  return iconSun();
}

function iconSun() {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = i * 45 * Math.PI / 180;
    const c = Math.cos(a), s = Math.sin(a);
    return `<line x1="${(50 + c * 30).toFixed(1)}" y1="${(50 + s * 30).toFixed(1)}"
                  x2="${(50 + c * 42).toFixed(1)}" y2="${(50 + s * 42).toFixed(1)}"
                  stroke="#fbbf24" stroke-width="3.5" stroke-linecap="round"/>`;
  }).join('');
  return `
    <svg class="wx-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
      <g class="sun-rays" style="transform-origin:50px 50px">${rays}</g>
      <circle class="sun-core" cx="50" cy="50" r="21" fill="#fbbf24"/>
      <circle cx="50" cy="50" r="16" fill="#fde68a"/>
    </svg>`;
}

function iconMoon() {
  return `
    <svg class="wx-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
      <path d="M55 18C34 18 21 34 21 52c0 18 13 30 31 30 14 0 24-7 29-18-9 3-19 1-26-7-7-8-9-20 0-39Z" fill="#e0e7ff" opacity="0.92"/>
      <circle cx="73" cy="27" r="3"   fill="#c7d2fe" opacity="0.65"/>
      <circle cx="81" cy="45" r="2"   fill="#c7d2fe" opacity="0.45"/>
      <circle cx="66" cy="17" r="1.5" fill="#c7d2fe" opacity="0.55"/>
    </svg>`;
}

function iconCloud() {
  return `
    <svg class="wx-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
      <g class="cloud-float">
        <ellipse cx="50" cy="60" rx="34" ry="18" fill="#94a3b8" opacity="0.88"/>
        <circle cx="36" cy="53" r="16" fill="#94a3b8" opacity="0.88"/>
        <circle cx="57" cy="46" r="21" fill="#94a3b8" opacity="0.92"/>
        <circle cx="73" cy="55" r="13" fill="#94a3b8" opacity="0.82"/>
        <ellipse cx="50" cy="58" rx="32" ry="15" fill="#cbd5e1" opacity="0.45"/>
      </g>
    </svg>`;
}

function iconRain() {
  return `
    <svg class="wx-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
      <g class="cloud-float">
        <ellipse cx="50" cy="44" rx="30" ry="14" fill="#64748b" opacity="0.92"/>
        <circle cx="33" cy="40" r="13" fill="#64748b" opacity="0.92"/>
        <circle cx="54" cy="33" r="18" fill="#64748b" opacity="0.95"/>
        <circle cx="69" cy="40" r="12" fill="#64748b" opacity="0.85"/>
      </g>
      <line class="rd" x1="35" y1="62" x2="31" y2="74" stroke="#93c5fd" stroke-width="2.5" stroke-linecap="round"/>
      <line class="rd" x1="47" y1="64" x2="43" y2="76" stroke="#93c5fd" stroke-width="2.5" stroke-linecap="round"/>
      <line class="rd" x1="59" y1="62" x2="55" y2="74" stroke="#93c5fd" stroke-width="2.5" stroke-linecap="round"/>
      <line class="rd" x1="41" y1="74" x2="37" y2="86" stroke="#93c5fd" stroke-width="2"   stroke-linecap="round" opacity="0.65"/>
      <line class="rd" x1="53" y1="76" x2="49" y2="88" stroke="#93c5fd" stroke-width="2"   stroke-linecap="round" opacity="0.65"/>
      <line class="rd" x1="65" y1="72" x2="61" y2="84" stroke="#93c5fd" stroke-width="2"   stroke-linecap="round" opacity="0.65"/>
    </svg>`;
}

function iconStorm() {
  return `
    <svg class="wx-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
      <g class="cloud-float">
        <ellipse cx="50" cy="38" rx="30" ry="14" fill="#475569" opacity="0.95"/>
        <circle cx="32" cy="34" r="13" fill="#475569" opacity="0.95"/>
        <circle cx="53" cy="27" r="18" fill="#475569"/>
        <circle cx="69" cy="34" r="12" fill="#475569" opacity="0.9"/>
      </g>
      <line class="rd" x1="36" y1="56" x2="32" y2="68" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round"/>
      <line class="rd" x1="63" y1="56" x2="59" y2="68" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round"/>
      <polygon class="bolt" points="54,54 45,68 52,68 47,82 61,64 54,64" fill="#fde68a"/>
    </svg>`;
}

function iconSnow() {
  return `
    <svg class="wx-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
      <g class="cloud-float">
        <ellipse cx="50" cy="40" rx="30" ry="15" fill="#7dd3fc" opacity="0.72"/>
        <circle cx="33" cy="36" r="13" fill="#7dd3fc" opacity="0.72"/>
        <circle cx="54" cy="29" r="18" fill="#bae6fd" opacity="0.8"/>
        <circle cx="69" cy="36" r="12" fill="#7dd3fc" opacity="0.65"/>
      </g>
      <g class="sf"><circle cx="35" cy="64" r="3"   fill="#e0f2fe"/></g>
      <g class="sf"><circle cx="51" cy="67" r="3"   fill="#e0f2fe"/></g>
      <g class="sf"><circle cx="66" cy="62" r="3"   fill="#e0f2fe"/></g>
      <g class="sf"><circle cx="43" cy="77" r="2.5" fill="#e0f2fe" opacity="0.8"/></g>
      <g class="sf"><circle cx="59" cy="79" r="2.5" fill="#e0f2fe" opacity="0.8"/></g>
    </svg>`;
}

function iconFog() {
  return `
    <svg class="wx-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
      <line class="fl" x1="18" y1="36" x2="82" y2="36" stroke="#9ca3af" stroke-width="5.5" stroke-linecap="round" opacity="0.7"/>
      <line class="fl" x1="24" y1="50" x2="76" y2="50" stroke="#9ca3af" stroke-width="4.5" stroke-linecap="round" opacity="0.6"/>
      <line class="fl" x1="16" y1="64" x2="84" y2="64" stroke="#9ca3af" stroke-width="5"   stroke-linecap="round" opacity="0.65"/>
      <line class="fl" x1="26" y1="78" x2="74" y2="78" stroke="#9ca3af" stroke-width="3.5" stroke-linecap="round" opacity="0.5"/>
    </svg>`;
}

const I = {
  thermo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`,
  drop:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  wind:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>`,
  eye:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  gauge:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12L8.56 8.56"/><circle cx="12" cy="12" r="2"/></svg>`,
  sun:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
  cloud:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  clock:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  cal:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
};

function buildSkeletons() {
  cardGrid.innerHTML = '';
  ['main-card wide', '', '', '', '', '', 'wide', '', 'full', 'full'].forEach(cls => {
    const a = document.createElement('article');
    a.className = `card skeleton ${cls}`.trim();
    a.innerHTML = `
      <div class="sk-line" style="width:38%;height:.6rem;margin-bottom:.9rem"></div>
      <div class="sk-line" style="width:55%;height:2.8rem;margin-bottom:.45rem"></div>
      <div class="sk-line" style="width:42%;height:.75rem"></div>`;
    cardGrid.appendChild(a);
  });
}

function buildCards(cur, fc) {

  const {
    main:    { temp, feels_like, temp_min, temp_max, humidity, pressure },
    wind:    { speed, deg: wDeg },
    weather: [{ description, id }],
    visibility, timezone, clouds: { all: cloudPct },
    sys:     { sunrise, sunset }
  } = cur;


  const tC   = temp        - 273.15;
  const fC   = feels_like  - 273.15;
  const lC   = temp_min    - 273.15;
  const hC   = temp_max    - 273.15;
  const kmh  = speed * 3.6;
  const visKm = visibility / 1000;


  const dayMap = {};
  (fc.list || []).forEach(item => {
    const k = new Date(item.dt * 1000).toDateString();
    if (!dayMap[k]) dayMap[k] = { temps: [], id: item.weather[0].id, desc: item.weather[0].description, dt: item.dt };
    dayMap[k].temps.push(item.main.temp - 273.15);
  });
  const fcDays = Object.values(dayMap).slice(0, 5);

  const hourly = (fc.list || []).slice(0, 8);

  
  const cards = [


    {
      cls: 'main-card wide',
      html: `
        <div class="main-left">
          <div class="main-temp"><span id="mT">—</span><sup>°C</sup></div>
          <div class="main-desc">${description}</div>
          <div class="main-range">↓&nbsp;<span id="mL">—</span>° &nbsp;/&nbsp; ↑&nbsp;<span id="mH">—</span>°</div>
        </div>
        <div class="main-right">${wxIcon(id, sunrise, sunset)}</div>`
    },

    {
      icon: I.thermo, lbl: 'Feels Like',
      html: `
        <div class="stat-row"><span class="stat-num" id="fT">—</span><span class="stat-unit">°C</span></div>
        <p class="card-sec">${fC < tC ? 'Colder than actual' : fC > tC ? 'Warmer than actual' : 'Same as actual'}</p>`
    },

    {
      icon: I.drop, lbl: 'Humidity',
      html: `
        <div class="stat-row"><span class="stat-num" id="hV">—</span><span class="stat-unit">%</span></div>
        <div class="prog"><div class="prog-fill" id="hBar"></div></div>
        <p class="card-sec" style="margin-top:.35rem">
          ${humidity < 30 ? 'Very dry' : humidity < 60 ? 'Comfortable' : humidity < 80 ? 'Humid' : 'Very humid'}
        </p>`
    },

    {
      icon: I.wind, lbl: 'Wind Speed',
      html: `
        <div class="stat-row"><span class="stat-num" id="wV">—</span><span class="stat-unit">km/h</span></div>
        <div class="wind-badge"><em class="wind-arrow" id="wA">↑</em><span id="wD">${dirStr(wDeg)}</span></div>`
    },

    {
      icon: I.eye, lbl: 'Visibility',
      html: `
        <div class="stat-row"><span class="stat-num" id="vV">—</span><span class="stat-unit">km</span></div>
        <div class="prog"><div class="prog-fill" id="vBar"></div></div>
        <p class="card-sec" style="margin-top:.35rem">
          ${visKm >= 10 ? 'Clear' : visKm >= 5 ? 'Moderate' : 'Poor visibility'}
        </p>`
    },

    {
      icon: I.gauge, lbl: 'Pressure',
      html: `
        <div class="stat-row"><span class="stat-num" id="pV">—</span><span class="stat-unit">hPa</span></div>
        <p class="card-sec">${pressure < 1000 ? 'Low pressure' : pressure > 1020 ? 'High pressure' : 'Normal'}</p>`
    },

    {
      cls: 'wide', icon: I.sun, lbl: 'Sun Times',
      html: `
        <div class="sun-row">
          <div class="sun-block">
            <span class="sun-lbl">Sunrise</span>
            <span class="sun-val">${fmtTime(sunrise, timezone)}</span>
          </div>
          <div class="sun-divider"></div>
          <div class="sun-block">
            <span class="sun-lbl">Sunset</span>
            <span class="sun-val">${fmtTime(sunset, timezone)}</span>
          </div>
        </div>`
    },

    {
      icon: I.cloud, lbl: 'Cloud Cover',
      html: `
        <div class="stat-row"><span class="stat-num" id="cV">—</span><span class="stat-unit">%</span></div>
        <div class="prog"><div class="prog-fill" id="cBar"></div></div>`
    },

    {
      cls: 'full', icon: I.clock, lbl: '24-Hour Forecast',
      html: `
        <div class="hourly-strip">
          ${hourly.map((h, i) => `
            <div class="h-item ${i === 0 ? 'now' : ''}">
              <span class="h-time">${i === 0 ? 'Now' : fmtTime(h.dt, timezone)}</span>
              <span class="h-emoji">${emoji(h.weather[0].id)}</span>
              <span class="h-temp">${(h.main.temp - 273.15).toFixed(0)}°</span>
            </div>`).join('')}
        </div>`
    },

    {
      cls: 'full', icon: I.cal, lbl: '5-Day Forecast',
      html: `
        <div class="fc-list">
          ${fcDays.map((d, i) => `
            <div class="fc-row">
              <span class="fc-day">${i === 0 ? 'Today' : fmtDay(d.dt)}</span>
              <span class="fc-emoji">${emoji(d.id)}</span>
              <span class="fc-desc">${d.desc}</span>
              <div class="fc-range">
                <span class="fc-lo">${Math.min(...d.temps).toFixed(0)}°</span>
                <span class="fc-hi">${Math.max(...d.temps).toFixed(0)}°</span>
              </div>
            </div>`).join('')}
        </div>`
    },
  ];

  cardGrid.innerHTML = '';

  cards.forEach((def, i) => {
    const a = document.createElement('article');
    a.className = `card ${def.cls || ''}`.trim();

    const header = (def.icon || def.lbl)
      ? `<header class="card-hd">
           <span class="card-icon">${def.icon || ''}</span>
           <span class="card-label">${def.lbl || ''}</span>
         </header>`
      : '';

    a.innerHTML = header + def.html;
    cardGrid.appendChild(a);

    if (noAnim()) {
      a.style.opacity   = '1';
      a.style.transform = 'none';
    } else {
      a.style.animationDelay = (i * 80) + 'ms';
      requestAnimationFrame(() => a.classList.add('animate-in'));
    }
  });

  setTimeout(() => {
    counter(document.getElementById('mT'), 0,   tC,       820);
    counter(document.getElementById('mL'), 0,   lC,       700);
    counter(document.getElementById('mH'), 0,   hC,       700);
    counter(document.getElementById('fT'), 0,   fC,       720);
    counter(document.getElementById('hV'), 0,   humidity, 700);
    counter(document.getElementById('wV'), 0,   kmh,      800);
    counter(document.getElementById('vV'), 0,   visKm,    700, 1);
    counter(document.getElementById('pV'), 950, pressure, 800);
    counter(document.getElementById('cV'), 0,   cloudPct, 700);

    setTimeout(() => {
      const fill = (id, pct) => {
        const el = document.getElementById(id);
        if (el) el.style.width = Math.min(pct, 100) + '%';
      };
      fill('hBar', humidity);
      fill('vBar', (visKm / 10) * 100);
      fill('cBar', cloudPct);
    }, 200);

    const wa = document.getElementById('wA');
    if (wa) wa.style.transform = `rotate(${wDeg}deg)`;

  }, cards.length * 80 + 120);
}

function startClock(tz) {
  if (clockTick) clearInterval(clockTick);
  const tick = () => {
    const d  = new Date((Math.floor(Date.now() / 1000) + tz) * 1000);
    const pad = n => n.toString().padStart(2, '0');
    locClock.textContent =
      `Local time — ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
  };
  tick();
  clockTick = setInterval(tick, 1000);
}

async function fetchAll(city) {
  const [r1, r2] = await Promise.all([
    fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`),
    fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}`)
  ]);
  if (!r1.ok) {
    const err = await r1.json();
    throw new Error(err.message || 'City not found');
  }
  return Promise.all([r1.json(), r2.json()]);
}

function showErr(msg) { errMsg.textContent = msg; errMsg.classList.add('show'); }
function clearErr()   { errMsg.classList.remove('show'); }

sForm.addEventListener('submit', async e => {
  e.preventDefault();
  const city = cInput.value.trim();
  if (!city) { showErr('Please enter a city name.'); return; }
  clearErr();

  dashboard.classList.add('show');
  buildSkeletons();
  locHero.classList.remove('show');
  locName.textContent    = city;
  locCountry.textContent = '';
  locClock.textContent   = '';

  try {
    const [cur, fc] = await fetchAll(city);

    document.documentElement.setAttribute(
      'data-theme',
      getTheme(cur.weather[0].id, cur.sys.sunrise, cur.sys.sunset)
    );

    locName.textContent    = cur.name;
    locCountry.textContent =
      `${cur.sys.country} · ${cur.coord.lat.toFixed(2)}°N, ${cur.coord.lon.toFixed(2)}°E`;
    locHero.classList.add('show');

    startClock(cur.timezone);
    buildCards(cur, fc);

  } catch (err) {
    const msg = err.message === 'city not found'
      ? 'City not found — try another name.'
      : err.message;
    showErr(msg);
    dashboard.classList.remove('show');
  }
});