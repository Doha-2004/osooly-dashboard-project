/* Car Dealer Dashboard dashboard – shell behavior only (sidebar modes, language, logout, user name).
   The sidebar, topbar, page header and logout dialog are written in each page's HTML; this file never creates markup.
   Needs boot.js (head) and Bootstrap's bundle loaded before it. */
(function () {
  'use strict';
  var D = window.CarDealerDash, KEY = D.keys, BP = { desktop: 992, tablet: 768 };
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  var st = { lang: D.lang, collapsed: false, overlay: false }, tooltips = [];
  try { st.collapsed = localStorage.getItem('osooly.sidebarCollapsed') === '1'; } catch (e) { /* ignore */ }

  function isDesktop() { return window.innerWidth >= BP.desktop; }
  /* body[data-sidebar] drives the layout CSS: full | rail | rail-open | hidden | drawer */
  function mode() {
    var w = window.innerWidth;
    if (w >= BP.desktop) return st.collapsed ? 'rail' : 'full';
    if (w >= BP.tablet) return st.overlay ? 'rail-open' : 'rail';
    return st.overlay ? 'drawer' : 'hidden';
  }
  function applyMode() {
    if (isDesktop()) st.overlay = false;
    var m = mode();
    document.body.setAttribute('data-sidebar', m);
    $('#sidebar').inert = (m === 'hidden');
    $('#sidebar-toggle').setAttribute('aria-expanded', (m === 'full' || m === 'rail-open' || m === 'drawer') ? 'true' : 'false');
    document.body.classList.toggle('overflow-hidden', m === 'drawer');
    tooltips.forEach(function (t) { if (m === 'rail') t.enable(); else { t.hide(); t.disable(); } });
  }
  function toggleSidebar() {
    if (isDesktop()) {
      st.collapsed = !st.collapsed;
      try { localStorage.setItem('osooly.sidebarCollapsed', st.collapsed ? '1' : '0'); } catch (e) { /* ignore */ }
      applyMode(); return;
    }
    st.overlay = !st.overlay; applyMode();
    if (st.overlay) { var first = $('#sidebar .nav-link-item'); if (first) first.focus(); }
  }
  function closeOverlay(returnFocus) {
    if (!st.overlay) return;
    st.overlay = false; applyMode();
    if (returnFocus) $('#sidebar-toggle').focus();
  }

  function setLang(lang) {
    st.lang = lang; D.lang = lang;
    try { localStorage.setItem(KEY.lang, lang); } catch (e) { /* ignore */ }
    var root = document.documentElement;
    root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $('#bootstrap-rtl').media = lang === 'ar' ? 'all' : 'not all';
    $('#bootstrap-ltr').media = lang === 'ar' ? 'not all' : 'all';
    var title = $('title'); title.textContent = title.getAttribute('data-' + lang) || title.textContent;
    labelOptions();
    document.dispatchEvent(new CustomEvent('car-dealer:lang'));
  }

  /* The signed-in name replaces the sample name that is already in the HTML (text only). */
  /* <option> cannot hold language spans, so each option carries data-ar / data-en and its text follows the language */
  function labelOptions() { $$('option[data-ar]').forEach(function (o) { o.textContent = o.getAttribute('data-' + st.lang) || o.textContent; }); }

  function showUser() {
    var n = D.session && D.session.name; if (!n) return;
    $$('[data-user-name] [data-lang]').forEach(function (s) { s.textContent = n[s.getAttribute('data-lang')] || s.textContent; });
    $$('[data-user-initials] [data-lang]').forEach(function (s) {
      var name = n[s.getAttribute('data-lang')] || ''; s.textContent = name.split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase();
    });
  }

  /* Role-based visibility: elements written in the HTML with data-role-only="role1 role2" show only for those roles;
     <body data-page-roles="role" data-page-fallback="url"> sends other roles to the fallback page. Backend: enforce on the server too. */
  function applyRoles() {
    var role = (D.session && D.session.role) || '', pr = document.body.getAttribute('data-page-roles');
    if (pr && pr.split(' ').indexOf(role) < 0) { location.replace(document.body.getAttribute('data-page-fallback') || 'index.html'); return; }
    $$('[data-role-only]').forEach(function (n) { n.classList.toggle('d-none', n.getAttribute('data-role-only').split(' ').indexOf(role) < 0); });
  }

  function init() {
    applyRoles();
    showUser();
    labelOptions();
    $$('#sidebar .nav-link-item').forEach(function (el) {   // icon-rail tooltips (Bootstrap Tooltip API, text from the existing label)
      tooltips.push(new bootstrap.Tooltip(el, {
        container: 'body', trigger: 'hover focus',
        title: function () { var s = $('.nav-label [data-lang="' + st.lang + '"]', el); return s ? s.textContent : ''; },
        placement: function () { return document.documentElement.dir === 'rtl' ? 'left' : 'right'; }
      }));
    });
    applyMode();

    document.addEventListener('click', function (e) {
      var act = e.target.closest('[data-action]'), link = e.target.closest('#sidebar a.nav-link-item[href]');
      if (act) {
        var a = act.getAttribute('data-action');
        if (a === 'toggle-sidebar') toggleSidebar();
        else if (a === 'close-sidebar') closeOverlay(true);
        else if (a === 'toggle-lang') setLang(st.lang === 'ar' ? 'en' : 'ar');
        else if (a === 'logout') bootstrap.Modal.getOrCreateInstance($('#logout-modal')).show();
      } else if (link && !isDesktop()) closeOverlay(false);
    });
    $('#logout-confirm').addEventListener('click', function () {
      try { sessionStorage.removeItem(KEY.session); } catch (e) { /* ignore */ }   // Backend: end the real session
      location.replace(document.documentElement.getAttribute('data-login') || 'login.html');
    });
    $('#sidebar-backdrop').addEventListener('click', function () { closeOverlay(true); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOverlay(true); });
    var raf; window.addEventListener('resize', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(applyMode); });

    document.documentElement.classList.remove('osl-boot');   // layout is ready: show the page, then allow transitions
    requestAnimationFrame(function () { requestAnimationFrame(function () { document.documentElement.classList.remove('osl-preload'); }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
