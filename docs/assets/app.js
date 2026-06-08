/* =========================================================================
   Foresight — shell + shared interactions
   renderShell(activeKey) injects the sidebar + topbar so every screen shares
   identical chrome. Everything is client-side; no backend.
   ========================================================================= */

const NAV = [
  { key: 'dashboard',  href: 'dashboard.html',         icon: 'layout-dashboard', label: 'Dashboard' },
  { key: 'queue',      href: 'at-risk-queue.html',     icon: 'list-checks',      label: 'At-Risk Queue', badge: 'atRisk' },
  { key: 'forecast',   href: 'forecast.html',          icon: 'calendar-clock',   label: 'Overbooking Forecast' },
  { key: 'rules',      href: 'automation-rules.html',  icon: 'workflow',         label: 'Automation Rules' },
  { key: 'roi',        href: 'interventions.html',     icon: 'target',           label: 'Intervention ROI' },
  { key: 'model',      href: 'model-monitoring.html',  icon: 'activity',         label: 'Model Monitoring' },
  { key: 'segments',   href: 'segment-analytics.html', icon: 'pie-chart',        label: 'Segment Analytics' },
  { key: 'settings',   href: 'settings.html',          icon: 'settings',         label: 'Settings' },
];

const TITLES = {
  dashboard: ['Dashboard', 'Revenue Manager overview'],
  queue:     ['At-Risk Booking Queue', 'Bookings ranked by cancellation risk'],
  detail:    ['Booking Risk Detail', 'Why this booking is at risk'],
  forecast:  ['Overbooking Forecast', 'Predicted cancellations per arrival date'],
  rules:     ['Policy Automation Rules', 'Configure auto-actions for high-risk bookings'],
  roi:       ['Intervention ROI', 'Are interventions actually working?'],
  model:     ['Model Monitoring', 'Production accuracy & retraining'],
  segments:  ['Segment Analytics', 'What drives cancellations, by segment'],
  settings:  ['Settings', 'Thresholds, alerts & compliance'],
};

function renderShell(activeKey) {
  const [title, sub] = TITLES[activeKey] || ['Foresight', ''];

  const links = NAV.map(n => {
    const active = n.key === activeKey;
    const badge = n.badge === 'atRisk'
      ? `<span class="ml-auto badge badge-high tnum">${KPIS.atRiskToday}</span>` : '';
    return `<a class="sidebar-link ${active ? 'active' : ''}" href="${n.href}">
      <i data-lucide="${n.icon}"></i><span>${n.label}</span>${badge}</a>`;
  }).join('');

  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = `
    <div class="px-5 pt-5 pb-4 flex items-center gap-2.5">
      <div class="w-9 h-9 rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30 grid place-items-center">
        <i data-lucide="radar" class="text-indigo-300" style="width:20px;height:20px"></i>
      </div>
      <div>
        <div class="text-white font-semibold leading-tight">Foresight</div>
        <div class="text-[11px] text-slate-400 leading-tight">Cancellation Prediction</div>
      </div>
    </div>
    <nav class="px-3 space-y-1 flex-1 overflow-y-auto">${links}</nav>
    <div class="px-3 pb-3 pt-2 space-y-1">
      <div class="divider bg-white/10 mx-2 my-2"></div>
      <a class="sidebar-link" href="index.html"><i data-lucide="layout-grid"></i><span>Project Overview</span></a>
      <div class="mt-2 mx-1 rounded-xl bg-white/5 px-3 py-2.5 flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-indigo-500 grid place-items-center text-white text-xs font-bold">AR</div>
        <div class="min-w-0">
          <div class="text-sm text-white font-medium truncate">Alex Rivera</div>
          <div class="text-[11px] text-slate-400 truncate">Revenue Manager</div>
        </div>
        <a href="login.html" class="ml-auto text-slate-400 hover:text-white" title="Sign out"><i data-lucide="log-out" style="width:16px;height:16px"></i></a>
      </div>
    </div>`;

  const topbar = document.getElementById('topbar');
  if (topbar) topbar.innerHTML = `
    <button id="navToggle" class="lg:hidden btn btn-ghost btn-sm" aria-label="Open menu"><i data-lucide="menu"></i></button>
    <div class="min-w-0">
      <h1 class="text-lg font-semibold text-slate-900 truncate">${title}</h1>
      <p class="text-xs text-slate-500 truncate">${sub}</p>
    </div>
    <div class="ml-auto flex items-center gap-2 sm:gap-3">
      <div class="hidden md:flex items-center gap-2 badge badge-low" title="Model health">
        <span class="dot"></span>${MODEL.name} ${MODEL.version} · ${MODEL.testAccuracy}% acc
      </div>
      <div class="hidden sm:flex items-center gap-2 text-xs text-slate-500 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white">
        <i data-lucide="sliders-horizontal" style="width:14px;height:14px"></i>Threshold <b class="text-slate-800 tnum">${MODEL.threshold}%</b>
      </div>
      <button class="relative btn btn-ghost btn-sm" onclick="toast('Showing 5 unread alerts')" aria-label="Alerts">
        <i data-lucide="bell"></i>
        <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] grid place-items-center tnum">5</span>
      </button>
    </div>`;

  // mobile sidebar toggle
  document.addEventListener('click', (e) => {
    if (e.target.closest('#navToggle')) document.body.classList.toggle('nav-open');
    else if (e.target.closest('#scrim')) document.body.classList.remove('nav-open');
  });

  if (window.lucide) lucide.createIcons();
}

