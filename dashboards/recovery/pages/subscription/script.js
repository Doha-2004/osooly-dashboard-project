/* Recovery Provider Dashboard – Subscription page.
   Behavior only. The subscription card, the renewal notice (requirements 3.7 / 8.3), the history slots and the placeholder
   notes are written in index.html. This file reads the mock subscription, computes the days left and shows the right state.
   Undecided in the document (placeholders): when the free year starts, how the 5 days are counted, the renewal price and the
   action taken after the grace period. ALL DATA IS MOCK. Backend: replace SUB with the API and enforce the policy on the server. */
(function () {
  'use strict';
  var D = window.RecoveryDash;
  var SUB = {"planAr":"سنة مجانية","planEn":"Free year","start":"2026-06-06","end":"2027-06-06","history":[{"d":"2026-06-06","a":["تم منح السنة المجانية","Free year granted"]}]};
  var NEAR_DAYS = 30;   // PLACEHOLDER: when the "renews soon" notice starts is not defined in the document
  var GRACE_DAYS = 5;   // from the document (3.7); how the 5 days are counted is undecided
  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function day(s) { return new Date(s + 'T00:00:00'); }
  var now = new Date(); now.setHours(0, 0, 0, 0);
  var left = Math.round((day(SUB.end) - now) / 86400000);
  var state = left > NEAR_DAYS ? 'active' : left >= 0 ? 'near' : (-left <= GRACE_DAYS ? 'grace' : 'expired');
  $('#sub-card').setAttribute('data-state', state);
  $$('[data-f]').forEach(function (n) { var v = SUB[n.getAttribute('data-f')]; if (v != null) n.textContent = v; });
  $$('[data-calc]').forEach(function (n) {
    var k = n.getAttribute('data-calc');
    n.textContent = k === 'left' ? Math.max(left, 0) : k === 'grace' ? Math.max(GRACE_DAYS + left, 0) : '';
  });
  var hist = SUB.history.slice().reverse();
  $$('[data-hist]').forEach(function (li, i) {
    li.classList.toggle('d-none', !hist[i]);
    if (hist[i]) { $('[data-h="d"]', li).textContent = hist[i].d; $('[data-h="ar"]', li).textContent = hist[i].a[0]; $('[data-h="en"]', li).textContent = hist[i].a[1]; }
  });
  $('#renew-btn').addEventListener('click', function () {
    bootstrap.Toast.getOrCreateInstance($('#toast')).show();   // Backend: open the payment flow (not defined in the document)
  });
})();
