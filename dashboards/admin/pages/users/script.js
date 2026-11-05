/* Admin Dashboard – Users & accounts page (requirement 3.2).
   Behavior only. Every element (row slots, the single details panel, history slots, pager, confirm step, toast, empty state)
   is written in index.html. This file fills them with text / attributes and shows or hides them with classes; it never
   creates, clones or injects markup. ALL DATA IS MOCK. Backend: replace load() with the API (page + filters sent to the
   server, at most PAGE_SIZE records per response) and the changes made in perform() / create() with the real requests. */
(function () {
  'use strict';
  var D = window.AdminDash, CFG = {"pageSize":10,"store":"osooly.mock.users","statusField":"status","tabField":"status","tabDefs":{"customers":["isBiz","false"],"business":["isBiz","true"],"requests":["isReq","true"]},"defaultTab":null,"search":["name","email","id"],"dateField":"created","actions":{"approve":{"next":"approved","log":["تم اعتماد الحساب","Account approved"]},"reject":{"next":"rejected","log":["تم رفض الحساب","Account rejected"],"inputs":[{"id":"reason","required":true}]},"disable":{"next":"disabled","log":["تم تعطيل الحساب","Account disabled"],"inputs":[{"id":"reason"}]},"reactivate":{"next":"approved","log":["تمت إعادة تفعيل الحساب","Account reactivated"]},"delete":{"log":["تم حذف الحساب","Account deleted"],"remove":true}},"editLink":null,"own":null,"fixed":null};
  var PAGE_SIZE = CFG.pageSize;   // = number of row slots in index.html
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function today() { return new Date().toISOString().slice(0, 10); }
  var SEED = [{"id":"acc-001","name":"معرض الأمل","type":"car_dealer","status":"new","created":"2026-10-18","email":"contact1@example.com","phone":"+20 100 555 1000","free":0,"paid":0,"tx":[],"log":[]},{"id":"acc-002","name":"مركز الصدارة للقطع","type":"spare_parts","status":"new","created":"2026-10-17","email":"contact2@example.com","phone":"+20 107 555 1013","free":0,"paid":0,"tx":[],"log":[]},{"id":"acc-003","name":"سفر لتأجير السيارات","type":"rental","status":"pending","created":"2026-10-16","email":"contact3@example.com","phone":"+20 104 555 1026","free":0,"paid":0,"tx":[],"log":[]},{"id":"acc-004","name":"Delta Motors","type":"car_dealer","status":"pending","created":"2026-10-15","email":"contact4@example.com","phone":"+20 101 555 1039","free":0,"paid":0,"tx":[],"log":[]},{"id":"acc-005","name":"Roadside Heroes","type":"recovery","status":"pending","created":"2026-10-14","email":"contact5@example.com","phone":"+20 108 555 1052","free":0,"paid":0,"tx":[],"log":[]},{"id":"acc-006","name":"محمد عبد الله","type":"customer","status":"active","created":"2026-09-28","email":"contact6@example.com","phone":"+20 105 555 1065","free":120,"paid":340,"tx":[{"typeB":{"ar":"دفع","en":"Payment"},"amt":"-180","date":"2026-10-16"},{"typeB":{"ar":"مكافأة","en":"Reward"},"amt":"+200","date":"2026-09-21"},{"typeB":{"ar":"خصم","en":"Deduction"},"amt":"-220","date":"2026-08-26"}],"log":[]},{"id":"acc-007","name":"Sara Ibrahim","type":"customer","status":"active","created":"2026-09-12","email":"contact7@example.com","phone":"+20 102 555 1078","free":45,"paid":0,"tx":[{"typeB":{"ar":"مكافأة","en":"Reward"},"amt":"+200","date":"2026-10-19"},{"typeB":{"ar":"خصم","en":"Deduction"},"amt":"-220","date":"2026-09-24"}],"log":[]},{"id":"acc-008","name":"Royal Cars Showroom","type":"car_dealer","status":"rejected","created":"2026-09-03","email":"contact8@example.com","phone":"+20 109 555 1091","free":0,"paid":0,"tx":[],"log":[{"d":"2026-09-05","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم رفض الحساب","en":"Account rejected"},"r":""}]},{"id":"acc-009","name":"ياسمين خالد","type":"customer","status":"active","created":"2026-08-30","email":"contact9@example.com","phone":"+20 106 555 1104","free":0,"paid":210,"tx":[{"typeB":{"ar":"إيداع","en":"Deposit"},"amt":"+240","date":"2026-10-25"},{"typeB":{"ar":"دفع","en":"Payment"},"amt":"-260","date":"2026-09-03"}],"log":[]},{"id":"acc-010","name":"Omar Fathy","type":"customer","status":"active","created":"2026-08-14","email":"contact10@example.com","phone":"+20 103 555 1117","free":300,"paid":120,"tx":[{"typeB":{"ar":"دفع","en":"Payment"},"amt":"-260","date":"2026-10-01"},{"typeB":{"ar":"مكافأة","en":"Reward"},"amt":"+280","date":"2026-09-06"},{"typeB":{"ar":"خصم","en":"Deduction"},"amt":"-300","date":"2026-08-11"}],"log":[]},{"id":"acc-011","name":"نورهان سمير","type":"customer","status":"disabled","created":"2026-07-21","email":"contact11@example.com","phone":"+20 100 555 1130","free":0,"paid":0,"tx":[],"log":[{"d":"2026-08-02","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم تعطيل الحساب","en":"Account disabled"},"r":""}]},{"id":"acc-012","name":"Karim Nabil","type":"customer","status":"active","created":"2026-07-02","email":"contact12@example.com","phone":"+20 107 555 1143","free":60,"paid":0,"tx":[{"typeB":{"ar":"خصم","en":"Deduction"},"amt":"-300","date":"2026-10-07"},{"typeB":{"ar":"إيداع","en":"Deposit"},"amt":"+320","date":"2026-09-12"}],"log":[]},{"id":"acc-013","name":"هدى مصطفى","type":"customer","status":"active","created":"2026-06-18","email":"contact13@example.com","phone":"+20 104 555 1156","free":0,"paid":95,"tx":[{"typeB":{"ar":"إيداع","en":"Deposit"},"amt":"+320","date":"2026-10-10"},{"typeB":{"ar":"دفع","en":"Payment"},"amt":"-40","date":"2026-09-15"}],"log":[]},{"id":"acc-014","name":"ورشة الأصيل","type":"spare_parts","status":"approved","created":"2026-06-08","email":"contact14@example.com","phone":"+20 101 555 1169","free":500,"paid":1800,"tx":[{"typeB":{"ar":"دفع","en":"Payment"},"amt":"-40","date":"2026-10-13"},{"typeB":{"ar":"مكافأة","en":"Reward"},"amt":"+60","date":"2026-09-18"},{"typeB":{"ar":"خصم","en":"Deduction"},"amt":"-80","date":"2026-08-23"}],"log":[{"d":"2026-06-10","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم اعتماد الحساب","en":"Account approved"},"r":""}],"hasSub":true,"subStatus":"active","subStart":"2026-06-10","subEnd":"2027-06-10"},{"id":"acc-015","name":"Youssef Adel","type":"customer","status":"active","created":"2026-05-09","email":"contact15@example.com","phone":"+20 108 555 1182","free":20,"paid":0,"tx":[{"typeB":{"ar":"مكافأة","en":"Reward"},"amt":"+60","date":"2026-10-16"},{"typeB":{"ar":"خصم","en":"Deduction"},"amt":"-80","date":"2026-09-21"}],"log":[]},{"id":"acc-016","name":"ليلى حسن","type":"customer","status":"active","created":"2026-04-25","email":"contact16@example.com","phone":"+20 105 555 1195","free":0,"paid":0,"tx":[],"log":[]},{"id":"acc-017","name":"سحب وإنقاذ الصعيد","type":"recovery","status":"approved","created":"2026-04-12","email":"contact17@example.com","phone":"+20 102 555 1208","free":250,"paid":900,"tx":[{"typeB":{"ar":"إيداع","en":"Deposit"},"amt":"+100","date":"2026-10-22"},{"typeB":{"ar":"دفع","en":"Payment"},"amt":"-120","date":"2026-09-27"},{"typeB":{"ar":"مكافأة","en":"Reward"},"amt":"+140","date":"2026-08-05"}],"log":[{"d":"2026-04-14","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم اعتماد الحساب","en":"Account approved"},"r":""}],"hasSub":true,"subStatus":"active","subStart":"2026-04-14","subEnd":"2027-04-14"},{"id":"acc-018","name":"الواحة لتأجير السيارات","type":"rental","status":"approved","created":"2026-03-22","email":"contact18@example.com","phone":"+20 109 555 1221","free":100,"paid":2400,"tx":[{"typeB":{"ar":"دفع","en":"Payment"},"amt":"-120","date":"2026-10-25"},{"typeB":{"ar":"مكافأة","en":"Reward"},"amt":"+140","date":"2026-09-03"},{"typeB":{"ar":"خصم","en":"Deduction"},"amt":"-160","date":"2026-08-08"}],"log":[{"d":"2026-03-23","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم اعتماد الحساب","en":"Account approved"},"r":""}],"hasSub":true,"subStatus":"near","subStart":"2025-11-05","subEnd":"2026-11-05"},{"id":"acc-019","name":"Gear Hub","type":"spare_parts","status":"disabled","created":"2026-02-27","email":"contact19@example.com","phone":"+20 106 555 1234","free":0,"paid":150,"tx":[{"typeB":{"ar":"مكافأة","en":"Reward"},"amt":"+140","date":"2026-10-01"},{"typeB":{"ar":"خصم","en":"Deduction"},"amt":"-160","date":"2026-09-06"}],"log":[{"d":"2026-09-30","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم تعطيل الحساب","en":"Account disabled"},"r":""}],"hasSub":true,"subStatus":"expired","subStart":"2025-03-01","subEnd":"2026-03-01"},{"id":"acc-020","name":"معرض النخبة للسيارات","type":"car_dealer","status":"approved","created":"2026-02-11","email":"contact20@example.com","phone":"+20 103 555 1247","free":800,"paid":5200,"tx":[{"typeB":{"ar":"خصم","en":"Deduction"},"amt":"-160","date":"2026-10-04"},{"typeB":{"ar":"إيداع","en":"Deposit"},"amt":"+180","date":"2026-09-09"},{"typeB":{"ar":"دفع","en":"Payment"},"amt":"-200","date":"2026-08-14"}],"log":[{"d":"2026-02-12","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم اعتماد الحساب","en":"Account approved"},"r":""}],"hasSub":true,"subStatus":"active","subStart":"2026-02-12","subEnd":"2027-02-12"},{"id":"acc-021","name":"Nile Rent-a-Car","type":"rental","status":"approved","created":"2026-01-30","email":"contact21@example.com","phone":"+20 100 555 1260","free":0,"paid":1300,"tx":[{"typeB":{"ar":"إيداع","en":"Deposit"},"amt":"+180","date":"2026-10-07"},{"typeB":{"ar":"دفع","en":"Payment"},"amt":"-200","date":"2026-09-12"},{"typeB":{"ar":"مكافأة","en":"Reward"},"amt":"+220","date":"2026-08-17"}],"log":[{"d":"2026-02-01","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم اعتماد الحساب","en":"Account approved"},"r":""}],"hasSub":true,"subStatus":"active","subStart":"2026-02-01","subEnd":"2027-02-01"},{"id":"acc-022","name":"Al-Salam Auto Parts","type":"spare_parts","status":"approved","created":"2025-12-19","email":"contact22@example.com","phone":"+20 107 555 1273","free":150,"paid":980,"tx":[{"typeB":{"ar":"دفع","en":"Payment"},"amt":"-200","date":"2026-10-10"},{"typeB":{"ar":"مكافأة","en":"Reward"},"amt":"+220","date":"2026-09-15"},{"typeB":{"ar":"خصم","en":"Deduction"},"amt":"-240","date":"2026-08-20"}],"log":[{"d":"2025-12-20","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم اعتماد الحساب","en":"Account approved"},"r":""}],"hasSub":true,"subStatus":"near","subStart":"2025-11-20","subEnd":"2026-11-20"},{"id":"acc-023","name":"قطع غيار الأمانة","type":"spare_parts","status":"approved","created":"2025-11-04","email":"contact23@example.com","phone":"+20 104 555 1286","free":400,"paid":2100,"tx":[{"typeB":{"ar":"مكافأة","en":"Reward"},"amt":"+220","date":"2026-10-13"},{"typeB":{"ar":"خصم","en":"Deduction"},"amt":"-240","date":"2026-09-18"},{"typeB":{"ar":"إيداع","en":"Deposit"},"amt":"+260","date":"2026-08-23"}],"log":[{"d":"2025-11-06","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم اعتماد الحساب","en":"Account approved"},"r":""}],"hasSub":true,"subStatus":"active","subStart":"2025-11-06","subEnd":"2026-12-31"},{"id":"acc-024","name":"إنقاذ السريع","type":"recovery","status":"approved","created":"2025-10-10","email":"contact24@example.com","phone":"+20 101 555 1299","free":0,"paid":760,"tx":[{"typeB":{"ar":"خصم","en":"Deduction"},"amt":"-240","date":"2026-10-16"},{"typeB":{"ar":"إيداع","en":"Deposit"},"amt":"+260","date":"2026-09-21"},{"typeB":{"ar":"دفع","en":"Payment"},"amt":"-280","date":"2026-08-26"}],"log":[{"d":"2025-10-12","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم اعتماد الحساب","en":"Account approved"},"r":""}],"hasSub":true,"subStatus":"near","subStart":"2025-10-12","subEnd":"2026-10-30"}];
  var ME = (D.session && D.session.name) || { ar: 'مستخدم', en: 'User' };
  function load() {   // Backend: replace with the API request
    if (window.__LOAD__) return window.__LOAD__(JSON.parse(JSON.stringify(SEED)));
    if (CFG.store) { try { var s = sessionStorage.getItem(CFG.store); if (s) return JSON.parse(s); } catch (e) { /* storage unavailable */ } }
    var seed = JSON.parse(JSON.stringify(SEED)); save(seed); return seed;
  }
  function save(rows) { if (window.__SAVE__) { window.__SAVE__(rows); return; } if (CFG.store) { try { sessionStorage.setItem(CFG.store, JSON.stringify(rows)); } catch (e) { /* storage unavailable */ } } }
  window.__DERIVE__ = function (r) {
      var T = {"customer":["عميل","Customer"],"car_dealer":["معرض سيارات","Car dealer"],"rental":["تأجير سيارات","Car rental"],"spare_parts":["قطع غيار","Spare parts"],"recovery":["خدمات إنقاذ","Recovery"]}, t = T[r.type] || ['', ''];
      r.typeB = { ar: t[0], en: t[1] }; r.isBiz = r.type !== 'customer' ? 'true' : 'false'; r.isReq = (r.type !== 'customer' && (r.status === 'new' || r.status === 'pending')) ? 'true' : 'false';
      r.freeN = Number(r.free).toLocaleString('en-US'); r.paidN = Number(r.paid).toLocaleString('en-US');
      var SB = { active: ['نشط', 'Active'], near: ['قريب من الانتهاء', 'Near expiry'], expired: ['منتهي', 'Expired'] }, sb = SB[r.subStatus] || ['', ''];
      r.subB = { ar: sb[0], en: sb[1] }; r.txView = (r.tx || []).slice(0, 4);
    };
  window.__AFTER__ = function (rec, action, vals) {
      if (action === 'reactivate') rec.status = rec.type === 'customer' ? 'active' : 'approved';
      if (action === 'reject') rec.rejectReason = vals.reason;
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