/* ---- Risk gauge (SVG circular meter) ----------------------------------- */
function riskColor(score) { return score >= 70 ? '#dc2626' : score >= 40 ? '#d97706' : '#059669'; }
function renderGauge(el, score, size = 168) {
  const r = size / 2 - 14, c = 2 * Math.PI * r, off = c * (1 - score / 100);
  el.innerHTML = `
    <svg class="gauge" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle class="track" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke-width="14"></circle>
      <circle class="meter" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke-width="14"
        stroke="${riskColor(score)}" stroke-dasharray="${c}" stroke-dashoffset="${c}"></circle>
    </svg>
    <div class="absolute inset-0 grid place-items-center text-center">
      <div>
        <div class="text-4xl font-bold tnum" style="color:${riskColor(score)}">${score}<span class="text-xl">%</span></div>
        <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">cancel risk</div>
      </div>
    </div>`;
  requestAnimationFrame(() => { const m = el.querySelector('.meter'); if (m) m.style.strokeDashoffset = off; });
}

/* ---- Queue rendering (shared by dashboard preview + queue page) --------- */
function bookingRow(b, compact = false) {
  const a = ACTIONS[b.recommended];
  const statusMap = {
    new: ['badge-neutral', 'New'], flagged: ['badge-high', 'Flagged'],
    intervened: ['badge-brand', 'Intervened'],
  };
  const [sc, sl] = statusMap[b.status] || statusMap.new;
  return `<tr class="row-clickable" onclick="location.href='booking-detail.html?id=${b.id}'">
    <td><span class="mono text-xs text-slate-500">${b.id}</span><div class="font-medium text-slate-800">${b.guest}</div></td>
    ${compact ? '' : `<td><span class="badge badge-neutral">${b.segment}</span></td>`}
    <td class="text-slate-600">${b.arrival}</td>
    <td class="tnum text-slate-600">${b.leadTime}d</td>
    ${compact ? '' : `<td class="tnum text-slate-600">$${b.price}</td>`}
    <td>
      <div class="flex items-center gap-2">
        <div class="bar-track w-14"><div class="bar-fill" style="width:${b.score}%;background:${riskColor(b.score)}"></div></div>
        <span class="tnum font-semibold risk-${band(b.score)}">${b.score}%</span>
      </div>
    </td>
    ${compact ? '' : `<td><span class="badge badge-${band(b.score)}"><span class="dot"></span>${bandLabel(b.score)}</span></td>`}
    ${compact ? '' : `<td class="text-slate-600 text-sm">${a.label}</td>`}
    <td><span class="badge ${sc}">${sl}</span></td>
    <td class="text-right"><i data-lucide="chevron-right" class="text-slate-300" style="width:16px;height:16px"></i></td>
  </tr>`;
}

function renderQueue(targetId, threshold, opts = {}) {
  const host = document.getElementById(targetId);
  if (!host) return;
  const rows = BOOKINGS
    .filter(b => b.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map(b => bookingRow(b, opts.compact)).join('');
  const countEl = document.getElementById(opts.countId);
  const shown = BOOKINGS.filter(b => b.score >= threshold).length;
  if (countEl) countEl.textContent = shown;
  host.innerHTML = rows || `<tr><td colspan="10" class="py-16 text-center text-slate-400">
      <i data-lucide="check-circle-2" class="mx-auto mb-2" style="width:34px;height:34px"></i>
      <div class="font-medium text-slate-600">No bookings above ${threshold}% risk</div>
      <div class="text-sm">Lower the threshold to review medium-risk bookings.</div></td></tr>`;
  if (window.lucide) lucide.createIcons();
}

/* ---- Toast & modal helpers --------------------------------------------- */
function toast(msg) {
  let host = document.getElementById('toast-host');
  if (!host) { host = document.createElement('div'); host.id = 'toast-host'; document.body.appendChild(host); }
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<i data-lucide="check-circle-2"></i><span>${msg}</span>`;
  host.appendChild(t);
  if (window.lucide) lucide.createIcons();
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; setTimeout(() => t.remove(), 250); }, 2800);
}
function openModal(id) { const m = document.getElementById(id); if (m) m.classList.add('open'); }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('open'); }

/* ---- Param helper ------------------------------------------------------ */
function getParam(k) { return new URLSearchParams(location.search).get(k); }

/* ---- Tabs -------------------------------------------------------------- */
function initTabs(scope) {
  const root = scope || document;
  root.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-tab-group');
      root.querySelectorAll(`[data-tab-group="${group}"]`).forEach(b => b.classList.remove('tab-active'));
      btn.classList.add('tab-active');
      root.querySelectorAll(`[data-panel-group="${group}"]`).forEach(p => p.classList.add('hidden'));
      const panel = root.querySelector(`[data-panel="${btn.getAttribute('data-tab')}"]`);
      if (panel) panel.classList.remove('hidden');
    });
  });
}
