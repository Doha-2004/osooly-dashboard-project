/* Admin – Reports (requirement 3.8). Behavior only: tabs, period form, tables (fixed month slots), chart columns (24 fixed slots)
   and the empty state are in index.html. This file computes mock numbers for the chosen period and fills text / bar heights.
   ALL DATA IS MOCK (24 months). Backend: replace months() with the report API (period + filters sent to the server).
   Export is not defined in the document, so there is no export control. */
(function () {
  'use strict';
  var MAR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'], MEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var ACC = [['customer', 'العملاء', 'Customers', 0.6], ['car_dealer', 'معارض السيارات', 'Car dealers', 0.1], ['rental', 'تأجير السيارات', 'Rental dealers', 0.08], ['spare', 'محلات قطع الغيار', 'Spare parts shops', 0.08], ['recovery', 'مقدمو خدمة الإنقاذ', 'Recovery providers', 0.06], ['insurance', 'شركات التأمين', 'Insurance', 0.08]];
  var REQ = [['new', 'جديدة', 'New'], ['review', 'قيد المراجعة', 'Under review'], ['accepted', 'مقبولة', 'Accepted'], ['completed', 'مكتملة', 'Completed'], ['rejected', 'مرفوضة', 'Rejected'], ['cancelled', 'ملغاة', 'Cancelled']];
  var SUBS = [['نشطة', 'Active', 1284], ['تنتهي خلال 5 أيام', 'Ending within 5 days', 46], ['منتهية ولم تُجدد', 'Expired, not renewed', 112], ['ملغاة', 'Cancelled', 38]];
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function fmt(n) { return new Intl.NumberFormat('en-US').format(Math.round(n)); }
  function pct(a, b) { return b ? (a / b * 100).toFixed(1) + '%' : '0%'; }
  function sum(l, f) { return l.reduce(function (s, x) { return s + f(x); }, 0); }
  function ymd(d) { var p = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }

  /* ---- mock data: 24 months, Nov 2024 - Oct 2026 (same generator as the previous version) ---- */
  var seed = 20241101; function rnd() { seed = seed * 16807 % 2147483647; return seed / 2147483647; }
  var MONTHS = [];
  for (var i = 0; i < 24; i++) {
    var mo = 10 + i, start = new Date(2024 + Math.floor(mo / 12), mo % 12, 1);
    var sNew = Math.round(40 + i * 2.2 + rnd() * 14), ren = Math.round(60 + i * 1.8 + rnd() * 10), sRev = Math.round((sNew + ren) * (600 + rnd() * 180));
    var adsFees = Math.round(14000 + i * 550 + rnd() * 5000), wFees = Math.round(1200 + rnd() * 1800), exp = Math.round(58000 + i * 700 + rnd() * 14000);
    var aNew = Math.round(120 + i * 2.5 + rnd() * 30), aApp = Math.round(aNew * (0.66 + rnd() * 0.08)), aRej = Math.round(aNew * (0.10 + rnd() * 0.06));
    var rt = Math.round(190 + i * 1.5 + rnd() * 50), req = { new: Math.round(rt * 0.08), review: Math.round(rt * 0.12), accepted: Math.round(rt * 0.25), rejected: Math.round(rt * 0.15), cancelled: Math.round(rt * 0.05) };
    req.completed = rt - req.new - req.review - req.accepted - req.rejected - req.cancelled;
    var accNew = Math.round(90 + i * 2 + rnd() * 20), acc = {}, others = 0;
    ACC.forEach(function (t, k) { if (k) { acc[t[0]] = Math.round(accNew * t[3]); others += acc[t[0]]; } }); acc.customer = accNew - others;
    MONTHS.push({ y: start.getFullYear(), m: start.getMonth(), start: start, end: new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59), sNew: sNew, ren: ren, sRev: sRev, adsFees: adsFees, wFees: wFees, rev: sRev + adsFees + wFees, exp: exp, aNew: aNew, aApp: aApp, aRej: aRej, aPen: aNew - aApp - aRej, req: req, accNew: accNew, acc: acc });
  }
  var el = { preset: $('#rp-preset'), from: $('#rp-from'), to: $('#rp-to'), err: $('#rp-error'), empty: $('#rp-empty') };
  var tab = 'fin';
  function presetRange(p) {
    var t = new Date(), y = t.getFullYear(), mo = t.getMonth(), f, e;
    if (p === 'this_month') { f = new Date(y, mo, 1); e = t; } else if (p === 'last_month') { f = new Date(y, mo - 1, 1); e = new Date(y, mo, 0); }
    else if (p === 'last_3') { f = new Date(y, mo - 2, 1); e = t; } else if (p === 'last_year') { f = new Date(y - 1, 0, 1); e = new Date(y - 1, 11, 31); } else { f = new Date(y, 0, 1); e = t; }
    return [ymd(f), ymd(e)];
  }
  function lab(x) { return [MAR[x.m] + ' ' + x.y, MEN[x.m] + ' ' + x.y]; }
  /* fills one table: rows = [[ar, v1, v2, ...] with en label at rows[i].en], foot = array or null */
  function fillTable(id, rows, foot) {
    var t = $('[data-table="' + id + '"]'); if (!t) return;
    $$('[data-r]', t).forEach(function (tr, i) {
      var r = rows[i]; tr.classList.toggle('d-none', !r);
      if (!r) return;
      $$('[data-c]', tr).forEach(function (n) { n.textContent = r[Number(n.getAttribute('data-c'))]; });
      $$('[data-ce]', tr).forEach(function (n) { n.textContent = r.en; });
    });
    $$('[data-foot]', t).forEach(function (n) { n.textContent = foot ? foot[Number(n.getAttribute('data-foot'))] : ''; });
  }
  function row(en) { var r = Array.prototype.slice.call(arguments, 1); r.en = en; return r; }
  function kpi(k, v) { var n = $('[data-kpi="' + k + '"]'); if (n) n.textContent = v; }
  var en = function () { return document.documentElement.lang === 'en'; };

  function render() {
    var f = el.from.value, t = el.to.value, bad = !!(f && t && f > t);
    el.err.classList.toggle('d-none', !bad); el.from.classList.toggle('is-invalid', bad); el.to.classList.toggle('is-invalid', bad);
    if (bad || !f || !t) return;
    var fd = new Date(f + 'T00:00:00'), td = new Date(t + 'T23:59:59');
    var L = MONTHS.filter(function (x) { return x.start <= td && x.end >= fd; });
    $$('[data-rtab]').forEach(function (b) { var on = b.getAttribute('data-rtab') === tab; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    $$('[data-pane]').forEach(function (p) { p.classList.toggle('d-none', p.getAttribute('data-pane') !== tab || !L.length); });
    el.empty.classList.toggle('d-none', !!L.length);
    if (!L.length) return;
    var R = sum(L, function (x) { return x.rev; }), E = sum(L, function (x) { return x.exp; });
    kpi('rev', fmt(R)); kpi('exp', fmt(E)); kpi('net', fmt(R - E));
    fillTable('fin', L.map(function (x) { var l = lab(x); return row(l[1], l[0], fmt(x.sRev), fmt(x.adsFees), fmt(x.wFees), fmt(x.rev), fmt(x.exp), fmt(x.rev - x.exp)); }), ['الإجمالي / Total', fmt(sum(L, function (x) { return x.sRev; })), fmt(sum(L, function (x) { return x.adsFees; })), fmt(sum(L, function (x) { return x.wFees; })), fmt(R), fmt(E), fmt(R - E)]);
    var years = {}; L.forEach(function (x) { var y = years[x.y] = years[x.y] || { r: 0, e: 0 }; y.r += x.rev; y.e += x.exp; });
    fillTable('year', Object.keys(years).map(function (y) { return row(y, y, fmt(years[y].r), fmt(years[y].e), fmt(years[y].r - years[y].e)); }), null);
    var max = Math.max.apply(null, L.map(function (x) { return Math.max(x.rev, x.exp); })) || 1;
    $$('[data-col]').forEach(function (c, i) {
      var x = L[i]; c.classList.toggle('d-none', !x); if (!x) return;
      $('[data-bar="rev"]', c).style.height = Math.max(2, Math.round(x.rev / max * 170)) + 'px'; $('[data-bar="exp"]', c).style.height = Math.max(2, Math.round(x.exp / max * 170)) + 'px';
      $('[data-c="0"]', c).textContent = MAR[x.m]; $('[data-ce="0"]', c).textContent = MEN[x.m];
    });
    kpi('snew', fmt(sum(L, function (x) { return x.sNew; }))); kpi('sren', fmt(sum(L, function (x) { return x.ren; }))); kpi('srev', fmt(sum(L, function (x) { return x.sRev; })));
    fillTable('subs', L.map(function (x) { var l = lab(x); return row(l[1], l[0], fmt(x.sNew), fmt(x.ren), fmt(x.sNew + x.ren), fmt(x.sRev)); }), ['الإجمالي / Total', fmt(sum(L, function (x) { return x.sNew; })), fmt(sum(L, function (x) { return x.ren; })), fmt(sum(L, function (x) { return x.sNew + x.ren; })), fmt(sum(L, function (x) { return x.sRev; }))]);
    fillTable('subst', SUBS.map(function (s) { return row(s[1], s[0], fmt(s[2])); }), null);
    var aN = sum(L, function (x) { return x.aNew; }); kpi('anew', fmt(aN)); kpi('aapp', fmt(sum(L, function (x) { return x.aApp; }))); kpi('arej', fmt(sum(L, function (x) { return x.aRej; })));
    fillTable('ads', L.map(function (x) { var l = lab(x); return row(l[1], l[0], fmt(x.aNew), fmt(x.aApp), fmt(x.aRej), fmt(x.aPen)); }), ['الإجمالي / Total', fmt(aN), fmt(sum(L, function (x) { return x.aApp; })), fmt(sum(L, function (x) { return x.aRej; })), fmt(sum(L, function (x) { return x.aPen; }))]);
    var rt = sum(L, function (x) { return sum(Object.keys(x.req), function (k) { return x.req[k]; }); });
    fillTable('req', REQ.map(function (q) { var n = sum(L, function (x) { return x.req[q[0]]; }); return row(q[2], q[1], fmt(n), pct(n, rt)); }), null);
    var an = sum(L, function (x) { return x.accNew; }); kpi('unew', fmt(an)); var cus = sum(L, function (x) { return x.acc.customer; }); kpi('ucus', fmt(cus)); kpi('ubiz', fmt(an - cus));
    fillTable('acc', ACC.map(function (a) { var n = sum(L, function (x) { return x.acc[a[0]]; }); return row(a[2], a[1], fmt(n), pct(n, an)); }), null);
    fillTable('accm', L.map(function (x) { var l = lab(x); return row(l[1], l[0], fmt(x.accNew)); }), null);
  }
  function applyPreset() {
    if (el.preset.value === 'custom') { el.from.disabled = false; el.to.disabled = false; }
    else { var r = presetRange(el.preset.value); el.from.value = r[0]; el.to.value = r[1]; }
    render();
  }
  el.preset.addEventListener('change', applyPreset);
  [el.from, el.to].forEach(function (c) { c.addEventListener('change', function () { el.preset.value = 'custom'; render(); }); });
  $('#rp-filter').addEventListener('submit', function (e) { e.preventDefault(); });
  $$('[data-rtab]').forEach(function (b) { b.addEventListener('click', function () { tab = b.getAttribute('data-rtab'); render(); }); });
  applyPreset();
})();
