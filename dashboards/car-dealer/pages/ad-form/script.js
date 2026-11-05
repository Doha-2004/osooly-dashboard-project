/* Car Dealer Dashboard – Car ad form page.
   Behavior only: the form, its error messages, the photo hint and the success/error banners are written in index.html.
   This file validates the fields, fills values when editing (?id=), and saves the record to the mock store.
   Edit policy and rules not defined in the requirements document are placeholders (see the notes on the page).
   ALL DATA IS MOCK. Backend: replace load() / save() with the API and upload the photos to the server. */
(function () {
  'use strict';
  var D = window.CarDealerDash, CFG = {"store":"osooly.mock.dealerAds","listHref":"../ads/index.html","maxPhotos":10,"prefix":"CAR-","start":2000,"lockedStatus":"sold","defaults":{"views":0,"calls":0,"wa":0,"status":"pending","rejectReason":null,"photos":0,"whatsapp":false},"fields":[{"id":"title","rec":"title","bi":true,"type":"text","required":true,"minlen":3,"maxlen":80},{"id":"year","rec":"year","type":"number","required":true,"int":true,"min":1980,"max":2027},{"id":"price","rec":"price","type":"number","required":true,"min":1000},{"id":"km","rec":"km","type":"number","required":true,"int":true,"min":0},{"id":"fuel","rec":"fuel","type":"select","required":true},{"id":"gear","rec":"gear","type":"select","required":true},{"id":"phone","rec":"phone","type":"tel","required":true,"pattern":"^01[0125]\\d{8}$"},{"id":"whatsapp","rec":"whatsapp","type":"checkbox"},{"id":"description","rec":"description","bi":true,"type":"textarea","required":true,"minlen":20},{"id":"photos","rec":"photos","type":"file"}]}, SEED = [{"id":"CAR-2001","title":{"ar":"سكودا أوكتافيا 2023","en":"Skoda Octavia 2023"},"year":2023,"price":1150000,"km":12000,"fuel":"petrol","gear":"auto","phone":"0100 220 2202","whatsapp":true,"photos":6,"description":{"ar":"بحالة ممتازة، صيانة كاملة في الوكالة، والفحص الشامل متاح.","en":"Excellent condition, full agency service, full inspection available."},"status":"approved","date":"2026-10-21","views":1240,"calls":86,"wa":41,"rejectReason":null,"log":[{"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"by":{"ar":"سلمى حسن","en":"Salma Hassan"},"d":"2026-10-21","r":""}]},{"id":"CAR-2002","title":{"ar":"مرسيدس C200 2020","en":"Mercedes C200 2020"},"year":2020,"price":1850000,"km":40000,"fuel":"petrol","gear":"auto","phone":"0100 220 2202","whatsapp":true,"photos":8,"description":{"ar":"مرسيدس C200 بحالة الوكالة، فل أوبشن.","en":"Mercedes C200 in agency condition, full option."},"status":"approved","date":"2026-10-12","views":2310,"calls":154,"wa":97,"rejectReason":null,"log":[{"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"by":{"ar":"سلمى حسن","en":"Salma Hassan"},"d":"2026-10-12","r":""}]},{"id":"CAR-2003","title":{"ar":"بي إم دبليو 320i 2021","en":"BMW 320i 2021"},"year":2021,"price":1650000,"km":29000,"fuel":"petrol","gear":"auto","phone":"0100 220 2202","whatsapp":false,"photos":5,"description":{"ar":"سيارة نظيفة جدًا، سجل صيانة منتظم.","en":"Very clean car with regular service history."},"status":"approved","date":"2026-09-28","views":980,"calls":61,"wa":0,"rejectReason":null,"log":[{"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"by":{"ar":"سلمى حسن","en":"Salma Hassan"},"d":"2026-09-28","r":""}]},{"id":"CAR-2004","title":{"ar":"جيلي إمجراند 2024","en":"Geely Emgrand 2024"},"year":2024,"price":780000,"km":5000,"fuel":"petrol","gear":"auto","phone":"0100 220 2202","whatsapp":true,"photos":4,"description":{"ar":"سيارة شبه جديدة بضمان المعرض.","en":"Almost new car with showroom warranty."},"status":"approved","date":"2026-10-05","views":455,"calls":22,"wa":14,"rejectReason":null,"log":[{"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"by":{"ar":"سلمى حسن","en":"Salma Hassan"},"d":"2026-10-05","r":""}]},{"id":"CAR-2005","title":{"ar":"ميتسوبيشي لانسر 2016","en":"Mitsubishi Lancer 2016"},"year":2016,"price":430000,"km":120000,"fuel":"petrol","gear":"auto","phone":"0100 220 2202","whatsapp":false,"photos":3,"description":{"ar":"سيارة اقتصادية بحالة جيدة، فحص متاح.","en":"Economical car in good condition, inspection available."},"status":"pending","date":"2026-10-18","views":0,"calls":0,"wa":0,"rejectReason":null,"log":[{"a":{"ar":"تم إنشاء الإعلان وإرساله للمراجعة","en":"Ad created and sent for review"},"by":{"ar":"سلمى حسن","en":"Salma Hassan"},"d":"2026-10-18","r":""}]},{"id":"CAR-2006","title":{"ar":"هوندا سيفيك 2017","en":"Honda Civic 2017"},"year":2017,"price":720000,"km":110000,"fuel":"petrol","gear":"auto","phone":"0100 220 2202","whatsapp":true,"photos":5,"description":{"ar":"سيارة بحالة جيدة وصيانة دورية منتظمة.","en":"Good condition with regular periodic service."},"status":"rejected","date":"2026-09-08","views":0,"calls":0,"wa":0,"rejectReason":{"ar":"الصور غير واضحة. أضف صورًا للداخل والخارج بإضاءة جيدة.","en":"The photos are unclear. Add interior and exterior photos in good light."},"log":[{"a":{"ar":"تم رفض الإعلان","en":"Ad rejected"},"by":{"ar":"سلمى حسن","en":"Salma Hassan"},"d":"2026-09-08","r":""}]},{"id":"CAR-2007","title":{"ar":"تويوتا كورولا 2019","en":"Toyota Corolla 2019"},"year":2019,"price":560000,"km":64000,"fuel":"petrol","gear":"manual","phone":"0100 220 2202","whatsapp":true,"photos":4,"description":{"ar":"كورولا عادية بحالة ممتازة.","en":"Manual Corolla in excellent condition."},"status":"inactive","date":"2026-08-30","views":720,"calls":40,"wa":18,"rejectReason":null,"log":[{"a":{"ar":"تم إيقاف نشر الإعلان","en":"Ad unpublished"},"by":{"ar":"سلمى حسن","en":"Salma Hassan"},"d":"2026-08-30","r":""}]},{"id":"CAR-2008","title":{"ar":"هيونداي إلنترا 2019","en":"Hyundai Elantra 2019"},"year":2019,"price":540000,"km":82000,"fuel":"petrol","gear":"auto","phone":"0100 220 2202","whatsapp":true,"photos":5,"description":{"ar":"سيارة مباعة، شكرًا لكل من تواصل معنا.","en":"Sold car. Thank you to everyone who contacted us."},"status":"sold","date":"2026-10-14","views":1560,"calls":93,"wa":52,"rejectReason":null,"log":[{"a":{"ar":"تم تسجيل الإعلان كمباع","en":"Ad marked as sold"},"by":{"ar":"سلمى حسن","en":"Salma Hassan"},"d":"2026-10-14","r":""}]}];
  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function today() { return new Date().toISOString().slice(0, 10); }
  var ME = (D.session && D.session.name) || { ar: 'مستخدم', en: 'User' };
  function load() {
    try { var s = sessionStorage.getItem(CFG.store); if (s) return JSON.parse(s); } catch (e) { /* storage unavailable */ }
    var seed = JSON.parse(JSON.stringify(SEED)); save(seed); return seed;
  }
  function save(rows) { try { sessionStorage.setItem(CFG.store, JSON.stringify(rows)); } catch (e) { /* storage unavailable */ } }
  var rows = load(), form = $('#ad-form');
  var editId = new URLSearchParams(location.search).get('id');
  var row = editId ? rows.filter(function (r) { return r.id === editId; })[0] : null;
  if (editId && (!row || (CFG.lockedStatus && row.status === CFG.lockedStatus))) { location.replace(CFG.listHref); return; }
  var isEdit = !!row;
  function show(sel, on) { $$(sel).forEach(function (n) { n.classList.toggle('d-none', !on); }); }
  show('[data-mode="add"]', !isEdit); show('[data-mode="edit"]', isEdit);
  function val(v) { return v && typeof v === 'object' && 'ar' in v ? v.ar : (v == null ? '' : v); }
  function getPath(r, p) { return p.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, r); }

  /* prefill (edit) */
  if (isEdit) {
    CFG.fields.forEach(function (f) {
      var c = $('#f-' + f.id); if (!c || f.type === 'file') return;
      var v = getPath(row, f.rec);
      if (f.type === 'checkbox') c.checked = !!v;
      else if (f.map) { var key = ''; for (var k in f.map) { if (f.map[k].ar === v.ar) key = k; } c.value = key; }
      else c.value = val(v);
    });
  }

  /* photos: counted only (demo) */
  var photos = $('#f-photos');
  function photoCount() { return photos && photos.files ? photos.files.length : 0; }
  function photoHint() {
    var n = photoCount(), cur = isEdit ? Number(row.photos) || 0 : 0;
    show('[data-hint="none"]', !n && !isEdit); show('[data-hint="keep"]', !n && isEdit); show('[data-hint="chosen"]', n > 0);
    $$('[data-photo-n]').forEach(function (s) { s.textContent = n; }); $$('[data-photo-cur]').forEach(function (s) { s.textContent = cur; });
  }
  if (photos) { photos.addEventListener('change', function () { photos.classList.remove('is-invalid'); photoHint(); }); photoHint(); }

  function setErr(c, bad) { c.classList.toggle('is-invalid', bad); c.setAttribute('aria-invalid', bad ? 'true' : 'false'); }
  function check(f) {
    var c = $('#f-' + f.id), v = f.type === 'checkbox' ? c.checked : c.value.trim();
    if (f.type === 'file') { var n = photoCount(); return n > CFG.maxPhotos || (!isEdit && n < 1); }
    if (f.type === 'checkbox') return false;
    if (f.required && !v) return true;
    if (!v) return false;
    if (f.type === 'number') { var x = Number(v); if (!(x >= (f.min == null ? -Infinity : f.min)) || (f.max != null && x > f.max) || (f.int && !Number.isInteger(x))) return true; }
    if (f.minlen && v.length < f.minlen) return true;
    if (f.maxlen && v.length > f.maxlen) return true;
    if (f.pattern && !(new RegExp(f.pattern)).test(v.replace(/\s+/g, ''))) return true;
    return false;
  }
  CFG.fields.forEach(function (f) { var c = $('#f-' + f.id); if (c) c.addEventListener('input', function () { setErr(c, false); $('#form-error').classList.add('d-none'); }); });
  function keepOrSet(old, v) { return (old && typeof old === 'object' && v === old.ar) ? old : { ar: v, en: v }; }
  function setPath(r, p, v) { var a = p.split('.'), o = r; for (var i = 0; i < a.length - 1; i++) { o[a[i]] = o[a[i]] || {}; o = o[a[i]]; } o[a[a.length - 1]] = v; }
  function nextId() { var n = CFG.start; rows.forEach(function (r) { var m = /(\d+)$/.exec(r.id); if (m) n = Math.max(n, Number(m[1])); }); return CFG.prefix + (n + 1); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [];
    CFG.fields.forEach(function (f) { var c = $('#f-' + f.id); var b = check(f); setErr(c, b); if (b) bad.push(c); });
    $('#form-error').classList.toggle('d-none', !bad.length);
    if (bad.length) { bad[0].focus(); return; }
    var rec = isEdit ? row : JSON.parse(JSON.stringify(CFG.defaults));
    CFG.fields.forEach(function (f) {
      if (f.type === 'file') return;
      var c = $('#f-' + f.id), v = f.type === 'checkbox' ? c.checked : c.value.trim();
      if (f.type === 'number') v = Number(v);
      if (f.type === 'tel') v = v.replace(/\s+/g, '');
      if (f.map) v = f.map[v]; else if (f.bi) v = keepOrSet(isEdit ? getPath(row, f.rec) : null, v);
      setPath(rec, f.rec, v);
    });
    var n = photoCount(); if (n) rec.photos = n;
    var by = ME, day = today();
    rec.log = rec.log || [];
    if (isEdit) { rec.status = 'pending'; rec.rej = { ar: '', en: '' }; rec.rejectReason = null; rec.log.push({ d: day, by: by, a: { ar: 'تم تعديل الإعلان وإرساله للمراجعة', en: 'Ad edited and sent for review' }, r: '' }); }
    else { rec.id = nextId(); rec.date = day; rec.log = [{ d: day, by: by, a: { ar: 'تم إنشاء الإعلان وإرساله للمراجعة', en: 'Ad created and sent for review' }, r: '' }]; rows.unshift(rec); }
    save(rows);   // Backend: POST / PUT the record, then upload the photos
    location.replace(CFG.listHref);
  });
})();
