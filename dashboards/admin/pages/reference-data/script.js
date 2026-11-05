/* Admin Dashboard – Categories & reference data page (requirement 3.5).
   Behavior only. Every element (row slots, the single details panel, history slots, pager, confirm step, toast, empty state)
   is written in index.html. This file fills them with text / attributes and shows or hides them with classes; it never
   creates, clones or injects markup. ALL DATA IS MOCK. Backend: replace load() with the API (page + filters sent to the
   server, at most PAGE_SIZE records per response) and the changes made in perform() / create() with the real requests. */
(function () {
  'use strict';
  var D = window.AdminDash, CFG = {"pageSize":10,"store":"osooly.mock.reference","statusField":"status","tabField":"kind","tabDefs":null,"defaultTab":"vehicle_type","search":["name","parentName"],"dateField":null,"actions":{"edit":{"log":["تم تعديل العنصر","Item edited"],"inputs":[{"id":"ar","required":true,"field":"name.ar","prefill":"name.ar"},{"id":"en","required":true,"field":"name.en","prefill":"name.en"}]},"deactivate":{"next":"inactive","log":["تم تعطيل العنصر","Item deactivated"]},"activate":{"next":"active","log":["تم تفعيل العنصر","Item activated"]},"delete":{"log":["تم حذف العنصر","Item deleted"],"remove":true}},"editLink":null,"own":null,"fixed":null,"create":{"prefix":"new-","start":100,"defaults":{"usage":0,"status":"active","parentId":null},"dateField":"updated","byField":null,"log":["تمت إضافة العنصر","Item added"],"fields":[{"id":"kind","field":"kind","required":true},{"id":"ar","field":"name.ar","required":true},{"id":"en","field":"name.en","required":true},{"id":"parent","field":"parentId"}]}};
  var PAGE_SIZE = CFG.pageSize;   // = number of row slots in index.html
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function today() { return new Date().toISOString().slice(0, 10); }
  var SEED = [{"id":"vt-car","kind":"vehicle_type","name":{"ar":"سيارات","en":"Cars"},"parentId":null,"usage":14,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"vt-truck","kind":"vehicle_type","name":{"ar":"شاحنات ومركبات أخرى","en":"Trucks & other vehicles"},"parentId":null,"usage":6,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"vt-bike","kind":"vehicle_type","name":{"ar":"دراجات نارية","en":"Motorcycles"},"parentId":null,"usage":5,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"mf-toyota","kind":"manufacturer","name":{"ar":"تويوتا","en":"Toyota"},"parentId":"vt-car","usage":2,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"mf-hyundai","kind":"manufacturer","name":{"ar":"هيونداي","en":"Hyundai"},"parentId":"vt-car","usage":1,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"mf-kia","kind":"manufacturer","name":{"ar":"كيا","en":"Kia"},"parentId":"vt-car","usage":1,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"mf-skoda","kind":"manufacturer","name":{"ar":"سكودا","en":"Skoda"},"parentId":"vt-car","usage":1,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"mf-bmw","kind":"manufacturer","name":{"ar":"بي إم دبليو","en":"BMW"},"parentId":"vt-car","usage":1,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"mf-fiat","kind":"manufacturer","name":{"ar":"فيات","en":"Fiat"},"parentId":"vt-car","usage":0,"status":"inactive","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"mf-isuzu","kind":"manufacturer","name":{"ar":"إيسوزو","en":"Isuzu"},"parentId":"vt-truck","usage":1,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"mf-mitsu","kind":"manufacturer","name":{"ar":"ميتسوبيشي","en":"Mitsubishi"},"parentId":"vt-truck","usage":1,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"mf-honda","kind":"manufacturer","name":{"ar":"هوندا","en":"Honda"},"parentId":"vt-bike","usage":2,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"mf-yamaha","kind":"manufacturer","name":{"ar":"ياماها","en":"Yamaha"},"parentId":"vt-bike","usage":0,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"md-corolla","kind":"model","name":{"ar":"كورولا","en":"Corolla"},"parentId":"mf-toyota","usage":1,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"md-yaris","kind":"model","name":{"ar":"ياريس","en":"Yaris"},"parentId":"mf-toyota","usage":1,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"md-elantra","kind":"model","name":{"ar":"إلنترا","en":"Elantra"},"parentId":"mf-hyundai","usage":1,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"md-sportage","kind":"model","name":{"ar":"سبورتاج","en":"Sportage"},"parentId":"mf-kia","usage":1,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"md-octavia","kind":"model","name":{"ar":"أوكتافيا","en":"Octavia"},"parentId":"mf-skoda","usage":1,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"md-320i","kind":"model","name":{"ar":"320i","en":"320i"},"parentId":"mf-bmw","usage":1,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"md-canter","kind":"model","name":{"ar":"كانتر","en":"Canter"},"parentId":"mf-mitsu","usage":1,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"md-npr","kind":"model","name":{"ar":"NPR","en":"NPR"},"parentId":"mf-isuzu","usage":0,"status":"inactive","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"ac-cars","kind":"ad_category","name":{"ar":"إعلانات السيارات","en":"Car ads"},"parentId":null,"usage":14,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"ac-rental","kind":"ad_category","name":{"ar":"إعلانات تأجير السيارات","en":"Car rental ads"},"parentId":null,"usage":9,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"ac-plates","kind":"ad_category","name":{"ar":"لوحات الأرقام المعدنية","en":"License plates"},"parentId":null,"usage":4,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"ac-parts","kind":"ad_category","name":{"ar":"قطع الغيار","en":"Spare parts"},"parentId":null,"usage":22,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"ac-accidents","kind":"ad_category","name":{"ar":"إعلانات الحوادث","en":"Accident ads"},"parentId":null,"usage":3,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"sc-insurance","kind":"service_category","name":{"ar":"التأمين","en":"Insurance"},"parentId":null,"usage":31,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"sc-recovery","kind":"service_category","name":{"ar":"الإنقاذ وسحب السيارات","en":"Recovery & towing"},"parentId":null,"usage":18,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"sc-quotes","kind":"service_category","name":{"ar":"تسعير قطع الغيار","en":"Spare parts quotes"},"parentId":null,"usage":12,"status":"active","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]},{"id":"sc-inspect","kind":"service_category","name":{"ar":"فحص السيارات","en":"Car inspection"},"parentId":null,"usage":0,"status":"inactive","updated":"2026-09-01","log":[{"d":"2026-09-01","by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"a":{"ar":"تمت إضافة العنصر","en":"Item added"},"r":""}]}];
  var ME = (D.session && D.session.name) || { ar: 'مستخدم', en: 'User' };
  function load() {   // Backend: replace with the API request
    if (window.__LOAD__) return window.__LOAD__(JSON.parse(JSON.stringify(SEED)));
    if (CFG.store) { try { var s = sessionStorage.getItem(CFG.store); if (s) return JSON.parse(s); } catch (e) { /* storage unavailable */ } }
    var seed = JSON.parse(JSON.stringify(SEED)); save(seed); return seed;
  }
  function save(rows) { if (window.__SAVE__) { window.__SAVE__(rows); return; } if (CFG.store) { try { sessionStorage.setItem(CFG.store, JSON.stringify(rows)); } catch (e) { /* storage unavailable */ } } }
  window.__DERIVE__ = function (r) {
      var K = {"vehicle_type":["نوع مركبة","Vehicle type"],"manufacturer":["شركة مصنعة","Manufacturer"],"model":["موديل","Model"],"ad_category":["فئة إعلان","Ad category"],"service_category":["فئة خدمة","Service category"]}, k = K[r.kind] || ['', ''];
      var p = r.parentId ? all.filter(function (x) { return x.id === r.parentId; })[0] : null, kids = all.filter(function (x) { return x.parentId === r.id; }).length;
      r.kindB = { ar: k[0], en: k[1] }; r.parentName = p ? p.name : { ar: '—', en: '—' }; r.kids = kids;
      r.canDelete = r.usage === 0 && kids === 0;
      r.blockB = kids > 0 ? { ar: 'يحتوي على ' + kids + ' عنصر تابع. احذف العناصر التابعة أو انقلها أولًا.', en: 'It has ' + kids + ' dependent item(s). Delete or move them first.' }
        : r.usage > 0 ? { ar: 'مستخدم في ' + r.usage + ' سجل (إعلانات / طلبات)، لذلك لا يمكن حذفه. يمكنك تعطيله بدلًا من ذلك.', en: 'It is used by ' + r.usage + ' record(s) (ads / requests), so it cannot be deleted. Deactivate it instead.' } : null;
    };
  window.__AFTER__ = function (rec, action, vals) {
      rec.updated = new Date().toISOString().slice(0, 10);
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
