/* Rental Dealer dashboard – ads list (requirement 6). Behavior only.
   Every element (10 table-row slots, the single details panel with its image / history slots, pager buttons, confirm
   step, toast, empty state) is written in index.html. This file fills those elements with text (textContent / attributes)
   and shows or hides them with classes. It never creates, clones or injects markup.
   Ads are reviewed by the admin before they show on the platform; pausing and reactivating are the only status changes
   the dealer makes here.
   ALL DATA IS MOCK. Backend: replace loadAds() with the API (page + filters sent to the server, at most PAGE_SIZE ads
   per response) and replace the changes made in perform() with the real request. */
(function () {
  'use strict';
  var D = window.RentalDash;
  var PAGE_SIZE = 10;   // = number of row slots in index.html
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function B(ar, en) { return { ar: ar, en: en }; }
  function today() { return new Date().toISOString().slice(0, 10); }

  /* ---------- mock data ---------- */
  var ADMIN = B('سارة عبد الله', 'Sara Abdullah'), DEALER = B('كريم فوزي', 'Karim Fawzy');
  var GEAR = { auto: B('أوتوماتيك', 'Automatic'), manual: B('عادي', 'Manual') };
  function L(d, by, ar, en) { return { d: d, by: by, a: B(ar, en) }; }
  function ad(id, t, year, price, gear, wa, photos, desc, status, date, views, calls, wal, rej, log) {
    return { id: id, title: B(t[0], t[1]), year: year, price: price, gear: GEAR[gear], phone: '0100 330 3303', wa: wa, wal: wal, photos: photos,
      desc: B(desc[0], desc[1]), status: status, date: date, views: views, calls: calls, rej: rej ? B(rej[0], rej[1]) : B('', ''), log: log };
  }
  function approved(d) { return L(d, ADMIN, 'تم اعتماد الإعلان', 'Ad approved'); }
  var ADS = [
    ad('RNT-3001', ['هيونداي إلنترا 2023', 'Hyundai Elantra 2023'], 2023, 1200, 'auto', true, 6, ['سيارة اقتصادية نظيفة، مناسبة للتنقل اليومي والسفر.', 'Clean economical car, suitable for daily use and travel.'], 'approved', '2026-10-21', 860, 64, 31, null, [approved('2026-10-21')]),
    ad('RNT-3002', ['كيا سيراتو 2022', 'Kia Cerato 2022'], 2022, 1100, 'auto', true, 5, ['سيراتو بحالة ممتازة وتكييف قوي.', 'Cerato in excellent condition with strong air conditioning.'], 'approved', '2026-10-15', 1120, 88, 47, null, [approved('2026-10-15')]),
    ad('RNT-3003', ['تويوتا كورولا 2021', 'Toyota Corolla 2021'], 2021, 1000, 'manual', false, 4, ['كورولا عادية اقتصادية في استهلاك الوقود.', 'Manual Corolla, economical on fuel.'], 'approved', '2026-10-02', 540, 39, 0, null, [approved('2026-10-02')]),
    ad('RNT-3004', ['نيسان صني 2024', 'Nissan Sunny 2024'], 2024, 950, 'auto', true, 4, ['سيارة حديثة بعداد منخفض.', 'Recent car with low mileage.'], 'pending', '2026-10-29', 0, 0, 0, null, [L('2026-10-29', DEALER, 'تم إنشاء الإعلان وإرساله للمراجعة', 'Ad created and sent for review')]),
    ad('RNT-3005', ['شيفروليه أوبترا 2020', 'Chevrolet Optra 2020'], 2020, 800, 'manual', true, 3, ['سيارة بسيطة واقتصادية للإيجار اليومي.', 'Simple economical car for daily rental.'], 'pending', '2026-10-27', 0, 0, 0, null, [L('2026-10-27', DEALER, 'تم تعديل الإعلان وإرساله للمراجعة', 'Ad edited and sent for review')]),
    ad('RNT-3006', ['مرسيدس E200 2021', 'Mercedes E200 2021'], 2021, 3500, 'auto', true, 3, ['سيارة فاخرة للمناسبات.', 'Luxury car for events.'], 'rejected', '2026-09-20', 0, 0, 0, ['الصور غير كافية. أضف صورًا للسيارة من الداخل والخارج.', 'Not enough photos. Add interior and exterior photos of the car.'], [L('2026-09-20', ADMIN, 'تم رفض الإعلان', 'Ad rejected')]),
    ad('RNT-3007', ['فيات تيبو 2019', 'Fiat Tipo 2019'], 2019, 850, 'manual', true, 4, ['تيبو بحالة جيدة، متاحة للإيجار الأسبوعي.', 'Tipo in good condition, available for weekly rental.'], 'inactive', '2026-08-30', 410, 22, 9, null, [L('2026-09-12', DEALER, 'تم إيقاف الإعلان', 'Ad paused')]),
    ad('RNT-3008', ['رينو لوجان 2022', 'Renault Logan 2022'], 2022, 780, 'manual', false, 5, ['لوجان اقتصادية مناسبة للمشاوير القصيرة.', 'Economical Logan, suitable for short trips.'], 'inactive', '2026-08-11', 295, 15, 0, null, [L('2026-09-03', DEALER, 'تم إيقاف الإعلان', 'Ad paused')]),
    ad('RNT-3009', ['ميتسوبيشي لانسر 2018', 'Mitsubishi Lancer 2018'], 2018, 700, 'auto', true, 4, ['لانسر بحالة جيدة، فحص متاح.', 'Lancer in good condition, inspection available.'], 'approved', '2026-10-08', 630, 41, 20, null, [approved('2026-10-08')]),
    ad('RNT-3010', ['سكودا رابيد 2020', 'Skoda Rapid 2020'], 2020, 900, 'auto', true, 5, ['رابيد واسعة واقتصادية.', 'Spacious and economical Rapid.'], 'approved', '2026-09-25', 770, 52, 26, null, [approved('2026-09-25')]),
    ad('RNT-3011', ['هيونداي أكسنت 2021', 'Hyundai Accent 2021'], 2021, 880, 'auto', false, 3, ['أكسنت نظيفة ومناسبة للمدينة.', 'Clean Accent, suitable for city driving.'], 'pending', '2026-10-30', 0, 0, 0, null, [L('2026-10-30', DEALER, 'تم إنشاء الإعلان وإرساله للمراجعة', 'Ad created and sent for review')]),
    ad('RNT-3012', ['سوزوكي سويفت 2023', 'Suzuki Swift 2023'], 2023, 820, 'manual', true, 4, ['سويفت صغيرة اقتصادية.', 'Small economical Swift.'], 'inactive', '2026-09-02', 330, 18, 7, null, [L('2026-09-20', DEALER, 'تم إيقاف الإعلان', 'Ad paused')])
  ];
  var STORE = 'osooly.mock.rentalAds';   // shared with the ad-form page (mock only)
  function saveAds() { try { sessionStorage.setItem(STORE, JSON.stringify(ads)); } catch (e) { /* storage unavailable */ } }
  function loadAds() {   // Backend: replace with the API request
    var rows = ADS;
    try { var s = sessionStorage.getItem(STORE); if (s) rows = JSON.parse(s); } catch (e) { /* storage unavailable */ }
    rows.forEach(function (r) { r.waText = r.wa ? r.wal.toLocaleString('en-US') : '—'; });
    return rows;
  }

  /* ---------- elements that already exist in index.html ---------- */
  var ads = loadAds(), tabs = $$('[data-tab]'), slots = $$('#rows [data-row]'), panel = $('#details'), toastEl = $('#toast');
  var el = {
    search: $('#search'), from: $('#from'), to: $('#to'), error: $('#filter-error'), wrap: $('#table-wrap'), empty: $('#empty'), footer: $('#footer'),
    fromN: $('#from-n'), toN: $('#to-n'), totalN: $('#total-n'), pageSlots: $$('[data-page-slot]'), prev: $('[data-page-prev]'), next: $('[data-page-next]'),
    actions: $('#actions'), confirm: $('#confirm'), edit: $('#edit-link')
  };
  var NEXT = { deactivate: 'inactive', activate: 'approved' };
  var st = { tab: 'all', search: '', from: '', to: '', page: 1, selected: null };

  /* ---------- fill: [data-f="a.b"] elements get the value as text ---------- */
  function get(rec, path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, rec); }
  function fill(root, rec) {
    $$('[data-f]', root).forEach(function (n) {
      var v = get(rec, n.getAttribute('data-f'));
      n.textContent = v == null ? '' : (n.hasAttribute('data-num') && typeof v === 'number' ? v.toLocaleString('en-US') : v);
    });
  }

  /* ---------- list ---------- */
  function matches(r) {
    if (st.tab !== 'all' && r.status !== st.tab) return false;
    if (st.search && (r.title.ar + ' ' + r.title.en + ' ' + r.id).toLowerCase().indexOf(st.search) === -1) return false;
    if (st.from && r.date < st.from) return false;
    if (st.to && r.date > st.to) return false;
    return true;
  }
  function renderCounts() {
    tabs.forEach(function (b) {
      var k = b.getAttribute('data-tab');
      $('[data-count="' + k + '"]').textContent = ads.filter(function (r) { return k === 'all' || r.status === k; }).length;
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
    var matched = ads.filter(matches), pages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
    st.page = Math.min(st.page, pages);
    var start = (st.page - 1) * PAGE_SIZE, slice = matched.slice(start, start + PAGE_SIZE);
    slots.forEach(function (tr, i) {
      var rec = slice[i];
      tr.hidden = !rec;
      if (!rec) return;
      fill(tr, rec); tr.setAttribute('data-id', rec.id); tr.setAttribute('data-status', rec.status);
    });
    el.wrap.classList.toggle('d-none', !matched.length); el.empty.classList.toggle('d-none', !!matched.length); el.footer.classList.toggle('d-none', !matched.length);
    el.fromN.textContent = matched.length ? start + 1 : 0; el.toN.textContent = start + slice.length; el.totalN.textContent = matched.length;
    renderPager(pages); renderCounts();
  }

  /* ---------- filters ---------- */
  function readFilters() {
    var from = el.from.value, to = el.to.value, bad = !!(from && to && from > to);
    el.error.classList.toggle('d-none', !bad); el.from.classList.toggle('is-invalid', bad); el.to.classList.toggle('is-invalid', bad);
    if (bad) return;
    st.search = el.search.value.trim().toLowerCase(); st.from = from; st.to = to; st.page = 1;
    render();
  }
  function reset() {
    el.search.value = ''; el.from.value = ''; el.to.value = '';
    el.error.classList.add('d-none'); el.from.classList.remove('is-invalid'); el.to.classList.remove('is-invalid');
    st.search = ''; st.from = ''; st.to = ''; st.page = 1;
    render();
  }

  /* ---------- details panel ---------- */
  function renderPanel(rec) {
    fill(panel, rec);
    panel.setAttribute('data-status', rec.status);
    $$('[data-tile]', panel).forEach(function (t, i) { t.classList.toggle('d-none', i >= rec.photos); });
    $$('[data-wa]', panel).forEach(function (s) { s.classList.toggle('d-none', (s.getAttribute('data-wa') === 'yes') !== rec.wa); });
    var log = rec.log.slice().reverse();
    $$('[data-log-slot]', panel).forEach(function (li, i) {
      li.classList.toggle('d-none', !log[i]);
      if (log[i]) fill(li, log[i]);
    });
  }
  function closeConfirm() {
    el.confirm.classList.add('d-none'); el.actions.classList.remove('d-none');
    $$('[data-msg], [data-yes]', panel).forEach(function (n) { n.classList.add('d-none'); });
  }
  function ask(action) {
    $$('[data-msg], [data-yes]', panel).forEach(function (n) { n.classList.toggle('d-none', (n.getAttribute('data-msg') || n.getAttribute('data-yes')) !== action); });
    el.actions.classList.add('d-none'); el.confirm.classList.remove('d-none');
    $('[data-yes="' + action + '"]', panel).focus();
  }
  function perform(action) {
    var rec = st.selected; if (!rec) return;
    rec.status = NEXT[action];   // Backend: send the request, then use the response
    rec.log.push({ d: today(), by: (D.session && D.session.name) || DEALER, a: action === 'deactivate' ? B('تم إيقاف الإعلان', 'Ad paused') : B('تمت إعادة تفعيل الإعلان', 'Ad reactivated') });
    saveAds(); renderPanel(rec); closeConfirm(); render();
    $$('[data-toast]', toastEl).forEach(function (s) { s.classList.toggle('d-none', s.getAttribute('data-toast') !== action); });
    bootstrap.Toast.getOrCreateInstance(toastEl).show();
  }
  function open(id) {
    var rec = ads.filter(function (r) { return r.id === id; })[0]; if (!rec) return;
    st.selected = rec; closeConfirm(); renderPanel(rec);
    el.edit.setAttribute('href', '../ad-form/index.html?id=' + encodeURIComponent(rec.id));
    bootstrap.Offcanvas.getOrCreateInstance(panel).show();
  }

  /* ---------- wiring ---------- */
  el.from.max = today(); el.to.max = today();
  $('#filter').addEventListener('submit', function (e) { e.preventDefault(); });
  el.search.addEventListener('input', readFilters); el.from.addEventListener('change', readFilters); el.to.addEventListener('change', readFilters);
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
  $('#cancel').addEventListener('click', closeConfirm);
  panel.addEventListener('hidden.bs.offcanvas', function () { st.selected = null; closeConfirm(); });

  render();
})();
