/* Rental Dealer Dashboard – Rental ad form page.
   Behavior only: the form, its error messages, the photo hint and the success/error banners are written in index.html.
   This file validates the fields, fills values when editing (?id=), and saves the record to the mock store.
   Edit policy and rules not defined in the requirements document are placeholders (see the notes on the page).
   ALL DATA IS MOCK. Backend: replace load() / save() with the API and upload the photos to the server. */
(function () {
  'use strict';
  var D = window.RentalDash, CFG = {"store":"osooly.mock.rentalAds","listHref":"../ads/index.html","maxPhotos":8,"prefix":"RNT-","start":3000,"lockedStatus":null,"defaults":{"views":0,"calls":0,"wal":0,"status":"pending","rej":{"ar":"","en":""},"phone":"","photos":0,"wa":false},"fields":[{"id":"title","rec":"title","bi":true,"type":"text","required":true,"minlen":3,"maxlen":80},{"id":"year","rec":"year","type":"number","required":true,"int":true,"min":1980,"max":2027},{"id":"price","rec":"price","type":"number","required":true,"min":100},{"id":"gear","rec":"gear","type":"select","required":true,"map":{"auto":{"ar":"أوتوماتيك","en":"Automatic"},"manual":{"ar":"عادي","en":"Manual"}}},{"id":"phone","rec":"phone","type":"tel","required":true,"pattern":"^01[0125]\\d{8}$"},{"id":"wa","rec":"wa","type":"checkbox"},{"id":"desc","rec":"desc","bi":true,"type":"textarea","required":true,"minlen":20},{"id":"photos","rec":"photos","type":"file"}]}, SEED = [{"id":"RNT-3001","title":{"ar":"هيونداي إلنترا 2023","en":"Hyundai Elantra 2023"},"year":2023,"price":1200,"gear":{"ar":"أوتوماتيك","en":"Automatic"},"phone":"0100 330 3303","wa":true,"wal":31,"photos":6,"desc":{"ar":"سيارة اقتصادية نظيفة، مناسبة للتنقل اليومي والسفر.","en":"Clean economical car, suitable for daily use and travel."},"status":"approved","date":"2026-10-21","views":860,"calls":64,"rej":{"ar":"","en":""},"log":[{"d":"2026-10-21","by":{"ar":"سارة عبد الله","en":"Sara Abdullah"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"}}]},{"id":"RNT-3002","title":{"ar":"كيا سيراتو 2022","en":"Kia Cerato 2022"},"year":2022,"price":1100,"gear":{"ar":"أوتوماتيك","en":"Automatic"},"phone":"0100 330 3303","wa":true,"wal":47,"photos":5,"desc":{"ar":"سيراتو بحالة ممتازة وتكييف قوي.","en":"Cerato in excellent condition with strong air conditioning."},"status":"approved","date":"2026-10-15","views":1120,"calls":88,"rej":{"ar":"","en":""},"log":[{"d":"2026-10-15","by":{"ar":"سارة عبد الله","en":"Sara Abdullah"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"}}]},{"id":"RNT-3003","title":{"ar":"تويوتا كورولا 2021","en":"Toyota Corolla 2021"},"year":2021,"price":1000,"gear":{"ar":"عادي","en":"Manual"},"phone":"0100 330 3303","wa":false,"wal":0,"photos":4,"desc":{"ar":"كورولا عادية اقتصادية في استهلاك الوقود.","en":"Manual Corolla, economical on fuel."},"status":"approved","date":"2026-10-02","views":540,"calls":39,"rej":{"ar":"","en":""},"log":[{"d":"2026-10-02","by":{"ar":"سارة عبد الله","en":"Sara Abdullah"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"}}]},{"id":"RNT-3004","title":{"ar":"نيسان صني 2024","en":"Nissan Sunny 2024"},"year":2024,"price":950,"gear":{"ar":"أوتوماتيك","en":"Automatic"},"phone":"0100 330 3303","wa":true,"wal":0,"photos":4,"desc":{"ar":"سيارة حديثة بعداد منخفض.","en":"Recent car with low mileage."},"status":"pending","date":"2026-10-29","views":0,"calls":0,"rej":{"ar":"","en":""},"log":[{"d":"2026-10-29","by":{"ar":"كريم فوزي","en":"Karim Fawzy"},"a":{"ar":"تم إنشاء الإعلان وإرساله للمراجعة","en":"Ad created and sent for review"}}]},{"id":"RNT-3005","title":{"ar":"شيفروليه أوبترا 2020","en":"Chevrolet Optra 2020"},"year":2020,"price":800,"gear":{"ar":"عادي","en":"Manual"},"phone":"0100 330 3303","wa":true,"wal":0,"photos":3,"desc":{"ar":"سيارة بسيطة واقتصادية للإيجار اليومي.","en":"Simple economical car for daily rental."},"status":"pending","date":"2026-10-27","views":0,"calls":0,"rej":{"ar":"","en":""},"log":[{"d":"2026-10-27","by":{"ar":"كريم فوزي","en":"Karim Fawzy"},"a":{"ar":"تم تعديل الإعلان وإرساله للمراجعة","en":"Ad edited and sent for review"}}]},{"id":"RNT-3006","title":{"ar":"مرسيدس E200 2021","en":"Mercedes E200 2021"},"year":2021,"price":3500,"gear":{"ar":"أوتوماتيك","en":"Automatic"},"phone":"0100 330 3303","wa":true,"wal":0,"photos":3,"desc":{"ar":"سيارة فاخرة للمناسبات.","en":"Luxury car for events."},"status":"rejected","date":"2026-09-20","views":0,"calls":0,"rej":{"ar":"الصور غير كافية. أضف صورًا للسيارة من الداخل والخارج.","en":"Not enough photos. Add interior and exterior photos of the car."},"log":[{"d":"2026-09-20","by":{"ar":"سارة عبد الله","en":"Sara Abdullah"},"a":{"ar":"تم رفض الإعلان","en":"Ad rejected"}}]},{"id":"RNT-3007","title":{"ar":"فيات تيبو 2019","en":"Fiat Tipo 2019"},"year":2019,"price":850,"gear":{"ar":"عادي","en":"Manual"},"phone":"0100 330 3303","wa":true,"wal":9,"photos":4,"desc":{"ar":"تيبو بحالة جيدة، متاحة للإيجار الأسبوعي.","en":"Tipo in good condition, available for weekly rental."},"status":"inactive","date":"2026-08-30","views":410,"calls":22,"rej":{"ar":"","en":""},"log":[{"d":"2026-09-12","by":{"ar":"كريم فوزي","en":"Karim Fawzy"},"a":{"ar":"تم إيقاف الإعلان","en":"Ad paused"}}]},{"id":"RNT-3008","title":{"ar":"رينو لوجان 2022","en":"Renault Logan 2022"},"year":2022,"price":780,"gear":{"ar":"عادي","en":"Manual"},"phone":"0100 330 3303","wa":false,"wal":0,"photos":5,"desc":{"ar":"لوجان اقتصادية مناسبة للمشاوير القصيرة.","en":"Economical Logan, suitable for short trips."},"status":"inactive","date":"2026-08-11","views":295,"calls":15,"rej":{"ar":"","en":""},"log":[{"d":"2026-09-03","by":{"ar":"كريم فوزي","en":"Karim Fawzy"},"a":{"ar":"تم إيقاف الإعلان","en":"Ad paused"}}]},{"id":"RNT-3009","title":{"ar":"ميتسوبيشي لانسر 2018","en":"Mitsubishi Lancer 2018"},"year":2018,"price":700,"gear":{"ar":"أوتوماتيك","en":"Automatic"},"phone":"0100 330 3303","wa":true,"wal":20,"photos":4,"desc":{"ar":"لانسر بحالة جيدة، فحص متاح.","en":"Lancer in good condition, inspection available."},"status":"approved","date":"2026-10-08","views":630,"calls":41,"rej":{"ar":"","en":""},"log":[{"d":"2026-10-08","by":{"ar":"سارة عبد الله","en":"Sara Abdullah"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"}}]},{"id":"RNT-3010","title":{"ar":"سكودا رابيد 2020","en":"Skoda Rapid 2020"},"year":2020,"price":900,"gear":{"ar":"أوتوماتيك","en":"Automatic"},"phone":"0100 330 3303","wa":true,"wal":26,"photos":5,"desc":{"ar":"رابيد واسعة واقتصادية.","en":"Spacious and economical Rapid."},"status":"approved","date":"2026-09-25","views":770,"calls":52,"rej":{"ar":"","en":""},"log":[{"d":"2026-09-25","by":{"ar":"سارة عبد الله","en":"Sara Abdullah"},"a":{"ar":"تم اعتماد الإعلان","en":"Ad approved"}}]},{"id":"RNT-3011","title":{"ar":"هيونداي أكسنت 2021","en":"Hyundai Accent 2021"},"year":2021,"price":880,"gear":{"ar":"أوتوماتيك","en":"Automatic"},"phone":"0100 330 3303","wa":false,"wal":0,"photos":3,"desc":{"ar":"أكسنت نظيفة ومناسبة للمدينة.","en":"Clean Accent, suitable for city driving."},"status":"pending","date":"2026-10-30","views":0,"calls":0,"rej":{"ar":"","en":""},"log":[{"d":"2026-10-30","by":{"ar":"كريم فوزي","en":"Karim Fawzy"},"a":{"ar":"تم إنشاء الإعلان وإرساله للمراجعة","en":"Ad created and sent for review"}}]},{"id":"RNT-3012","title":{"ar":"سوزوكي سويفت 2023","en":"Suzuki Swift 2023"},"year":2023,"price":820,"gear":{"ar":"عادي","en":"Manual"},"phone":"0100 330 3303","wa":true,"wal":7,"photos":4,"desc":{"ar":"سويفت صغيرة اقتصادية.","en":"Small economical Swift."},"status":"inactive","date":"2026-09-02","views":330,"calls":18,"rej":{"ar":"","en":""},"log":[{"d":"2026-09-20","by":{"ar":"كريم فوزي","en":"Karim Fawzy"},"a":{"ar":"تم إيقاف الإعلان","en":"Ad paused"}}]}];
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
