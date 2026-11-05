/* Topbar bell (requirement 9.4): shows new customer-service conversations OUTSIDE the CS pages: customer name, type, a short
   summary and a link that opens the conversation directly. In-app only, so it works without any browser permission.
   The slots are written in each page's HTML; this file fills them and toggles classes. ALL DATA IS MOCK.
   Backend: feed from the API (polling / websocket); browser notifications would need the user's permission. */
(function () {
  'use strict';
  if (!window.AdminCS) return;
  var PAGE = { inquiry: 'cs-inquiries', request: 'cs-requests', complaint: 'cs-complaints' };
  var rows = window.AdminCS.load().filter(function (c) { return c.unread; });
  rows.sort(function (a, b) { return b.messages[b.messages.length - 1].at.localeCompare(a.messages[a.messages.length - 1].at); });
  var slots = Array.prototype.slice.call(document.querySelectorAll('[data-bell-slot]'));
  var base = location.pathname.replace(/\/pages\/[^/]+\/[^/]*$/, '/pages/');
  slots.forEach(function (a, i) {
    var c = rows[i];
    a.classList.toggle('d-none', !c);
    if (!c) return;
    var t = window.AdminCS.TYPES[c.type];
    a.querySelector('[data-f="name"]').textContent = c.name;
    a.querySelector('[data-f="snippet"]').textContent = c.messages[c.messages.length - 1].text;
    a.querySelector('[data-f="typeB.ar"]').textContent = t[0]; a.querySelector('[data-f="typeB.en"]').textContent = t[1];
    a.setAttribute('href', base + PAGE[c.type] + '/index.html?open=' + encodeURIComponent(c.id));
  });
  var n = document.getElementById('bell-count');
  n.textContent = rows.length; n.classList.toggle('d-none', !rows.length);
  document.getElementById('bell-empty').classList.toggle('d-none', !!rows.length);
})();
