/* Insurance Dashboard – All requests page (requirement 4.1–4.4).
   Behavior only. Every element (row slots, the single details panel, history slots, pager, confirm step, toast, empty state)
   is written in index.html. This file fills them with text / attributes and shows or hides them with classes; it never
   creates, clones or injects markup. ALL DATA IS MOCK. Backend: replace load() with the API (page + filters sent to the
   server, at most PAGE_SIZE records per response) and the changes made in perform() / create() with the real requests. */
(function () {
  'use strict';
  var D = window.InsuranceDash, CFG = {"pageSize":10,"store":"osooly.mock.insurance","statusField":"status","tabField":"status","tabDefs":null,"defaultTab":null,"search":["id","customerName","vehicle","plate","typeL","assigneeName"],"dateField":"date","actions":{"take":{"next":"review","log":["بدء المراجعة","Review started"]},"assign":{"log":["تم تغيير التعيين","Assignment changed"],"inputs":[{"id":"who","required":true,"field":"assignee","map":{"none":null,"yasser":"yasser","heba":"heba"}}]},"complete":{"log":["تم استكمال بيانات الطلب","Request details completed"],"inputs":[{"id":"insurer","required":true,"field":"completion.insurer","prefill":"completion.insurer"},{"id":"amount","required":true,"min":0.01,"num":true,"field":"completion.amount","prefill":"completion.amount"},{"id":"doc","required":true,"unless":"completion.doc","field":"completion.doc","optional":true},{"id":"notes","field":"completion.notes","optional":true,"prefill":"completion.notes"}]},"pay":{"next":"paid","log":["تم تسجيل الطلب كمدفوع","Marked as paid"]},"cancel":{"next":"cancelled","log":["تم إلغاء الطلب","Request cancelled"],"inputs":[{"id":"reason","required":true}]}},"editLink":null,"own":{"field":"assignee","roles":["insurance_staff"],"map":{"insurance.staff@osooly.test":"yasser"}},"fixed":null};
  var PAGE_SIZE = CFG.pageSize;   // = number of row slots in index.html
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function today() { return new Date().toISOString().slice(0, 10); }
  var SEED = [{"id":"INS-1001","date":"2026-11-02","customerName":"عمرو سليم","customerPhone":"+20 100 700 1001","type":"comprehensive","vehicle":"تويوتا كورولا 2022","plate":"ق ب ك 1201","status":"new","assignee":null,"completion":null,"paidAt":null,"cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-11-02","r":"","n":""}]},{"id":"INS-1002","date":"2026-11-02","customerName":"ياسمين رأفت","customerPhone":"+20 111 700 1002","type":"third","vehicle":"هيونداي الترا 2020","plate":"ب ت ن 4433","status":"new","assignee":null,"completion":null,"paidAt":null,"cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-11-02","r":"","n":""}]},{"id":"INS-1003","date":"2026-10-31","customerName":"حسام ماجد","customerPhone":"+20 122 700 1003","type":"renewal","vehicle":"نيسان صني 2019","plate":"و ع د 7781","status":"new","assignee":"yasser","completion":null,"paidAt":null,"cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-10-31","r":"","n":""},{"a":{"ar":"تعيين الطلب إلى ياسر حامد","en":"Request assigned to Yasser Hamed"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-10-31","r":"","n":""}]},{"id":"INS-1004","date":"2026-10-30","customerName":"دينا فتحي","customerPhone":"+20 115 700 1004","type":"comprehensive","vehicle":"شيفروليه كابتيفا 2021","plate":"س ط ر 3390","status":"review","assignee":"yasser","completion":null,"paidAt":null,"cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-10-30","r":"","n":""},{"a":{"ar":"تعيين الطلب إلى ياسر حامد","en":"Request assigned to Yasser Hamed"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-10-30","r":"","n":""}]},{"id":"INS-1005","date":"2026-10-28","customerName":"مصطفى عادل","customerPhone":"+20 106 700 1005","type":"third","vehicle":"كيا سبورتج 2021","plate":"ح ج ك 5512","status":"review","assignee":"yasser","completion":{"insurer":"شركة النيل للتأمين","amount":8450,"doc":"policy-1005.pdf","notes":""},"paidAt":null,"cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-10-28","r":"","n":""},{"a":{"ar":"تعيين الطلب إلى ياسر حامد","en":"Request assigned to Yasser Hamed"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-10-28","r":"","n":""}]},{"id":"INS-1006","date":"2026-10-27","customerName":"رنا ممدوح","customerPhone":"+20 101 700 1006","type":"renewal","vehicle":"فيات 500 2018","plate":"م ن ه 2290","status":"review","assignee":"heba","completion":null,"paidAt":null,"cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-10-27","r":"","n":""},{"a":{"ar":"تعيين الطلب إلى هبة فؤاد","en":"Request assigned to Heba Fouad"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-10-27","r":"","n":""}]},{"id":"INS-1007","date":"2026-10-25","customerName":"أحمد ناجي","customerPhone":"+20 128 700 1007","type":"comprehensive","vehicle":"مرسيدس C180 2020","plate":"ل ص ع 6104","status":"review","assignee":"heba","completion":{"insurer":"الأهلي للتأمين","amount":15200,"doc":"policy-1007.pdf","notes":"تم التحقق من الفحص الفني"},"paidAt":null,"cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-10-25","r":"","n":""},{"a":{"ar":"تعيين الطلب إلى هبة فؤاد","en":"Request assigned to Heba Fouad"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-10-25","r":"","n":""}]},{"id":"INS-1008","date":"2026-10-22","customerName":"سارة حسني","customerPhone":"+20 100 700 1008","type":"comprehensive","vehicle":"تويوتا يارس 2023","plate":"ف ق ي 8831","status":"paid","assignee":"yasser","completion":{"insurer":"شركة النيل للتأمين","amount":7300,"doc":"policy-1008.pdf","notes":""},"paidAt":"2026-10-24","cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-10-22","r":"","n":""},{"a":{"ar":"تعيين الطلب إلى ياسر حامد","en":"Request assigned to Yasser Hamed"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-10-22","r":"","n":""},{"a":{"ar":"تم تسجيل الطلب كمدفوع","en":"Marked as paid"},"by":{"ar":"ياسر حامد","en":"Yasser Hamed"},"d":"2026-10-24","r":"","n":""}]},{"id":"INS-1009","date":"2026-10-20","customerName":"كريم شوقي","customerPhone":"+20 112 700 1009","type":"third","vehicle":"MG 5 2022","plate":"ر س ط 1177","status":"paid","assignee":"heba","completion":{"insurer":"المصرية للتأمين","amount":6100,"doc":"policy-1009.pdf","notes":""},"paidAt":"2026-10-23","cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-10-20","r":"","n":""},{"a":{"ar":"تعيين الطلب إلى هبة فؤاد","en":"Request assigned to Heba Fouad"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-10-20","r":"","n":""},{"a":{"ar":"تم تسجيل الطلب كمدفوع","en":"Marked as paid"},"by":{"ar":"هبة فؤاد","en":"Heba Fouad"},"d":"2026-10-23","r":"","n":""}]},{"id":"INS-1010","date":"2026-10-18","customerName":"هالة محمود","customerPhone":"+20 127 700 1010","type":"renewal","vehicle":"جيب شيروكي 2017","plate":"ب م ع 9045","status":"paid","assignee":"yasser","completion":{"insurer":"الأهلي للتأمين","amount":9800,"doc":"policy-1010.pdf","notes":""},"paidAt":"2026-10-23","cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-10-18","r":"","n":""},{"a":{"ar":"تعيين الطلب إلى ياسر حامد","en":"Request assigned to Yasser Hamed"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-10-18","r":"","n":""},{"a":{"ar":"تم تسجيل الطلب كمدفوع","en":"Marked as paid"},"by":{"ar":"ياسر حامد","en":"Yasser Hamed"},"d":"2026-10-23","r":"","n":""}]},{"id":"INS-1011","date":"2026-10-16","customerName":"طارق عصام","customerPhone":"+20 100 700 1011","type":"comprehensive","vehicle":"بيجو 301 2019","plate":"ك ل م 2468","status":"cancelled","assignee":"yasser","completion":null,"paidAt":null,"cancelReason":"ألغى العميل الطلب","cancelledBy":"yasser","cancelledAt":"2026-10-17","attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-10-16","r":"","n":""},{"a":{"ar":"تعيين الطلب إلى ياسر حامد","en":"Request assigned to Yasser Hamed"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-10-16","r":"","n":""},{"a":{"ar":"تم إلغاء الطلب","en":"Request cancelled"},"by":{"ar":"ياسر حامد","en":"Yasser Hamed"},"d":"2026-10-17","r":"ألغى العميل الطلب","n":""}]},{"id":"INS-1012","date":"2026-10-14","customerName":"ندى هشام","customerPhone":"+20 111 700 1012","type":"third","vehicle":"شيري تيغو 2021","plate":"ت ث ج 3357","status":"cancelled","assignee":"heba","completion":null,"paidAt":null,"cancelReason":"بيانات المركبة غير مطابقة للوثائق","cancelledBy":"heba","cancelledAt":"2026-10-15","attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-10-14","r":"","n":""},{"a":{"ar":"تعيين الطلب إلى هبة فؤاد","en":"Request assigned to Heba Fouad"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-10-14","r":"","n":""},{"a":{"ar":"تم إلغاء الطلب","en":"Request cancelled"},"by":{"ar":"هبة فؤاد","en":"Heba Fouad"},"d":"2026-10-15","r":"بيانات المركبة غير مطابقة للوثائق","n":""}]},{"id":"INS-1013","date":"2026-10-12","customerName":"عبد الرحمن خالد","customerPhone":"+20 122 700 1013","type":"comprehensive","vehicle":"هيونداي إلنترا 2021","plate":"ذ ر ز 4412","status":"paid","assignee":"heba","completion":{"insurer":"شركة النيل للتأمين","amount":5600,"doc":"policy-1013.pdf","notes":""},"paidAt":"2026-10-18","cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-10-12","r":"","n":""},{"a":{"ar":"تعيين الطلب إلى هبة فؤاد","en":"Request assigned to Heba Fouad"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-10-12","r":"","n":""},{"a":{"ar":"تم تسجيل الطلب كمدفوع","en":"Marked as paid"},"by":{"ar":"هبة فؤاد","en":"Heba Fouad"},"d":"2026-10-18","r":"","n":""}]},{"id":"INS-1014","date":"2026-10-09","customerName":"منار ياسر","customerPhone":"+20 115 700 1014","type":"renewal","vehicle":"سيات ليون 2020","plate":"س ش ص 5520","status":"cancelled","assignee":null,"completion":null,"paidAt":null,"cancelReason":"طلب مكرر لطلب آخر","cancelledBy":"ahmed","cancelledAt":"2026-10-10","attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-10-09","r":"","n":""},{"a":{"ar":"تم إلغاء الطلب","en":"Request cancelled"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-10-10","r":"طلب مكرر لطلب آخر","n":""}]},{"id":"INS-1015","date":"2026-10-06","customerName":"بسام فريد","customerPhone":"+20 106 700 1015","type":"third","vehicle":"فورد إسكيب 2018","plate":"ض ظ ع 6631","status":"paid","assignee":"yasser","completion":{"insurer":"المصرية للتأمين","amount":4200,"doc":"policy-1015.pdf","notes":""},"paidAt":"2026-10-10","cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-10-06","r":"","n":""},{"a":{"ar":"تعيين الطلب إلى ياسر حامد","en":"Request assigned to Yasser Hamed"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-10-06","r":"","n":""},{"a":{"ar":"تم تسجيل الطلب كمدفوع","en":"Marked as paid"},"by":{"ar":"ياسر حامد","en":"Yasser Hamed"},"d":"2026-10-10","r":"","n":""}]},{"id":"INS-1016","date":"2026-11-03","customerName":"ليلى كامل","customerPhone":"+20 101 700 1016","type":"comprehensive","vehicle":"تويوتا فورتشنر 2024","plate":"غ ف ق 1002","status":"new","assignee":null,"completion":null,"paidAt":null,"cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-11-03","r":"","n":""}]},{"id":"INS-1017","date":"2026-11-01","customerName":"وليد رشدي","customerPhone":"+20 128 700 1017","type":"renewal","vehicle":"جيلي إم جي 2023","plate":"ك م ن 7790","status":"new","assignee":"heba","completion":null,"paidAt":null,"cancelReason":null,"cancelledBy":null,"cancelledAt":null,"attachments":["id-card.jpg","vehicle-license.jpg"],"log":[{"a":{"ar":"تم إنشاء الطلب","en":"Request created"},"by":{"ar":"النظام","en":"System"},"d":"2026-11-01","r":"","n":""},{"a":{"ar":"تعيين الطلب إلى هبة فؤاد","en":"Request assigned to Heba Fouad"},"by":{"ar":"أحمد محمد","en":"Ahmed Mohamed"},"d":"2026-11-01","r":"","n":""}]}];
  var ME = (D.session && D.session.name) || { ar: 'مستخدم', en: 'User' };
  function load() {   // Backend: replace with the API request
    if (window.__LOAD__) return window.__LOAD__(JSON.parse(JSON.stringify(SEED)));
    if (CFG.store) { try { var s = sessionStorage.getItem(CFG.store); if (s) return JSON.parse(s); } catch (e) { /* storage unavailable */ } }
    var seed = JSON.parse(JSON.stringify(SEED)); save(seed); return seed;
  }
  function save(rows) { if (window.__SAVE__) { window.__SAVE__(rows); return; } if (CFG.store) { try { sessionStorage.setItem(CFG.store, JSON.stringify(rows)); } catch (e) { /* storage unavailable */ } } }
  window.__DERIVE__ = function (r) {
      var T = { comprehensive: ['تأمين شامل', 'Comprehensive'], third: ['تأمين ضد الغير', 'Third-party'], renewal: ['تجديد وثيقة', 'Policy renewal'] };
      var S = { ahmed: ['أحمد محمد', 'Ahmed Mohamed'], yasser: ['ياسر حامد', 'Yasser Hamed'], heba: ['هبة فؤاد', 'Heba Fouad'] };
      var t = T[r.type] || ['', ''], a = r.assignee ? S[r.assignee] : ['غير معيّن', 'Unassigned'];
      r.typeL = { ar: t[0], en: t[1] }; r.assigneeName = { ar: a[0], en: a[1] };
      var c = r.completion, cb = r.cancelledBy ? S[r.cancelledBy] : ['', ''];
      r.isComplete = !!(c && c.insurer && c.amount > 0 && c.doc);
      r.cInsurer = c && c.insurer ? { ar: c.insurer, en: c.insurer } : { ar: 'لم تُستكمل بعد', en: 'Not completed yet' };
      r.cAmount = c && c.amount ? Number(c.amount).toLocaleString('en-US') : '—';
      r.cDoc = c && c.doc ? c.doc : '—'; r.cNotes = c && c.notes ? { ar: c.notes, en: c.notes } : { ar: '', en: '' };
      r.cancelB = r.cancelReason ? { ar: r.cancelReason, en: r.cancelReason } : { ar: '', en: '' };
      r.cancelledByName = { ar: cb[0], en: cb[1] };
      r.head = r.id + ' · ' + r.customerName;
    };
  window.__AFTER__ = function (rec, action, vals) {
      var S = { ahmed: ['أحمد محمد', 'Ahmed Mohamed'], yasser: ['ياسر حامد', 'Yasser Hamed'], heba: ['هبة فؤاد', 'Heba Fouad'] };
      var role = (D.session && D.session.role) || '', meKey = role === 'insurance_manager' ? 'ahmed' : 'yasser', last = rec.log[rec.log.length - 1];
      if (action === 'take' && !rec.assignee) rec.assignee = meKey;   // one employee per request: Backend must reject a second claim (conflict)
      if (action === 'assign') { var n = rec.assignee ? S[rec.assignee] : null; last.a = n ? { ar: 'تعيين الطلب إلى ' + n[0], en: 'Request assigned to ' + n[1] } : { ar: 'إلغاء تعيين الطلب', en: 'Assignment removed' }; }
      if (action === 'complete') { var c = rec.completion; last.n = { ar: 'شركة التأمين: ' + c.insurer + ' · المبلغ: ' + Number(c.amount).toLocaleString('en-US') + ' ج.م', en: 'Insurer: ' + c.insurer + ' · Amount: ' + Number(c.amount).toLocaleString('en-US') + ' EGP' }; }
      if (action === 'pay') rec.paidAt = new Date().toISOString().slice(0, 10);
      if (action === 'cancel') { rec.cancelReason = rec.cancelReason || vals.reason; rec.cancelledBy = meKey; rec.cancelledAt = new Date().toISOString().slice(0, 10); }
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
      $$('[data-slot]', box).forEach(function (li, i) { li.classList.toggle('d-none', !items[i]); if (items[i]) fill(li, items[i]); });
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
