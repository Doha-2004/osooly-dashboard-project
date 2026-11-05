/* Admin Dashboard – Trucks & other vehicles page (requirement 3.4).
   Behavior only. Every element (row slots, the single details panel, history slots, pager, confirm step, toast, empty state)
   is written in index.html. This file fills them with text / attributes and shows or hides them with classes; it never
   creates, clones or injects markup. ALL DATA IS MOCK. Backend: replace load() with the API (page + filters sent to the
   server, at most PAGE_SIZE records per response) and the changes made in perform() / create() with the real requests. */
(function () {
  'use strict';
  var D = window.AdminDash, CFG = {"pageSize":10,"store":"osooly.mock.admin_trucks","statusField":"status","tabField":"status","tabDefs":null,"defaultTab":null,"search":["title","owner","id"],"dateField":"date","actions":{"disable":{"next":"disabled","log":["تم تعطيل الإعلان","Ad disabled"],"inputs":[{"id":"reason"}]},"enable":{"next":"approved","log":["تمت إعادة تفعيل الإعلان","Ad re-enabled"]},"delete":{"log":["تم حذف الإعلان","Ad deleted"],"inputs":[{"id":"reason","required":true}],"remove":true}},"editLink":null,"own":null,"fixed":null};
  var PAGE_SIZE = CFG.pageSize;   // = number of row slots in index.html
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function today() { return new Date().toISOString().slice(0, 10); }
  var SEED = [{"id":"trk-001","title":{"ar":"ميتسوبيشي كانتر 2018","en":"Mitsubishi Canter 2018"},"owner":{"ar":"شركة الدلتا للنقل","en":"Delta Transport"},"ownerType":"customer","status":"new","date":"2026-10-21","price":690000,"year":2018,"km":210000,"spec":{"ar":"نقل خفيف · 3 طن","en":"Light truck · 3 t"},"phone":"0100 310 1101","log":[],"unitH":false},{"id":"trk-002","title":{"ar":"مرسيدس أكتروس 2016","en":"Mercedes Actros 2016"},"owner":{"ar":"معرض الصعيد للشاحنات","en":"Upper Egypt Trucks"},"ownerType":"car_dealer","status":"approved","date":"2026-10-17","price":3200000,"year":2016,"km":480000,"spec":{"ar":"رأس تريلا","en":"Tractor unit"},"phone":"0101 320 2202","log":[{"d":"2026-10-17","by":{"ar":"سلمى حسن","en":"Salma Hassan"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":""}],"unitH":false},{"id":"trk-003","title":{"ar":"فان هيونداي H1 2020","en":"Hyundai H1 Van 2020"},"owner":{"ar":"أحمد سعيد","en":"Ahmed Said"},"ownerType":"customer","status":"pending","date":"2026-10-16","price":850000,"year":2020,"km":90000,"spec":{"ar":"فان · 12 راكب","en":"Van · 12 seats"},"phone":"0102 330 3303","log":[],"unitH":false},{"id":"trk-004","title":{"ar":"إيسوزو NPR 2019","en":"Isuzu NPR 2019"},"owner":{"ar":"معرض الصعيد للشاحنات","en":"Upper Egypt Trucks"},"ownerType":"car_dealer","status":"approved","date":"2026-10-09","price":1150000,"year":2019,"km":160000,"spec":{"ar":"نقل متوسط · 5 طن","en":"Medium truck · 5 t"},"phone":"0101 320 2202","log":[{"d":"2026-10-09","by":{"ar":"سلمى حسن","en":"Salma Hassan"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":""}],"unitH":false},{"id":"trk-005","title":{"ar":"ميكروباص تويوتا هايس 2017","en":"Toyota HiAce Minibus 2017"},"owner":{"ar":"مصطفى كمال","en":"Mostafa Kamal"},"ownerType":"customer","status":"rejected","date":"2026-10-06","price":640000,"year":2017,"km":230000,"spec":{"ar":"ميكروباص · 14 راكب","en":"Minibus · 14 seats"},"phone":"0103 340 4404","log":[],"unitH":false},{"id":"trk-006","title":{"ar":"جرار زراعي نيو هولاند","en":"New Holland Tractor"},"owner":{"ar":"إبراهيم حسن","en":"Ibrahim Hassan"},"ownerType":"customer","status":"new","date":"2026-10-20","price":520000,"year":2014,"km":9000,"spec":{"ar":"معدات زراعية","en":"Agricultural"},"phone":"0104 350 5505","log":[],"unitH":true},{"id":"trk-007","title":{"ar":"حفار كاتربيلر 320","en":"Caterpillar 320 Excavator"},"owner":{"ar":"معرض الصعيد للشاحنات","en":"Upper Egypt Trucks"},"ownerType":"car_dealer","status":"disabled","date":"2026-09-10","price":4100000,"year":2012,"km":15000,"spec":{"ar":"معدات ثقيلة","en":"Heavy equipment"},"phone":"0101 320 2202","log":[],"unitH":true},{"id":"trk-008","title":{"ar":"شاحنة مان 2015","en":"MAN Truck 2015"},"owner":{"ar":"شركة الدلتا للنقل","en":"Delta Transport"},"ownerType":"customer","status":"cancelled","date":"2026-09-03","price":2700000,"year":2015,"km":520000,"spec":{"ar":"نقل ثقيل","en":"Heavy truck"},"phone":"0100 310 1101","log":[],"unitH":false}];
  var ME = (D.session && D.session.name) || { ar: 'مستخدم', en: 'User' };
  function load() {   // Backend: replace with the API request
    if (window.__LOAD__) return window.__LOAD__(JSON.parse(JSON.stringify(SEED)));
    if (CFG.store) { try { var s = sessionStorage.getItem(CFG.store); if (s) return JSON.parse(s); } catch (e) { /* storage unavailable */ } }
    var seed = JSON.parse(JSON.stringify(SEED)); save(seed); return seed;
  }
  function save(rows) { if (window.__SAVE__) { window.__SAVE__(rows); return; } if (CFG.store) { try { sessionStorage.setItem(CFG.store, JSON.stringify(rows)); } catch (e) { /* storage unavailable */ } } }
  window.__DERIVE__ = function (r) {
      var F = { petrol: ['بنزين', 'Petrol'], diesel: ['ديزل', 'Diesel'], hybrid: ['هجين', 'Hybrid'], electric: ['كهرباء', 'Electric'] }, G = { auto: ['أوتوماتيك', 'Automatic'], manual: ['عادي', 'Manual'] };
      if (r.fuel) { var f = F[r.fuel] || ['', ''], g = G[r.gear] || ['', ''];
        r.ownerType = 'car_dealer'; r.owner = { ar: 'معرض النخبة للسيارات', en: 'Elite Motors' }; r.spec = { ar: f[0] + ' · ' + g[0], en: f[1] + ' · ' + g[1] };
        if (r.status === 'pending' && !r.isNewFlag) { /* dealer ads wait for review */ } }
      var O = { customer: { ar: 'عميل', en: 'Customer' }, car_dealer: { ar: 'معرض سيارات', en: 'Car dealer' } };
      r.ownB = O[r.ownerType] || { ar: '', en: '' }; r.isDealer = r.ownerType === 'car_dealer' ? 'true' : '';
      r.kmText = Number(r.km).toLocaleString('en-US') + (r.unitH ? ' h' : ' km');
      r.rejB = r.rejectReason && r.rejectReason.ar ? r.rejectReason : { ar: r.rej && r.rej.ar ? r.rej.ar : '', en: r.rej && r.rej.en ? r.rej.en : '' };
    };
  window.__AFTER__ = function (rec, action, vals) {
      if (action === 'disable' && rec.id.indexOf('CAR-') === 0) rec.status = 'inactive';
    };
  
  var all = load();
  function visible() {   // roles that see only their own records (assigned to them)
    var role = (D.session && D.session.role) || '', o = CFG.own;
    var rows = all;
    if (o && o.roles.indexOf(role) > -1) { var me = o.map ? o.map[D.session.email] : D.session.email; rows = rows.filter(function (r) { return r[o.field] === me; }); }
    if (CFG.fixed) rows = rows.filter(function (r) { return String(get(r, CFG.fixed.field)) === CFG.fixed.value; });
    return rows;
  }

  var tabs = $$('[data-tab]'), slots = $$('#rows [data-row]'), panel = $('#details'), toastEl = $('#toast');
  var el = {
    search: $('#search'), from: $('#from'), to: $('#to'), error: $('#filter-error'), wrap: $('#table-wrap'), empty: $('#empty'), footer: $('#footer'),
    fromN: $('#from-n'), toN: $('#to-n'), totalN: $('#total-n'), pageSlots: $$('[data-page-slot]'), prev: $('[data-page-prev]'), next: $('[data-page-next]'),
    actions: $('#actions'), confirm: $('#confirm')
  };
  var selects = $$('[data-filter]');
  var st = { tab: CFG.defaultTab || 'all', q: '', from: '', to: '', page: 1, selected: null, sel: {} };

  function get(rec, path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, rec); }
  function fill(root, rec) {
    $$('[data-f]', root).forEach(function (n) {
      var v = get(rec, n.getAttribute('data-f'));
      n.textContent = v == null ? '' : (n.hasAttribute('data-num') && typeof v === 'number' ? v.toLocaleString('en-US') : v);
    });
    $$('[data-show-if]', root).forEach(function (n) { n.classList.toggle('d-none', !get(rec, n.getAttribute('data-show-if'))); });
    $$('[data-hide-if]', root).forEach(function (n) { n.classList.toggle('d-none', !!get(rec, n.getAttribute('data-hide-if'))); });
  }
  function setPath(o, path, v) { var a = path.split('.'); for (var i = 0; i < a.length - 1; i++) { if (!o[a[i]]) o[a[i]] = {}; o = o[a[i]]; } o[a[a.length - 1]] = v; }
  function derive(rec) { if (window.__DERIVE__) window.__DERIVE__(rec); }
  function text(v) { return v && typeof v === 'object' ? v.ar + ' ' + v.en : (v == null ? '' : String(v)); }

  /* ---------- list ---------- */
  function matches(r) {
    if (CFG.tabField && st.tab !== 'all' && !inTab(r, st.tab)) return false;
    if (st.q && CFG.search.map(function (f) { return text(get(r, f)); }).join(' ').toLowerCase().indexOf(st.q) === -1) return false;
    for (var k in st.sel) { if (st.sel[k] && String(get(r, k)) !== st.sel[k]) return false; }
    if (CFG.dateField) { var d = get(r, CFG.dateField); if (st.from && d < st.from) return false; if (st.to && d > st.to) return false; }
    return true;
  }
  function inTab(r, k) { var d = CFG.tabDefs && CFG.tabDefs[k]; return d ? String(get(r, d[0])) === d[1] : String(get(r, CFG.tabField)) === k; }
  function renderCounts() {
    var base = visible();
    tabs.forEach(function (b) {
      var k = b.getAttribute('data-tab');
      $('[data-count="' + k + '"]').textContent = base.filter(function (r) { return k === 'all' || inTab(r, k); }).length;
    });
  }
  function renderPager(pages) {
    var start = Math.max(1, Math.min(st.page - 2, pages - el.pageSlots.length + 1));
    el.pageSlots.forEach(function (li, i) {
      var n = start + i, b = $('[data-page]', li);
      li.classList.toggle('d-none', n > pages);
      b.textContent = n; b.setAttribute('data-page', n);
      li.classList.toggle('active', n === st.page);
    });
    el.prev.classList.toggle('disabled', st.page <= 1); el.next.classList.toggle('disabled', st.page >= pages);
  }
  function render() {
    all.forEach(derive);
    var matched = visible().filter(matches), pages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
    st.page = Math.min(st.page, pages);
    var start = (st.page - 1) * PAGE_SIZE, slice = matched.slice(start, start + PAGE_SIZE);
    slots.forEach(function (tr, i) {
      var rec = slice[i];
      tr.hidden = !rec;
      if (!rec) return;
      derive(rec); fill(tr, rec); tr.setAttribute('data-id', rec.id); tr.setAttribute('data-status', get(rec, CFG.statusField));
    });
    el.wrap.classList.toggle('d-none', !matched.length); el.empty.classList.toggle('d-none', !!matched.length); el.footer.classList.toggle('d-none', !matched.length);
    el.fromN.textContent = matched.length ? start + 1 : 0; el.toN.textContent = start + slice.length; el.totalN.textContent = matched.length;
    renderPager(pages); if (CFG.tabField) renderCounts();
    if (window.__ON_RENDER__) window.__ON_RENDER__(matched);
  }

  /* ---------- filters ---------- */
  function readFilters() {
    var from = el.from ? el.from.value : '', to = el.to ? el.to.value : '', bad = !!(from && to && from > to);
    if (el.error) { el.error.classList.toggle('d-none', !bad); el.from.classList.toggle('is-invalid', bad); el.to.classList.toggle('is-invalid', bad); }
    if (bad) return;
    st.q = el.search ? el.search.value.trim().toLowerCase() : ''; st.from = from; st.to = to; st.page = 1;
    selects.forEach(function (s) { st.sel[s.getAttribute('data-filter')] = s.value; });
    render();
  }
  function reset() {
    if (el.search) el.search.value = ''; if (el.from) { el.from.value = ''; el.to.value = ''; el.error.classList.add('d-none'); el.from.classList.remove('is-invalid'); el.to.classList.remove('is-invalid'); }
    selects.forEach(function (s) { s.value = ''; });
    st.q = ''; st.from = ''; st.to = ''; st.sel = {}; st.page = 1;
    render();
  }

  /* ---------- details panel ---------- */
  function renderPanel(rec) {
    derive(rec); fill(panel, rec);
    panel.setAttribute('data-status', get(rec, CFG.statusField));
    var n = Number(rec.photos) || 0;
    $$('[data-tile]', panel).forEach(function (t, i) { t.classList.toggle('d-none', i >= n); });
    var log = (rec.log || []).slice().reverse();
    $$('[data-log-slot]', panel).forEach(function (li, i) {
      li.classList.toggle('d-none', !log[i]);
      if (log[i]) { fill(li, log[i]); var r = $('[data-log-reason]', li); if (r) r.classList.toggle('d-none', !log[i].r); var nt = $('[data-log-note]', li); if (nt) nt.classList.toggle('d-none', !(log[i].n && log[i].n.ar)); }
    });
    $$('[data-list]', panel).forEach(function (box) {
      var items = get(rec, box.getAttribute('data-list')) || [];
      $$('[data-item]', box).forEach(function (li, i) { li.classList.toggle('d-none', i >= items.length); if (i < items.length) $('[data-item-text]', li).textContent = items[i]; });
    });
    $$('[data-repeat]', panel).forEach(function (box) {
      var items = get(rec, box.getAttribute('data-repeat')) || [];
      $$('[data-slot]', box).forEach(function (li, i) { li.classList.toggle('d-none', !items[i]); if (items[i]) { fill(li, items[i]); if (items[i].dir) li.setAttribute('data-dir', items[i].dir); } });
    });
    if (window.__ON_PANEL__) window.__ON_PANEL__(rec);
  }
  function resetInputs() {
    $$('[data-input]', panel).forEach(function (c) { c.value = c.tagName === 'SELECT' ? '' : ''; c.classList.remove('is-invalid'); });
  }
  function closeConfirm() {
    if (!el.confirm) return;
    el.confirm.classList.add('d-none'); el.actions.classList.remove('d-none');
    $$('[data-msg], [data-yes], [data-for]', panel).forEach(function (n) { n.classList.add('d-none'); });
    resetInputs();
  }
  function ask(action) {
    resetInputs();
    $$('[data-msg], [data-yes], [data-for]', panel).forEach(function (n) { n.classList.toggle('d-none', (n.getAttribute('data-msg') || n.getAttribute('data-yes') || n.getAttribute('data-for')) !== action); });
    el.actions.classList.add('d-none'); el.confirm.classList.remove('d-none');
    var A = CFG.actions[action] || {};
    (A.inputs || []).forEach(function (inp) { var c = $('#in-' + action + '-' + inp.id); if (inp.prefill && c && c.type !== 'file') { var v = get(st.selected, inp.prefill); c.value = v == null ? '' : v; } });
    var first = $('[data-for="' + action + '"] [data-input]', panel); (first || $('[data-yes="' + action + '"]', panel)).focus();
  }
  function flash(key) {
    $$('[data-toast]', toastEl).forEach(function (s) { s.classList.toggle('d-none', s.getAttribute('data-toast') !== key); });
    bootstrap.Toast.getOrCreateInstance(toastEl).show();
  }
  function perform(action) {
    var rec = st.selected, A = CFG.actions[action]; if (!rec || !A) return;
    var vals = {}, bad = false;
    (A.inputs || []).forEach(function (inp) {
      var c = $('#in-' + action + '-' + inp.id), v = c.type === 'file' ? (c.files[0] ? c.files[0].name : '') : c.value.trim();
      var req = !!inp.required && !(inp.unless && get(rec, inp.unless)), inv = (req && !v) || (v && inp.min != null && !(Number(v) >= inp.min));
      c.classList.toggle('is-invalid', inv); if (inv) bad = true;
      vals[inp.id] = v;
    });
    if (bad) { var b = $('[data-for="' + action + '"] .is-invalid', panel); if (b) b.focus(); return; }
    if (window.__CHECK__ && window.__CHECK__(rec, action, vals) === false) return;
    if (A.remove) {   // Backend: send the delete request
      all.splice(all.indexOf(rec), 1); save(all); st.selected = null;
      bootstrap.Offcanvas.getOrCreateInstance(panel).hide(); render(); flash(action); return;
    }
    if (A.next) rec[CFG.statusField] = A.next;   // Backend: send the request, then use the response
    (A.inputs || []).forEach(function (inp) {
      if (!inp.field || (inp.optional && !vals[inp.id] && get(rec, inp.field))) return;
      var v = vals[inp.id], out = inp.map ? inp.map[v] : (inp.bi ? { ar: v, en: v } : (inp.num ? Number(v) : v));
      var path = inp.field.split('.'), o = rec;
      for (var i = 0; i < path.length - 1; i++) { if (!o[path[i]]) o[path[i]] = {}; o = o[path[i]]; }
      o[path[path.length - 1]] = out;
    });
    if (A.set) { for (var k in A.set) rec[k] = A.set[k]; }
    if (A.clear) A.clear.forEach(function (k) { rec[k] = null; });
    rec.log = rec.log || [];
    rec.log.push({ d: today(), by: ME, a: { ar: A.log[0], en: A.log[1] }, r: vals.reason || '' });
    if (window.__AFTER__) window.__AFTER__(rec, action, vals);
    save(all); renderPanel(rec); closeConfirm(); render(); flash(action);
  }
  function open(id) {
    var rec = all.filter(function (r) { return r.id === id; })[0]; if (!rec) return;
    st.selected = rec; closeConfirm(); renderPanel(rec);
    if (CFG.editLink) { var e = $('#edit-link'); if (e) e.setAttribute('href', CFG.editLink + '?id=' + encodeURIComponent(rec.id)); }
    bootstrap.Offcanvas.getOrCreateInstance(panel).show();
  }

  /* ---------- add record (static modal) ---------- */
  function create() {
    var C = CFG.create, bad = false, rec = JSON.parse(JSON.stringify(C.defaults || {}));
    C.fields.forEach(function (f) {
      var c = $('#add-' + f.id), v = c.value.trim(), invalid = (f.required && !v) || (f.num && v && !(Number(v) >= (f.min || 0)));
      c.classList.toggle('is-invalid', !!invalid); if (invalid) bad = true;
      setPath(rec, f.field, f.map ? f.map[v] : (f.bi ? { ar: v, en: v } : (f.num ? Number(v) : v)));
    });
    if (bad) { var b = $('#add-modal .is-invalid'); if (b) b.focus(); return; }
    var n = 0; all.forEach(function (r) { var m = /(\d+)$/.exec(r.id); if (m) n = Math.max(n, Number(m[1])); });
    rec.id = C.prefix + (Math.max(n, C.start) + 1);
    if (C.dateField) rec[C.dateField] = today();
    if (C.byField) rec[C.byField] = ME;
    rec.log = [{ d: today(), by: ME, a: { ar: C.log[0], en: C.log[1] }, r: '' }];
    all.unshift(rec); save(all);   // Backend: POST the new record
    bootstrap.Modal.getOrCreateInstance($('#add-modal')).hide();
    $$('#add-form [id^="add-"]').forEach(function (c) { c.value = ''; c.classList.remove('is-invalid'); });
    st.tab = CFG.defaultTab || 'all'; tabs.forEach(function (x) { var on = x.getAttribute('data-tab') === st.tab; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    render(); flash('create');
  }

  /* ---------- wiring ---------- */
  if (el.from) { el.from.max = '2100-01-01'; }
  $('#filter').addEventListener('submit', function (e) { e.preventDefault(); });
  if (el.search) el.search.addEventListener('input', readFilters);
  if (el.from) { el.from.addEventListener('change', readFilters); el.to.addEventListener('change', readFilters); }
  selects.forEach(function (s) { s.addEventListener('change', readFilters); });
  $('#reset').addEventListener('click', reset); $('#empty-reset').addEventListener('click', reset);
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      st.tab = b.getAttribute('data-tab'); st.page = 1;
      tabs.forEach(function (x) { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      render();
    });
  });
  $('#rows').addEventListener('click', function (e) {
    var b = e.target.closest('[data-open]'); if (b) open(b.closest('tr').getAttribute('data-id'));
  });
  $('#pager').addEventListener('click', function (e) {
    var b = e.target.closest('[data-page]'); if (!b || b.closest('.disabled')) return;
    var k = b.getAttribute('data-page'); st.page = k === 'prev' ? st.page - 1 : k === 'next' ? st.page + 1 : +k; render();
  });
  panel.addEventListener('click', function (e) {
    var a = e.target.closest('[data-ask]'), y = e.target.closest('[data-yes]');
    if (a) ask(a.getAttribute('data-ask')); else if (y) perform(y.getAttribute('data-yes'));
  });
  if ($('#cancel')) $('#cancel').addEventListener('click', closeConfirm);
  panel.addEventListener('hidden.bs.offcanvas', function () { st.selected = null; closeConfirm(); });
  if (CFG.create) { $('#add-save').addEventListener('click', create); $('#add-form').addEventListener('submit', function (e) { e.preventDefault(); create(); }); }
  
  render();
})();
