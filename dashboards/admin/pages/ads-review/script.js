/* Admin Dashboard – Ads review page (requirement 3.3).
   Behavior only. Every element (row slots, the single details panel, history slots, pager, confirm step, toast, empty state)
   is written in index.html. This file fills them with text / attributes and shows or hides them with classes; it never
   creates, clones or injects markup. ALL DATA IS MOCK. Backend: replace load() with the API (page + filters sent to the
   server, at most PAGE_SIZE records per response) and the changes made in perform() / create() with the real requests. */
(function () {
  'use strict';
  var D = window.AdminDash, CFG = {"pageSize":10,"store":"osooly.mock.adsReview","statusField":"status","tabField":"status","tabDefs":null,"defaultTab":null,"search":["title","owner","id"],"dateField":"date","actions":{"approve":{"next":"approved","log":["تم اعتماد الإعلان","Ad approved"]},"reject":{"next":"rejected","log":["تم رفض الإعلان","Ad rejected"],"inputs":[{"id":"reason","required":true,"field":"rejectReason"}]},"disable":{"next":"disabled","log":["تم تعطيل الإعلان","Ad disabled"]},"delete":{"log":["تم حذف الإعلان","Ad deleted"],"remove":true}},"editLink":null,"own":null,"fixed":null};
  var PAGE_SIZE = CFG.pageSize;   // = number of row slots in index.html
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function today() { return new Date().toISOString().slice(0, 10); }
  var SEED = [{"id":"ad-001","title":"تويوتا كورولا 2021","category":"car","owner":"محمد عبد الله","ownerType":"customer","status":"new","date":"2026-10-21","price":620000,"photos":4,"phone":"+20 110 555 2000","desc":"ممشى 45 ألف كم، حالة ممتازة، صيانة دورية بالوكالة.","rejectReason":"","log":[]},{"id":"ad-002","title":"Skoda Octavia 2023","category":"car","owner":"معرض النخبة للسيارات","ownerType":"car_dealer","status":"new","date":"2026-10-21","price":1150000,"photos":4,"phone":"+20 113 555 2017","desc":"Single owner, full service history, under warranty.","rejectReason":"","log":[]},{"id":"ad-003","title":"بطارية سيارة 70 أمبير","category":"part","owner":"قطع غيار الأمانة","ownerType":"spare_parts","status":"new","date":"2026-10-20","price":2400,"photos":2,"phone":"+20 116 555 2034","desc":"بطارية جديدة بضمان سنتين.","rejectReason":"","log":[]},{"id":"ad-004","title":"Plate X Y Z 777","category":"plate","owner":"Omar Fathy","ownerType":"customer","status":"new","date":"2026-10-20","price":85000,"photos":1,"phone":"+20 119 555 2051","desc":"Metal plate, clean record.","rejectReason":"","log":[]},{"id":"ad-005","title":"كيا سبورتاج 2022","category":"car","owner":"هدى مصطفى","ownerType":"customer","status":"pending","date":"2026-10-19","price":910000,"photos":4,"phone":"+20 112 555 2068","desc":"فبريكا بالكامل، رخصة سارية.","rejectReason":"","log":[]},{"id":"ad-006","title":"Weekly rental - Kia Cerato","category":"rental","owner":"الواحة لتأجير السيارات","ownerType":"rental","status":"pending","date":"2026-10-19","price":4200,"photos":3,"phone":"+20 115 555 2085","desc":"Weekly rate, insurance included, unlimited mileage.","rejectReason":"","log":[]},{"id":"ad-007","title":"Brake pads set - Corolla","category":"part","owner":"Al-Salam Auto Parts","ownerType":"spare_parts","status":"pending","date":"2026-10-18","price":950,"photos":2,"phone":"+20 118 555 2102","desc":"OEM-quality brake pads, front set.","rejectReason":"","log":[]},{"id":"ad-008","title":"سيارة حادث - هيكل سليم","category":"accident","owner":"ياسمين خالد","ownerType":"customer","status":"pending","date":"2026-10-17","price":185000,"photos":4,"phone":"+20 111 555 2119","desc":"حادث خفيف من الأمام، الهيكل سليم والمحرك يعمل.","rejectReason":"","log":[]},{"id":"ad-009","title":"تأجير فورد فيوجن يومي","category":"rental","owner":"Nile Rent-a-Car","ownerType":"rental","status":"pending","date":"2026-10-16","price":650,"photos":3,"phone":"+20 114 555 2136","desc":"إيجار يومي مع سائق اختياري.","rejectReason":"","log":[]},{"id":"ad-010","title":"Toyota Yaris 2020","category":"car","owner":"Youssef Adel","ownerType":"customer","status":"rejected","date":"2026-10-15","price":480000,"photos":1,"phone":"+20 117 555 2153","desc":"Great condition.","rejectReason":"بيانات الإعلان ناقصة","log":[{"d":"2026-10-16","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم رفض الإعلان","en":"Ad rejected"},"r":"بيانات الإعلان ناقصة","n":{"ar":"","en":""}}]},{"id":"ad-011","title":"Hyundai Elantra 2019","category":"car","owner":"Sara Ibrahim","ownerType":"customer","status":"approved","date":"2026-10-14","price":540000,"photos":4,"phone":"+20 110 555 2170","desc":"Automatic, 70k km, new tires.","rejectReason":"","log":[{"d":"2026-10-15","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":"","n":{"ar":"","en":""}}]},{"id":"ad-012","title":"مرسيدس C200 2020","category":"car","owner":"معرض النخبة للسيارات","ownerType":"car_dealer","status":"approved","date":"2026-10-12","price":1850000,"photos":4,"phone":"+20 113 555 2187","desc":"وارد الوكالة، ضمان ساري.","rejectReason":"","log":[{"d":"2026-10-13","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":"","n":{"ar":"","en":""}}]},{"id":"ad-013","title":"فيات 128 كلاسيك","category":"car","owner":"Omar Fathy","ownerType":"customer","status":"cancelled","date":"2026-10-11","price":90000,"photos":3,"phone":"+20 116 555 2204","desc":"Classic car, project vehicle.","rejectReason":"","log":[]},{"id":"ad-014","title":"إطارات ميشلان 205/55","category":"part","owner":"ورشة الأصيل","ownerType":"spare_parts","status":"approved","date":"2026-10-10","price":7200,"photos":2,"phone":"+20 119 555 2221","desc":"طقم إطارات جديد، إنتاج 2026.","rejectReason":"","log":[{"d":"2026-10-11","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":"","n":{"ar":"","en":""}}]},{"id":"ad-015","title":"لوحة معدنية س ص ع 555","category":"plate","owner":"نورهان سمير","ownerType":"customer","status":"rejected","date":"2026-10-09","price":60000,"photos":1,"phone":"+20 112 555 2238","desc":"لوحة مميزة.","rejectReason":"السعر غير منطقي","log":[{"d":"2026-10-10","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم رفض الإعلان","en":"Ad rejected"},"r":"السعر غير منطقي","n":{"ar":"","en":""}}]},{"id":"ad-016","title":"لوحة معدنية أ ب ج 1234","category":"plate","owner":"محمد عبد الله","ownerType":"customer","status":"approved","date":"2026-10-08","price":120000,"photos":1,"phone":"+20 115 555 2255","desc":"لوحة مميزة، نقل ملكية فوري.","rejectReason":"","log":[{"d":"2026-10-09","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":"","n":{"ar":"","en":""}}]},{"id":"ad-017","title":"Accident car - front damage","category":"accident","owner":"Karim Nabil","ownerType":"customer","status":"approved","date":"2026-10-05","price":95000,"photos":4,"phone":"+20 118 555 2272","desc":"Front damage, engine and gearbox intact.","rejectReason":"الصور غير واضحة","log":[{"d":"2026-10-06","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم رفض الإعلان","en":"Ad rejected"},"r":"الصور غير واضحة","n":{"ar":"","en":""}},{"d":"2026-10-08","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":"","n":{"ar":"إعادة مراجعة","en":"Re-review"}}]},{"id":"ad-018","title":"Oil filter pack","category":"part","owner":"Al-Salam Auto Parts","ownerType":"spare_parts","status":"approved","date":"2026-10-02","price":480,"photos":1,"phone":"+20 111 555 2289","desc":"Pack of 10 filters, assorted models.","rejectReason":"","log":[{"d":"2026-10-03","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":"","n":{"ar":"","en":""}}]},{"id":"ad-019","title":"سيارة بدون صور","category":"car","owner":"Sara Ibrahim","ownerType":"customer","status":"rejected","date":"2026-09-30","price":300000,"photos":0,"phone":"+20 114 555 2306","desc":"No photos uploaded.","rejectReason":"الصور غير واضحة","log":[{"d":"2026-10-01","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم رفض الإعلان","en":"Ad rejected"},"r":"الصور غير واضحة","n":{"ar":"","en":""}}]},{"id":"ad-020","title":"BMW 320i 2021","category":"car","owner":"معرض النخبة للسيارات","ownerType":"car_dealer","status":"approved","date":"2026-09-28","price":1650000,"photos":4,"phone":"+20 117 555 2323","desc":"ممشى 30 ألف كم، فل كامل.","rejectReason":"","log":[{"d":"2026-09-29","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":"","n":{"ar":"","en":""}}]},{"id":"ad-021","title":"Daily rental - Hyundai Accent","category":"rental","owner":"Nile Rent-a-Car","ownerType":"rental","status":"approved","date":"2026-09-25","price":700,"photos":3,"phone":"+20 110 555 2340","desc":"Daily rate, free delivery within the city.","rejectReason":"","log":[{"d":"2026-09-26","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":"","n":{"ar":"","en":""}}]},{"id":"ad-022","title":"تأجير شهري - ميتسوبيشي لانسر","category":"rental","owner":"الواحة لتأجير السيارات","ownerType":"rental","status":"cancelled","date":"2026-09-22","price":9800,"photos":3,"phone":"+20 113 555 2357","desc":"إيجار شهري شامل التأمين.","rejectReason":"","log":[]},{"id":"ad-023","title":"نيسان صني 2018","category":"car","owner":"ليلى حسن","ownerType":"customer","status":"approved","date":"2026-09-20","price":360000,"photos":4,"phone":"+20 116 555 2374","desc":"حالة جيدة جداً، عداد أصلي.","rejectReason":"","log":[{"d":"2026-09-21","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":"","n":{"ar":"","en":""}}]},{"id":"ad-024","title":"إعلان مخالف للسياسة","category":"part","owner":"Gear Hub","ownerType":"spare_parts","status":"rejected","date":"2026-09-18","price":1500,"photos":1,"phone":"+20 119 555 2391","desc":"محتوى مخالف.","rejectReason":"المحتوى مخالف لسياسة المنصة","log":[{"d":"2026-09-19","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم رفض الإعلان","en":"Ad rejected"},"r":"المحتوى مخالف لسياسة المنصة","n":{"ar":"","en":""}}]},{"id":"ad-025","title":"مكيف سيارة جديد","category":"part","owner":"قطع غيار الأمانة","ownerType":"spare_parts","status":"approved","date":"2026-09-12","price":5600,"photos":2,"phone":"+20 112 555 2408","desc":"مكيف كامل لعدة موديلات.","rejectReason":"","log":[{"d":"2026-09-13","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":"","n":{"ar":"","en":""}}]},{"id":"ad-026","title":"Honda Civic 2017","category":"car","owner":"معرض النخبة للسيارات","ownerType":"car_dealer","status":"disabled","date":"2026-09-08","price":480000,"photos":4,"phone":"+20 115 555 2425","desc":"Manual transmission, 90k km.","rejectReason":"","log":[{"d":"2026-09-09","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":"","n":{"ar":"","en":""}},{"d":"2026-10-04","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم تعطيل الإعلان","en":"Ad disabled"},"r":"","n":{"ar":"","en":""}}]},{"id":"ad-027","title":"Set of 4 alloy wheels","category":"part","owner":"ورشة الأصيل","ownerType":"spare_parts","status":"disabled","date":"2026-08-29","price":9000,"photos":2,"phone":"+20 118 555 2442","desc":"16 inch alloy wheels.","rejectReason":"","log":[{"d":"2026-08-30","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":"","n":{"ar":"","en":""}},{"d":"2026-09-25","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم تعطيل الإعلان","en":"Ad disabled"},"r":"","n":{"ar":"","en":""}}]},{"id":"ad-028","title":"Plate D E F 2026","category":"plate","owner":"Karim Nabil","ownerType":"customer","status":"disabled","date":"2026-08-15","price":70000,"photos":1,"phone":"+20 111 555 2459","desc":"Plate, transfer ready.","rejectReason":"","log":[{"d":"2026-08-16","by":{"ar":"منى عادل","en":"Mona Adel"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":"","n":{"ar":"","en":""}},{"d":"2026-09-10","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تم تعطيل الإعلان","en":"Ad disabled"},"r":"","n":{"ar":"","en":""}}]}];
  var ME = (D.session && D.session.name) || { ar: 'مستخدم', en: 'User' };
  function load() {   // Backend: replace with the API request
    if (window.__LOAD__) return window.__LOAD__(JSON.parse(JSON.stringify(SEED)));
    if (CFG.store) { try { var s = sessionStorage.getItem(CFG.store); if (s) return JSON.parse(s); } catch (e) { /* storage unavailable */ } }
    var seed = JSON.parse(JSON.stringify(SEED)); save(seed); return seed;
  }
  function save(rows) { if (window.__SAVE__) { window.__SAVE__(rows); return; } if (CFG.store) { try { sessionStorage.setItem(CFG.store, JSON.stringify(rows)); } catch (e) { /* storage unavailable */ } } }
  window.__DERIVE__ = function (r) {
      var C = {"car":{"ar":"سيارات","en":"Cars"},"rental":{"ar":"تأجير","en":"Rental"},"plate":{"ar":"لوحات معدنية","en":"License plates"},"part":{"ar":"قطع غيار","en":"Spare parts"},"accident":{"ar":"حوادث","en":"Accidents"}}, O = {"customer":{"ar":"عميل","en":"Customer"},"car_dealer":{"ar":"معرض سيارات","en":"Car dealer"},"rental":{"ar":"تأجير سيارات","en":"Car rental"},"spare_parts":{"ar":"قطع غيار","en":"Spare parts"},"workshop":{"ar":"ورشة","en":"Workshop"}}, c = C[r.category] || { ar: '', en: '' }, o = O[r.ownerType] || { ar: r.ownerType, en: r.ownerType };
      r.catB = c; r.ownB = o; r.rejB = { ar: r.rejectReason || '', en: r.rejectReason || '' };
    };
  window.__CHECK__ = function (rec, action, vals) {
      rec._prev = rec.status; return true;
    };
  window.__AFTER__ = function (rec, action, vals) {
      var last = rec.log[rec.log.length - 1];
      if ((rec._prev === 'rejected' || rec._prev === 'cancelled') && action !== 'disable') last.n = { ar: 'إعادة مراجعة (تبقى المراجعات السابقة محفوظة)', en: 'Re-review (previous reviews are kept)' };
      if (action === 'approve') rec.rejectReason = '';
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
