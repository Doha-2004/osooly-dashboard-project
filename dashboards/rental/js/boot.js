/* Rental Dealer dashboard – runs in the page head, before first paint.
   Applies language + direction + the matching Bootstrap build to elements that already exist in the page, and sends
   anyone who is not a signed-in rental dealer to the login page. Creates no markup.
   Backend: replace the session check with the real server session / role check. */
(function () {
  'use strict';
  var KEY = { lang: 'osooly.lang', session: 'osooly.session' }, ROLE = 'rental_dealer';
  var root = document.documentElement, lang = 'ar', session = null;
  try { var l = localStorage.getItem(KEY.lang); if (l === 'ar' || l === 'en') lang = l; } catch (e) { /* storage unavailable */ }
  try { var s = JSON.parse(sessionStorage.getItem(KEY.session) || 'null'); if (s && s.email && s.role) session = s; } catch (e) { /* storage unavailable */ }
  if (!session || session.role !== ROLE) { location.replace(root.getAttribute('data-login') || 'login.html'); }

  root.classList.add('osl-boot', 'osl-preload');   // removed by dashboard.js once the page is ready
  setTimeout(function () { root.classList.remove('osl-boot', 'osl-preload'); }, 4000);   // safety net
  root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('bootstrap-rtl').media = lang === 'ar' ? 'all' : 'not all';
  document.getElementById('bootstrap-ltr').media = lang === 'ar' ? 'not all' : 'all';
  var title = document.querySelector('title');
  if (title) title.textContent = title.getAttribute('data-' + lang) || title.textContent;

  window.RentalDash = { keys: KEY, session: session, lang: lang };
})();
