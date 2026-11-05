/* Spare Parts Shop Dashboard – Spare part ad form page.
   Behavior only: the form, its error messages, the photo hint and the success/error banners are written in index.html.
   This file validates the fields, fills values when editing (?id=), and saves the record to the mock store.
   Edit policy and rules not defined in the requirements document are placeholders (see the notes on the page).
   ALL DATA IS MOCK. Backend: replace load() / save() with the API and upload the photos to the server. */
(function () {
  'use strict';
  var D = window.SparePartsDash, CFG = {"store":"osooly.mock.partsAds","listHref":"../ads/index.html","maxPhotos":8,"prefix":"PRT-","start":4000,"lockedStatus":null,"defaults":{"views":0,"calls":0,"wal":0,"status":"pending","rej":{"ar":"","en":""},"photos":0,"wa":false},"fields":[{"id":"title","rec":"title","bi":true,"type":"text","required":true,"minlen":3,"maxlen":80},{"id":"price","rec":"price","type":"number","required":true,"min":1},{"id":"cat","rec":"cat","type":"select","required":true},{"id":"cond","rec":"cond","type":"select","required":true},{"id":"compat","rec":"compat","type":"text","required":true,"minlen":2},{"id":"phone","rec":"phone","type":"tel","required":true,"pattern":"^01[0125]\\d{8}$"},{"id":"wa","rec":"wa","type":"checkbox"},{"id":"desc","rec":"desc","bi":true,"type":"textarea","required":true,"minlen":10},{"id":"photos","rec":"photos","type":"file"}]}, SEED = [{"id":"PRT-4001","title":{"ar":"طقم تيل فرامل أمامي","en":"Front brake pads set"},"price":650,"cat":"brakes","cond":"new","compat":"تويوتا كورولا 2015-2022","phone":"0100 440 4404","wa":true,"wal":18,"photos":4,"desc":{"ar":"تيل فرامل أصلي مع ضمان 6 شهور.","en":"Original brake pads with a 6-month warranty."},"status":"approved","date":"2026-10-14","views":640,"calls":41,"rej":{"ar":"","en":""},"log":[{"d":"2026-10-14","by":{"ar":"سارة عبد الله","en":"Sara Abdullah"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":""}]},{"id":"PRT-4002","title":{"ar":"بطارية 70 أمبير","en":"70 Ah battery"},"price":2400,"cat":"electrical","cond":"new","compat":"عام","phone":"0100 440 4404","wa":true,"wal":35,"photos":3,"desc":{"ar":"بطارية مجففة بضمان سنتين.","en":"Dry battery with a two-year warranty."},"status":"approved","date":"2026-10-18","views":980,"calls":66,"rej":{"ar":"","en":""},"log":[{"d":"2026-10-18","by":{"ar":"سارة عبد الله","en":"Sara Abdullah"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":""}]},{"id":"PRT-4003","title":{"ar":"إطار ميشلان 205/55 R16","en":"Michelin tire 205/55 R16"},"price":3100,"cat":"tires","cond":"new","compat":"عام","phone":"0100 440 4404","wa":false,"wal":0,"photos":4,"desc":{"ar":"إطار جديد بحالة المصنع.","en":"Brand new tire in factory condition."},"status":"approved","date":"2026-10-22","views":455,"calls":30,"rej":{"ar":"","en":""},"log":[{"d":"2026-10-22","by":{"ar":"سارة عبد الله","en":"Sara Abdullah"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":""}]},{"id":"PRT-4004","title":{"ar":"كشاف أمامي أيمن","en":"Right headlight"},"price":1800,"cat":"body","cond":"used","compat":"هيونداي إلنترا 2018","phone":"0100 440 4404","wa":true,"wal":0,"photos":5,"desc":{"ar":"كشاف مستعمل بحالة جيدة.","en":"Used headlight in good condition."},"status":"pending","date":"2026-11-01","views":0,"calls":0,"rej":{"ar":"","en":""},"log":[{"d":"2026-11-01","by":{"ar":"عمر خالد","en":"Omar Khaled"},"a":{"ar":"تم إنشاء الإعلان وإرساله للمراجعة","en":"Ad created and sent for review"},"r":""}]},{"id":"PRT-4005","title":{"ar":"مضخة وقود","en":"Fuel pump"},"price":1350,"cat":"engine","cond":"new","compat":"كيا سيراتو 2016-2020","phone":"0100 440 4404","wa":true,"wal":0,"photos":3,"desc":{"ar":"مضخة وقود جديدة.","en":"New fuel pump."},"status":"pending","date":"2026-11-02","views":0,"calls":0,"rej":{"ar":"","en":""},"log":[{"d":"2026-11-02","by":{"ar":"عمر خالد","en":"Omar Khaled"},"a":{"ar":"تم إنشاء الإعلان وإرساله للمراجعة","en":"Ad created and sent for review"},"r":""}]},{"id":"PRT-4006","title":{"ar":"مساعدين خلفي","en":"Rear shock absorbers"},"price":2200,"cat":"other","cond":"new","compat":"نيسان صني 2017","phone":"0100 440 4404","wa":false,"wal":0,"photos":4,"desc":{"ar":"طقم مساعدين.","en":"Shock absorbers set."},"status":"rejected","date":"2026-10-25","views":0,"calls":0,"rej":{"ar":"الصور غير واضحة. أضف صورًا أوضح للقطعة.","en":"The photos are unclear. Add clearer photos of the part."},"log":[{"d":"2026-10-25","by":{"ar":"سارة عبد الله","en":"Sara Abdullah"},"a":{"ar":"تم رفض الإعلان","en":"Ad rejected"},"r":"الصور غير واضحة. أضف صورًا أوضح للقطعة."}]},{"id":"PRT-4007","title":{"ar":"فلتر زيت","en":"Oil filter"},"price":120,"cat":"engine","cond":"new","compat":"عام","phone":"0100 440 4404","wa":true,"wal":5,"photos":2,"desc":{"ar":"فلتر زيت أصلي.","en":"Original oil filter."},"status":"inactive","date":"2026-10-04","views":210,"calls":12,"rej":{"ar":"","en":""},"log":[{"d":"2026-10-04","by":{"ar":"سارة عبد الله","en":"Sara Abdullah"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"},"r":""}]}];
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
