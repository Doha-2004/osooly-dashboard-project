/* Admin – Home (requirement 3.1). Behavior only: the tiles, the period form, the error messages and the empty state are written
   in index.html; this file fills the numbers and toggles classes. Period-sensitive numbers scale with the selected dates (mock rule);
   the rest are "as of now". ALL DATA IS MOCK. Backend: replace stats() with the statistics API (period sent to the server). */
(function () {
  'use strict';
  var DATA_START = '2025-01-01';
  var BASE = { 'users.total': 48250, 'users.customers': 46980, 'biz.car_dealer': 412, 'biz.rental': 188, 'biz.spare_parts': 936, 'biz.recovery': 241,
    'biz.new': 37, 'biz.pending': 64, 'biz.approved': 1604, 'biz.rejected': 109, 'ads.new': 214, 'ads.pending': 187, 'ads.approved': 9640, 'ads.rejected': 530,
    'ord.ins.new': 58, 'ord.ins.review': 41, 'ord.ins.paid': 612, 'ord.ins.cancelled': 77, 'ord.rec.incoming': 12, 'ord.rec.accepted': 34, 'ord.rec.rejected': 19, 'ord.rec.completed': 740,
    'ord.sp.total': 1385, 'fin.revenue': 2845000, 'fin.expenses': 1190000, 'wal.free': 410250, 'wal.paid': 2710200, 'wal.tx': 18432, 'sub.active': 1022, 'sub.near': 87, 'sub.expired': 143 };
  var POINT = ['users.total', 'users.customers', 'biz.car_dealer', 'biz.rental', 'biz.spare_parts', 'biz.recovery', 'wal.free', 'wal.paid', 'sub.active', 'sub.near', 'sub.expired'];
  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function today() { return new Date().toISOString().slice(0, 10); }
  function days(a, b) { return Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000) + 1); }
  function fmt(n) { return new Intl.NumberFormat('en-US').format(n); }
  var from = $('#p-from'), to = $('#p-to'), period = null;
  function stats(range) {   // Backend: replace with the API request
    if (range && range.to < DATA_START) return null;
    var f = range ? Math.min(1, days(range.from < DATA_START ? DATA_START : range.from, range.to) / days(DATA_START, today())) : 1, out = {};
    Object.keys(BASE).forEach(function (k) { out[k] = POINT.indexOf(k) > -1 ? BASE[k] : Math.round(BASE[k] * f); });
    out['biz.total'] = out['biz.car_dealer'] + out['biz.rental'] + out['biz.spare_parts'] + out['biz.recovery'];
    out['wal.total'] = out['wal.free'] + out['wal.paid']; out['fin.net'] = out['fin.revenue'] - out['fin.expenses'];
    return out;
  }
  function render() {
    var d = stats(period);
    $('#ov-content').classList.toggle('d-none', !d); $('#ov-empty').classList.toggle('d-none', !!d);
    $('#p-all').classList.toggle('d-none', !!period); $('#p-range').classList.toggle('d-none', !period);
    if (period) { $('#p-from-t').textContent = period.from; $('#p-to-t').textContent = period.to; }
    if (!d) return;
    $$('[data-stat]').forEach(function (n) { var v = d[n.getAttribute('data-stat')]; n.textContent = v === undefined ? '\u2014' : fmt(v); });
  }
  function validate() {
    var f = from.value, t = to.value, key = null;
    if ((f && !t) || (!f && t)) key = 'required'; else if (f && t && f > t) key = 'order'; else if (t && t > today()) key = 'future';
    $$('#p-error [data-msg]').forEach(function (m) { m.classList.toggle('d-none', m.getAttribute('data-msg') !== key); });
    $('#p-error').classList.toggle('d-none', !key);
    from.classList.toggle('is-invalid', key === 'required' && !f || key === 'order'); to.classList.toggle('is-invalid', key === 'required' && !t || key === 'future' || key === 'order');
    return !key;
  }
  function reset() { from.value = ''; to.value = ''; validate(); period = null; render(); }
  from.max = today(); to.max = today();
  $('#period-form').addEventListener('submit', function (e) { e.preventDefault(); if (!validate()) return; period = from.value && to.value ? { from: from.value, to: to.value } : null; render(); });
  $('#p-reset').addEventListener('click', reset); $('#p-empty-reset').addEventListener('click', reset);
  render();
})();
